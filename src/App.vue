<template>
  <v-app id="inspire">
    <v-navigation-drawer v-model="navDrawer" app clipped>
      <v-list dense>
        <v-list-item link @click="$router.push({ name: 'home' })">
          <v-list-item-action>
            <v-icon>mdi-home</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>Home</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-list-item link @click="$router.push({ name: 'playlists' })">
          <v-list-item-action>
            <v-icon>mdi-playlist-music</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>Playlists</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-list-item link>
          <v-list-item-action>
            <v-icon>mdi-logout</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>Logout</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>

    <v-app-bar app clipped-left>
      <v-app-bar-nav-icon
        @click.stop="$store.commit('TOGGLE_NAV_DRAWER')"
      ></v-app-bar-nav-icon>
      <v-toolbar-title @click="$router.push('/')"
        >Spotify Playlist Creator</v-toolbar-title
      >
    </v-app-bar>

    <v-main :class="{ 'is-mobile': $vuetify.breakpoint.smAndDown }">
      <keep-alive>
        <router-view></router-view>
      </keep-alive>
      <a-player
        class="vue-player"
        mode="order"
        v-show="hasTrackSelected"
        mutex
        :autoplay="false"
        :music="currentTrack"
        theme="#1DB954"
        ref="vuePlayer"
      ></a-player>
    </v-main>
  </v-app>
</template>
<script>
import VueAplayer from 'vue-aplayer'

import {
  spotifyApi,
  generateRandomString,
  getAccessToken
} from './services/spotify-service'
import { store } from './store'
import isEmpty from 'lodash/isEmpty'
import { mapGetters } from 'vuex'

export default {
  name: 'App',
  components: {
    'a-player': VueAplayer
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
      .then(res => {
        store.dispatch('application/cleanSelectedAlbum')
        return res
      })
      .catch(e => {
        console.error('error getting me - e:', e)
        store.dispatch('cleanAccess')
        setTimeout(() => {
          this.login()
        }, 300)
      })
  },
  data: () => ({}),

  created() {
    this.$vuetify.theme.dark = true
  },

  methods: {
    login() {
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
    ...mapGetters('player', ['autoplay', 'currentTrack']),
    navDrawer: {
      get() {
        return this.$store.state.navDrawer
      },
      set(val) {
        this.$store.commit('SET_NAV_DRAWER', val)
      }
    },
    hasTrackSelected() {
      return !isEmpty(this.currentTrack)
    }
  },
  watch: {
    currentTrack(newVal) {
      // this.$refs.vuePlayer.play()
    }
  }
}
</script>
<style lang="scss" scoped>
.v-main {
  .vue-player {
    position: fixed;
    bottom: 0;
    margin: 0px;
    width: 100%;
  }
}
</style>
