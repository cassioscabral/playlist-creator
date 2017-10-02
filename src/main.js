// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import Vuex from 'vuex'
import VueRouter from 'vue-router'
Vue.use(Vuex)
Vue.use(VueRouter)
import {
  Button,
  Input,
  Form,
  FormItem } from 'element-ui'
import App from './App'
import 'vue-material-design-icons/styles.css'
// Element-ui components
Vue.component(Button.name, Button)
Vue.component(Input.name, Input)
Vue.component(Form.name, Form)
Vue.component(FormItem.name, FormItem)

import {store} from './stores'

// route components
import Home from 'components/views/home'
import Search from 'components/views/search'
import Playlists from 'components/views/playlists'
const routes = [
  { path: '/', name: 'home', component: Home },
  { path: '/search', name: 'search', component: Search },
  { path: '/playlists', name: 'playlists', component: Playlists }
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
