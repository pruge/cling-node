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
const device_1 = __importDefault(require("./device"));
class Button extends device_1.default {
    constructor(client, node, name, regAddress) {
        super(client, node, name, regAddress);
    }
    click() {
        return __awaiter(this, void 0, void 0, function* () {
            console.log('Button Click!');
            try {
                yield this.Coil(1);
                yield this.delay(200);
                yield this.Coil(0);
            }
            catch (error) {
                console.error(error);
            }
        });
    }
}
exports.default = Button;
