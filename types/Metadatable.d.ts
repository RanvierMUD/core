export declare function Metadatable(parentClass): any {
    /**
     * Set a metadata value.
     * Warning: Does _not_ autovivify, you will need to create the parent objects if they don't exist
     * @param {string} key   Key to set. Supports dot notation e.g., `"foo.bar"`
     * @param {*}      value Value must be JSON.stringify-able
     * @throws Error
     * @throws RangeError
     * @fires Metadatable#metadataUpdate
     */
    function setMeta(key: string, value: any): void;

    /**
     * Get metadata by dot notation
     * Warning: This method is _very_ permissive and will not error on a non-existent key. Rather, it will return false.
     * @param {string} key Key to fetch. Supports dot notation e.g., `"foo.bar"`
     * @return {*}
     * @throws Error
     */
    function getMeta(key: string): any;
}