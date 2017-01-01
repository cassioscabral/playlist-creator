export default {
  state: {
    playlist: [],
    playlistName: 'My Playlist'
  },
  getters: {
    playlist: state => state.playlist,
    playlistName: state => state.playlistName,
    playlistIsEmpty: state => state.playlist.length === 0
  },
  actions: {
    push ({commit}, {track}) {
      commit('PUSH', {track})
    },
    remove ({commit}, {track}) {
      commit('REMOVE', {track})
    },
    changePlaylistName ({commit}, {name}) {
      commit('CHANGE_PLAYLIST_NAME', {name})
    }
  },
  mutations: {
    PUSH (state, {track}) {
      state.playlist = [...state.playlist, track]
    },
    REMOVE (state, {track}) {
      state.playlist = state.playlist.filter(t => t.id !== track.id)
    },
    CHANGE_PLAYLIST_NAME (state, {name}) {
      state.playlistName = `${name}`
    }
  }
}
