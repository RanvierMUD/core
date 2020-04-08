export namespace Logger {
    function getLevel(): string;
    function setLevel(level): void;
    /*
        Medium priority logging, default.
    */
    function log(...messages): void;
    /*
        Appends red "ERROR" to the start of logs.
        Highest priority logging.
    */
    function error(...messages): void;
    /*
        Less high priority than error, still higher visibility than default.
    */
    function warn(...messages): void;
    /*
        Lower priority logging.
        Only logs if the environment variable is set to VERBOSE.
    */
    function verbose(...messages): void;
    function setFileLogging(path): void;
    function deactivateFileLogging(): void;
    function enablePrettyErrors(): void;
}
