import { ModbusMaster } from '@cling/capacitor-modbus';
import Device from './device';
import { Node } from '.';
declare class Output extends Device {
    constructor(client: ModbusMaster, node: Node, name: string, regAddress: number);
    isOn(): boolean;
    isOff(): boolean;
    on(): Promise<void>;
    off(): Promise<void>;
}
export default Output;
