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
      </div>
    </header>
    <div class="playlist-creator">
      <div class="search-area">

      </div>
      <div class="songs">
        <div class="top-songs">

        </div>
        <div class="browse-albums-and-songs">
          <div class="albums">
            ALBUMS
          </div>
          <div class="current-album column">
            <div class="row">
              <div class="current-album-title">
                Album Title
              </div>
              <div class="icons-actions">
                Back to grid
              </div>
            </div>
            <div class="current-album-songs column">
              Songs from current album
            </div>
          </div>
        </div>
      </div>
      <!-- end of current-album -->
      <div class="playlist-manager">
        Playlist manager
      </div>
      <!-- end of playlist-manager -->
      <div class="player">
        Player
      </div>
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

export default {
  name: 'app',
  data () {
    return {
      accessToken: null
    }
  },
  mounted () {
    this.accessToken = getAccessToken()
    if (this.accessToken) {
      // TODO fetch me

      // TODO set currentUser
    }
  },
  methods: {
    login () {
      const stateKey = 'spotify_auth_state'
      const clientId = '49275dd30324422b8bbba8bdea0e7b8c' // Your client id
      const redirectUri = 'http://localhost:8080/' // Your redirect uri
      const state = generateRandomString(16)
      window.localStorage.setItem(stateKey, state)
      const scope = 'user-read-private user-read-email'
      let url = 'https://accounts.spotify.com/authorize'
      url += '?response_type=token'
      url += '&client_id=' + encodeURIComponent(clientId)
      url += '&scope=' + encodeURIComponent(scope)
      url += '&redirect_uri=' + encodeURIComponent(redirectUri)
      url += '&state=' + encodeURIComponent(state)
      window.location = url
    }
  },
  components: {
  }
}
</script>
<style lang="sass" scoped>
#app
  font-family: 'Avenir', Helvetica, Arial, sans-serif
  -webkit-font-smoothing: antialiased
  -moz-osx-font-smoothing: grayscale
  color: #2c3e50
  display: flex
  flex-direction: column

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

</style>
