// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import Vuex from 'vuex'
import VueRouter from 'vue-router'
Vue.use(Vuex)
Vue.use(VueRouter)
import { Button, Select } from 'element-ui'
import App from './App'
import 'vue-material-design-icons/styles.css'

// Element-ui components
Vue.component(Button.name, Button)
Vue.component(Select.name, Select)
/* or
 * Vue.use(Button)
 * Vue.use(Select)
 */

import {store} from './stores'

// TODO move to another file
// components
import Search from 'components/views/search'
const routes = [
  { path: '/search', name: 'search', component: Search }
]

const router = new VueRouter({
  routes // short for `routes: routes`
})
/* eslint-disable no-new */
new Vue({
  router,
  el: '#app',
  template: '<App/>',
  components: { App },
  store
})
