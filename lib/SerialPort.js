"use strict";
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
exports.SerialPort = void 0;
const capacitor_serial_1 = require("@adeunis/capacitor-serial");
const events_1 = __importDefault(require("events"));
// import $eventBus from '../eventbus'
const EventEmitter = events_1.default.EventEmitter || events_1.default;
class SerialPort extends EventEmitter {
    constructor(options) {
        super();
        this.options = options;
        this._connected = false;
    }
    open() {
        return __awaiter(this, void 0, void 0, function* () {
            return capacitor_serial_1.Serial.requestSerialPermissions()
                .then((permissionResponse) => {
                if (!permissionResponse.granted) {
                    return Promise.reject('Permission refused');
                }
                return Promise.resolve();
            })
                .then(() => {
                capacitor_serial_1.Serial.openConnection(this.options);
            })
                .then(() => {
                console.info('Serial connection opened');
                this._connected = true;
                this.registerReadCallback();
                this.emit('open');
            })
                .catch((error) => {
                console.error(error);
                this._connected = false;
            });
        });
    }
    close() {
        return __awaiter(this, void 0, void 0, function* () {
            return capacitor_serial_1.Serial.closeConnection();
        });
    }
    /**
     * Check if port is open.
     *
     * @returns {boolean}
     */
    get isOpen() {
        return this._connected;
    }
    write(data) {
        return __awaiter(this, void 0, void 0, function* () {
            // throw new Error(JSON.stringify(data))
            const hexData = { data: data.toString('hex') };
            return yield capacitor_serial_1.Serial.writeHexadecimal(hexData);
            // const resp = await Serial.read({readRaw: false})
            // // console.log('Response:', resp.data)
            // throw new Error(JSON.stringify(resp))
            // this.emit('data', resp.data)
            // // TODO data: string => Buffer
            // return resp.data
        });
    }
    registerReadCallback() {
        // $eventBus.trigger('state', JSON.stringify('register read callback'))
        capacitor_serial_1.Serial.registerReadRawCallback((message, error) => {
            if (message) {
                this.emit('data', Buffer.from(message.data, 'base64'));
                // $eventBus.trigger('data', Buffer.from(message.data, 'base64'))
                // $eventBus.trigger('data', Buffer.from(message.data, 'base64'))
            }
            if (error) {
                this.emit('error', error);
                // $eventBus.trigger('error', JSON.stringify(message))
            }
        });
    }
}
exports.SerialPort = SerialPort;
