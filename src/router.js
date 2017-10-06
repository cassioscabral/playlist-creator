import VueRouter from 'vue-router'
import Home from 'components/views/home'
import Search from 'components/views/search'
import Playlists from 'components/views/playlists'

const routes = [
  { path: '/', name: 'home', component: Home },
  { path: '/:access-token', component: Home },
  { path: '/search', name: 'search', component: Search },
  { path: '/playlists', name: 'playlists', component: Playlists }
]

const router = new VueRouter({
  routes
})

export default router
