<template>
<div class="artist-info" v-if="selectedArtist.id">
  <div class="row current-artist vertical-space">
    <div class="column">
      <img class="image" :src="selectedArtist.images[1].url" :alt="selectedArtist.name">
      <div class="text vertical-space">
        <span class="clickable" @click="unselectGenre">{{selectedArtist.name}}</span>
        <div class="genres">
          <span
            class="genre clickable"
            v-for="genre in selectedArtist.genres"
            @click="selectGenre(genre)">
            {{genre}}
          </span>
        </div>
      </div>
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
  <div class="vertical-space text">

    <span v-if="selectedGenre">
      <span class="clickable" @click="unselectGenre">{{selectedArtist.name}}</span> > {{selectedGenre}}
    </span>
    <span v-else>Related with {{selectedArtist.name}}</span>

  </div>
  <!-- Could be reused on album-browser  -->
  <div class="related-artists media-wrapper column">

    <div
      v-for="artist in relatedArtists"
      class="artist media clickable"
      v-show="!selectedGenre"
      @click="selectArtist(artist)">
      <img class="image circle" :src="artist.images[1].url" :alt="artist.name">
      {{artist.name}}
    </div>

    <div
      v-if="selectedGenre"
      v-for="artist in genreResults"
      class="artist media clickable"
      @click="selectArtist(artist)">
      <img class="image circle" :src="artist.images[1].url" :alt="artist.name">
      {{artist.name}}
    </div>


  </div>
</div>
</template>

<script>
import spotifyApi from '../loaders/spotifyApi'
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
      selectedGenre: null, // reset when selectedArtist changes
      genreResults: []
    }
  },
  methods: {
    selectArtist (artist) {
      this.$emit('select-artist', artist)
    },
    async selectGenre (genre) {
      this.selectedGenre = genre
      let {artists} = await spotifyApi.searchArtists(`genre:${genre.replace(' ', '+')}`)
      this.genreResults = artists.items
    },
    unselectGenre () {
      this.selectedGenre = null
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

.genres
  display: flex
  align-items: center
.genre
  border-radius: 16px
  background-color: #84bd00
  color: #000
  padding: 0 1rem
  margin: 0.3rem
</style>
