<template>
  <v-app id="inspire">
    <v-navigation-drawer v-model="navDrawer" app clipped>
      <v-list dense>
        <v-list-item link>
          <v-list-item-action>
            <v-icon>mdi-view-dashboard</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>Dashboard</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-list-item link>
          <v-list-item-action>
            <v-icon>mdi-cog</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>Settings</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>

    <v-app-bar app clipped-left>
      <v-app-bar-nav-icon
        v-if="$vuetify.breakpoint.mdAndUp"
        @click.stop="$store.commit('TOGGLE_NAV_DRAWER')"
      ></v-app-bar-nav-icon>
      <v-toolbar-title>Spotify Playlist Creator</v-toolbar-title>
    </v-app-bar>

    <v-main :class="{ 'pb-12': $vuetify.breakpoint.mobile }">
      <router-view></router-view>
    </v-main>

    <app-bottom-bar v-if="$vuetify.breakpoint.smAndDown" />
  </v-app>
</template>
<script>
import AppBottomBar from './components/layout/BottomBar.vue'
import VueAplayer from 'vue-aplayer'

import {
  spotifyApi,
  generateRandomString,
  getAccessToken
} from './services/spotify-service'
import { store } from './store'

export default {
  name: 'App',

  components: {
    AppBottomBar
  },
  mounted() {
    // store.dispatch('resetAll')
    // debugger
    const accessToken = getAccessToken() || this.accessToken // comes from URL or Vuex
    store.dispatch('saveAccessToken', { accessToken })
    spotifyApi.setAccessToken(accessToken)
    spotifyApi
      .getMe()
      .then(me => {
        store.dispatch('saveCurrentUser', { currentUser: me })
        return me
      })
      .catch(e => {
        console.error('error getting me - e:', e)
        store.dispatch('cleanAccess')
        this.login()
      })
  },
  data: () => ({}),

  created() {
    this.$vuetify.theme.dark = true
  },

  methods: {
    login() {
      console.log('logging in')
      const stateKey = 'spotify_auth_state'
      const clientId = '49275dd30324422b8bbba8bdea0e7b8c' // Your client id
      const redirectUri = window.location.origin + '/' // Your redirect uri
      const state = generateRandomString(16)
      window.localStorage.setItem(stateKey, state)
      const scope =
        'user-read-private user-read-email playlist-modify-public playlist-modify-private playlist-read-private'
      let url = 'https://accounts.spotify.com/authorize'
      url += '?response_type=token'
      url += '&client_id=' + encodeURIComponent(clientId)
      url += '&scope=' + encodeURIComponent(scope)
      url += '&redirect_uri=' + encodeURIComponent(redirectUri)
      url += '&state=' + encodeURIComponent(state)
      window.location.href = url
      // this.$router.push(url)
    }
  },
  computed: {
    navDrawer: {
      get() {
        return this.$store.state.navDrawer
      },
      set(val) {
        this.$store.commit('SET_NAV_DRAWER', val)
      }
    }
  }
}
</script>
