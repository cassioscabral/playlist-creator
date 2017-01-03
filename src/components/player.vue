<template>
<div class="player">
  <audio controls
    ref="audio"
    v-if="currentTrack"
    :src="currentTrack.preview_url"
    @play="play({track: currentTrack})"
    @ended="pause({track: currentTrack})"
    @pause="pause({track: currentTrack})">
  </audio>
</div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'

export default {
  name: 'player',
  data () {
    return {

    }
  },
  mounted () {
    const audio = this.$refs.audio
    audio.volume = 0.5
  },
  computed: {
    ...mapGetters([
      'playlist',
      'currentTrack',
      'isPlaying'
    ])
  },
  methods: {
    ...mapActions([
      'play',
      'pause'
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
