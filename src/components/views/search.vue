<template>
  <div class="search">
    <el-input class="sm-vertical-space" placeholder="Search" v-model="input">
      <i slot="prefix" class="el-input__icon el-icon-search"></i>
    </el-input>

    <div class="search-results">
      <div class="search-result clickable sm-vertical-space"
        v-for="artist in searchResult"
        :key="artist.id"
        @click="selectArtist({artist})">

        <img class="artist-image" v-if="artist && artist.images && artist.images[1]" :src="artist.images[artist.images.length - 1].url" :alt="artist.name">
        <span class="artist-name">{{artist.name}}</span>
      </div>
    </div>
  </div>
</template>

<script>
// import { store } from 'src/stores'
import { mapActions, mapGetters } from 'vuex'
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
  methods: {
    ...mapActions('application', [
      'selectArtist'
    ])
  },
  computed: {
    ...mapGetters([
      'accessToken',
      'currentUser'
    ])
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

.search-result {
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid #f3f1f1;
  padding: 0.8rem 0;
}
</style>
