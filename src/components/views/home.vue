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
        :track="track"></trackc>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import Album from 'components/generic/album'
import Trackc from 'components/generic/track'
import ClockIcon from 'vue-material-design-icons/clock.vue'

export default {
  name: 'home-page',
  computed: {
    ...mapGetters('application', [
      'selectedArtist',
      'albums',
      'selectedAlbumTracks'
    ])
  },
  components: {
    Album,
    Trackc,
    ClockIcon
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
