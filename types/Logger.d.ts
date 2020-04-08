export namespace Logger {
    static function getLevel(): string;
    static function setLevel(level): void;
    /*
        Medium priority logging, default.
    */
    static function log(...messages): void;
    /*
        Appends red "ERROR" to the start of logs.
        Highest priority logging.
    */
    static function error(...messages): void;
    /*
        Less high priority than error, still higher visibility than default.
    */
    static function warn(...messages): void;
    /*
        Lower priority logging.
        Only logs if the environment variable is set to VERBOSE.
    */
    static function verbose(...messages): void;
    static function setFileLogging(path): void;
    static function deactivateFileLogging(): void;
    static function enablePrettyErrors(): void;
}
