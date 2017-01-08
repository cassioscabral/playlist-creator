const SpotifyApi = require('spotify-web-api-js')

const spotifyApi = new SpotifyApi()
import {differenceBy} from 'lodash'

export default {
  state: {
    playlist: [],
    originalPlaylist: [],
    playlistName: 'My Playlist',
    playlistObject: {}
  },
  getters: {
    playlist: state => state.playlist,
    playlistName: state => state.playlistName,
    playlistIsEmpty: state => state.playlist.length === 0
  },
  actions: {
    push ({commit}, {track}) {
      spotifyApi.getAudioFeaturesForTrack(track.id)
      .then(data => {
        console.log(data)
        track.features = data
        commit('PUSH', {track})
      })
    },
    remove ({commit}, {track}) {
      commit('REMOVE', {track})
    },
    replace ({commit}, {playlistTracks}) {
      commit('REPLACE_PLAYLIST', {playlistTracks})
    },
    setPlaylistObject ({commit}, {playlist}) {
      commit('SET_PLAYLIST_OBJ', {playlist})
    },
    setOriginalPlaylist ({commit}, {playlistTracks}) {
      commit('REPLACE_ORIGINAL_PLAYLIST', {playlistTracks})
    },
    changePlaylistName ({commit}, {name}) {
      commit('CHANGE_PLAYLIST_NAME', {name})
    },
    loadPlaylist ({commit, rootState}, {playlist}) {
      commit('SET_PLAYLIST_OBJ', {playlist})
      spotifyApi.setAccessToken(rootState.accessToken)
      spotifyApi.getPlaylistTracks(rootState.currentUser.id, playlist.id)
      .then((data) => {
        const playlistTracks = data.items.map(i => i.track)
        return playlistTracks
      })
      .then(playlistTracks => {
        const trackIds = playlistTracks.map(t => t.id)
        spotifyApi.getAudioFeaturesForTracks(trackIds)
        .then(({audio_features: features}) => {
          return playlistTracks.map((t, index) => {
            t.features = features[index]
            return t
          })
        })
        .then(tracksWithFeatures => {
          commit('REPLACE_PLAYLIST', {playlistTracks: tracksWithFeatures})
          commit('REPLACE_ORIGINAL_PLAYLIST', {playlistTracks: tracksWithFeatures})
        })
      })
      .then(() => {
        commit('CHANGE_PLAYLIST_NAME', {name: playlist.name})
      })
      .catch(e => {
        console.error(e)
        commit('CLEAN_ACCESS')
      })
    },
    addTracksToPlaylist ({state, commit, rootState, dispatch}) {
      if (!rootState.accessToken) {
        dispatch('cleanAccess')
        window.alert('Please login again')
      }

      const newTracks = differenceBy(state.playlist, state.originalPlaylist, 'id').map(t => t.uri)

      if (newTracks.length > 0) {
        spotifyApi.setAccessToken(rootState.accessToken)
        spotifyApi.addTracksToPlaylist(rootState.currentUser.id, state.playlistObject.id, newTracks)
        .then((data) => {
          // only get a snapshot https://developer.spotify.com/web-api/add-tracks-to-playlist/
        })
        .catch(e => { console.error(e) })
      }
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
    },
    REPLACE_ORIGINAL_PLAYLIST (state, {playlistTracks}) {
      state.originalPlaylist = playlistTracks
    },
    SET_PLAYLIST_OBJ (state, {playlist}) {
      state.playlistObject = playlist
    }
  }
}
