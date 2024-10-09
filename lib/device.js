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
var _Device_name, _Device_node, _Device_regAddress, _Device_client;
Object.defineProperty(exports, "__esModule", { value: true });
class Device {
    constructor(client, node, name, regAddress) {
        _Device_name.set(this, void 0);
        _Device_node.set(this, void 0);
        _Device_regAddress.set(this, void 0);
        _Device_client.set(this, void 0);
        __classPrivateFieldSet(this, _Device_name, name, "f");
        __classPrivateFieldSet(this, _Device_regAddress, regAddress, "f");
        __classPrivateFieldSet(this, _Device_client, client, "f");
        __classPrivateFieldSet(this, _Device_node, node, "f");
    }
    Coil(value) {
        if (value === undefined) {
            if (typeof __classPrivateFieldGet(this, _Device_node, "f").mem.get(__classPrivateFieldGet(this, _Device_regAddress, "f")) === 'number') {
                return __classPrivateFieldGet(this, _Device_node, "f").mem.get(__classPrivateFieldGet(this, _Device_regAddress, "f"));
            }
            else {
                // @ts-ignore legnedstate proxy
                return __classPrivateFieldGet(this, _Device_node, "f").mem.get(__classPrivateFieldGet(this, _Device_regAddress, "f")).get();
            }
        }
        else {
            try {
                // this.#node.mem.set(this.#regAddress, value)
                return __classPrivateFieldGet(this, _Device_client, "f").writeCoil(__classPrivateFieldGet(this, _Device_regAddress, "f"), value ? true : false);
            }
            catch (error) {
                return Promise.reject(error);
            }
        }
    }
    Hreg(value) {
        if (value === undefined) {
            if (typeof __classPrivateFieldGet(this, _Device_node, "f").mem.get(__classPrivateFieldGet(this, _Device_regAddress, "f")) === 'number') {
                return __classPrivateFieldGet(this, _Device_node, "f").mem.get(__classPrivateFieldGet(this, _Device_regAddress, "f"));
            }
            else {
                // @ts-ignore legnedstate proxy
                return __classPrivateFieldGet(this, _Device_node, "f").mem.get(__classPrivateFieldGet(this, _Device_regAddress, "f")).get();
            }
        }
        else {
            try {
                // this.#node.mem.set(this.#regAddress, value)
                return __classPrivateFieldGet(this, _Device_client, "f").writeRegister(__classPrivateFieldGet(this, _Device_regAddress, "f"), value);
            }
            catch (error) {
                return Promise.reject(error);
            }
        }
    }
    delay(ms) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve) => setTimeout(resolve, ms));
        });
    }
}
_Device_name = new WeakMap(), _Device_node = new WeakMap(), _Device_regAddress = new WeakMap(), _Device_client = new WeakMap();
exports.default = Device;
