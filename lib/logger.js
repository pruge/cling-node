"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Logger = void 0;
class Logger {
    constructor(options) {
        this.options = options;
    }
    info(string) {
        if (this.options.debug) {
            console.log(string);
        }
    }
}
exports.Logger = Logger;
