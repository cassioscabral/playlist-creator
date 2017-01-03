<template>
<div class="song-list">
  <div class="features-info row" v-if="showFeatures">
    <div class="actions">
      Actions
    </div>
    <div class="name">
      Name
    </div>
    <div class="artist">
      Artist
    </div>
    <div class="duration">
      Duration
    </div>
    <div class="happiness">
      Happiness
    </div>
    <div class="instrumentalness">
      Instrumentalness
    </div>
    <div class="energy">
      Energy
    </div>
    <div class="speechiness">
      Speechiness
    </div>
    <div class="tempo">
      Tempo
    </div>

  </div>
  <song-item
    v-for="song in songs"
    :song="song"
    :show-features="showFeatures">
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
    },
    showFeatures: {
      type: Boolean,
      default () {
        return false
      }
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

<style lang="sass">
.features-info
  display: flex
  align-items: center
  & > *
    display: flex
    margin: 0 0.3rem
</style>
