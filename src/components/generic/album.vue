<template>
  <div class="album" @click="selectAlbum({ album })">
    <div class="album-cover">
      <img :src="album.images[1].url" alt="">
    </div>
    <div class="album-name">
      {{album.name}}
    </div>
  </div>
</template>

<script>
import { mapActions } from 'vuex'
export default {
  name: 'album',
  props: {
    album: {
      type: Object,
      required: true
    }
  },
  methods: {
    ...mapActions('application', [
      'selectAlbum'
    ])
  }
}
</script>

<style lang="scss" scoped>
.album {
  display: flex;
  flex-direction: column;
  margin: 1rem;
  .album-cover {
    img {
      width: 150px;
      height: 150px;
    }
  }
}
</style>
