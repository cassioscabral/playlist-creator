<template>
  <div class="search">
    <div class="artist-search">
      <input
      type="text"
      v-model="artistSearchInput"
      class="artist-input input"
      :placeholder="searchingGenres ? 'genre' : 'artist'"
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
            <div class="right" v-if="index < maximumShortcut">
              Alt + {{index + 1}}
            </div>
          </div>
        </li>
      </ul>
      <input class="checkbox clickable" type="checkbox" v-model="searchingGenres">
      <span v-show="artistSearchInput.length > 0">genre</span>
      </input>
    </div>
  </div>
</template>

<script>
import spotifyApi from '../loaders/spotifyApi'

export default {
  name: 'search',
  data () {
    return {
      artistSearchInput: '',
      searchResult: [],
      isSearching: false,
      maximumShortcut: 5,
      searchingGenres: false
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
        this.isSearching = true
        let searchInput = this.searchingGenres ? `genre:${this.artistSearchInput.replace(' ', '+')}` : this.artistSearchInput
        spotifyApi.searchArtists(searchInput, {limit: 10})
        .then(data => { this.searchResult = data.artists.items })
        .catch(err => { console.error(err) })
      } else {
        this.isSearching = false
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
  transition: all 0.5s ease-in-out
  .result-item
    opacity: 0
    font-size: 0
  &.is-active
    opacity: 1
    height: auto
    visibility: visible
  .result-item
    display: flex
    list-style: none
    padding: 4px 0
    opacity: 1
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

</style>
