Vue.component('director-machines', {
    props: ['machines'],
    template: `
    <div id='machine-list'>
        <h5>Machines</h5>
        <director-list-item 
            v-for="machine in machines"
            :item="machine"
            :key="machine._id"
            v-on:select-item="$emit('select-machine', machine)"/>
            <span class='btn btn-primary' 
                v-on:click="$emit('add-machine')">
                    Add Machine
                </span>
    </div>`
});