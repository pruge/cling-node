/// <reference types="node" />
/// <reference types="node" />
import { SerialConnectionParameters } from '@adeunis/capacitor-serial';
import events from 'events';
declare const EventEmitter: typeof events;
export declare class SerialPort extends EventEmitter {
    options: SerialConnectionParameters;
    _connected: boolean;
    constructor(options: SerialConnectionParameters);
    open(): Promise<void>;
    close(): Promise<void>;
    /**
     * Check if port is open.
     *
     * @returns {boolean}
     */
    get isOpen(): boolean;
    write(data: Buffer): Promise<void>;
    registerReadCallback(): void;
}
export {};
