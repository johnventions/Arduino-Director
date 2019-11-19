import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
	state: {
		ports: [],
		activePort: null,
		activeMachine: null,
		machines: []
	},
	mutations: {
		SET_PORTS(state, ports) {
			state.ports = ports;
		},
		SET_ACTIVE(state, portName) {
			state.activePort = portName;
		},
		SET_MACHINE(state, machine) {
			state.activeMachine = machine;
		}
	},
	actions: {
	},
	modules: {
	}
})
