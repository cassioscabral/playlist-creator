<template>
  <div class="playlists">
    <header-info>
      <div class="flex a-center space-between w-100">
        <playlist-icon title="playlists"></playlist-icon>
        <span class="playlist-name">My Playlist</span>
        <plus-circle-icon title="create new playlist"></plus-circle-icon>
      </div>
    </header-info>

    <div class="flex space-between m-around">

      <el-select v-model="orderBy" size="mini" clearable placeholder="Order by">
        <el-option
          v-for="(option, index) in orderOptions"
          :key="index"
          :label="option.label"
          :value="option.value">
        </el-option>
      </el-select>

      <el-select v-model="playlistSearch" no-data-text="Empty" size="mini" filterable placeholder="Playlists">
        <el-option
          v-for="playlist in userPlaylists"
          :key="playlist.id"
          :label="playlist.name"
          :value="playlist.id">
        </el-option>
      </el-select>

    </div>

    <div class="user-playlists">
    </div>

  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import HeaderInfo from 'components/mobile/header.vue'
import PlaylistIcon from 'vue-material-design-icons/playlist-play.vue'
import PlusCircleIcon from 'vue-material-design-icons/plus-circle-outline.vue'

export default {
  name: 'playlists-page',
  beforeRouteEnter (to, from, next) {
    next(vm => {
      vm.getUserPlaylists()
    })
  },
  data () {
    return {
      playlistSearch: '',
      orderBy: '',
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
    ])
  },
  computed: {
    ...mapGetters('playlist', [
      'playlist',
      'playlistName'
    ]),
    ...mapGetters([
      'userPlaylists'
    ])
  },
  components: {
    HeaderInfo,
    PlaylistIcon,
    PlusCircleIcon
  }
}
</script>

<style lang="scss" scoped>

</style>
