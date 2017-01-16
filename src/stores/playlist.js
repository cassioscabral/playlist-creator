const SpotifyApi = require('spotify-web-api-js')
const spotifyApi = new SpotifyApi()
import {differenceBy, chunk} from 'lodash'
export default {
  state: {
    playlist: [], // hold all the tracks
    // to be used on undo action
    previousPlaylist: null,
    // originalPlaylist is the one before save
    originalPlaylist: [],
    orderedBy: [],
    playlistName: 'My Playlist',
    playlistObject: {} // playlist object from Spotify
  },
  getters: {
    playlist: state => state.playlist,
    playlistName: state => state.playlistName,
    playlistObject: state => state.playlistObject,
    playlistIsEmpty: state => state.playlist.length === 0,
    totalDurationPlaylist: ({playlist}) => playlist.reduce((a, b) => a + b.duration_ms, 0),
    totalSongs: ({playlist}) => playlist.length,
    previousPlaylist: ({previousPlaylist}) => previousPlaylist
  },
  actions: {
    push ({commit}, {track}) {
      spotifyApi.getAudioFeaturesForTrack(track.id)
      .then(data => {
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
    resetAll ({commit}) {
      commit('RESET_ALL')
    },
    resetPlaylistStore ({commit}) {
      commit('RESET_ALL')
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
        window.alertify.warning('Please login again')
        return
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
    },
    reorder ({state, commit}, {playlist}) {
      // save previousPlaylist
      commit('UPDATE_PREVIOUS_PLAYLIST', {playlist: state.playlist})
      // reordered playlist
      commit('REPLACE_PLAYLIST', {playlistTracks: playlist})
    },
    undo ({commit, state}) {
      // reordered playlist
      commit('REPLACE_PLAYLIST', {playlistTracks: state.previousPlaylist})
      commit('UPDATE_PREVIOUS_PLAYLIST', {playlist: null})
    },
    /**
     * SpotifyApi only accepts requests with a maximum of 100 tracks per requests
     * Since the creator can reorder the playlist, the easy way to save this is to replace 100 tracks and add
     * the rest in 100 batches using  addTracksToPlaylist after replaceTracksInPlaylist
     * @param {any} {state, commit, rootState, dispatch}
     * @param {any} {maximumPerRequest = 100}
     */
    async savePlaylist ({state, commit, rootState, dispatch}, {maximumPerRequest = 100}) {
      const {currentUser} = rootState
      if (!rootState.accessToken) {
        dispatch('cleanAccess')
        window.alertify.warning('Please login again')
        return
      }

      if (!state.playlistObject.id) { // playlist was not created
        await dispatch('createPlaylist', {name: state.playlistName})
      }
      spotifyApi.setAccessToken(rootState.accessToken)
      const userId = currentUser.id
      const playlistId = state.playlistObject.id
      const playlistURIs = state.playlist.map(track => track.uri)
      const chunks = chunk(playlistURIs, maximumPerRequest)
      try {
        if (playlistURIs.length === 0) {
          await spotifyApi.replaceTracksInPlaylist(userId, playlistId, [])
        } else {
          chunks.forEach(async (chunk, i) => {
            if (i === 0) { // first
              await spotifyApi.replaceTracksInPlaylist(userId, playlistId, chunk)
            } else { // rest
              await spotifyApi.addTracksToPlaylist(userId, playlistId, chunk)
            }
          })
          window.alertify.success('Saved')
        }
      } catch (err) {
        console.error(err)
        dispatch('cleanAccess')
        window.alertify.warning('Please login again')
      }
    },
    async createPlaylist ({state, dispatch, rootState, commit}, {name, clean = false}) {
      if (!rootState.accessToken || !rootState.currentUser) {
        await dispatch('cleanAccess')
        window.alertify.warning('Please login again')
        return
      }
      // clean the playlist
      if (clean) {
        commit('CLEAN_PLAYLIST')
      }

      try {
        const playlist = await spotifyApi.createPlaylist(rootState.currentUser.id, {name})
        await dispatch('changePlaylistName', {name})
        await dispatch('setPlaylistObject', {playlist})
        await dispatch('pushPlaylist', {playlist})
        return playlist
      } catch (error) {
        console.error(error)
        await dispatch('cleanAccess')
        window.alertify.warning('Please login again')
      }

      // return spotifyApi.createPlaylist(rootState.currentUser.id, {name})
      // .then((playlist) => {
      //   dispatch('changePlaylistName', {name})
      //   dispatch('setPlaylistObject', {playlist})
      //   return playlist
      // })
      // .then((playlist) => {
      //   dispatch('pushPlaylist', {playlist})
      //   return playlist
      // })
      // .catch(e => {
      //   console.error(e)
      //   dispatch('cleanAccess')
      //   window.alertify.warning('Please login again')
      // })
    }
  },
  mutations: {
    PUSH (state, {track}) {
      state.playlist.push(track)
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
    },
    UPDATE_PREVIOUS_PLAYLIST (state, {playlist}) {
      state.previousPlaylist = playlist
    },
    RESET_ALL (state) {
      state.playlist = []
      state.previousPlaylist = null
      state.originalPlaylist = []
      state.orderedBy = []
      state.playlistName = 'My Playlist'
      state.playlistObject = {}
    },
    CLEAN_PLAYLIST (state) {
      state.playlist = []
    }
  }
}
