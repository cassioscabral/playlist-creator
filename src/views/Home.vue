<template>
  <div class="home">
    <!-- Greeting message TODO this should hide after some time -->
    <div class="text-h5 pa-3" v-if="currentUser">
      Hi
      {{ currentUser.display_name && currentUser.display_name.split(' ')[0] }},
      welcome back!
    </div>
    <!-- Add or Edit Playlist Journey -->
    <v-container>
      <v-row>
        <v-col cols="12" md="6">
          <v-btn class="mx-2" light color="primary">
            <v-icon class="mr-2" dark>mdi-plus</v-icon>
            Create a fresh new playlist
          </v-btn>
        </v-col>
        <v-col cols="12" md="6">
          <v-btn
            class="mx-2"
            color="secondary"
            @click="$router.push({ name: 'playlists' })"
          >
            <v-icon class="mr-2" dark>mdi-format-list-bulleted-square</v-icon>
            Change your playlist
          </v-btn>
        </v-col>
      </v-row>
    </v-container>
    <!-- Search field -->
    <v-text-field
      color="secundary"
      label="Search for an artist..."
      hide-details="auto"
      class="pa-3"
      v-model="search"
    ></v-text-field>
    <!-- Search results -->
    <v-list v-if="search && search.length > 0">
      <v-list-item-group v-model="selectedArtist" @change="selectAnArtist">
        <v-list-item :value="artist" v-for="artist in artists" :key="artist.id">
          <v-list-item-icon>
            <div v-if="artist && artist.images && artist.images[1]">
              <img
                class="artist-image"
                :src="artist.images[artist.images.length - 1].url"
                :alt="artist.name"
              />
            </div>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title v-text="artist.name"></v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list-item-group>
    </v-list>

    <!-- Artist -->
    <v-card v-if="selectedArtist" color="primary">
      <div class="d-flex flex-no-wrap justify-space-between">
        <div>
          <v-card-title
            class="headline"
            v-text="selectedArtist.name"
          ></v-card-title>

          <v-card-subtitle>
            {{ selectedArtist.followers.total }} Followers
          </v-card-subtitle>
        </div>

        <v-avatar class="ma-3" size="120" tile>
          <v-img :src="selectedArtist.images[0].url"></v-img>
        </v-avatar>
      </div>
    </v-card>

    <!-- Albums -->
    <v-slide-group
      v-if="selectedArtist"
      @change="changeAlbum"
      class="albums-collection pa-4"
      mandatory
      center-active
    >
      <v-slide-item
        v-for="album in albums"
        :key="album.id"
        :value="album"
        v-slot:default="{ active, toggle }"
      >
        <v-card
          :color="active ? 'primary' : 'grey lighten-1'"
          class="ma-4"
          height="125"
          width="125"
          @click="toggle"
        >
          <v-row class="fill-height" align="center" justify="center">
            <v-scale-transition>
              <!-- <v-icon
                v-if="active"
                color="white"
                size="48"
                v-text="'mdi-close-circle-outline'"
              ></v-icon> -->
              <v-avatar size="125" tile>
                <v-img :src="album.images[1].url"></v-img>
                <!-- <div class="text-body-2 album-name">
                  {{ album.name }}
                </div> -->
              </v-avatar>
            </v-scale-transition>
          </v-row>
        </v-card>
      </v-slide-item>
    </v-slide-group>

    <!-- Selected Album tracks -->
    <tracks-manager
      :tracks="selectedAlbumTracks"
      :clickTrackHandler="clickTrackHandler"
    ></tracks-manager>
  </div>
</template>

<script>
import { searchArtists } from '../services/spotify-service'
import get from 'lodash/get'
import debounce from 'lodash/debounce'
import { mapGetters, mapActions } from 'vuex'
import { msToTime } from '../utils'
import TracksManager from '../components/TracksManager.vue'

export default {
  name: 'Home',
  components: {
    TracksManager
  },
  data: () => ({
    search: '',
    selectedArtist: null,
    artists: [],
    selectedTracks: []
  }),
  computed: {
    ...mapGetters('application', [
      'albums',
      'selectedAlbum',
      'selectedAlbumTracks'
    ]),
    ...mapGetters(['currentUser'])
  },
  methods: {
    ...mapActions('application', ['selectArtist', 'selectAlbum']),
    ...mapActions('player', ['playTrack']),
    getSearchResults: debounce(async function(search) {
      try {
        if (search.length > 0) {
          const result = await searchArtists(search)
          this.artists = get(result, 'artists.items')
        }
      } catch (error) {
        console.error(error)
      }
    }, 300),
    selectAnArtist(artist) {
      this.selectArtist({ artist })
    },
    changeAlbum(album) {
      this.selectAlbum({ album })
      this.search = ''
    },
    clickTrackHandler(track) {
      this.playTrack({ track })
    },
    msToTime,
    get
  },
  watch: {
    search(newSearch) {
      this.getSearchResults(newSearch)
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
.albums-collection {
  // Dark Primary color. TODO use vuetify color directly
  background-color: #191414;
}
</style>
