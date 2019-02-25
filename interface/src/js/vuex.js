const store = new Vuex.Store({
    state: {
        scale: 50,
        xOffset: 0,
        curTime: 0,
        activeSequence: null,
        activeMachine: null,
    },
    mutations: {
        setTime (state, t) {
            state.curTime = t;
        },
        increaseTime(state, t) {
            state.curTime += t;
        },
        setScale (state, n) {
            state.scale = n;
        },
        changeScale(state, n) {
            state.scale += n;
        },
        setOffset(state, o) {
            state.xOffset = o;
        },
        changeOffset(state, o) {
            var n = state.xOffset + parseFloat(o);
            if (n <= 0) {
                state.xOffset = n;
            }
        },
        setMachine (state, m) {
            state.activeMachine = m;
        },
        setSequence (state, s) {
            state.activeSequence = s;
        },
        setComponents (state, c) {
            state.activeSequence.components = c;
        },
        addComponent (state, c) {
            state.activeSequence.components.push(c);
        }
    },
    getters: {

    }
  })