<template>
  <div class="playlists">
    <header-info>
      <div class="flex a-center space-between w-100">
        <playlist-icon title="playlists"></playlist-icon>
        <span @click="changeName" class="playlist-name">{{currentPlaylist.name}}</span>
        <div class="new-playlist" @click="prompt">
          <plus-circle-icon
          class="icon"
          title="create new playlist"></plus-circle-icon>
        </div>
      </div>
    </header-info>

    <div class="selectors flex-col space-between">
      <div class="flex">
        <multiselect
          deselect-label=""
          :searchable="false"
          v-model="selectedOrder"
          placeholder="Order By"
          :options="orderOptions"
          label="label"
          track-by="value"></multiselect>
      </div>
      <div class="flex sm-vertical-space">
        <multiselect
        deselect-label=""
        :searchable="false"
        v-model="selectedPlaylist"
        placeholder="Playlists"
        :options="playlistsOptions"
        label="label"
        track-by="id"
        :allow-empty="false"
        @input="selectPlaylist"></multiselect>
      </div>
    </div>

    <div class="user-playlist" v-if="playlist.length > 0">
      <tracks 
      @swiped-left="removeFromPlaylist" @select-track="selectTrack" 
      :able-to-swipe-right="false"
      :tracks="playlist">
      </tracks>
    </div>
    <div class="empty-user-playlist" v-else>
      <h3>Your playlist is empty</h3>
    </div>

  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import HeaderInfo from 'components/mobile/header.vue'
import PlaylistIcon from 'vue-material-design-icons/playlist-play.vue'
import PlusCircleIcon from 'vue-material-design-icons/plus-circle-outline.vue'
import Tracks from 'components/generic/tracks'
import Multiselect from 'vue-multiselect'
import { isEmpty } from 'lodash'
export default {
  name: 'playlists-page',
  beforeRouteEnter (to, from, next) {
    next(vm => {
      isEmpty(vm.playlists) ? vm.getUserPlaylists() : null
      vm.playlistSearch = vm.playlistName || ''
      const selectedPlaylist = vm.playlistSpotifyObject
      vm.selectedPlaylist = {id: selectedPlaylist.id, label: selectedPlaylist.name}
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
      playlists: [],
      selectedPlaylist: {},
      selectedOrder: null
    }
  },
  methods: {
    ...mapActions('playlist', [
      'loadPlaylist',
      'addTracksToPlaylist',
      'savePlaylist',
      'createPlaylist',
      'changePlaylistName'
    ]),
    ...mapActions('playlist', {
      removeTrackToPlaylist: 'remove'
    }),
    ...mapActions([
      'getUserPlaylists'
    ]),
    selectTrack (track) {
      // console.log('track', track)
    },
    selectPlaylist (playlistOption) { // comes from el-option value
      const {id: playlistId} = playlistOption
      const playlist = this.userPlaylists.find(p => p.id === playlistId)
      this.loadPlaylist({ playlist })
    },
    prompt () {
      // console.log('prompt')
      this.$prompt('New playlist', '', {
        confirmButtonText: 'OK',
        cancelButtonText: 'Cancel',
        // inputPattern: /[\w!#$%&'*+/=?^_`{|}~-]+(?:\.[\w!#$%&'*+/=?^_`{|}~-]+)*@(?:[\w](?:[\w-]*[\w])?\.)+[\w](?:[\w-]*[\w])?/,
        inputErrorMessage: 'Invalid playlist Name'
      }).then(async (value) => {
        const {value: name} = value
        await this.createPlaylist({name})
        this.$message({
          type: 'success',
          message: 'Playlist ' + value + ' created'
        })
      }).catch(() => {
        // this.$message({
        //   type: 'info',
        //   message: 'Cancelled'
        // })
      })
    },
    removeFromPlaylist (track, e) {
      this.removeTrackToPlaylist({track})
    },
    changeName () {
      this.$prompt('Change this playlist name').then(async ({ value, action }) => {
        console.log('value', value)
        await this.changePlaylistName({name: value})
        this.selectedPlaylist = {id: this.selectedPlaylist.id, label: value}
      })
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
    },
    playlistsOptions () {
      return this.userPlaylists.map(p => ({label: p.name, id: p.id}))
    }
  },
  components: {
    HeaderInfo,
    PlaylistIcon,
    PlusCircleIcon,
    Tracks,
    Multiselect
  }
}
</script>

<style lang="scss" scoped>
.selectors {
  margin: 1.1rem 0.7rem;
}

.empty-user-playlist {
  display: flex;
  justify-content: center;
}
</style>
<style src="vue-multiselect/dist/vue-multiselect.min.css"></style>
