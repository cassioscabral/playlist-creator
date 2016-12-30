<template>
  <div class="search">
    <div class="artist-search">
      <input type="text" v-model="artistSearchInput" class="input" placeholder="artist">
      <!-- list results -->
      <ul class="list-results">
        <li
          class="result-item"
          @click="selectResult(result)"
          v-for="result in searchResult">
          {{result}}
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
export default {
  name: 'search',
  data () {
    return {
      artistSearchInput: '',
      searchResult: ['rihanna', 'elvis', 'hammock']
    }
  },
  methods: {
    // artist or genre
    selectResult (item, type = 'artist') {
      console.log(`selected ${type}`, item)
      this.$emit(`selected-${type}`, item)
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
    list-style: none
    padding: 4px 0
    font-size: $font-size
    cursor: pointer
    border-bottom: 1px solid #d9d9d9
    &:hover
      background: #afc3d5
.input
  height: 3rem
  font-size: $font-size
</style>
