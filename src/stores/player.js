export default {
  state: {
    playlist: [],
    currentTrack: null,
    isPlaying: false
  },
  getters: {
    playlist: state => state.playlist,
    currentTrack: state => state.currentTrack,
    isPlaying: state => state.isPlaying
  },
  actions: {
    play ({commit}, {track}) {
      commit('PLAY_TRACK', {track})
    },
    pause ({commit}, {track}) {
      commit('PAUSE', {track})
    }
  },
  mutations: {
    PLAY_TRACK (state, {track}) {
      state.currentTrack = Object.assign({}, track)
      state.isPlaying = true
    },
    PAUSE (state, {track}) {
      state.isPlaying = false
    }
  }
}
