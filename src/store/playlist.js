import spotifyApi from '../loaders/spotifyApi'
import { differenceBy, chunk, isEmpty, find } from 'lodash'
import { changePlaylistName as changePName } from '../services/spotify-service'

export default {
  namespaced: true,
  state: {
    playlist: [], // hold all the tracks
    // to be used on undo action
    previousPlaylist: null,
    // originalPlaylist is the one before save, in case want to go back
    originalPlaylist: [],
    orderedBy: [],
    playlistName: 'My Playlist',
    playlistSpotifyObject: {} // playlist object from Spotify
  },
  getters: {
    playlist: state => state.playlist,
    playlistName: state => state.playlistName,
    playlistSpotifyObject: state => state.playlistSpotifyObject,
    playlistIsEmpty: state => state.playlist.length === 0,
    totalDurationPlaylist: ({ playlist }) =>
      playlist.reduce((a, b) => a + b.duration_ms, 0),
    totalSongs: ({ playlist }) => playlist.length,
    previousPlaylist: ({ previousPlaylist }) => previousPlaylist
  },
  actions: {
    async push(
      { dispatch, commit, state },
      { track, getAudioFeatures = false, autoSave = true }
    ) {
      const newTrack = isEmpty(find(state.playlist, { id: track.id }))
      if (newTrack) {
        // avoid tracks added to be added again
        if (getAudioFeatures) {
          spotifyApi.getAudioFeaturesForTrack(track.id).then(async data => {
            track.features = data
            commit('PUSH', { track })
            if (autoSave) {
              await dispatch('savePlaylist')
            }
          })
        } else {
          commit('PUSH', { track })
          if (autoSave) {
            await dispatch('savePlaylist')
          }
        }
      }
    },
    async remove({ dispatch, commit }, { track, autoSave = true }) {
      commit('REMOVE', { track })
      if (autoSave) {
        await dispatch('savePlaylist')
      }
    },
    replace({ commit }, { playlistTracks }) {
      commit('REPLACE_PLAYLIST', { playlistTracks })
    },
    setPlaylistObject({ commit }, { playlist }) {
      commit('SET_PLAYLIST_OBJ', { playlist })
    },
    setOriginalPlaylist({ commit }, { playlistTracks }) {
      commit('REPLACE_ORIGINAL_PLAYLIST', { playlistTracks })
    },
    async changePlaylistName({ commit, state, rootState }, { name }) {
      // debugger
      try {
        const { currentUser } = rootState
        spotifyApi.setAccessToken(rootState.accessToken)
        const userId = currentUser.id
        const playlistId = state.playlistSpotifyObject.id
        const result = await changePName(userId, playlistId, name)
        console.log('result', result)
        // await dispatch('setPlaylistObject', {playlist})
        commit('CHANGE_PLAYLIST_NAME', { name })
      } catch (e) {
        console.error('error changing the name', e)
      }
    },
    resetAll({ commit }) {
      commit('RESET_ALL')
    },
    resetPlaylistStore({ commit }) {
      commit('RESET_ALL')
    },
    async loadPlaylist({ commit, rootState }, { playlist }) {
      try {
        commit('SET_PLAYLIST_OBJ', { playlist })
        spotifyApi.setAccessToken(rootState.accessToken)

        const res = await spotifyApi.getPlaylistTracks(playlist.id)
        const { items, next } = res
        let playlistTracks = items.map(i => i.track)
        let currentNext = next
        // add the rest of the tracks
        while (currentNext) {
          const { items: moreTracks, next } = await spotifyApi.getGeneric(
            currentNext
          )
          playlistTracks = playlistTracks.concat(moreTracks.map(i => i.track))
          currentNext = next
        }

        // Audio features
        // const trackIds = playlistTracks.map(t => t.id)
        // const chunkSize = 50
        // const chunks = chunk(trackIds, chunkSize)
        // // TODO needs to change the SpotifyApi(getAudioFeaturesForTracks) to send the request via body instead of params
        // const chunkEntries = chunks.entries()

        // for (const [i, chunk] of chunkEntries) {
        //   const offset = i * chunkSize
        //   const {audio_features: features} = await spotifyApi.getAudioFeaturesForTracks(chunk)
        //   let playlistPiece = playlistTracks.slice(offset, offset + chunkSize)
        //   playlistPiece.forEach((t, i) => {
        //     t.features = features[i]
        //   })
        // }
        // playlistTracks it has features now, supposedly
        commit('REPLACE_PLAYLIST', { playlistTracks })
        commit('REPLACE_ORIGINAL_PLAYLIST', { playlistTracks })
        commit('CHANGE_PLAYLIST_NAME', { name: playlist.name })
      } catch (e) {
        console.error(e)
      }
    },
    addTracksToPlaylist({ state, commit, rootState, dispatch }) {
      if (!rootState.accessToken) {
        dispatch('cleanAccess')
        return
      }

      const newTracks = differenceBy(
        state.playlist,
        state.originalPlaylist,
        'id'
      ).map(t => t.uri)

      if (newTracks.length > 0) {
        spotifyApi.setAccessToken(rootState.accessToken)
        spotifyApi
          .addTracksToPlaylist(
            rootState.currentUser.id,
            state.playlistSpotifyObject.id,
            newTracks
          )
          .then(data => {
            // only get a snapshot https://developer.spotify.com/web-api/add-tracks-to-playlist/
          })
          .catch(e => {
            console.error(e)
          })
      }
    },
    reorder({ state, commit }, { playlist }) {
      // save previousPlaylist
      commit('UPDATE_PREVIOUS_PLAYLIST', { playlist: state.playlist })
      // reordered playlist
      commit('REPLACE_PLAYLIST', { playlistTracks: playlist })
    },
    undo({ commit, state }) {
      commit('REPLACE_PLAYLIST', { playlistTracks: state.previousPlaylist })
      commit('UPDATE_PREVIOUS_PLAYLIST', { playlist: null })
    },
    /**
     * SpotifyApi only accepts requests with a maximum of 100 tracks per requests
     * Since the creator can reorder the playlist, the easy way to save this is to replace 100 tracks and add
     * the rest in 100 batches using  addTracksToPlaylist after replaceTracksInPlaylist
     * @param {any} {state, commit, rootState, dispatch}
     * @param {any} {maximumPerRequest = 100}
     */
    async savePlaylist(
      { state, commit, rootState, dispatch },
      { maximumPerRequest = 100 } = {}
    ) {
      const { currentUser } = rootState
      if (!rootState.accessToken) {
        dispatch('cleanAccess')
        return
      }

      if (!state.playlistSpotifyObject.id) {
        // playlist was not created
        await dispatch('createPlaylist', { name: state.playlistName })
      }
      spotifyApi.setAccessToken(rootState.accessToken)
      const userId = currentUser.id
      const playlistId = state.playlistSpotifyObject.id
      const playlistURIs = state.playlist.map(track => track.uri)
      const chunks = chunk(playlistURIs, maximumPerRequest)
      try {
        if (playlistURIs.length === 0) {
          await spotifyApi.replaceTracksInPlaylist(userId, playlistId, [])
        } else {
          chunks.forEach(async (chunk, i) => {
            if (i === 0) {
              // first
              await spotifyApi.replaceTracksInPlaylist(
                userId,
                playlistId,
                chunk
              )
            } else {
              // rest
              await spotifyApi.addTracksToPlaylist(userId, playlistId, chunk)
            }
          })
        }
      } catch (err) {
        console.error(err)
        dispatch('cleanAccess')
      }
    },
    async createPlaylist(
      { state, dispatch, rootState, commit },
      { name, clean = false }
    ) {
      if (!rootState.accessToken || !rootState.currentUser) {
        await dispatch('cleanAccess')
        return
      }
      // clean the playlist
      // if (clean) {
      //   commit('CLEAN_PLAYLIST')
      // }

      try {
        const playlist = await spotifyApi.createPlaylist(
          rootState.currentUser.id,
          { name }
        )
        await dispatch('changePlaylistName', { name })
        await dispatch('setPlaylistObject', { playlist })
        await dispatch('pushPlaylist', { playlist }, { root: true })
        commit('REPLACE_PLAYLIST', { playlistTracks: [] })
        return playlist
      } catch (error) {
        console.error(error)
        await dispatch('cleanAccess', null, { root: true })
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
      // })
    }
  },
  mutations: {
    PUSH(state, { track }) {
      state.playlist.push(track)
    },
    // TODO check if Vue has a better way to handle removal
    REMOVE(state, { track }) {
      state.playlist = state.playlist.filter(t => t.id !== track.id)
    },
    CHANGE_PLAYLIST_NAME(state, { name }) {
      state.playlistName = name
      state.playlistSpotifyObject.name = name
    },
    REPLACE_PLAYLIST(state, { playlistTracks }) {
      state.playlist = playlistTracks
    },
    REPLACE_ORIGINAL_PLAYLIST(state, { playlistTracks }) {
      state.originalPlaylist = playlistTracks
    },
    SET_PLAYLIST_OBJ(state, { playlist }) {
      state.playlistSpotifyObject = playlist
    },
    UPDATE_PREVIOUS_PLAYLIST(state, { playlist }) {
      state.previousPlaylist = playlist
    },
    RESET_ALL(state) {
      state.playlist = []
      state.previousPlaylist = null
      state.originalPlaylist = []
      state.orderedBy = []
      state.playlistName = 'My Playlist'
      state.playlistSpotifyObject = {}
    },
    CLEAN_PLAYLIST(state) {
      state.playlist = []
    }
  }
}
