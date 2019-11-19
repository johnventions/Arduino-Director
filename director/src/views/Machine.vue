<template>
  <div class="sequences">
		<div>
			Sequences
		<button v-on:click="newSequence()">
			New Sequence
		</button>
		</div>
		<div v-if="activeMachine != null">
			<div v-for="sequence of activeMachine.sequences" v-bind:key="sequence.name">
				{{ sequence.name }}
				<router-link v-bind:to="'/machine/' + machineID + '/' + sequence._id">
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
    name: 'machine',
    data: function() {
		return {};
    },
	computed: {
        machineID() {
            return this.$route.params.id;
		},
		activeMachine(){
            return this.$store.state.activeMachine;
		}
	},
	components: {
	},
	mounted: function() {
		this.getSequences();
	},
	methods: {
		getSequences: function() {
			this.$http.get("/api/machines/" + this.machineID)
				.then(response => {
					console.log(response.data);
					this.$store.commit("SET_MACHINE", response.data);
					
			});
		},
		newSequence: function() {
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
