import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex)
import player from './player'

export const store = new Vuex.Store({
  state: {
    accessToken: null
  },
  actions: {
    saveAccessToken ({commit}, {accessToken}) {
      commit('ADD_ACESS_TOKEN', {accessToken})
    }
  },
  mutations: {
    ADD_ACESS_TOKEN (state, {accessToken}) {
      state.accessToken = accessToken
    }
  },
  getters: {

  },
  modules: {
    player
  }
})

export default store
