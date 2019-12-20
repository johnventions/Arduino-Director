<template>
  <div>
    <h4>Ports</h4>
    <button v-on:click="getPorts"
      class='btn btn-primary'>
      Refresh</button>
    <ul>
      <li v-for="port of ports" v-bind:key="port.path">
        {{ port.path }}
        <button v-if="port.path != activePort"
          v-on:click="connect(port)"
          class='btn btn-primary'>
          Connect
        </button>
      </li>
    </ul>
    <h4>Options</h4>
    <h5 v-for="actor of actors" v-bind:key="actor.name + actor.id">{{ actor.id }} {{ actor.name}}</h5>
    <h5 v-for="button of buttons" v-bind:key="button.name + button.id">{{ button.id }} {{ button.name}}</h5>
    
    <button v-on:click="getOptions"
      class='btn btn-primary'>
      Refresh
    </button>
  </div>
</template>

<script>
  const ipc = require('electron').ipcRenderer

  export default {
    name: 'Sidebar',
    data: function () {
      return {
        activePort: null,
        actors: [],
        buttons: [],
        ports: []
      }
    },
    mounted: function () {
      ipc.on('PORTS', (event, ports) => {
        this.ports = ports
        const active = ports.find(x => x.connected)
        if (active) {
          this.activePort = active.path
        }
        console.log(ports)
      })
      ipc.on('CONNECTED', (event, path) => {
        this.activePort = path
        setTimeout(this.getOptions, 3000)
      })
      ipc.on('DISCONNECTED', (event, err) => {
        this.activePort = null
        this.actors = []
        this.buttons = []
      })
      ipc.on('OPTIONS', (event, pkg) => {
        console.log(pkg)
        this.actors = []
        this.buttons = []
        const components = pkg.split('|')
        components.forEach((val) => {
          if (val.indexOf(',') > -1) {
            var o = val.split(',')
            var _o = {
                id: o[0],
                name: o[1],
                type: o[2]
            }
            if (o[2] === 'S') { // Servo
                this.actors.push(_o)
            } else if (o[2] === 'B') { // Button
                this.buttons.push(_o)
            }
          }
          console.log(this.actors, this.buttons)
        })
      })
      this.getPorts()
    },
    methods: {
      getPorts: function () {
        ipc.send('GET_PORTS', {})
      },
      getOptions: function () {
        ipc.send('SERIAL_WRITE', 'OPTIONS')
      },
      connect: function (port) {
        ipc.send('CONNECT', port)
      }
    }
  }
</script>

<style>
  #sidebar {
      height: 100vh;
      background: black;
      color: white;
  }
  ul {
    list-style: none;
  }
</style>
