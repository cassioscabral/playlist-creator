import {
  getArtistAlbums,
  getAlbumTracks
} from 'src/core/spotify-service'
import { get } from 'lodash'

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
    selectArtist ({ commit, dispatch }, { artist, getAlbums = true }) {
      commit('SELECT_ARTIST', { artist })
      if (getAlbums) {
        dispatch('getAlbums', { artist })
      }
    },
    async getAlbums ({ commit }, { artist }) {
      try {
        const result = await getArtistAlbums(artist.id)
        const albums = get(result, 'items')
        commit('ALBUMS', { albums })
      } catch (error) {
        console.error(error)
      }
    },
    selectAlbum ({ commit, dispatch }, { album, getTracks = true }) {
      commit('SELECT_ALBUM', { album })
      if (getTracks) {
        dispatch('getAlbumTracks', { album })
      }
    },
    async getAlbumTracks ({ commit }, { album }) {
      try {
        const result = await getAlbumTracks(album.id)
        const tracks = get(result, 'items')
        commit('ALBUM_TRACKS', { tracks })
      } catch (error) {
        console.error(error)
      }
    }
  },
  mutations: {
    SELECT_ARTIST (state, { artist }) {
      state.selectedArtist = Object.assign({}, artist)
    },
    SELECT_ALBUM (state, { album }) {
      state.selectedAlbum = Object.assign({}, album)
    },
    ALBUM_TRACKS (state, { tracks }) {
      state.selectedAlbumTracks = [...tracks]
    },
    ALBUMS (state, { albums }) {
      state.albums = [...albums]
    }
  }
}
