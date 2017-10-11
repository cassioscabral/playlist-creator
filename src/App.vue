<template>
  <div id="app" ref="app">
    <div class="main">
      <keep-alive>
        <router-view></router-view>
      </keep-alive>
    </div>
    <a-player mode="order" v-show="hasTrackSelected" @change="changeMusic" mutex :autoplay="autoplay" :music="currentTrack" ref="player"></a-player>
    <main-menu></main-menu>
  </div>
</template>

<script>
import { store } from './stores'
import { mapGetters } from 'vuex'
import { isEmpty } from 'lodash'
// import VueAplayer from 'vue-aplayer/src/vue-aplayer'
import VueAplayer from 'vue-aplayer'

import {
  spotifyApi,
  generateRandomString,
  getAccessToken
} from './core/spotify-service'

// components
import MainMenu from './components/mobile/menu.vue'

// import ZingTouch from 'zingtouch'

export default {
  name: 'app',
  data () {
    return {
    }
  },
  watch: {
  },
  mounted () {
    // store.dispatch('resetAll')
    // debugger
    const accessToken = getAccessToken() || this.accessToken // comes from URL or Vuex
    store.dispatch('saveAccessToken', { accessToken })
    spotifyApi.setAccessToken(accessToken)
    spotifyApi.getMe()
    .then((me) => {
      store.dispatch('saveCurrentUser', { currentUser: me })
      return me
    })
    .catch(e => {
      console.error('error getting me - e:', e)
      store.dispatch('cleanAccess')
      this.login()
    })
  },
  methods: {
    changeMusic (music) {
      // console.log('music changed', music)
    },
    selectAlbum (album) {
      this.currentSelectedAlbum = album
    },
    updateCurrentSelectedArtist (artist) {
      this.selectedArtist = artist
    },
    login () {
      console.log('logging in')
      const stateKey = 'spotify_auth_state'
      const clientId = '49275dd30324422b8bbba8bdea0e7b8c' // Your client id
      let redirectUri = window.location.origin + '/' // Your redirect uri
      const state = generateRandomString(16)
      window.localStorage.setItem(stateKey, state)
      const scope = 'user-read-private user-read-email playlist-modify-public playlist-modify-private playlist-read-private'
      let url = 'https://accounts.spotify.com/authorize'
      url += '?response_type=token'
      url += '&client_id=' + encodeURIComponent(clientId)
      url += '&scope=' + encodeURIComponent(scope)
      url += '&redirect_uri=' + encodeURIComponent(redirectUri)
      url += '&state=' + encodeURIComponent(state)
      window.location.href = url
      // this.$router.push(url)
    },
    isEmpty
  },
  computed: {
    ...mapGetters([
      'accessToken',
      'currentUser'
      // 'playlist',
      // 'playlistName',
      // 'playlistObject'
    ]),
    ...mapGetters('application', [
      'selectedArtist'
    ]),
    ...mapGetters('player', [
      'autoplay',
      'currentTrack'
    ]),
    hasTrackSelected () {
      return !this.isEmpty(this.currentTrack)
    }
  },
  components: {
    MainMenu,
    'a-player': VueAplayer
  }
}
</script>
<style lang="scss">
@import './assets/reset';
@import './assets/utils';
@import './assets/colors';

body {
  max-width: 100%;
  overflow: hidden;
}

#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  display: flex;
  flex-direction: column;
  max-width: 100%;
  min-height: 100vh;
  height: 100vh;
  max-height: 100vh;
  border: 0;
  padding: 0;
  overflow-y: scroll; // has to be scroll, not auto
  -webkit-overflow-scrolling: touch;
}

.main {
  flex: 1;
  overflow-y: scroll; // has to be scroll, not auto
  -webkit-overflow-scrolling: touch;
}

.material-design-icon {
  width: 3rem;
  height: 3rem;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
