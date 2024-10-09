"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkCrc = exports.addCrc = exports.parseFc03Packet = exports.parseFc01Packet = exports.getDataBuffer = void 0;
const crc_1 = __importDefault(require("crc"));
const bufferput_1 = __importDefault(require("bufferput"));
/**
 * Slice header, bytes count and crc. Return buffer only with data
 * @param {Buffer} buffer
 */
function getDataBuffer(buffer) {
    return buffer.slice(3, buffer.length - 2);
}
exports.getDataBuffer = getDataBuffer;
/**
 * Parse function 01 response packet (read coils)
 * @param {Buffer} buffer
 * @param {number} length
 * @returns {number[]}
 */
function parseFc01Packet(buffer, length) {
    const results = [];
    let idx;
    for (let i = 0; i < length; i++) {
        idx = i / 8;
        results.push((buffer[idx] >> i % 8) & 1);
    }
    return results;
}
exports.parseFc01Packet = parseFc01Packet;
/**
 * Parse function 03 response packet (read holding registers)
 * @param {Buffer} buffer
 * @param {number} [dataType]
 * @returns {number[]}
 */
function parseFc03Packet(buffer, dataType) {
    const results = [];
    for (let i = 0; i < buffer.length; i += 2) {
        results.push(readDataFromBuffer(buffer, i, dataType));
    }
    return results;
}
exports.parseFc03Packet = parseFc03Packet;
/**
 * Returns new buffer signed with CRC
 * @param {Buffer} buf
 * @returns {Buffer}
 */
function addCrc(buf) {
    return new bufferput_1.default().put(buf).word16le(crc_1.default.crc16modbus(buf)).buffer();
}
exports.addCrc = addCrc;
/**
 *
 * @param {Buffer} buffer
 * @returns boolean
 */
function checkCrc(buffer) {
    const pdu = buffer.slice(0, buffer.length - 2);
    return buffer.equals(addCrc(pdu));
}
exports.checkCrc = checkCrc;
/**
 *
 * @param {Buffer} buffer
 * @param {int} offset
 * @param {int} [dataType]
 * @returns {number | string}
 */
function readDataFromBuffer(buffer, offset, dataType) {
    switch (dataType) {
        case 'UINT':
            return buffer.readUInt16BE(offset);
        default:
            return buffer.readInt16BE(offset);
    }
}
