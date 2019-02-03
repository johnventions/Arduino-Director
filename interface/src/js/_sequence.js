class Sequence {
	constructor(_name) {
		this.name = _name;
		this.audio = null;
		this.duration = 10;
        this.components = [];
    }
    graphLength() {
        return Math.ceil(this.duration);
    }
    graphLabelPosX(n) {
        return (n * scale) + offset;
    }
    graphLabelPosY(n) {
        return 180 - (n*45) + 10;
    }
    graphLabelY(n) {
        return (n*45);
    }
}