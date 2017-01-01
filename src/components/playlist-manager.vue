<template>
  <div class="playlist-manager" v-if="!playlistIsEmpty">
    Playlist name: {{playlistName}}
    <ul>
      <li v-for="track in playlist">
        {{track.name}}
      </li>
    </ul>
    <button class="button" @click="createPlaylist">
      Create
    </button>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'playlist-manager',
  data () {
    return {
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
    }
  }
}
</script>

<style lang="css">
</style>
