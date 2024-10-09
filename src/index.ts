import {ModbusMaster} from '@cling/capacitor-modbus'
import Button from './button'
import Device from './device'
import Encoder from './encoder'
import Output from './output'
import Sensor from './sensor'
import Switch2 from './switch2'
import Variable from './variable'
import {Observable} from '@legendapp/state'
import events from 'events'
import {ClingProducts} from './helpers/types'

const EventEmitter = events.EventEmitter || events

export class Node extends EventEmitter {
  #master: ModbusMaster
  #coil_start = 3000 // some max value
  #coil_end = 0
  #coil_count = 0
  #hreg_start = 3000
  #hreg_end = 0
  #hreg_count = 0
  #devices = new Map<string, Device>()
  mem: Map<number, number> | Observable<Map<number, number>>

  constructor(master: ModbusMaster, mem?: Observable<Map<number, number>>) {
    super()
    this.#master = master
    if (mem) {
      this.mem = mem
    } else {
      this.mem = new Map<number, number>()
    }

    master.on('COIL', (data) => {
      let i, j
      for (i = this.#coil_start, j = 0; i <= this.#coil_end; i++, j++) {
        this.mem.set(i, data[j])
      }
      this.emit('COIL_CHANGED')
    })
    let i, j
    master.on('HREG', (data) => {
      for (i = this.#hreg_start, j = 0; i <= this.#hreg_end; i++, j++) {
        this.mem.set(i, data[j])
      }
      this.emit('HREG_CHANGED')
    })

    master.on('error', (error) => {
      this.emit('error', error)
    })
  }

  /**
   * json 설정 정보를 통해 노드 초기화
   */
  async initialize(devices: ClingProducts) {
    let device
    for (const item of devices) {
      switch (item.type) {
        // ==== coil ====
        case 'button':
          device = Button
          break
        case 'switch2':
          device = Switch2
          break
        case 'sensor':
          device = Sensor
          break
        case 'output':
          device = Output
          break

        // ==== hreg ====
        case 'encoder':
          device = Encoder
          break

        case 'variable':
          device = Variable
          break

        default:
          break
      }

      if (device == undefined) {
        continue
      }

      const _device = new device(this.#master, this, item.name, item.address)
      this.#devices.set(item.name, _device)

      if (item.memory === 'Coil') {
        this.#coil_start = this.#coil_start > item.address ? item.address : this.#coil_start
        this.#coil_end = this.#coil_end > item.address ? this.#coil_end : item.address
        this.#coil_count = this.#coil_end - this.#coil_start + 1
      } else {
        this.#hreg_start = this.#hreg_start > item.address ? item.address : this.#hreg_start
        this.#hreg_end = this.#hreg_end > item.address ? this.#hreg_end : item.address
        this.#hreg_count = this.#hreg_end - this.#hreg_start + 1
      }
    }
  }

  // ==== coil ====
  button(name: string): Button {
    const device = this.#devices.get(name)
    if (device == undefined) {
      throw new Error(`${name} is not found`)
    }
    return device as Button
  }

  // ==== coil ====
  switch2(name: string): Switch2 {
    const device = this.#devices.get(name)
    if (device == undefined) {
      throw new Error(`${name} is not found`)
    }
    return device as Switch2
  }

  // ==== coil ====
  sensor(name: string): Sensor {
    const device = this.#devices.get(name)
    if (device == undefined) {
      throw new Error(`${name} is not found`)
    }
    return device as Sensor
  }

  // ==== coil ====
  output(name: string): Output {
    const device = this.#devices.get(name)
    if (device == undefined) {
      throw new Error(`${name} is not found`)
    }
    return device as Output
  }

  // ==== register ====
  encoder(name: string): Encoder {
    const device = this.#devices.get(name)
    if (device == undefined) {
      throw new Error(`${name} is not found`)
    }
    return device as Encoder
  }

  // ==== register ====
  variable(name: string): Variable {
    const device = this.#devices.get(name)
    if (device == undefined) {
      throw new Error(`${name} is not found`)
    }
    return device as Variable
  }

  // ==== polling read ====
  start(polling: number) {
    this.#master.pollCoils(this.#coil_start, this.#coil_count, polling)
    this.#master.pollRegisters(this.#hreg_start, this.#hreg_count, 'INT', polling)
  }
}
