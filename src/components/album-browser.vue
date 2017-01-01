<template>
<div class="album-browser column" v-if="albums.length > 0">
    <div
      v-for="album in albums"
      class="album clickable"
      @click="selectAlbum(album)">
      <img v-if="album.images.length > 0" class="image" :src="album.images[1].url" :alt="album.name">
      {{album.name}}
    </div>
</div>
</template>

<script>
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
    }
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
