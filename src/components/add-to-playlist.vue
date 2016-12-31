<template>
  <div class="add-to-playlist" @click="toggle">
    {{thisSongIsOnPlaylist ? '✓' : '➕'}}
  </div>
</template>

<script>
import { store } from 'src/stores'
import { mapGetters } from 'vuex'
import { includes } from 'lodash'

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
      return includes(this.playlist, this.song.id)
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
.play
  font-size: 1.8rem
  cursor: pointer
</style>
