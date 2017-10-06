<template>
  <div class="home">
    <div class="albums flex">
      <album class=""
        v-for="album in albums"
        :album="album"
        :key="album.id"
      ></album>
    </div>

    <div class="tracks">
      <header class="flex" v-show="selectedAlbumTracks.length > 0">
        <span class="title">Title</span>
        <div class="duration"><clock-icon title="duration"></clock-icon></div>
      </header>
      <div class="tracks-wrapper">
        <trackc
        v-for="track in selectedAlbumTracks"
        :key="track.id"
        @select-track="changeTrack"
        :track="track"></trackc>
      </div>
    </div>
    <a-player @change="changeMusic" mutex autoplay :music="currentTrack" ref="player"></a-player>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import Album from 'components/generic/album'
import Trackc from 'components/generic/track'
import ClockIcon from 'vue-material-design-icons/clock.vue'
// import VueAplayer from 'vue-aplayer/src/vue-aplayer'
import VueAplayer from 'vue-aplayer'

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
    ])
  },
  components: {
    Album,
    Trackc,
    ClockIcon,
    'a-player': VueAplayer
  }
}
</script>

<style lang="scss" scoped>
.albums {
  overflow: auto;
}
.tracks {
  padding: 0 1rem;
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
