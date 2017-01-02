const SpotifyApi = require('spotify-web-api-js')

const spotifyApi = new SpotifyApi()

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
    replace ({commit}, {playlistTracks}) {
      commit('REPLACE_PLAYLIST', {playlistTracks})
    },
    changePlaylistName ({commit}, {name}) {
      commit('CHANGE_PLAYLIST_NAME', {name})
    },
    loadPlaylist ({commit, rootState}, {playlist}) {
      spotifyApi.setAccessToken(rootState.accessToken)
      spotifyApi.getPlaylistTracks(rootState.currentUser.id, playlist.id)
      .then((data) => {
        const playlistTracks = data.items.map(i => i.track)
        commit('REPLACE_PLAYLIST', {playlistTracks})
        return playlistTracks
      })
      .then(() => { commit('CHANGE_PLAYLIST_NAME', {name: playlist.name}) })
      .catch(e => {
        console.warn(e)
        commit('CLEAN_ACCESS')
      })
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
    },
    REPLACE_PLAYLIST (state, {playlistTracks}) {
      state.playlist = playlistTracks
    }
  }
}
