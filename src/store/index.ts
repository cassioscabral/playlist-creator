import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    navDrawer: false
  },
  mutations: {
    SET_NAV_DRAWER: (state, payload) => {
      state.navDrawer = payload;
    },
    TOGGLE_NAV_DRAWER: state => {
      state.navDrawer = !state.navDrawer;
    }
  },
  actions: {},
  modules: {}
});
