import dotenv from 'dotenv';

dotenv.config();

export const env = {
    APP_NAME: process.env.APP_NAME || 'backend-typescript',
    PORT: process.env.PORT || 8000,
    NODE_ENV: process.env.NODE_ENV || 'development',
    MONGO_URI: process.env.MONGO_URI || '',
    JWT_SECRET: process.env.JWT_SECRET || 'fallback_secret',
    CORS_ORIGIN: process.env.CORS_ORIGIN || '*',
    FIREBASE_CONFIG: process.env.FIREBASE_SERVICE_KEY || {},
    CORS_DOMAINS: process.env.CORS_DOMAINS || '*',
};
