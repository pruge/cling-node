import {ModbusMaster} from '@cling/capacitor-modbus'
import Device from './device'
import {Node} from '.'
class Variable extends Device {
  constructor(client: ModbusMaster, node: Node, name: string, regAddress: number) {
    super(client, node, name, regAddress)
  }

  value(): number
  value(value: number): Promise<unknown>
  value(value?: number): number | Promise<unknown> {
    if (value === undefined) {
      return this.Hreg() as number
    } else {
      return this.Hreg(value)
    }
  }
}

export default Variable
