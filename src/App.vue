<template>
  <div id="app">
    <header class="header">
      <div class="left">
        <h1>Playlist Creator</h1>
      </div>
      <div class="right">
        <button
          v-if="!accessToken"
          class="button login-button"
          @click="login">
          Login
        </button>
        <div v-if="currentUser.id && currentUser.images" class="user-info text">
          <img :src="currentUser.images[0].url" alt="" class="image">
          {{currentUser.display_name || currentUser.id }}
        </div>
      </div>
    </header>
    <div class="playlist-creator">
      <div class="search-area vertical-space">
        <search @selected-artist="updateCurrentSelectedArtist"></search>
      </div>
      <div class="songs vertical-space">
        <div class="browse-albums-and-songs vertical-space column">
          <div class="selected-artist-info">
            <artist-info
              :selected-artist="selectedArtist"
              :related-artists="relatedArtists"
              @select-artist="updateCurrentSelectedArtist">
            </artist-info>
          </div>
          <div class="row">
            <div class="top-songs column limit-height" v-if="currentSelectedArtistTopTracks.length > 0">
              <div class="text vertical-space">
                Top Songs
              </div>
              <song-list
                :songs="currentSelectedArtistTopTracks">
              </song-list>
            </div>
            <div class="current-album-songs column limit-height" v-if="currentSelectedArtistAlbumTracks.length > 0">
              Album: {{currentSelectedAlbum.name}}
              <song-list
                :songs="currentSelectedArtistAlbumTracks">
              </song-list>
            </div>
            <div class="albums column limit-height">
              <album-browser
                :albums="currentSelectedArtistAlbums"
                @select-album="selectAlbum">
              </album-browser>
            </div>
          </div>
        </div>
      </div>
      <!-- end of current-album -->
      <playlist-manager
        @create-playlist="createPlaylist">
      </playlist-manager>
      <!-- end of playlist-manager -->
      <player></player>
    </div>
  </div>
</template>

<script>
function getAccessToken () {
  if (!window.location.hash) return
  let r = new RegExp('([^&;=]+)=?([^&;]*)', 'g')
  return window.location.hash.match(r)[0].split('#access_token=')[1]
}
/**
 * Generates a random string containing numbers and letters
 * @param  {number} length The length of the string
 * @return {string} The generated string
 */
function generateRandomString (length) {
  let text = ''
  let possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  for (var i = 0; i < length; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length))
  }
  return text
}

const SpotifyApi = require('spotify-web-api-js')

const spotifyApi = new SpotifyApi()

import {store} from './stores'
import { mapGetters } from 'vuex'
import Search from './components/search'
import SongList from './components/song-list'
import Player from './components/player'
import AlbumBrowser from './components/album-browser'
import ArtistInfo from './components/artist-info'
import PlaylistManager from './components/playlist-manager'
import {uniqBy} from 'lodash'

export default {
  name: 'app',
  data () {
    return {
      selectedArtist: {},
      currentSelectedArtistTopTracks: [],
      currentSelectedArtistAlbums: [],
      currentSelectedAlbum: {},
      currentSelectedArtistAlbumTracks: [],
      relatedArtists: []
    }
  },
  watch: {
    currentSelectedAlbum () {
      this.currentSelectedAlbum
      // album tracks
      spotifyApi.getAlbumTracks(this.currentSelectedAlbum.id)
      .then(data => { this.currentSelectedArtistAlbumTracks = data.items })
      .catch(err => { console.log(err) })
    },
    selectedArtist () {
      if (this.selectedArtist.id) {
        // TODO change 'BR' to geolocation data

        // top tracks
        spotifyApi.getArtistTopTracks(this.selectedArtist.id, 'BR')
        .then(data => { this.currentSelectedArtistTopTracks = data.tracks })
        .catch(err => { console.log(err) })

        // albums
        spotifyApi.getArtistAlbums(this.selectedArtist.id, 'BR')
        .then(data => {
          this.currentSelectedArtistAlbums = uniqBy(data.items.filter(a => a.album_type === 'album'), 'name')
        })
        .catch(err => { console.log(err) })

        // related artists
        spotifyApi.getArtistRelatedArtists(this.selectedArtist.id, 'BR')
        .then(data => { this.relatedArtists = data.artists })
        .catch(err => { console.log(err) })
      }
    }
  },
  mounted () {
    const accessToken = getAccessToken()
    if (accessToken) {
      store.dispatch('saveAccessToken', {accessToken: accessToken})
      spotifyApi.setAccessToken(accessToken)
      spotifyApi.getMe()
      .then((me) => {
        store.dispatch('saveCurrentUser', {currentUser: me})
      })
      .catch(e => { store.dispatch('cleanAccess') })
    }
  },
  methods: {
    createPlaylist () {
      spotifyApi.createPlaylist(this.currentUser.id, {name: this.playlistName})
      .then((playlist) => {
        spotifyApi.addTracksToPlaylist(
          this.currentUser.id,
          playlist.id,
          this.playlist.map(t => t.uri)
        )
      })
      .catch(e => { console.warn(e) })
    },
    selectAlbum (album) {
      this.currentSelectedAlbum = album
    },
    updateCurrentSelectedArtist (artist) {
      this.selectedArtist = artist
    },
    login () {
      const stateKey = 'spotify_auth_state'
      const clientId = '49275dd30324422b8bbba8bdea0e7b8c' // Your client id
      const redirectUri = 'http://localhost:8080/' // Your redirect uri
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
      'playlistName'
    ])
  },
  components: {
    Search,
    SongList,
    Player,
    AlbumBrowser,
    ArtistInfo,
    PlaylistManager
  }
}
</script>
<style lang="sass">
#app
  font-family: 'Avenir', Helvetica, Arial, sans-serif
  -webkit-font-smoothing: antialiased
  -moz-osx-font-smoothing: grayscale
  color: #2c3e50
  display: flex
  flex-direction: column
  max-width: 100%

.browse-albums-and-songs
  min-height: 400px
  overflow: auto

.playlist-creator
  display: flex
  flex-direction: column

.albums
  flex: 2

.selected-artist-info
  min-height: 300px

.user-info
  display: flex
  align-items: center
  img
    border-radius: 50%
    margin-right: 0.5rem

// utils
.vertical-space
  margin: 20px 0

.column
  display: flex
  flex-direction: column
  flex: 1 1 auto

.row
  display: flex
  flex-direction: row

.clickable
  cursor: pointer

.header
  display: flex
  width: 100%
  align-items: center
  justify-content: space-between

.button
  cursor: pointer
  border: none
  font-size: 1.6rem
  border-radius: 5px
  padding: 5px 10px
  outline: none

.limit-height
  max-height: 400px
  overflow: auto

.image
  width: 70px
  height: 70px

.media-wrapper
  display: flex
  width: 100%
  max-height: 400px
  overflow-x: scroll
  flex-wrap: wrap

.media
  display: flex
  align-items: center
  font-size: 1.3rem
  margin-bottom: 0.5rem
  margin-right: 1.2rem
  &:last-child
    margin-bottom: 0
    margin-right: 0
  img
    margin-right: 5px

.text
  font-size: 1.4rem
</style>
