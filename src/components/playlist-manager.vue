<template>
  <div class="playlist-manager">
    Playlist Manager

    Playlist name: {{playlistName}}
    <ul>
      <li v-for="track in playlist">
        {{track.name}}
      </li>
    </ul>
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
      'playlistName'
    ])
  }
}
</script>

<style lang="css">
</style>
