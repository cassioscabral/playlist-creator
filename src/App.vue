<template>
  <div id="app" ref="app">
    <div class="main">
      <keep-alive>
        <router-view></router-view>
      </keep-alive>
    </div>
    <main-menu></main-menu>
  </div>
</template>

<script>
import { store } from './stores'
import { mapGetters } from 'vuex'
// import { uniqBy } from 'lodash'
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
      currentSelectedArtistTopTracks: [],
      currentSelectedArtistAlbums: [],
      // currentSelectedAlbum: {},
      currentSelectedArtistAlbumTracks: [],
      relatedArtists: [],
      userPlaylists: []
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

    // set user playlists
    // if (this.currentUser.id) {
    //   spotifyApi.getUserPlaylists(this.currentUser.id, {limit: 50})
    //   .then(data => {
    //     // get only playlists owned by the user
    //     const playlists = data.items.filter(i => i.owner.id === this.currentUser.id)
    //     store.dispatch('saveUserPlaylists', {playlists})
    //     return playlists
    //   })
    //   .then(playlists => {
    //     // playlist might not exist and the user just reload
    //     let playlistWasDeleted = playlists.filter(p => p.id === this.playlistObject.id).length === 0
    //     if (this.playlist.length !== 0 && playlistWasDeleted) {
    //       window.alertify.warning('Your playlist was deleted on Spotify, create a new one')
    //       store.dispatch('resetPlaylistStore')
    //     }
    //   })
    //   .catch(e => {
    //     console.error(e)
    //     store.dispatch('cleanAccess')
    //     this.login()
    //   })
    // }
  },
  methods: {
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
      window.location = url
    }
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
    ])
  },
  components: {
    MainMenu
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
  overflow: auto;
}

.main {
  flex: 1;
  overflow: auto;
}

.material-design-icon {
  width: 3rem;
  height: 3rem;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
