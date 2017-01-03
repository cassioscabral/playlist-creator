<template>
  <div class="play" @click="toggle">{{thisSongIsPlaying ? '❚❚' : '►'}}
  </div>
</template>

<script>
import { store } from 'src/stores'

export default {
  name: 'play',
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
    // Couldn't get mapState to work
    currentTrack () {
      return this.$store.state.player.currentTrack
    },
    isPlaying () {
      return this.$store.state.player.isPlaying
    },
    thisSongIsPlaying () {
      if (!this.song) return false
      if (!this.currentTrack) return false
      return (this.song.id === this.currentTrack.id) && this.isPlaying
    }
  },
  watch: {
  },
  methods: {
    toggle () {
      if (this.thisSongIsPlaying) {
        store.dispatch('pause', {track: this.song})
      } else {
        store.dispatch('playTrack', {track: this.song})
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
