<template>
<div class="player">
  <audio controls
    ref="audio"
    v-if="currentTrack"
    :src="currentTrack.preview_url">
  </audio>
</div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'player',
  data () {
    return {

    }
  },
  computed: {
    ...mapGetters([
      'playlist',
      'currentTrack',
      'isPlaying'
    ])
  },
  watch: {
    currentTrack () {
      // deal with the audio when the track changes
      this.$nextTick(() => {
        const audio = this.$refs.audio
        if (audio.paused) {
          audio.play()
        } else {
          audio.pause()
        }
      })
    },
    isPlaying () {
      // deal with the self pausing, click again on the same track
      this.$nextTick(() => {
        const audio = this.$refs.audio
        if (this.isPlaying) {
          audio.play()
        } else {
          audio.pause()
        }
      })
    }
  }
}
</script>

<style lang="css">
</style>
