export declare class Logger {
    getLevel(): string;
    setLevel(level): void;
    /*
        Medium priority logging, default.
    */
    log(...messages): void;
    /*
        Appends red "ERROR" to the start of logs.
        Highest priority logging.
    */
    error(...messages): void;
    /*
        Less high priority than error, still higher visibility than default.
    */
    warn(...messages): void;
    /*
        Lower priority logging.
        Only logs if the environment variable is set to VERBOSE.
    */
    verbose(...messages): void;
    setFileLogging(path): void;
    deactivateFileLogging(): void;
    enablePrettyErrors(): void;
}
