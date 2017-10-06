export default {
  namespaced: true,
  state: {
    playerPlaylist: [],
    currentTrack: { // default fallback
      title: 'Preparation',
      author: 'Hans Zimmer/Richard Harvey',
      url: 'http://devtest.qiniudn.com/Preparation.mp3',
      pic: 'http://devtest.qiniudn.com/Preparation.jpg',
      lrc: '[00:00.00]lrc here\n[00:01.00]aplayer'
    },
    isPlaying: false
  },
  getters: {
    playerPlaylist: state => state.playerPlaylist,
    currentTrack: state => state.currentTrack,
    isPlaying: state => state.isPlaying
  },
  actions: {
    play ({commit}, {track}) {
      commit('PLAY', {track})
    },
    playTrack ({commit}, {track}) {
      commit('PLAY_TRACK', {track})
    },
    pause ({commit}, {track}) {
      commit('PAUSE', {track})
    }
  },
  mutations: {
    PLAY_TRACK (state, {track}) {
      state.currentTrack = {...track}
      // state.isPlaying = true
    },
    PLAY (state, {track}) {
      state.isPlaying = true
    },
    PAUSE (state, {track}) {
      state.isPlaying = false
    }
  }
}
