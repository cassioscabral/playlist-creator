import Vue from 'vue'
import VueRouter, { RouteConfig } from 'vue-router'
import Home from '../views/Home.vue'
import Search from '../views/Search.vue'
import Playlists from '../views/Playlists.vue'

Vue.use(VueRouter)

const routes: Array<RouteConfig> = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  { path: '/:access-token', component: Home },
  { path: '/search', name: 'search', component: Search },
  { path: '/playlists', name: 'playlists', component: Playlists }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
