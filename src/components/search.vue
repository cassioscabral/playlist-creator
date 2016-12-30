<template>
  <div class="search">
    <div class="artist-search">
      <input type="text" v-model="artistSearchInput" class="input" placeholder="artist" autofocus>
      <!-- list results -->
      <ul class="list-results">
        <li
          class="result-item"
          @click="selectResult(result)"
          v-for="result in searchResult">
          <div class="square-preview" v-if="result && result.images && result.images[0]">
            <img :src="result.images[0].url" alt="">
          </div>
          <div class="name">
            {{result.name}}
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
const SpotifyApi = require('spotify-web-api-js')

const spotifyApi = new SpotifyApi()

export default {
  name: 'search',
  data () {
    return {
      artistSearchInput: '',
      searchResult: []
    }
  },
  methods: {
    // artist or genre
    selectResult (item, type = 'artist') {
      console.log(`selected ${type}`, item)
      this.$emit(`selected-${type}`, item)
    }
  },
  watch: {
    artistSearchInput () {
      console.log('artistSearchInput', this.artistSearchInput)
      spotifyApi.searchArtists(this.artistSearchInput, {limit: 5})
      .then(data => { this.searchResult = data.artists.items })
      .catch(err => { console.log(err) })
    }
  }
}
</script>

<style lang="sass" scoped>
$font-size: 1.7rem
.artist-search
  width: 80%
  display: flex
  flex-direction: column

.search
  display: flex
  justify-content: center

.list-results
  margin: 0
  display: flex
  padding: 0
  flex-direction: column
  justify-content: space-between
  .result-item
    display: flex
    list-style: none
    padding: 4px 0
    font-size: $font-size
    cursor: pointer
    border-bottom: 1px solid #d9d9d9
    .square-preview img
      width: 38px
      height: 38px
      margin-right: 10px
    &:hover
      background: #afc3d5
.input
  height: 3rem
  font-size: $font-size
</style>
