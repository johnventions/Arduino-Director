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
    posX(i){
        if (i < 0) {
            return 0;
        }
        return (this.data[i].x * 50 + offset);
    }
    posY(i) {
        if (i < 0) {
            return 180;
        }
        return 180 - this.data[i].y;
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
        var x = ($(selectedElement).attr("cx") - offset) / scale;
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
        this.data.push({x: x/scale, y: 180 - y});
    }
    startX() {
        return offset;
    }
    getAngle() {
        return 'rotate(-' + this.currentPosition + 'deg)';
    }
}