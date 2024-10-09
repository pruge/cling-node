import { Task } from './task';
export declare class Queue {
    taskHandler: (task: Task, done: () => void) => void;
    queueTimeout: number;
    queue: Task[];
    isActive: boolean;
    /**
     * @template T
     * @param {number} timeout pause between queue tasks
     */
    constructor(timeout: number);
    /**
     * Set handler which will be called on each task
     * @param {function(task: T, done: function):void} handler
     */
    setTaskHandler(handler: (task: Task, done: () => void) => void): void;
    /**
     * @param {T} task
     */
    push(task: Task): void;
    start(): void;
    stop(): void;
    /**
     * @private
     */
    handle(): void;
    /**
     * @private
     */
    continueQueue(): void;
}
