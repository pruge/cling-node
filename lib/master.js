"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ModbusMaster = void 0;
const bufferput_1 = __importDefault(require("bufferput"));
const serial_helper_1 = require("./serial-helper");
const constants_1 = require("./constants");
const packetUtils = __importStar(require("./packet-utils"));
// import $eventBus from '../eventbus';
// import { getDefaultStore } from 'jotai';
// import { Store } from '@/components/provider/JotaiProvider';
// import { LBIT_ATOM, LWORD_ATOM } from '@/atom/modbus';
const logger_1 = require("./logger");
const errors_1 = require("./errors");
const events_1 = __importDefault(require("events"));
const EventEmitter = events_1.default.EventEmitter || events_1.default;
class ModbusMaster extends EventEmitter {
    constructor(serialPort, options) {
        super();
        this._unitID = 0;
        this._lockPollCoils = false;
        this._lockPollRegisters = false;
        this._options = Object.assign({}, {
            responseTimeout: constants_1.RESPONSE_TIMEOUT,
            queueTimeout: constants_1.QUEUE_TIMEOUT,
            retryCount: constants_1.DEFAULT_RETRY_COUNT,
            debug: false,
        }, options || {});
        this.logger = new logger_1.Logger(this._options);
        this.serial = serial_helper_1.SerialHelperFactory.create(serialPort, this._options);
    }
    /**
     * Modbus function: 1, read coils
     * @param {number} address
     * @param {number} length
     * @param {number} [retryCount]
     * @returns {Promise<number[]>}
     */
    readCoils(address, length) {
        return __awaiter(this, void 0, void 0, function* () {
            const packet = this.createFixedPacket(this._unitID, constants_1.FUNCTION_CODES.READ_COILS, address, length);
            // $eventBus.trigger('data', packet)
            return this.request(packet).then((buffer) => {
                const buf = packetUtils.getDataBuffer(buffer);
                // $eventBus.trigger('data', buf)
                return packetUtils.parseFc01Packet(buf, length);
            });
        });
    }
    /**
     * Modbus function: 5, write single coil
     * @param {number} address
     * @param {boolean} value
     * @param {number} [retryCount]
     */
    writeCoil(address, value, _retryCount) {
        return __awaiter(this, void 0, void 0, function* () {
            const packet = this.createFixedPacket(this._unitID, constants_1.FUNCTION_CODES.WRITE_SINGLE_COIL, address, value ? 1 : 0);
            const retryCount = _retryCount !== null && _retryCount !== void 0 ? _retryCount : this._options.retryCount;
            const performRequest = (retry) => {
                return new Promise((resolve, reject) => {
                    const funcName = 'writeSingleCoil: ';
                    const funcId = `Slave ${this._unitID}; Address: ${address}; Value: ${value ? 'true' : 'false'};` +
                        `Retry ${retryCount - retry} of ${retryCount}`;
                    if (retry < 0) {
                        // throw new ModbusRetryLimitExceed(funcId)
                        reject('Modbus retry limit exceed');
                    }
                    this.logger.info(funcName + 'perform request.' + funcId);
                    this.request(packet)
                        .then(resolve)
                        .catch((err) => {
                        this.logger.info(funcName + err + funcId);
                        return performRequest(--retry).then(resolve).catch(reject);
                    });
                });
            };
            return performRequest(retryCount);
        });
    }
    /**
     * Modbus function: 3, read holding registers
     * @param {number} address
     * @param {number} length
     * @param {number | function} [dataType] value from DATA_TYPES const or callback
     * @returns {Promise<number[]>}
     */
    readHoldingRegisters(address, length, dataType) {
        const packet = this.createFixedPacket(this._unitID, constants_1.FUNCTION_CODES.READ_HOLDING_REGISTERS, address, length);
        return this.request(packet).then((buffer) => {
            const buf = packetUtils.getDataBuffer(buffer);
            // $eventBus.trigger('data', buf);
            // this.emit('data', buf);
            return packetUtils.parseFc03Packet(buf, dataType);
        });
    }
    /**
     * Modbus function: 6,  write single register
     * @param {number} address
     * @param {number} value
     * @param {number} [retryCount]
     */
    writeRegister(address, value, _retryCount) {
        const packet = this.createFixedPacket(this._unitID, constants_1.FUNCTION_CODES.WRITE_SINGLE_REGISTER, address, value);
        const retryCount = _retryCount !== null && _retryCount !== void 0 ? _retryCount : this._options.retryCount;
        const performRequest = (retry) => {
            return new Promise((resolve, reject) => {
                const funcName = 'writeSingleRegister: ';
                const funcId = `Slave ${this._unitID}; Address: ${address}; Value: ${value};` +
                    `Retry ${retryCount - retry} of ${retryCount}`;
                if (retry < 0) {
                    // throw new ModbusRetryLimitExceed(funcId)
                    reject('Modbus retry limit exceed');
                }
                this.logger.info(funcName + 'perform request.' + funcId);
                this.request(packet)
                    .then(resolve)
                    .catch((err) => {
                    this.logger.info(funcName + err + funcId);
                    return performRequest(--retry).then(resolve).catch(reject);
                });
            });
        };
        return performRequest(retryCount);
    }
    /**
     * Modbus function: 16, write multiple registers
     * @param {number} address
     * @param {number[]} array
     * @param {number} [retryCount]
     */
    writeRegisters(address, array, _retryCount) {
        const packet = this.createVariousPacket(this._unitID, constants_1.FUNCTION_CODES.WRITE_MULTIPLE_REGISTERS, address, array);
        const retryCount = _retryCount !== null && _retryCount !== void 0 ? _retryCount : this._options.retryCount;
        const performRequest = (retry) => {
            return new Promise((resolve, reject) => {
                const funcName = 'writeMultipleRegisters: ';
                const funcId = `Slave ${this._unitID}; Address: ${address}; Value: ${array.toString()};` +
                    `Retry ${retryCount + 1 - retry} of ${retryCount}`;
                if (retry < 0) {
                    // throw new ModbusRetryLimitExceed(funcId)
                    reject('Modbus retry limit exceed');
                }
                this.logger.info(funcName + 'perform request.' + funcId);
                this.request(packet)
                    .then(resolve)
                    .catch((err) => {
                    this.logger.info(funcName + err + funcId);
                    return performRequest(--retry).then(resolve).catch(reject);
                });
            });
        };
        return performRequest(retryCount);
    }
    /**
     * Modbus polling coils
     * @param {number} address
     * @param {number} length
     * @param {number} polling
     */
    pollCoils(address, length, polling = 500) {
        // $eventBus.trigger('state', 'coil polling: ' + polling);
        if (this._lockPollCoils) {
            return;
        }
        this._lockPollCoils = true;
        this.readCoils(address, length)
            .then((data) => {
            this.emit('LBIT', data);
            // this.emit('data', data);
            // this._store.set(LBIT_ATOM, data);
            // $eventBus.trigger('LBIT', data);
            // $eventBus.trigger('data', data);
        })
            .catch((error) => {
            this.emit('error', error);
        })
            .finally(() => {
            setTimeout(() => {
                this._lockPollCoils = false;
                this.pollCoils(address, length, polling);
            }, polling);
        });
    }
    /**
     * Modbus polling coils
     * @param {number} address
     * @param {number} length
     * @param {number} polling
     */
    pollRegisters(address, length, dataType = 'INT', polling = 500) {
        // $eventBus.trigger('state', 'register polling: ' + polling);
        if (this._lockPollRegisters) {
            return;
        }
        this._lockPollRegisters = true;
        this.readHoldingRegisters(address, length, dataType)
            .then((data) => {
            // this._store.set(LWORD_ATOM, data);
            // $eventBus.trigger('LWORD', data);
            this.emit('LWORD', data);
        })
            .catch((error) => {
            // this.emit('error', error);
        })
            .finally(() => {
            setTimeout(() => {
                this._lockPollRegisters = false;
                this.pollRegisters(address, length, dataType, polling);
            }, polling);
        });
    }
    /**
     * Create modbus packet with fixed length
     * @private
     * @param {number} slave
     * @param {number} func
     * @param {number} param
     * @param {number} param2
     * @returns {Buffer}
     */
    createFixedPacket(slave, func, param, param2) {
        const buf = new bufferput_1.default().word8be(slave).word8be(func);
        switch (func) {
            case constants_1.FUNCTION_CODES.WRITE_SINGLE_COIL:
                buf.word16be(param);
                if (param2 === 0) {
                    buf.word16be(0);
                }
                else {
                    buf.word8be(255);
                    buf.word8be(0);
                }
                break;
            default:
                buf.word16be(param).word16be(param2).buffer();
                break;
        }
        return buf.buffer();
    }
    /**
     * Create modbus packet with various length
     * @private
     * @param {number} slave
     * @param {number} func
     * @param {number} start
     * @param {number[]} array
     * @returns {Buffer}
     */
    createVariousPacket(slave, func, start, array) {
        const buf = new bufferput_1.default()
            .word8be(slave)
            .word8be(func)
            .word16be(start)
            .word16be(array.length)
            .word8be(array.length * 2);
        array.forEach((value) => buf.word16be(value));
        return buf.buffer();
    }
    /**
     * @private
     * @param {Buffer} buffer
     * @returns {Promise<Buffer>}
     */
    request(buffer) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield this.serial.write(packetUtils.addCrc(buffer));
            if (!packetUtils.checkCrc(response)) {
                throw new errors_1.ModbusCrcError();
            }
            return response;
        });
    }
    delay(ms) {
        return new Promise((resolve) => setTimeout(resolve, ms));
    }
    setID(id) {
        this._unitID = id;
    }
}
exports.ModbusMaster = ModbusMaster;
