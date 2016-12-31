<template>
<div class="song-item">
  <play :song="song"></play>
  <add-to-playlist :song="song"></add-to-playlist>
  <div class="song-name">
    {{song.name}}
  </div>
</div>
</template>

<script>
import Play from './play'
import AddToPlaylist from './add-to-playlist'

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
    Play,
    AddToPlaylist
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
