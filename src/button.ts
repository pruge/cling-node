import {ModbusMaster} from '@cling/capacitor-modbus'
import Device from './device'
import {Node} from '.'

class Button extends Device {
  constructor(client: ModbusMaster, node: Node, name: string, regAddress: number) {
    super(client, node, name, regAddress)
  }

  async click() {
    console.log('Button Click!')

    try {
      await this.Coil(1)
      await this.delay(200)
      await this.Coil(0)
    } catch (error) {
      console.error(error)
    }
  }
}

export default Button
