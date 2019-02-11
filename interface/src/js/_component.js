class Component {
    constructor(_name) {
        this.name = _name;
        this.data = [
            {x: 1, y: 45},
            {x: 2, y: 90},
            {x: 3, y: 60},
        ];
        this.order = 0;
        this.currentPosition = 0;
        this.motorID = -1;
    }
    startDrag(e, i) {
        if (e.shiftKey) {
            this.data.splice(i, 1);
        } else {
            selectedElement = e.target;
        }
    }
    updatePoint(x, y, i) {
       var n = {x: x, y: y};
        director.$set(this.data, i, n);
    }
    stopDrag(e, i) {
        var x = ($(selectedElement).attr("cx") - offset) / store.state.scale;
        var y = 180 - $(selectedElement).attr("cy");
        this.updatePoint(x, y, i);
        selectedElement = null;
    }
    click(e, c) {
        if (selectedElement || e.shiftKey) {
            return;
        } if (!$(e.target).is("svg")) {
            return;
        }
        var rect = e.target.getBoundingClientRect();
        var x = (e.clientX - rect.left) - offset; 
        var y = e.clientY - rect.top;
        this.data.push({x: (x/store.state.scale) - store.state.xOffset, y: 180 - y});
    }
    startX() {
        return offset;
    }
    getAngle() {
        return 'rotate(-' + this.currentPosition + 'deg)';
    }
}