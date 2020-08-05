import { getArtistAlbums, getAlbumTracks } from '../services/spotify-service'
import { get } from 'lodash'
// import router from 'src/router'

export default {
  namespaced: true,
  state: {
    selectedArtist: {},
    selectedAlbum: {},
    selectedAlbumTracks: [],
    albums: []
  },
  getters: {
    selectedArtist: state => state.selectedArtist,
    selectedAlbum: state => state.selectedAlbum,
    selectedAlbumTracks: state => state.selectedAlbumTracks,
    albums: state => state.albums
  },
  actions: {
    selectArtist({ commit, dispatch }, { artist, getAlbums = true }) {
      commit('SELECT_ARTIST', { artist })
      dispatch('cleanSelectedAlbum') // case there is a different artist selected album
      if (getAlbums) {
        dispatch('getAlbums', { artist, goTo: 'home' })
      }
    },
    async getAlbums({ commit, dispatch }, { artist, goTo = false }) {
      try {
        const result = await getArtistAlbums(artist.id)
        const albums = get(result, 'items')
        commit('ALBUMS', { albums })
        if (albums && albums.length > 0) {
          // Preselect first album available
          dispatch('selectAlbum', { album: albums[0] })
        }
        if (goTo) {
          // router.push(goTo)
        }
      } catch (error) {
        console.error(error)
      }
    },
    selectAlbum({ commit, dispatch }, { album, getTracks = true }) {
      commit('SELECT_ALBUM', { album })
      if (getTracks) {
        dispatch('getAlbumTracks', { album })
      }
    },
    async getAlbumTracks({ commit }, { album }) {
      try {
        const result = await getAlbumTracks(album.id)
        const tracks = get(result, 'items')
        commit('ALBUM_TRACKS', { tracks })
      } catch (error) {
        console.error(error)
      }
    },
    cleanSelectedAlbum({ commit, dispatch }) {
      commit('SELECT_ALBUM', { album: {} })
      dispatch('cleanSelectedAlbumTracks')
    },
    cleanSelectedAlbumTracks({ commit }) {
      commit('ALBUM_TRACKS', { tracks: [] })
    }
  },
  mutations: {
    SELECT_ARTIST(state, { artist }) {
      state.selectedArtist = Object.assign({}, artist)
    },
    SELECT_ALBUM(state, { album }) {
      state.selectedAlbum = Object.assign({}, album)
    },
    ALBUM_TRACKS(state, { tracks }) {
      state.selectedAlbumTracks = [...tracks]
    },
    ALBUMS(state, { albums }) {
      state.albums = [...albums]
    }
  }
}
