<template>
<div class="song-list">
  <song-item
    v-for="song in songs"
    :song="song">
  </song-item>
</div>
</template>

<script>
import SongItem from './song-item'

export default {
  name: 'song-list',
  props: {
    songs: {
      type: Array,
      required: true
    }
  },
  data () {
    return {
    }
  },
  components: {
    SongItem
  }
}
</script>

<style lang="css">
</style>
