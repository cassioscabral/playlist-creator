<template>
  <div class="playlists">
    <header-info>
      <div class="flex a-center space-between w-100">
        <playlist-icon title="playlists"></playlist-icon>
        <span class="playlist-name">{{currentPlaylist.name}}</span>
        <plus-circle-icon class="icon" title="create new playlist"></plus-circle-icon>
      </div>
    </header-info>

    <div class="selectors flex space-between">

      <el-select v-model="orderBy" size="mini" clearable placeholder="Order by">
        <el-option
          v-for="(option, index) in orderOptions"
          :key="index"
          :label="option.label"
          :value="option.value">
        </el-option>
      </el-select>

      <el-select v-model="playlistSearch" no-data-text="Empty" size="mini" filterable placeholder="Playlists" @change="selectPlaylist">
        <el-option
          v-for="playlist in userPlaylists"
          :key="playlist.id"
          :label="playlist.name"
          :value="playlist.id">
        </el-option>
      </el-select>

    </div>

    <div class="user-playlist" v-if="playlist.length > 0">
      <tracks show-artist @select-track="selectTrack" :tracks="playlist">
      </tracks>
    </div>

  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import HeaderInfo from 'components/mobile/header.vue'
import PlaylistIcon from 'vue-material-design-icons/playlist-play.vue'
import PlusCircleIcon from 'vue-material-design-icons/plus-circle-outline.vue'
import Tracks from 'components/generic/tracks'

export default {
  name: 'playlists-page',
  beforeRouteEnter (to, from, next) {
    next(vm => {
      vm.getUserPlaylists()
      vm.playlistSearch = vm.playlistName || ''
    })
  },
  data () {
    return {
      orderBy: '',
      playlistSearch: '',
      orderOptions: [
        {
          label: 'BPM',
          value: 'BPM'
        }
      ],
      playlists: []
    }
  },
  methods: {
    ...mapActions('playlist', [
      'loadPlaylist',
      'addTracksToPlaylist',
      'savePlaylist'
    ]),
    ...mapActions([
      'getUserPlaylists'
    ]),
    selectTrack (track) {
      console.log('track', track)
    },
    selectPlaylist (playlistId) { // comes from el-option value
      const playlist = this.userPlaylists.find(p => p.id === playlistId)
      this.loadPlaylist({ playlist })
    }
  },
  computed: {
    ...mapGetters('playlist', [
      'playlist',
      'playlistName',
      'playlistSpotifyObject'
    ]),
    ...mapGetters([
      'userPlaylists'
    ]),
    currentPlaylist () {
      return this.playlistSpotifyObject
    }
  },
  components: {
    HeaderInfo,
    PlaylistIcon,
    PlusCircleIcon,
    Tracks
  }
}
</script>

<style lang="scss" scoped>
.selectors {
  margin: 1.1rem 0.7rem;
}
</style>
