<template>
  <div class="play" @click="toggle">{{isPlaying ? '❚❚' : '►'}}
    <audio
      ref="audio"
      v-if="song.preview_url"
      :src="song.preview_url">
    </audio>
  </div>
</template>

<script>
export default {
  name: 'play',
  props: {
    song: {
      type: Object
    }
  },
  data () {
    return {
      isPlaying: false
    }
  },
  methods: {
    toggle () {
      this.isPlaying = !this.isPlaying
      const audio = this.$refs.audio
      if (audio.paused) {
        audio.play()
      } else {
        audio.pause()
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
