<template>
  <div class="home">
    <header-info></header-info>
    <div class="albums flex">
      <album class=""
        v-for="album in albums"
        :album="album"
        :key="album.id"
      ></album>
    </div>

    <tracks
      v-show="selectedAlbumTracks.length > 0"
      @doubletap-track="addToPlaylist"
      :auto-change-track="false"
      :tracks="selectedAlbumTracks">
    </tracks>

  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import Album from 'components/generic/album'
import HeaderInfo from 'components/mobile/header.vue'
import Tracks from 'components/generic/tracks'

export default {
  name: 'home-page',
  data () {
    return {
      autoplay: true
    }
  },
  methods: {
    ...mapActions('player', [
      'playTrack'
    ]),
    ...mapActions('playlist', {
      addTrackToPlaylist: 'push',
      removeTrackToPlaylist: 'remove'
    }),
    addToPlaylist (track, e) {
      console.log('add to playlist', track)
      this.addTrackToPlaylist({track})
    }
  },
  computed: {
    ...mapGetters('application', [
      'selectedArtist',
      'albums',
      'selectedAlbum',
      'selectedAlbumTracks'
    ]),
    ...mapGetters('player', [
      'currentTrack'
    ]),
    hasAlbumSelected () {
      return !this.isEmpty(this.selectedAlbum)
    },
    hasTrackSelected () {
      return !this.isEmpty(this.currentTrack)
    }
  },
  components: {
    Album,
    HeaderInfo,
    Tracks
  }
}
</script>

<style lang="scss" scoped>
.albums {
  scroll-behavior: smooth;
  overflow-x: scroll; // has to be scroll, not auto
  -webkit-overflow-scrolling: touch;
}
.tracks {
  .tracks-wrapper {
    overflow-y: scroll; // has to be scroll, not auto
    -webkit-overflow-scrolling: touch;
    // max-height: 60vh;
  }
  header {
    align-items: center;
    justify-content: space-between;
    border-bottom: 1px solid grey;
  }
}
</style>
