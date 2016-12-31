import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex)
import player from './player'
import playlist from './playlist'

export const store = new Vuex.Store({
  state: {
    accessToken: '',
    currentUser: {}
  },
  getters: {
    accessToken: state => state.accessToken,
    currentUser: state => state.currentUser
  },
  actions: {
    saveAccessToken ({commit}, {accessToken}) {
      commit('ADD_ACESS_TOKEN', {accessToken})
    },
    saveCurrentUser ({commit}, {currentUser}) {
      commit('ADD_CURRENT_USER', {currentUser})
    }
  },
  mutations: {
    ADD_ACESS_TOKEN (state, {accessToken}) {
      state.accessToken = accessToken
    },
    ADD_CURRENT_USER (state, {currentUser}) {
      state.currentUser = currentUser
    }
  },
  modules: {
    player,
    playlist
  }
})

export default store
