<template>
  <div class="home">
    <!-- Greeting message -->
    <div class="text-h5 pa-3" v-if="currentUser">
      Hi
      {{ currentUser.display_name && currentUser.display_name.split(' ')[0] }},
      welcome back!
    </div>
    <!-- Search field -->
    <v-text-field
      dark
      color="secondary"
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
    <v-list v-if="selectedAlbumTracks" two-line>
      <v-list-item-group
        v-model="selectedTracks"
        multiple
        active-class="primary"
      >
        <template v-for="(track, index) in selectedAlbumTracks">
          <v-list-item
            :value="track"
            :key="track.id"
            @click="clickTrackHandler(track)"
          >
            <template v-slot:default="{ active }">
              <v-list-item-content>
                <v-list-item-title v-text="track.name"></v-list-item-title>
                <v-list-item-subtitle
                  class="text--primary"
                  v-text="get(track, 'album.name')"
                ></v-list-item-subtitle>
                <v-list-item-subtitle
                  v-text="get(track, 'artists[0].name')"
                ></v-list-item-subtitle>
              </v-list-item-content>

              <v-list-item-action>
                <v-list-item-action-text
                  v-text="msToTime(track.duration_ms)"
                ></v-list-item-action-text>
                <v-icon v-if="!active" color="accent">
                  mdi-check-box
                </v-icon>

                <v-icon v-else color="success">
                  mdi-check-box-outline
                </v-icon>
              </v-list-item-action>
            </template>
          </v-list-item>

          <v-divider
            v-if="index + 1 < selectedAlbumTracks.length"
            :key="index"
          ></v-divider>
        </template>
      </v-list-item-group>
    </v-list>
  </div>
</template>

<script>
import { searchArtists } from '../services/spotify-service'
import get from 'lodash/get'
import debounce from 'lodash/debounce'
import { mapGetters, mapActions } from 'vuex'
import { msToTime } from '../utils'

export default {
  name: 'Home',
  components: {},
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
