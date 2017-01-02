<template>
  <div class="search">
    <div class="artist-search">
      <input
      type="text"
      v-model="artistSearchInput"
      class="artist-input input"
      placeholder="artist"
      autofocus
      @focus="isSearching = true"
      @keyup.alt.49="selectItemWithKey"
      @keyup.alt.50="selectItemWithKey"
      @keyup.alt.51="selectItemWithKey"
      @keyup.alt.52="selectItemWithKey"
      @keyup.alt.53="selectItemWithKey"
      @keyup.meta.49="selectItemWithKey"
      @keyup.meta.50="selectItemWithKey"
      @keyup.meta.51="selectItemWithKey"
      @keyup.meta.52="selectItemWithKey"
      @keyup.meta.53="selectItemWithKey">
      <!-- list results -->
      <ul class="list-results"
        :class="{'is-active': isSearching}">
        <li
          class="result-item"
          @click="selectResult(result)"
          @keyup.enter="selectResult(result)"
          @keyup.space="selectResult(result)"
          v-for="(result, index) in searchResult"
          :ref="`item${index}`"
          :tabindex="0">
          <div class="square-preview" v-if="result && result.images && result.images[1]">
            <img :src="result.images[1].url" alt="">
          </div>
          <div class="name">
            <div class="left">
              {{result.name}}
            </div>
            <div class="right">
              Alt + {{index + 1}}
            </div>
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
      searchResult: [],
      isSearching: false
    }
  },
  methods: {
    // artist or genre
    selectResult (item, type = 'artist') {
      this.$emit(`selected-${type}`, item)
      this.isSearching = false
    },
    selectItemWithKey (e) {
      const {keyCode} = e
      // codes 49 to 54 represent 1 to 5
      if (keyCode > 48 || keyCode < 55) {
        this.selectResult(this.searchResult[keyCode - 49])
      }
    }
  },
  watch: {
    artistSearchInput () {
      if (this.artistSearchInput.length > 0) {
        spotifyApi.searchArtists(this.artistSearchInput, {limit: 5})
        .then(data => { this.searchResult = data.artists.items })
        .catch(err => { console.log(err) })
      }
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
  opacity: 0
  height: 0
  visibility: hidden
  margin: 0
  display: flex
  padding: 0
  flex-direction: column
  justify-content: space-between
  &.is-active
    opacity: 1
    height: auto
    visibility: visible
  .result-item
    display: flex
    list-style: none
    padding: 4px 0
    font-size: $font-size
    cursor: pointer
    border-bottom: 1px solid #d9d9d9
    .name
      display: flex
      justify-content: space-between
      align-items: center
      width: 100%
    .square-preview img
      width: 38px
      height: 38px
      margin-right: 10px
    &:hover
      background: #afc3d5
    &:focus
      background: #afc3d5

.input
  height: 3rem
  font-size: $font-size
  padding: 2px 0 2px 6px

// .artist-input
//   &:focus ~ .list-results,
//   &:active ~ .list-results
//     opacity: 1
//     height: auto
//     visibility: visible
</style>
