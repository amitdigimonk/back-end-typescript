

## 🚀 Building and Deploying to Production

This project is configured to generate a perfectly self-contained bundle for production deployment. When you run the build command, it compiles TypeScript, automatically copies all static assets (templates, locales, public files), and creates an optimized production-ready `package.json` inside the `dist/` folder. It will also copy the appropriate environment file (`.env` or `.env.prod`) into the `dist/` folder depending on the command used.

### 1. Create the Build
You can build the project for different environments. Run the appropriate command in the root directory:

**For Development (uses `.env`):**
```bash
npm run build
```

**For Production (uses `.env.prod`):**
```bash
npm run build:prod
```

These commands execute the `tsc` compiler and run the post-build scripts. The `build:prod` command sets the `BUILD_ENV=prod` variable, which tells the post-build script to copy the `.env.prod` file (instead of the standard `.env` file) as `.env` inside the generated `dist/` folder. Once finished, a `dist/` directory will be created containing everything you need for deployment.

### 2. Deploy to Server
You do **not** need to deploy the entire project or source files. To deploy to your server, simply follow these steps:

1. Upload the **entire contents** of the `dist/` directory to your server (including the optimized `package.json`).
2. SSH into your server and navigate into your project directory.
3. Install **only** the production dependencies:
   ```bash
   npm install --omit=dev
   ```
4. Start your application!
   ```bash
   npm run start
   ```

> **Note:** The `package.json` inside the `dist/` folder has been stripped of dev dependencies and scripts (like `nodemon`, `typescript`, etc.) to keep your production environment secure and lightweight. The `start` script maps automatically to `node index.js`.
