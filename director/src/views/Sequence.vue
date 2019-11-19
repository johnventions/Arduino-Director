<template>
  <div class="sequences" v-if="sequence != null">
		<div>
			<h2>{{ sequence.name }}</h2>
		<button v-on:click="newSequence()">
			New Sequence
		</button>
		</div>
		<div>
			<div v-for="component of sequence.components" v-bind:key="component.name">
				{{ component.name }}
			</div>
		</div>
  </div>
</template>

<script>
// @ is an alias to /src
//import HelloWorld from '@/components/HelloWorld.vue'

export default {
    name: 'sequence',
    data: function() {
        return {
        };
    },
	computed: {
        machineID() {
            return this.$route.params.id;
        },
        sequenceID() {
            return this.$route.params.seq;
        },
        sequence() {
            if (this.$store.state.activeMachine == null) return {};
            console.log(this.$store.state.activeMachine);
            return this.$store.state.activeMachine.sequences.find( x=> {
                return x._id == this.sequenceID;
            });
        }
	},
	components: {
	},
	mounted: function() {
	},
	methods: {
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
