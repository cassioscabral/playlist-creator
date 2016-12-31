export default {
  state: {
    playlist: [],
    playlistName: 'My Playlist'
  },
  getters: {
    playlist: state => state.playlist,
    playlistName: state => state.playlistName
  },
  actions: {
    push ({commit}, {track}) {
      commit('PUSH', {track})
    },
    changePlaylistName ({commit}, {name}) {
      commit('CHANGE_PLAYLIST_NAME', {name})
    }
  },
  mutations: {
    PUSH (state, {track}) {
      state.playlist = [...state.playlist, track]
    },
    CHANGE_PLAYLIST_NAME (state, {name}) {
      state.playlistName = `${name}`
    }
  }
}
