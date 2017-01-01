<template>
  <div class="add-to-playlist" @click="toggle">
    {{thisSongIsOnPlaylist ? '✓' : '➕'}}
  </div>
</template>

<script>
import { store } from 'src/stores'
import { mapGetters } from 'vuex'

export default {
  name: 'add-to-playlist',
  props: {
    song: {
      type: Object
    }
  },
  data () {
    return {
    }
  },
  computed: {
    ...mapGetters([
      'playlist',
      'playlistName'
    ]),
    thisSongIsOnPlaylist () {
      if (!this.song) return false
      if (!this.playlist) return false
      return this.playlist.find(t => t.id === this.song.id)
    }
  },
  watch: {
  },
  methods: {
    toggle () {
      if (this.thisSongIsOnPlaylist) {
        store.dispatch('remove', {track: this.song})
      } else {
        store.dispatch('push', {track: this.song})
      }
    }
  }
}
</script>

<style lang="sass" scoped>
.add-to-playlist
  font-size: 1.8rem
  cursor: pointer
</style>
