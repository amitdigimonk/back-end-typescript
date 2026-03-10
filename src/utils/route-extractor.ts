import fs from 'fs';
import path from 'path';

export interface RouteMeta {
    path: string;
    methods: string[];
    description?: string;
    body?: string[];    // Array of required keys
    params?: string[];
}

export function generateRoutesMap(): Record<string, RouteMeta[]> {
    const endpoints: Record<string, RouteMeta[]> = {};
    // In production we run inside `dist/utils/`, but we want to read the raw source files
    // in `src/routes/` and `src/modules/` since they aren't compiled back over
    // Find the project root dir first (assumes we are either in src/utils or dist/utils)
    const isDist = __dirname.includes('dist');
    const projectRoot = isDist ? path.join(__dirname, '../..') : path.join(__dirname, '../..');

    // Always parse the raw TypeScript source code, even if running the compiled node .js app
    const srcDir = path.join(projectRoot, 'src');
    const ext = '.ts';

    const routesFilePath = path.join(srcDir, 'routes', `v1.routes${ext}`);

    // 1. Read routes file to get the base paths mapping
    if (!fs.existsSync(routesFilePath)) return endpoints;
    const routesContent = fs.readFileSync(routesFilePath, 'utf8');

    // Matches: rootRouter.use('/auth', authRoutes) -> captures ['/auth', 'authRoutes']
    const usePattern = /rootRouter\.use\(\s*['"]([/a-zA-Z0-9_-]+)['"]\s*,\s*(?:[a-zA-Z0-9_]+\s*,\s*)?([a-zA-Z0-9_]+)\s*\)/g;

    // Matches imports: import authRoutes from '../modules/auth/auth.routes' -> captures ['authRoutes', '../modules/auth/auth.routes']
    const importPattern = /import\s+([a-zA-Z0-9_]+)\s+from\s+['"]([^'"]+)['"]/g;

    const baseRoutes: { prefix: string, moduleName: string }[] = [];
    const moduleImports: Record<string, string> = {};

    let match;
    while ((match = usePattern.exec(routesContent)) !== null) {
        baseRoutes.push({ prefix: match[1], moduleName: match[2] });
    }

    while ((match = importPattern.exec(routesContent)) !== null) {
        moduleImports[match[1]] = match[2]; // e.g., authRoutes -> ../modules/auth/auth.routes
    }

    // 2. Parse each module file to extract its inner routes
    for (const base of baseRoutes) {
        const importPath = moduleImports[base.moduleName];
        if (!importPath) continue;

        // Resolve the true path of the router file
        // Routes are imported from routes.ts like '../modules/auth/auth.routes'
        const resolvedPath = path.resolve(path.dirname(routesFilePath), importPath) + ext;

        if (!fs.existsSync(resolvedPath)) continue;

        const routerContent = fs.readFileSync(resolvedPath, 'utf8');
        const endpointList: RouteMeta[] = [];

        // Matches: (optional JSDoc) router.post('/login', ...) or router.get('/profile', ...)
        const routePattern = /(\/\*\*[\s\S]*?\*\/)?\s*router\.(get|post|put|patch|delete)\(\s*['"]([^'"]+)['"]/g;

        let routeMatch;

        // Remove the starting slash of the prefix if it exists to categorize nicely
        const category = base.prefix.replace(/^\//, '') || 'general';

        while ((routeMatch = routePattern.exec(routerContent)) !== null) {
            const comment = routeMatch[1];
            const method = routeMatch[2].toUpperCase();
            const subPath = routeMatch[3];

            let description = undefined;
            let body = undefined;

            if (comment) {
                const descMatch = /@desc\s+(.+)/.exec(comment);
                if (descMatch) description = descMatch[1].trim();

                const bodyMatch = /@body\s+(.+)/.exec(comment);
                if (bodyMatch) {
                    body = bodyMatch[1].split(',').map(s => s.trim());
                }
            }

            // Reconstruct full path e.g. /api/v1/auth/login
            const fullPath = `/api/v1${base.prefix === '/' ? '' : base.prefix}${subPath === '/' ? '' : subPath}`;

            // check if endpoint path already recorded and append method
            const existing = endpointList.find(e => e.path === fullPath);
            if (existing && !existing.methods.includes(method)) {
                existing.methods.push(method);
                if (description) existing.description = description;
                if (body) existing.body = body;
            } else if (!existing) {
                const routeMeta: RouteMeta = { path: fullPath, methods: [method] };
                if (description) routeMeta.description = description;
                if (body) routeMeta.body = body;
                endpointList.push(routeMeta);
            }
        }

        if (endpointList.length > 0) {
            endpoints[category] = endpointList;
        }
    }

    return endpoints;
}
