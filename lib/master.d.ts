/// <reference types="node" />
/// <reference types="node" />
import { SerialHelper } from './serial-helper';
import * as packetUtils from './packet-utils';
import { SerialPort } from './SerialPort';
import { Logger } from './logger';
import events from 'events';
declare const EventEmitter: typeof events;
export type ModbusMasterOptions = {
    responseTimeout: number;
    queueTimeout: number;
    retryCount: number;
    debug: boolean;
};
export declare class ModbusMaster extends EventEmitter {
    serial: SerialHelper;
    logger: Logger;
    _options: ModbusMasterOptions;
    _unitID: number;
    _lockPollCoils: boolean;
    _lockPollRegisters: boolean;
    constructor(serialPort: SerialPort, options?: Partial<ModbusMasterOptions>);
    /**
     * Modbus function: 1, read coils
     * @param {number} address
     * @param {number} length
     * @param {number} [retryCount]
     * @returns {Promise<number[]>}
     */
    readCoils(address: number, length: number): Promise<number[]>;
    /**
     * Modbus function: 5, write single coil
     * @param {number} address
     * @param {boolean} value
     * @param {number} [retryCount]
     */
    writeCoil(address: number, value: boolean, _retryCount?: number): Promise<unknown>;
    /**
     * Modbus function: 3, read holding registers
     * @param {number} address
     * @param {number} length
     * @param {number | function} [dataType] value from DATA_TYPES const or callback
     * @returns {Promise<number[]>}
     */
    readHoldingRegisters(address: number, length: number, dataType: packetUtils.DATA_TYPES): Promise<number[]>;
    /**
     * Modbus function: 6,  write single register
     * @param {number} address
     * @param {number} value
     * @param {number} [retryCount]
     */
    writeRegister(address: number, value: number, _retryCount?: number): Promise<unknown>;
    /**
     * Modbus function: 16, write multiple registers
     * @param {number} address
     * @param {number[]} array
     * @param {number} [retryCount]
     */
    writeRegisters(address: number, array: number[], _retryCount?: number): Promise<unknown>;
    /**
     * Modbus polling coils
     * @param {number} address
     * @param {number} length
     * @param {number} polling
     */
    pollCoils(address: number, length: number, polling?: number): void;
    /**
     * Modbus polling coils
     * @param {number} address
     * @param {number} length
     * @param {number} polling
     */
    pollRegisters(address: number, length: number, dataType?: packetUtils.DATA_TYPES, polling?: number): void;
    /**
     * Create modbus packet with fixed length
     * @private
     * @param {number} slave
     * @param {number} func
     * @param {number} param
     * @param {number} param2
     * @returns {Buffer}
     */
    createFixedPacket(slave: number, func: number, param: number, param2: number): any;
    /**
     * Create modbus packet with various length
     * @private
     * @param {number} slave
     * @param {number} func
     * @param {number} start
     * @param {number[]} array
     * @returns {Buffer}
     */
    createVariousPacket(slave: number, func: number, start: number, array: number[]): any;
    /**
     * @private
     * @param {Buffer} buffer
     * @returns {Promise<Buffer>}
     */
    request(buffer: Buffer): Promise<Buffer>;
    delay(ms: number): Promise<unknown>;
    setID(id: number): void;
}
export {};
