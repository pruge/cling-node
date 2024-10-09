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
Object.defineProperty(exports, "__esModule", { value: true });
exports.SerialHelper = exports.SerialHelperFactory = void 0;
/* eslint-disable @typescript-eslint/ban-types */
const task_1 = require("./task");
const queue_1 = require("./queue");
const logger_1 = require("./logger");
class SerialHelperFactory {
    /**
     * @param {SerialPort} serialPort
     * @param options
     * @returns {SerialHelper}
     */
    static create(serialPort, options) {
        const queue = new queue_1.Queue(options.queueTimeout);
        return new SerialHelper(serialPort, queue, options);
    }
}
exports.SerialHelperFactory = SerialHelperFactory;
class SerialHelper {
    /**
     * @param {SerialPort} serialPort
     * @param {Queue<Task>} queue
     * @param options
     */
    constructor(serialPort, queue, options) {
        /**
         * @type {Queue<Task>}
         * @private
         */
        this.queue = queue;
        queue.setTaskHandler(this.handleTask.bind(this));
        /**
         * @private
         */
        this.options = options;
        this.serialPort = serialPort;
        this.logger = new logger_1.Logger(options);
        this.bindToSerialPort();
    }
    /**
     *
     * @param {Buffer} buffer
     * @returns {Promise}
     */
    write(buffer) {
        return __awaiter(this, void 0, void 0, function* () {
            const task = new task_1.Task(buffer);
            this.queue.push(task);
            return task.promise;
        });
    }
    /**
     * @private
     */
    bindToSerialPort() {
        this.serialPort.on('open', () => {
            this.queue.start();
        });
        // this.queue.start();
    }
    /**
     *
     * @param {Task} task
     * @param {function} done
     * @private
     */
    handleTask(task, done) {
        return __awaiter(this, void 0, void 0, function* () {
            this.logger.info('write ' + task.payload.toString('hex'));
            this.serialPort.write(task.payload).catch((error) => {
                if (error) {
                    task.reject(error);
                }
            });
            // set execution timeout for task
            const timeout = setTimeout(() => {
                // task.reject(new ModbusResponseTimeout(this.options.responseTimeout))
                task.reject('Modbus Response Timeout');
            }, this.options.responseTimeout);
            const onData = (data) => {
                task.receiveData(data, (response) => {
                    // this.logger.info('resp ' + response.toString('hex'));
                    task.resolve(response);
                });
            };
            this.serialPort.on('data', onData);
            task.promise
                // eslint-disable-next-line @typescript-eslint/no-empty-function
                // .catch(() => {})
                .finally(() => {
                // [x] 왜 clear가 안되는가?
                // nextjs dev 모드에서 두번 실행 되어서 그럼.
                // use-effect-once 를 수정 사용
                clearTimeout(timeout);
                this.serialPort.removeListener('data', onData);
                done();
            });
        });
    }
}
exports.SerialHelper = SerialHelper;
