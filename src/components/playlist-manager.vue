<template>
  <div class="playlist-manager">
    <div class="column user-playlists" v-if="userPlaylists">
      <div class="text vertical-space">
        My Playlists:
      </div>
      <div class="text vertical-space">
        <input type="text" class="input" v-model="name" @keyup.enter="isEditing = false" @change="changePlaylistName({name})">
        <button
          class="button"
          @click="createPlaylist"
          :disabled="this.name.length === 0">
          ➕
        </button>
      </div>
      <ul>
        <li
          class="clickable"
          v-for="playlist in userPlaylists"
          @click="loadPlaylist({playlist})">
          {{playlist.name}}
        </li>
      </ul>
    </div>
    <div class="current-playlist column">
      <div class="text vertical-space">
        <div  v-if="!isEditing" class="name" @click="isEditing = true">
          Playlist name: {{playlistName}}
        </div>

      </div>
      <song-list :songs="playlist"></song-list>
      <button v-if="this.playlist.length > 0" class="button" @click="addTracksToPlaylist">
        Save
      </button>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import SongList from './song-list'

export default {
  name: 'playlist-manager',
  data () {
    return {
      isEditing: false,
      name: this.playlistName || ''
    }
  },
  computed: {
    ...mapGetters([
      'accessToken',
      'currentUser',
      'playlist',
      'playlistName',
      'playlistIsEmpty',
      'userPlaylists'
    ])
  },
  methods: {
    ...mapActions([
      'changePlaylistName',
      'loadPlaylist',
      'addTracksToPlaylist'
    ]),
    createPlaylist () {
      if (this.currentUser.id && this.name.length > 0) {
        // better use the spotifyApi on the App component where the token is set
        this.$emit('create-playlist', this.name)
      }
    }
  },
  components: {
    SongList
  }
}
</script>

<style lang="sass">
.playlist-manager
  display: flex

.user-playlists
  width: 30%

.current-playlist
  width: 70%

</style>
