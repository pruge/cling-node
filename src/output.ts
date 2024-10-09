import {ModbusMaster} from '@cling/capacitor-modbus'
import Device from './device'
import {Node} from '.'

class Output extends Device {
  constructor(client: ModbusMaster, node: Node, name: string, regAddress: number) {
    super(client, node, name, regAddress)
  }

  isOn(): boolean {
    return this.Coil() === 1
  }

  isOff(): boolean {
    return this.Coil() === 0
  }

  async on() {
    try {
      await this.Coil(1)
    } catch (error) {
      console.error(error)
    }
  }

  async off() {
    try {
      await this.Coil(0)
    } catch (error) {
      console.error(error)
    }
  }
}

export default Output
