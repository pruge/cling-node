import { ModbusMasterOptions } from './master';
export declare class Logger {
    options: Partial<ModbusMasterOptions>;
    constructor(options: Partial<ModbusMasterOptions>);
    info(string: string): void;
}
