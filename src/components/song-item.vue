<template>
<div class="song-item">
  <play :song="song"></play>
  <div class="song-name">
    {{song.name}}
  </div>
</div>
</template>

<script>
import Play from './play'

export default {
  name: 'song-item',
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
  },
  components: {
    Play
  }
}
</script>

<style lang="sass" scoped>
.song-item
  display: flex
  align-items: center

.song-name
  margin-left: 5px
</style>
