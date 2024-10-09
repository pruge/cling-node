import {ModbusMaster} from '@cling/capacitor-modbus'
import {Node} from './'

class Device {
  #name: string
  #node: Node
  #regAddress: number
  #client: ModbusMaster
  constructor(client: ModbusMaster, node: Node, name: string, regAddress: number) {
    this.#name = name
    this.#regAddress = regAddress
    this.#client = client
    this.#node = node
  }
  Coil(): number
  Coil(value: number): Promise<unknown>
  Coil(value?: number): number | Promise<unknown> {
    if (value === undefined) {
      if (typeof this.#node.mem.get(this.#regAddress) === 'number') {
        return this.#node.mem.get(this.#regAddress) as number
      } else {
        // @ts-ignore legnedstate proxy
        return this.#node.mem.get(this.#regAddress).get() as number
      }
    } else {
      try {
        // this.#node.mem.set(this.#regAddress, value)
        return this.#client.writeCoil(this.#regAddress, value ? true : false)
      } catch (error) {
        return Promise.reject(error)
      }
    }
  }

  Hreg(): number
  Hreg(value: number): Promise<unknown>
  Hreg(value?: number): number | Promise<unknown> {
    if (value === undefined) {
      if (typeof this.#node.mem.get(this.#regAddress) === 'number') {
        return this.#node.mem.get(this.#regAddress) as number
      } else {
        // @ts-ignore legnedstate proxy
        return this.#node.mem.get(this.#regAddress).get() as number
      }
    } else {
      try {
        // this.#node.mem.set(this.#regAddress, value)
        return this.#client.writeRegister(this.#regAddress, value)
      } catch (error) {
        return Promise.reject(error)
      }
    }
  }

  async delay(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms))
  }
}

export default Device
