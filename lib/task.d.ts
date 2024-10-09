/// <reference types="node" />
export declare class Task {
    deferred: DefferedType;
    id: number;
    cmd: number;
    length: number;
    buffer: Buffer;
    payload: Buffer;
    promise: Promise<Buffer>;
    /**
     * @param {Buffer} payload
     */
    constructor(payload: Buffer);
    resolve(data: Buffer): void;
    reject(error: any): void;
    /**
     *
     * @param {Buffer} data
     * @param {function(response: Buffer)} done
     * @returns {Buffer}
     */
    receiveData(data: Buffer, done: Function): any;
    /**
     * @private
     * @param {number} start
     * @param {number} length
     * @returns {Buffer}
     */
    getMessage(start: number, length: number): Buffer;
    /**
     * @private
     * @param {number} cmd
     * @param {Buffer} payload
     * @return number
     */
    getExpectedLength(cmd: number, payload: Buffer): number;
    /**
     * @private
     * @returns {{}}
     */
    createDeferred(): DefferedType;
}
export type DefferedType = {
    promise: Promise<Buffer>;
    resolve: (data: Buffer) => void;
    reject: (error: Error) => void;
};
