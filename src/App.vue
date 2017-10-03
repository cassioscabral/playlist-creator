<template>
  <div id="app" ref="app">
    <header-info></header-info>
    <div class="main">
      <router-view></router-view>
    </div>
    <main-menu></main-menu>
  </div>
</template>

<script>
import { store } from './stores'
import { mapGetters } from 'vuex'
import { uniqBy } from 'lodash'
import {
  spotifyApi,
  generateRandomString,
  getAccessToken
} from './core/spotify-service'

// components
import MainMenu from './components/mobile/menu.vue'
import HeaderInfo from './components/mobile/header.vue'

// import ZingTouch from 'zingtouch'

export default {
  name: 'app',
  data () {
    return {
      currentSelectedArtistTopTracks: [],
      currentSelectedArtistAlbums: [],
      currentSelectedAlbum: {},
      currentSelectedArtistAlbumTracks: [],
      relatedArtists: [],
      userPlaylists: []
    }
  },
  watch: {
    // accessToken () {
    //   // session expired
    //   if (this.accessToken === '') {
    //     // if (window.confirm('Your session is over, do you wish to login again?')) {

    //     // }
    //     this.login()
    //     console.log('logging in...')
    //   }
    // },
    async currentSelectedAlbum () {
      this.currentSelectedAlbum
      // album tracks
      if (this.currentSelectedAlbum.id) {
        spotifyApi.getAlbumTracks(this.currentSelectedAlbum.id)
        .then(data => {
          // this.currentSelectedArtistAlbumTracks = data.items
          return data.items
        })
        .then(tracks => {
          // GET tracks via tracks API, return tracks with album
          spotifyApi.getTracks(tracks.map(t => t.id))
          .then(({tracks}) => {
            this.currentSelectedArtistAlbumTracks = tracks
          })
          .catch(err => { console.error(err) })
        })
        .catch(err => { console.error(err) })
      }
    },
    selectedArtist () {
      if (this.selectedArtist.id) {
        // reset currentSelectedAlbum
        this.currentSelectedAlbum = {}
        this.currentSelectedArtistAlbumTracks = []
        // TODO change 'BR' to geolocation data

        // top tracks
        spotifyApi.getArtistTopTracks(this.selectedArtist.id, 'US')
        .then(data => { this.currentSelectedArtistTopTracks = data.tracks })
        .catch(err => { console.error(err) })

        // albums
        // TODO check if has next url
        spotifyApi.getArtistAlbums(this.selectedArtist.id, {limit: 50})
        .then(data => {
          this.currentSelectedArtistAlbums = uniqBy(data.items.filter(a => a.album_type === 'album'), 'name')
        })
        .catch(err => { console.error(err) })

        // related artists
        spotifyApi.getArtistRelatedArtists(this.selectedArtist.id)
        .then(data => { this.relatedArtists = data.artists })
        .catch(err => { console.error(err) })
      }
    }
  },
  mounted () {
    // store.dispatch('resetAll')
    const accessToken = getAccessToken() // comes from URL
    console.log('mounted - accessToken', accessToken)
    // TODO try to get from store with this.accessToken
    if (typeof accessToken === 'undefined') {
      // from vuex
      if (typeof this.accessToken === 'undefined' || this.accessToken === '') {
        console.log('accessToken not defined on vuex')
        this.login()
      }
      spotifyApi.setAccessToken(this.accessToken)// from vuex
    } else {
      store.dispatch('saveAccessToken', { accessToken })
      spotifyApi.setAccessToken(accessToken)
      spotifyApi.getMe()
        .then((me) => {
          store.dispatch('saveCurrentUser', { currentUser: me })
          return me
        })
        .catch(e => {
          store.dispatch('cleanAccess')
          this.login()
        })
    }

    // set user playlists
    if (this.currentUser.id) {
      spotifyApi.getUserPlaylists(this.currentUser.id, {limit: 50})
      .then(data => {
        // get only playlists owned by the user
        const playlists = data.items.filter(i => i.owner.id === this.currentUser.id)
        store.dispatch('saveUserPlaylists', {playlists})
        return playlists
      })
      .then(playlists => {
        // playlist might not exist and the user just reload
        let playlistWasDeleted = playlists.filter(p => p.id === this.playlistObject.id).length === 0
        if (this.playlist.length !== 0 && playlistWasDeleted) {
          window.alertify.warning('Your playlist was deleted on Spotify, create a new one')
          store.dispatch('resetPlaylistStore')
        }
      })
      .catch(e => {
        console.warn(e)
        store.dispatch('cleanAccess')
        this.login()
      })
    }
  },
  methods: {
    selectAlbum (album) {
      this.currentSelectedAlbum = album
    },
    updateCurrentSelectedArtist (artist) {
      this.selectedArtist = artist
    },
    login () {
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
      'currentUser',
      'playlist',
      'playlistName',
      'playlistObject'
    ]),
    ...mapGetters('application', [
      'selectedArtist'
    ])
  },
  components: {
    MainMenu,
    HeaderInfo
  }
}
</script>
<style lang="scss">
@import './assets/reset';
@import './assets/utils';
@import './assets/colors';

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
</style>
