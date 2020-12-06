export declare interface HelpfileOptions {
    keywords: string[];
    command: string;
    channel: string;
    related: string[];
    body: string;
}

export declare class Helpfile {
  /**
   * @param {string} bundle Bundle the helpfile comes from
   * @param {string} name
   * @param {HelpfileOptions} options
   */
  constructor(bundle: string, name: string, options: HelpfileOptions);
}
