// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import Vuex from 'vuex'
import VueRouter from 'vue-router'
import VueTouch from 'vue-touch'
Vue.use(Vuex)
Vue.use(VueRouter)
// https://alligator.io/vuejs/vue-touch-events/
VueTouch.registerCustomEvent('doubletap', {
  type: 'tap',
  taps: 2
})
Vue.use(VueTouch, {name: 'v-touch'})

import App from './App'
import 'vue-material-design-icons/styles.css'

// mint-ui elements
import { MessageBox } from 'mint-ui'
Vue.component(MessageBox.name, MessageBox)
Vue.prototype.$msgbox = MessageBox
Vue.prototype.$alert = MessageBox.alert
Vue.prototype.$confirm = MessageBox.confirm
Vue.prototype.$prompt = MessageBox.prompt

import {store} from './stores'

import router from 'src/router'

/* eslint-disable no-new */
new Vue({
  router,
  el: '#app',
  template: '<App/>',
  components: { App },
  store
})
