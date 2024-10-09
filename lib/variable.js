"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const device_1 = __importDefault(require("./device"));
class Variable extends device_1.default {
    constructor(client, node, name, regAddress) {
        super(client, node, name, regAddress);
    }
    value(value) {
        if (value === undefined) {
            return this.Hreg();
        }
        else {
            return this.Hreg(value);
        }
    }
}
exports.default = Variable;
