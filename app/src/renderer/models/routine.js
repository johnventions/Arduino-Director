const uuidv1 = require('uuid/v1')

class Routine {
    constructor () {
        this.name = 'New Sequence'
        this._id = uuidv1()
        this.components = []
    }
}

export default Routine
