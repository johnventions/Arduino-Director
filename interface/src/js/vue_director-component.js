Vue.component('director-component', {
    props: ['component'],
    template: `
        <div class="row director-component">
            <div class='col-2'>
                <input v-model="component.name">
                <div class='preview-container'>
                    <span class='preview preview-1'></span>
                    <span class='preview preview-2'
                        v-bind:style="{ transform: component.getAngle() }"></span>
                </div>
            </div>
            <div class='col-10'>
                <director-chart :component="component"> </director-chart>
            </div>
        </div>`
});