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

    <tracks v-show="selectedAlbumTracks.length > 0" show-artist @select-track="changeTrack" :tracks="selectedAlbumTracks">
    </tracks>

    <a-player mode="order" v-show="hasAlbumSelected && hasTrackSelected" @change="changeMusic" mutex autoplay :music="currentTrack" ref="player"></a-player>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import Album from 'components/generic/album'
import HeaderInfo from 'components/mobile/header.vue'
import Tracks from 'components/generic/tracks'
// import VueAplayer from 'vue-aplayer/src/vue-aplayer'
import VueAplayer from 'vue-aplayer'
import { isEmpty } from 'lodash'

export default {
  name: 'home-page',
  data () {
    return {
      autoplay: true,
      defaultMusic: { // default fallback
        title: 'Preparation',
        author: 'Hans Zimmer/Richard Harvey',
        url: 'http://devtest.qiniudn.com/Preparation.mp3',
        pic: 'http://devtest.qiniudn.com/Preparation.jpg'
      }
    }
  },
  methods: {
    ...mapActions('player', [
      'playTrack'
    ]),
    isEmpty,
    changeTrack (track) {
      let { name: title, preview_url: url } = track
      const author = this.selectedArtist.name
      const albumPicURL = this.selectedAlbum.images[1].url

      try {
        const formattedTrack = {
          title,
          author,
          url,
          pic: albumPicURL || 'http://devtest.qiniudn.com/Preparation.jpg'
        }
        this.playTrack({ track: formattedTrack })
      } catch (e) {
        console.error('error', e)
      }
    },
    changeMusic (music) {
      // console.log('music changed', music)
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
    Tracks,
    'a-player': VueAplayer
  }
}
</script>

<style lang="scss" scoped>
.albums {
  overflow: auto;
}
.tracks {
  .tracks-wrapper {
    overflow: auto;
    max-height: 60vh;
  }
  header {
    align-items: center;
    justify-content: space-between;
    border-bottom: 1px solid grey;
  }
}
</style>
