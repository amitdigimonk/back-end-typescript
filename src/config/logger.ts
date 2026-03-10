import fs from 'fs';
import path from 'path';

enum LogLevel {
    INFO = 'INFO',
    WARN = 'WARN',
    ERROR = 'ERROR'
}

class LoggerService {
    private logStream: fs.WriteStream;
    private errorStream: fs.WriteStream;

    constructor() {
        const logDir = path.join(__dirname, '../../logs');
        if (!fs.existsSync(logDir)) {
            fs.mkdirSync(logDir);
        }

        this.logStream = fs.createWriteStream(path.join(logDir, 'combined.log'), { flags: 'a' });
        this.errorStream = fs.createWriteStream(path.join(logDir, 'error.log'), { flags: 'a' });
    }

    private formatMessage(level: LogLevel, message: string, meta?: any): string {
        const now = new Date();


        const day = String(now.getDate()).padStart(2, '0');
        const month = String(now.getMonth() + 1).padStart(2, '0');
        const year = now.getFullYear();
        const hours = String(now.getHours()).padStart(2, '0');
        const minutes = String(now.getMinutes()).padStart(2, '0');
        const timestamp = `${day}-${month}-${year} ${hours}:${minutes}`;

        const metaString = meta ? ` | Data: ${JSON.stringify(meta)}` : '';
        return `[${timestamp}] [${level}]: ${message}${metaString}\n`;
    }

    public info(message: string, meta?: any) {
        const logMsg = this.formatMessage(LogLevel.INFO, message, meta);

        console.log(`\x1b[32m${logMsg.trim()}\x1b[0m`);

        this.logStream.write(logMsg);
    }

    public warn(message: string, meta?: any) {
        const logMsg = this.formatMessage(LogLevel.WARN, message, meta);

        console.warn(`\x1b[33m${logMsg.trim()}\x1b[0m`);

        this.logStream.write(logMsg);
    }

    public error(message: string, meta?: any) {
        const logMsg = this.formatMessage(LogLevel.ERROR, message, meta);


        console.error(`\x1b[31m${logMsg.trim()}\x1b[0m`);


        this.logStream.write(logMsg);
        this.errorStream.write(logMsg);
    }
}

export const logger = new LoggerService();

