const Readline = require('@serialport/parser-readline')
const SerialPort = require('serialport')

/* ####################################
SERIAL PORT SETUP
#################################### */

class SerialService {
  init () {
    this.window = null
    this.activePort = null
    this.parser = new Readline()

    this.parser.on('data', line => {
      console.log(`> ${line}`)
      if (this.window == null) return
      if (line.indexOf(':') > -1) {
        var components = line.split(':')
        this.window.webContents.send(components[0], components[1])
      } else {
        this.window.webContents.send('SerialMessage', line)
      }
    })
  }

  setWindow (window) {
    this.window = window
  }

  getPorts (returnFn) {
    SerialPort.list().then(
      ports => {
          ports.forEach(val => {
              val.connected = false
                if (this.activePort && this.activePort.path === val.path) {
                    val.connected = true
                }
          })
          returnFn(ports)
      },
      err => {
          console.log(err)
      }
    )
  }

  connect (port, success, close) {
    console.log('Connecting to', port)
    this.activePort = new SerialPort(port.path, {baudRate: 500000})
    this.activePort.on('open', _ => {
      this.activePort.pipe(this.parser)
      success(port.path)
    })
    this.activePort.on('close', err => {
      console.log(err)
      this.activePort = null
      close(err)
    })
  }

  write (message) {
    if (this.activePort != null) {
      this.activePort.write(message)
    }
  }
}

export default SerialService
