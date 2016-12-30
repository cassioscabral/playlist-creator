<template>
  <div id="app">
    <header class="header">
      <div class="left">
        <h1>Playlist Creator</h1>
      </div>
      <div class="right">
        <button class="button login-button">
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
export default {
  name: 'app',
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
