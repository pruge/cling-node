/// <reference types="node" />
import { Task } from './task';
import { Queue } from './queue';
import { SerialPort } from './SerialPort';
import { ModbusMasterOptions } from './master';
import { Logger } from './logger';
export declare class SerialHelperFactory {
    /**
     * @param {SerialPort} serialPort
     * @param options
     * @returns {SerialHelper}
     */
    static create(serialPort: SerialPort, options: ModbusMasterOptions): SerialHelper;
}
export declare class SerialHelper {
    queue: Queue;
    options: ModbusMasterOptions;
    serialPort: SerialPort;
    logger: Logger;
    /**
     * @param {SerialPort} serialPort
     * @param {Queue<Task>} queue
     * @param options
     */
    constructor(serialPort: SerialPort, queue: Queue, options: ModbusMasterOptions);
    /**
     *
     * @param {Buffer} buffer
     * @returns {Promise}
     */
    write(buffer: Buffer): Promise<Buffer>;
    /**
     * @private
     */
    bindToSerialPort(): void;
    /**
     *
     * @param {Task} task
     * @param {function} done
     * @private
     */
    handleTask(task: Task, done: Function): Promise<void>;
}
