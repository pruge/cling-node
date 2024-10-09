<p align="center">
 <img width="100px" src="https://raw.githubusercontent.com/hebertcisco/ts-npm-package-boilerplate/main/.github/images/favicon512x512-npm.png" align="center" alt=":package: ts-npm-package-boilerplate" />
 <h2 align="center">@cling/node</h2>
 <p align="center">arduino device component access</p>



# Getting started

## Installation

> npm i https://github.com/pruge/cling-node

### Use library:

#### init
```ts
import { Node } from '@cling/node';
import {ModbusMaster, SerialPort} from '@cling/capacitor-modbus'

// modbus
const serial = new SerialPort({baudRate: 57600, rts: true, dtr: true})
const master = new ModbusMaster(serial, {debug: false})
await serial.open()
master.setID(1)

// node
const node = new Node(master)
// const node = new Node(master, mem$) // use legendstate
await node.initialize(variables)
node.start(500)
```

#### legnedstate
```ts
import {observable} from '@legendapp/state'
export const mem$ = observable(new Map<number, number>())
```

> 값의 변경을 손쉽게 관리.
>
> 자동으로 rerendering 됨.
```tsx
import useModbus from '@/hooks/use-modbus'
import {cn} from '@/lib/utils'
import {observer} from '@legendapp/state/react'

const LED = observer(({name}: {name: string}) => {
  const {node} = useModbus()
  const led = node?.output(name)

  return (
    <div
      className={cn(
        'w-32 h-32 rounded-full text-black flex items-center justify-center',
        led?.isOn() ? 'bg-green-300' : 'bg-white',
      )}
    >
      {name}
    </div>
  )
})

export default LED
```




#### devices
```ts
const devices = [
  {
    "name":"run led",
    "type":"output",
    "board":"PORT",
    "memory":"Coil",
    "address":1,
    "portId":[
      22
    ]
  },
  {
    "name":"btn A",
    "type":"button",
    "board":"CFDI-16B",
    "memory":"Coil",
    "address":19,
    "portId":[
      0
    ]
   },
]
```

#### use
```ts
const led = node.output('active led')
led.on()
led.off()
led.isOn()
led.isOff()

const btn = node.button('btn A')
btn.click()
```


## 📝 License

Copyright © 2022 [Prugehada](https://github.com/pruge).<br />
This project is [MIT](LICENSE) licensed.
