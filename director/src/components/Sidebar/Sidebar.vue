<template>
    <div>
        <h2>Ports</h2>
        <ul>
            <li v-for="port of ports" v-bind:key="port.comName">
                {{ port.path }}
                <button 
                    v-if="activePort == null"
                    v-on:click="selectPort(port.path)">
                        Connect
                    </button>
                <button 
                    v-if="activePort == port.path"
                    v-on:click="disconnect()">
                        Disconnect
                    </button>
            </li>
        </ul>
    </div>
</template>
<style src="./Sidebar.styl" lang="styl" scoped></style>
<script>
export default {
  name: 'Sidebar',
  computed: {
      activePort() {
          return this.$store.state.activePort;
      },
      ports() {
          return this.$store.state.ports;
      }
  },
  mounted: function() {
      this.getPorts();
  },
  methods: {
      getPorts: function() {
          this.$http.get("/api/ports")
            .then(response => {
                console.log(response.data);
                this.$store.commit("SET_PORTS", response.data);
            });
      },
      selectPort: function(port) {
          this.$http.post("/api/ports/" + port)
            .then(  () => {
                this.$store.commit("SET_ACTIVE", port);
            });
      },
      disconnect: function() {
            this.$http.delete("/api/ports")
                .then(  () => {
                    this.$store.commit("SET_ACTIVE", null);
                });
      }
  }
}
</script>