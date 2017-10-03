<template>
  <div class="search">
    <el-input class="" placeholder="Search" v-model="input">
      <i slot="prefix" class="el-input__icon el-icon-search"></i>
    </el-input>

    <div class="search-results" v-show="input.length > 0">
      <div class="search-result clickable"
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
import { get, throttle } from 'lodash'

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
    input: throttle(async (search) => {
      try {
        if (search.length > 0) {
          const result = await searchArtists(search)
          this.searchResult = get(result, 'artists.items')
        }
      } catch (error) {
        console.error(error)
      }
    }, 700)
  }
}
</script>

<style lang="scss" scoped>
@import 'src/assets/colors';

.artist-image {
  width: 38px;
  height: 38px;
  border-radius: 50%;
}

.search-results {
  overflow: auto;
}

.search-result {
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid $base-gray;
  padding: 0.4rem 0.5rem;
  &:last-child {
    border: none;
  }
}
</style>
