<template>
  <div class="search">
    <el-input placeholder="Search" v-model="input">
      <i slot="prefix" class="el-input__icon el-icon-search"></i>
    </el-input>

    <div class="search-results">
      <div class="searh-result" v-for="item in searchResult" :key="item.id">

        <img class="artist-image" :src="item.images[1].url" alt="">
         {{item.name}}
      </div>
    </div>
  </div>
</template>

<script>
import {
  searchArtists
} from 'src/core/spotify-service'
import { get } from 'lodash'

export default {
  name: 'search-page',
  data () {
    return {
      input: '',
      searchResult: []
    }
  },
  watch: {
    async input (search) {
      try {
        if (search.length > 0) {
          const result = await searchArtists(search)
          this.searchResult = get(result, 'artists.items')
        }
      } catch (error) {
        console.error(error)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.artist-image {
  width: 38px;
  height: 38px;
  border-radius: 50%;
}
</style>
