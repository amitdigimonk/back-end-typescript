import { env } from './env';
import 'dotenv/config';
import mongoose from 'mongoose';
import app from './app';
import { connectDB } from './config/db';
import { logger } from './config/logger';

const PORT = env.PORT;

const startServer = async () => {
  try {
    await connectDB();

    const server = app.listen(PORT, () => {
      logger.info(`🚀 Server running on port ${PORT} in ${env.NODE_ENV} mode`);
    });

    const gracefulShutdown = (signal: string) => {
      logger.warn(`${signal} received. Shutting down gracefully...`);

      setTimeout(() => {
        logger.error('Could not close connections in time, forcefully shutting down');
        process.exit(1);
      }, 10000);

      server.close(() => {
        logger.info('HTTP Server closed');

        mongoose.connection.close(false).then(() => {
          logger.info('MongoDB connection closed');
          process.exit(0);
        });
      });
    };

    process.on('SIGINT', () => gracefulShutdown('SIGINT'));
    process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));

    process.on('unhandledRejection', (err: Error) => {
      logger.error('Unhandled Rejection! 💥 Shutting down...');
      logger.error(err.message);
      gracefulShutdown('UNHANDLED_REJECTION');
    });

  } catch (error) {
    logger.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();