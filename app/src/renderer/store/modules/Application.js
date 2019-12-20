const state = {
  currentFile: null,
  fileData: null
}
const mutations = {
  OPEN_FILE (state, data) {
    console.log(data)
    state.currentFile = data.file
    state.fileData = data.contents
  }
}
const actions = {
  OPEN_FILE (context, data) {
    console.log(data)
    context.commit('OPEN_FILE', data)
  }
}
export default {
  state,
  mutations,
  actions
}
