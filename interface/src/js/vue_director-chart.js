Vue.component('director-chart', {
    props: ['component'],
    methods: {
        graphLabelY: function(n) {
            return 180 - ((n-1) *45);
        },
        graphLabelPosY: function(n) {
            var y = ((n-1) * 45) + 5;
            return Math.max(10, y);
        },
        graphLabelX: function(n) {
            return (n * this.$store.state.scale) + offset - 5;
        },
        graphLength: function() {
            return 10;
        },
        intervalPos() {
            return (this.$store.state.curTime * this.$store.state.scale) + offset;
        },
        xPos(x) {
            if (x < 0) {
                return 0;
            }
            return (x * this.$store.state.scale) + offset;
        },
        xTransform() {
            var t = (this.$store.state.xOffset * this.$store.state.scale);
            return `translate(${t}, 0)`;
        },
        yPos(y) {
            if (y < 0) {
                return 0;
            }
            return 180 - y;
        }
    },
    template: `<svg height="200" width="100%" v-on:click="component.click($event, component)">
    <line :x1="component.startX()"
            :x2="component.startX()"
            y1="0" y2="180" stroke="black" stroke-width="0.5" />
    <line :x1="component.startX()"
            x2="100%"
            y1="180" y2="180" stroke="black" stroke-width="0.5" />
    <line :x1="intervalPos()" 
            :x2="intervalPos()"
            :transform="xTransform()"
            y1="0" y2="180" stroke="red" stroke-width="0.5" />
    <circle v-for="(data, i) in component.data"
            :cx="xPos(data.x)"
            :cy="yPos(data.y)"
            :data-y="data.y"
            :transform="xTransform()"
            v-on:mousedown="component.startDrag($event, i)"
            v-on:mouseup="component.stopDrag($event, i)"
            r="5" stroke="black" stroke-width="1" fill="red"/>
            <text v-for="n in 5"
                x="0" :y="graphLabelPosY(n)">
                {{ graphLabelY(n) }}
            </text>
            <text v-for="n in graphLength()"
                :transform="xTransform()"
                :x="graphLabelX(n)" y="195">
                {{ n }}
            </text>
    </svg>`
});