<template>
<div class="artist-info" v-if="selectedArtist.id">
  <div class="row current-artist vertical-space">
    <div class="column">
      <div class="text vertical-space">
        {{selectedArtist.name}}
      </div>
      <img class="image" :src="selectedArtist.images[1].url" :alt="selectedArtist.name">
    </div>

    <div class="top-songs column limit-height" v-if="topTracks.length > 0">
      <div class="text vertical-space">
        Top Songs
      </div>
      <song-list
        :songs="topTracks">
      </song-list>
    </div>
  </div>
  <div class="vertical-space text">Related with {{selectedArtist.name}}</div>
  <!-- Could be reused on album-browser  -->
  <div class="related-artists media-wrapper column">

    <div
      v-for="artist in relatedArtists"
      class="artist media clickable"
      @click="selectArtist(artist)">
      <img class="image circle" :src="artist.images[1].url" :alt="artist.name">
      {{artist.name}}
    </div>
  </div>
</div>
</template>

<script>
import SongList from './song-list'

export default {
  name: 'artist-info',
  props: {
    selectedArtist: {
      type: Object
    },
    relatedArtists: {
      type: Array
    },
    topTracks: {
      type: Array
    }
  },
  data () {
    return {

    }
  },
  methods: {
    selectArtist (artist) {
      this.$emit('select-artist', artist)
    }
  },
  components: {
    SongList
  }
}
</script>

<style lang="sass">
.related-artists
  display: flex
  flex-wrap: wrap
  overflow: auto
  border-bottom: 1px solid black

.current-artist
  justify-content: space-between

</style>
