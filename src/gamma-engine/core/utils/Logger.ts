export enum LogLevel { ALL = 4, INFO = 3, WARNING = 2, ERROR = 1, NONE = 0}

export default class Logger {
    public static logLevel: LogLevel = LogLevel.ALL;

    public static debug(...messages: any[]): void {
        if (Logger.logLevel >= LogLevel.ALL) {
          //  console.log('[DEBUG] ' + Logger.buildMessage(messages));
        }
    }

    public static info(...messages: any[]): void {
        if (Logger.logLevel >= LogLevel.INFO) {
            console.log('%c[INFO] ' + Logger.buildMessage(messages), 'color: #0000FF');
        }
    }

    public static warning(...messages: any[]): void {
        if (Logger.logLevel >= LogLevel.WARNING) {
            console.log('%c[WARNING] ' + Logger.buildMessage(messages), 'color: #FFCC00');
        }
    }

    public static error(...messages: any[]): void {
        if (Logger.logLevel >= LogLevel.ERROR) {
            console.log('%c[ERROR] ' + Logger.buildMessage(messages), 'color: #FF0000');
        }
    }

    private static buildMessage(messages: any[]): string {
        let message: string = '';
        for (const m of messages) {
            message += m + ' ';
        }
        return message.substring(0, message.length - 1);
    }
}
