/// <reference types="node" />
export type DATA_TYPES = 'INT' | 'UINT';
/**
 * Slice header, bytes count and crc. Return buffer only with data
 * @param {Buffer} buffer
 */
export declare function getDataBuffer(buffer: Buffer): Buffer;
/**
 * Parse function 01 response packet (read coils)
 * @param {Buffer} buffer
 * @param {number} length
 * @returns {number[]}
 */
export declare function parseFc01Packet(buffer: Buffer, length: number): number[];
/**
 * Parse function 03 response packet (read holding registers)
 * @param {Buffer} buffer
 * @param {number} [dataType]
 * @returns {number[]}
 */
export declare function parseFc03Packet(buffer: Buffer, dataType: DATA_TYPES): number[];
/**
 * Returns new buffer signed with CRC
 * @param {Buffer} buf
 * @returns {Buffer}
 */
export declare function addCrc(buf: Buffer): any;
/**
 *
 * @param {Buffer} buffer
 * @returns boolean
 */
export declare function checkCrc(buffer: Buffer): boolean;
