// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import Vuex from 'vuex'
import VueRouter from 'vue-router'
import VueTouch from 'vue-touch'
Vue.use(Vuex)
Vue.use(VueRouter)
// https://alligator.io/vuejs/vue-touch-events/
Vue.use(VueTouch)
import {
  Button,
  Input,
  Form,
  Select,
  Option,
  FormItem } from 'element-ui'
import App from './App'
import 'vue-material-design-icons/styles.css'
// Element-ui components
Vue.component(Button.name, Button)
Vue.component(Input.name, Input)
Vue.component(Form.name, Form)
Vue.component(FormItem.name, FormItem)
Vue.component(Select.name, Select)
Vue.component(Option.name, Option)

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
