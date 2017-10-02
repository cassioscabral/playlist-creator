export default {
  namespaced: true,
  state: {
    selectedArtist: {}
  },
  getters: {
    selectedArtist: state => state.selectedArtist
  },
  actions: {
    selectArtist ({ commit }, { artist }) {
      commit('SELECT_ARTIST', { artist })
    }
  },
  mutations: {
    SELECT_ARTIST (state, { artist }) {
      state.selectedArtist = Object.assign({}, artist)
    }
  }
}
