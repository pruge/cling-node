import { ModbusMaster } from '@cling/capacitor-modbus';
import Device from './device';
import { Node } from '.';
declare class Variable extends Device {
    constructor(client: ModbusMaster, node: Node, name: string, regAddress: number);
    value(): number;
    value(value: number): Promise<unknown>;
}
export default Variable;
