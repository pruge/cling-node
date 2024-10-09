import { ModbusMaster } from '@cling/capacitor-modbus';
import Device from './device';
import { Node } from '.';
declare class Button extends Device {
    constructor(client: ModbusMaster, node: Node, name: string, regAddress: number);
    click(): Promise<void>;
}
export default Button;
