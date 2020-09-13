<template>
  <v-container class="playlists pa-0">
    <div class="text-h4 my-3 pa-2">
      Your playlists
    </div>
    <v-select
      dark
      v-model="selectedPlaylist"
      :items="playlistsOptions"
      item-text="label"
      filled
      return-object
      label="Select a playlist"
      @change="selectPlaylist"
    ></v-select>
    <tracks-manager
      :tracks="playlist"
      :clickTrackHandler="clickTrackHandler"
    ></tracks-manager>
  </v-container>
</template>

<script>
import isEmpty from 'lodash/isEmpty'
import { mapGetters, mapActions } from 'vuex'
import TracksManager from '../components/TracksManager.vue'

export default {
  name: 'Playlists',
  components: {
    TracksManager
  },
  beforeRouteEnter(to, from, next) {
    next(vm => {
      isEmpty(vm.playlists) ? vm.getUserPlaylists() : null
      vm.playlistSearch = vm.playlistName || ''
      const selectedPlaylist = vm.playlistSpotifyObject
      vm.selectedPlaylist = {
        id: selectedPlaylist.id,
        label: selectedPlaylist.name
      }
    })
  },
  data() {
    return {
      playlistSearch: '',
      playlists: [],
      selectedPlaylist: {}
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
    ...mapActions(['getUserPlaylists']),
    selectTrack(track) {
      // console.log('track', track)
    },
    selectPlaylist(playlistOption) {
      // comes from el-option value
      console.log('playlistOption', playlistOption)
      const { id: playlistId } = playlistOption
      // TODO normalization option
      const playlist = this.userPlaylists.find(p => p.id === playlistId)
      this.loadPlaylist({ playlist })
    },
    prompt() {
      // console.log('prompt')
      // this.$prompt('New playlist', '', {
      //   confirmButtonText: 'OK',
      //   cancelButtonText: 'Cancel',
      //   // inputPattern: /[\w!#$%&'*+/=?^_`{|}~-]+(?:\.[\w!#$%&'*+/=?^_`{|}~-]+)*@(?:[\w](?:[\w-]*[\w])?\.)+[\w](?:[\w-]*[\w])?/,
      //   inputErrorMessage: 'Invalid playlist Name'
      // })
      //   .then(async value => {
      //     const { value: name } = value
      //     await this.createPlaylist({ name })
      //     this.$message({
      //       type: 'success',
      //       message: 'Playlist ' + value + ' created'
      //     })
      //   })
      //   .catch(() => {
      //     // this.$message({
      //     //   type: 'info',
      //     //   message: 'Cancelled'
      //     // })
      //   })
    },
    removeFromPlaylist(track, e) {
      this.removeTrackToPlaylist({ track })
    },
    changeName() {
      // this.$prompt('Change this playlist name', '', {arr
      //   confirmButtonText: 'OK',
      //   cancelButtonText: 'Cancel',
      //   inputErrorMessage: 'Invalid Playlist Name'
      // }).then(async ({ value, action }) => {
      //   await this.changePlaylistName({ name: value })
      //   this.selectedPlaylist = { id: this.selectedPlaylist.id, label: value }
      //   this.getUserPlaylists()
      // })
    },
    clickTrackHandler(track) {
      console.log('clickTrackHandler track', track)
    }
  },
  computed: {
    ...mapGetters('playlist', [
      'playlist',
      'playlistName',
      'playlistSpotifyObject'
    ]),
    ...mapGetters(['userPlaylists']),
    currentPlaylist() {
      return this.playlistSpotifyObject
    },
    playlistsOptions() {
      return this.userPlaylists.map(p => ({ label: p.name, id: p.id }))
    }
  }
}
</script>

<style lang="scss" scoped></style>
