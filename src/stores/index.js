import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex)
import player from './player'

export const store = new Vuex.Store({
  state: {
    accessToken: null
  },
  actions: {

  },
  mutations: {

  },
  getters: {

  },
  modules: {
    player
  }
})

export default store
