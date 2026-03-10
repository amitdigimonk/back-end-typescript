const fs = require('fs');
const path = require('path');

const distPath = path.join(__dirname, '..', 'dist');

// 1. Copy and modify package.json
const pkgPath = path.join(__dirname, '..', 'package.json');
const distPkgPath = path.join(distPath, 'package.json');

const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));
pkg.scripts.start = "node index.js";
delete pkg.devDependencies;

// Remove scripts not needed in production to keep it clean (optional but recommended)
delete pkg.scripts.dev;
delete pkg.scripts.build;
delete pkg.scripts.postbuild;

// Update the seed script so they can seed in production
if (pkg.scripts.seed) {
    pkg.scripts.seed = "node seeders/seed.js";
}

fs.writeFileSync(distPkgPath, JSON.stringify(pkg, null, 2));
console.log('✅ Generated optimized package.json in dist/');

// 2. Copy .env file
const buildEnv = process.env.BUILD_ENV || 'dev';
const sourceEnvFile = buildEnv === 'prod' ? '.env.prod' : '.env';
const envPath = path.join(__dirname, '..', sourceEnvFile);
const distEnvPath = path.join(distPath, '.env');

if (fs.existsSync(envPath)) {
    fs.copyFileSync(envPath, distEnvPath);
    console.log(`✅ Copied ${sourceEnvFile} to dist/.env`);
} else {
    console.log(`⚠️ No ${sourceEnvFile} file found to copy.`);
}
