<template>
  <div class="search">
    <header-info></header-info>

    <input id="search-input" type="text" v-model="input">

    <div class="search-results" v-show="input.length > 0">
      <div class="search-result clickable"
        v-for="artist in searchResult"
        v-if="artist && artist.images && artist.images[1]"
        :key="artist.id"
        @click="selectArtist({artist}) && $router.push('/') ">

        <img class="artist-image" :src="artist.images[artist.images.length - 1].url" :alt="artist.name">
        <span class="artist-name">{{artist.name}}</span>
      </div>
    </div>
  </div>
</template>

<script>
import HeaderInfo from 'components/mobile/header.vue'
// import { store } from 'src/stores'
import { mapActions, mapGetters } from 'vuex'
import {
  searchArtists
} from 'src/core/spotify-service'
import { get, debounce } from 'lodash'

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
    ]),
    getSearchResults: debounce(async function (search) {
      try {
        if (search.length > 0) {
          const result = await searchArtists(search)
          this.searchResult = get(result, 'artists.items')
        }
      } catch (error) {
        console.error(error)
      }
    }, 300)
  },
  computed: {
    ...mapGetters([
      'accessToken',
      'currentUser'
    ])
  },
  watch: {
    input (newSearch) {
      this.getSearchResults(newSearch)
    }
    // input: function () {
    //   return debounce(async (search) => {
    //     try {
    //       if (search.length > 0) {
    //         const result = await searchArtists(search)
    //         this.searchResult = get(result, 'artists.items')
    //       }
    //     } catch (error) {
    //       if (Number(error.status) === 401) {
    //         console.log('401')
    //       }
    //       console.error(error)
    //     }
    //   }, 200)
    // }
  },
  components: {
    HeaderInfo
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
  overflow-y: scroll; // has to be scroll, not auto
  -webkit-overflow-scrolling: touch;
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

#search-input {
  width: 97%;
  border: 1px solid #cccaca;
  height: 30px;
  font-size: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0.3rem;
  border-radius: 4px;
  margin: 0.4rem 0.2rem 1rem 0.2rem;
}
</style>
