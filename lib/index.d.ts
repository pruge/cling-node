/// <reference types="node" />
import { ModbusMaster } from '@cling/capacitor-modbus';
import Button from './button';
import Encoder from './encoder';
import Output from './output';
import Sensor from './sensor';
import Switch2 from './switch2';
import Variable from './variable';
import { Observable } from '@legendapp/state';
import events from 'events';
import { ClingProducts } from './helpers/types';
declare const EventEmitter: typeof events;
export declare class Node extends EventEmitter {
    #private;
    mem: Map<number, number> | Observable<Map<number, number>>;
    constructor(master: ModbusMaster, mem?: Observable<Map<number, number>>);
    /**
     * json 설정 정보를 통해 노드 초기화
     */
    initialize(devices: ClingProducts): Promise<void>;
    button(name: string): Button;
    switch2(name: string): Switch2;
    sensor(name: string): Sensor;
    output(name: string): Output;
    encoder(name: string): Encoder;
    variable(name: string): Variable;
    start(polling: number): void;
}
export {};
