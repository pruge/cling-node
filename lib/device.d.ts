import { ModbusMaster } from '@cling/capacitor-modbus';
import { Node } from './';
declare class Device {
    #private;
    constructor(client: ModbusMaster, node: Node, name: string, regAddress: number);
    Coil(): number;
    Coil(value: number): Promise<unknown>;
    Hreg(): number;
    Hreg(value: number): Promise<unknown>;
    delay(ms: number): Promise<unknown>;
}
export default Device;
