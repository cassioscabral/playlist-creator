<template>
<div class="album-browser column">
    <div
      v-for="album in albums"
      class="album">
      <img :src="album.images[0].url" :alt="album.name">
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
  &:last-child
    margin-bottom: 0
  img
    width: 70px
    height: 70px
    margin-right: 5px

</style>
