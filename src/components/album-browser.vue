<template>
<div
  class="album-browser column"
  ref="albums"
  v-if="albums.length > 0">
    <div
      v-for="album in albums"
      class="album clickable"
      @click="selectAlbum(album)">
      <img v-if="album.images.length > 0" class="image" :src="album.images[1].url" :alt="album.name">{{album.name}} {{numberOfSongsInThisAlbum(album)}}
    </div>
</div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'album-browser',
  props: {
    albums: {
      type: Array
    }
  },
  data () {
    return {
    }
  },
  methods: {
    selectAlbum (album) {
      this.$emit('select-album', album)
    },
    numberOfSongsInThisAlbum (album) {
      if (!album) return ''
      console.log('playlist', this.playlist)
      const total = this.playlist.reduce((total, track) => track.album && (track.album.id === album.id) ? total + 1 : total, 0)
      console.group(album.name)
      console.log('album', total, album)
      console.groupEnd(album.name)
      return total === 0 ? '' : `(${total})`
    },
    // Deprecated, used for horizontal scrooling
    mousewheel (e) {
      const {deltaY} = e

      this.$refs.albums.scrollLeft -= deltaY / 5
    }
  },
  computed: {
    ...mapGetters([
      'playlist'
    ])
  }
}
</script>

<style lang="sass">
.album-browser
  display: flex
  width: 100%
  max-height: 400px
  overflow-x: scroll
  flex-wrap: wrap
.album
  display: flex
  align-items: center
  font-size: 1.3rem
  margin-bottom: 0.5rem
  margin-right: 1.2rem
  &:last-child
    margin-bottom: 0
    margin-right: 0
  img
    margin-right: 5px

</style>
