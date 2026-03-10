import { env } from './env';
import { formatUptime } from './utils/time';
import express from 'express';
import path from 'path';
import cors from 'cors';
import helmet from 'helmet';
import rootRouter from './routes/v1.routes';
import { i18next, middleware } from './middlewares/localization'
import { errorHandler } from './middlewares/error';
import { globalLimiter } from './config/security';
import { requestLogger } from './middlewares/logger';
import { sanitizeInput } from './middlewares/security';
import favicon from 'serve-favicon';
import { generateRoutesMap } from './utils/route-extractor';


const app = express();

app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));

// View Engine Setup
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'view'));

app.use(requestLogger);

// middlewares  
app.use(helmet());
app.use(cors({
    origin: env.CORS_DOMAINS.split(','),
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true
}));
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));
app.use(express.json());
app.use(sanitizeInput);
app.use(middleware.handle(i18next));


// Rate 
app.use('/api', globalLimiter);

// Default Welcome Route
app.get('/api', (_req, res) => {
    const uptime = formatUptime(process.uptime());
    // Get all registered endpoints statically from source code files only in development mode for security reasons
    const isProd = env.NODE_ENV === 'production' && __dirname.includes('dist');
    const endpoints = isProd ? null : generateRoutesMap();

    res.render('welcome', { appName: env.APP_NAME, uptime, endpoints });
});

// Routes
app.use('/api/v1', rootRouter);


// Global Error Handler
app.use(errorHandler);


export default app;