export declare class Logger {
    static getLevel(): string;
    static setLevel(level): void;
    /*
        Medium priority logging, default.
    */
    static log(...messages): void;
    /*
        Appends red "ERROR" to the start of logs.
        Highest priority logging.
    */
    static error(...messages): void;
    /*
        Less high priority than error, still higher visibility than default.
    */
    static warn(...messages): void;
    /*
        Lower priority logging.
        Only logs if the environment variable is set to VERBOSE.
    */
    static verbose(...messages): void;
    static setFileLogging(path): void;
    static deactivateFileLogging(): void;
    static enablePrettyErrors(): void;
}
