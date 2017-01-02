<template>
  <div class="playlist-manager" v-if="!playlistIsEmpty">
    <div class="text vertical-space">
      <div  v-if="!isEditing" class="name" @click="isEditing = true">
        Playlist name: {{playlistName}}
      </div>
      <input v-else type="text" class="input" v-model="name" @keyup.enter="isEditing = false" @change="changePlaylistName({name})">
    </div>
    <song-list :songs="playlist"></song-list>
    <button class="button" @click="createPlaylist">
      Create
    </button>
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
      'playlistIsEmpty'
    ])
  },
  methods: {
    createPlaylist () {
      // better use the spotifyApi on the App where the token is set
      this.$emit('create-playlist')
    },
    ...mapActions([
      'changePlaylistName'
    ])
  },
  components: {
    SongList
  }
}
</script>

<style lang="css">
</style>
