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
      <header class="flex">
        <span class="title">Title</span>
        <div class="duration">Duration</div>
      </header>
      <trackc
        v-for="track in selectedAlbumTracks"
        :key="track.id"
        :track="track"></trackc>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import Album from 'components/generic/album'
import Trackc from 'components/generic/track'
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
    Trackc
  }
}
</script>

<style lang="scss" scoped>
.albums {
  overflow: auto;
}
.tracks {
  overflow: auto;
  max-height: 35vh;
  header {
    margin-bottom: 1rem;
    justify-content: space-between;
    border-bottom: 1px solid grey;
  }
}
</style>
