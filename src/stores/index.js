import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex)
import application from './application'
import player from './player'
import playlist from './playlist'
import createPersistedState from 'vuex-persistedstate'

export const store = new Vuex.Store({
  plugins: [createPersistedState()],
  state: {
    accessToken: '',
    currentUser: {},
    userPlaylists: []
  },
  getters: {
    accessToken: state => state.accessToken,
    currentUser: state => state.currentUser,
    userPlaylists: state => state.userPlaylists
  },
  actions: {
    saveAccessToken ({commit}, {accessToken}) {
      commit('ADD_ACESS_TOKEN', {accessToken})
    },
    saveCurrentUser ({commit}, {currentUser}) {
      commit('ADD_CURRENT_USER', {currentUser})
    },
    saveUserPlaylists ({commit}, {playlists}) {
      commit('ADD_USER_PLAYLISTS', {playlists})
    },
    cleanAccess ({commit}) {
      commit('CLEAN_ACCESS')
    },
    pushPlaylist ({commit}, {playlist}) {
      commit('PUSH_PLAYLIST', {playlist})
    }
  },
  mutations: {
    ADD_ACESS_TOKEN (state, {accessToken}) {
      state.accessToken = accessToken
    },
    ADD_CURRENT_USER (state, {currentUser}) {
      state.currentUser = currentUser
    },
    ADD_USER_PLAYLISTS (state, {playlists}) {
      state.userPlaylists = playlists
    },
    CLEAN_ACCESS (state) {
      state.accessToken = ''
      state.currentUser = {}
    },
    PUSH_PLAYLIST (state, {playlist}) {
      state.userPlaylists.unshift(playlist)
    }
  },
  modules: {
    application,
    player,
    playlist
  }
})

export default store
