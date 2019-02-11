Vue.component('director-list-item', {
    props: ['item'],
    template: `
    <div class='row'>
        <div class='col-10'>
                {{ item.name }}
        </div>
        <div class='col-2'>
            <span class='btn btn-primary'
                v-on:click="$emit('select-item')">
                Edit
            </span>
        </div>
    </div>`
});