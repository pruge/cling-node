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
var __classPrivateFieldSet = (this && this.__classPrivateFieldSet) || function (receiver, state, value, kind, f) {
    if (kind === "m") throw new TypeError("Private method is not writable");
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
};
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _Node_master, _Node_coil_start, _Node_coil_end, _Node_coil_count, _Node_hreg_start, _Node_hreg_end, _Node_hreg_count, _Node_devices;
Object.defineProperty(exports, "__esModule", { value: true });
exports.Node = void 0;
const button_1 = __importDefault(require("./button"));
const encoder_1 = __importDefault(require("./encoder"));
const output_1 = __importDefault(require("./output"));
const sensor_1 = __importDefault(require("./sensor"));
const switch2_1 = __importDefault(require("./switch2"));
const variable_1 = __importDefault(require("./variable"));
const events_1 = __importDefault(require("events"));
const EventEmitter = events_1.default.EventEmitter || events_1.default;
class Node extends EventEmitter {
    constructor(master, mem) {
        super();
        _Node_master.set(this, void 0);
        _Node_coil_start.set(this, 3000); // some max value
        _Node_coil_end.set(this, 0);
        _Node_coil_count.set(this, 0);
        _Node_hreg_start.set(this, 3000);
        _Node_hreg_end.set(this, 0);
        _Node_hreg_count.set(this, 0);
        _Node_devices.set(this, new Map());
        __classPrivateFieldSet(this, _Node_master, master, "f");
        if (mem) {
            this.mem = mem;
        }
        else {
            this.mem = new Map();
        }
        master.on('COIL', (data) => {
            let i, j;
            for (i = __classPrivateFieldGet(this, _Node_coil_start, "f"), j = 0; i <= __classPrivateFieldGet(this, _Node_coil_end, "f"); i++, j++) {
                this.mem.set(i, data[j]);
            }
            this.emit('COIL_CHANGED');
        });
        let i, j;
        master.on('HREG', (data) => {
            for (i = __classPrivateFieldGet(this, _Node_hreg_start, "f"), j = 0; i <= __classPrivateFieldGet(this, _Node_hreg_end, "f"); i++, j++) {
                this.mem.set(i, data[j]);
            }
            this.emit('HREG_CHANGED');
        });
        master.on('error', (error) => {
            this.emit('error', error);
        });
    }
    /**
     * json 설정 정보를 통해 노드 초기화
     */
    initialize(variables) {
        return __awaiter(this, void 0, void 0, function* () {
            let device;
            for (const item of variables) {
                switch (item.type) {
                    // ==== coil ====
                    case 'button':
                        device = button_1.default;
                        break;
                    case 'switch2':
                        device = switch2_1.default;
                        break;
                    case 'sensor':
                        device = sensor_1.default;
                        break;
                    case 'output':
                        device = output_1.default;
                        break;
                    // ==== hreg ====
                    case 'encoder':
                        device = encoder_1.default;
                        break;
                    case 'variable':
                        device = variable_1.default;
                        break;
                    default:
                        break;
                }
                if (device == undefined) {
                    continue;
                }
                const _device = new device(__classPrivateFieldGet(this, _Node_master, "f"), this, item.name, item.address);
                __classPrivateFieldGet(this, _Node_devices, "f").set(item.name, _device);
                if (item.memory === 'Coil') {
                    __classPrivateFieldSet(this, _Node_coil_start, __classPrivateFieldGet(this, _Node_coil_start, "f") > item.address ? item.address : __classPrivateFieldGet(this, _Node_coil_start, "f"), "f");
                    __classPrivateFieldSet(this, _Node_coil_end, __classPrivateFieldGet(this, _Node_coil_end, "f") > item.address ? __classPrivateFieldGet(this, _Node_coil_end, "f") : item.address, "f");
                    __classPrivateFieldSet(this, _Node_coil_count, __classPrivateFieldGet(this, _Node_coil_end, "f") - __classPrivateFieldGet(this, _Node_coil_start, "f") + 1, "f");
                }
                else {
                    __classPrivateFieldSet(this, _Node_hreg_start, __classPrivateFieldGet(this, _Node_hreg_start, "f") > item.address ? item.address : __classPrivateFieldGet(this, _Node_hreg_start, "f"), "f");
                    __classPrivateFieldSet(this, _Node_hreg_end, __classPrivateFieldGet(this, _Node_hreg_end, "f") > item.address ? __classPrivateFieldGet(this, _Node_hreg_end, "f") : item.address, "f");
                    __classPrivateFieldSet(this, _Node_hreg_count, __classPrivateFieldGet(this, _Node_hreg_end, "f") - __classPrivateFieldGet(this, _Node_hreg_start, "f") + 1, "f");
                }
            }
        });
    }
    // ==== coil ====
    button(name) {
        const device = __classPrivateFieldGet(this, _Node_devices, "f").get(name);
        if (device == undefined) {
            throw new Error(`${name} is not found`);
        }
        return device;
    }
    // ==== coil ====
    switch2(name) {
        const device = __classPrivateFieldGet(this, _Node_devices, "f").get(name);
        if (device == undefined) {
            throw new Error(`${name} is not found`);
        }
        return device;
    }
    // ==== coil ====
    sensor(name) {
        const device = __classPrivateFieldGet(this, _Node_devices, "f").get(name);
        if (device == undefined) {
            throw new Error(`${name} is not found`);
        }
        return device;
    }
    // ==== coil ====
    output(name) {
        const device = __classPrivateFieldGet(this, _Node_devices, "f").get(name);
        if (device == undefined) {
            throw new Error(`${name} is not found`);
        }
        return device;
    }
    // ==== register ====
    encoder(name) {
        const device = __classPrivateFieldGet(this, _Node_devices, "f").get(name);
        if (device == undefined) {
            throw new Error(`${name} is not found`);
        }
        return device;
    }
    // ==== register ====
    variable(name) {
        const device = __classPrivateFieldGet(this, _Node_devices, "f").get(name);
        if (device == undefined) {
            throw new Error(`${name} is not found`);
        }
        return device;
    }
    // ==== polling read ====
    start(polling) {
        __classPrivateFieldGet(this, _Node_master, "f").pollCoils(__classPrivateFieldGet(this, _Node_coil_start, "f"), __classPrivateFieldGet(this, _Node_coil_count, "f"), polling);
        __classPrivateFieldGet(this, _Node_master, "f").pollRegisters(__classPrivateFieldGet(this, _Node_hreg_start, "f"), __classPrivateFieldGet(this, _Node_hreg_count, "f"), 'INT', polling);
    }
}
exports.Node = Node;
_Node_master = new WeakMap(), _Node_coil_start = new WeakMap(), _Node_coil_end = new WeakMap(), _Node_coil_count = new WeakMap(), _Node_hreg_start = new WeakMap(), _Node_hreg_end = new WeakMap(), _Node_hreg_count = new WeakMap(), _Node_devices = new WeakMap();
