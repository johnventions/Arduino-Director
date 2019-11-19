<template>
  <div class="machines">
		<div>
			Machines
		<button v-on:click="newMachine()">
			New Machine
		</button>
		</div>
		<div>
			<div v-for="machine of machines" v-bind:key="machine.name">
				{{ machine.name }}
				<router-link v-bind:to="'/machine/' + machine._id">
					<button>Edit</button>
				</router-link>
			</div>
		</div>
  </div>
</template>

<script>
// @ is an alias to /src
//import HelloWorld from '@/components/HelloWorld.vue'

export default {
	name: 'home',
	data: function() {
        return {
			machines: []
		}
	},
	components: {
	},
	mounted: function() {
		this.getMachines();
	},
	methods: {
		getMachines: function() {
			this.$http.get("/api/machines")
				.then(response => {
					console.log(response.data);
					this.machines = response.data;
			});
		},
		newMachine: function() {
			var machinename = prompt("Machine Name", "New Machine");
			var pkg = {
				name: machinename
			};
			this.$http.post("/api/machines", pkg)
				.then( response => {
					console.log(response.data);
				});
		}
	}
}
</script>
