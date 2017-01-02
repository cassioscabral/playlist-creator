<template>
<div class="song-item sm-vertical-space">
  <play :song="song" class="mr-5"></play>
  <add-to-playlist class="mr-5" :song="song"></add-to-playlist>
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
  border-bottom: 1px solid rgba(#2c3e50, 0.82)
  padding-bottom: 2px
  &:last-child
    border-bottom: none

.song-name
  margin-left: 5px
  font-size: 1.2rem
</style>
