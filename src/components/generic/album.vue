<template>
  <div class="album" @click="selectAlbum({ album })">
    <div class="album-cover">
      <img :src="get(album, 'images[1].url')" alt="">
    </div>
    <div class="album-name">
      {{shortenedName}}
    </div>
  </div>
</template>

<script>
import { mapActions } from 'vuex'
import { truncate, get } from 'lodash'
export default {
  name: 'album',
  props: {
    album: {
      type: Object,
      required: true
    }
  },
  methods: {
    get,
    ...mapActions('application', [
      'selectAlbum'
    ])
  },
  computed: {
    shortenedName () {
      return truncate(this.album.name, {
        'length': 23,
        'separator': '...'
      })
    }
  }
}
</script>

<style lang="scss" scoped>
$album-size: 130px;

.album {
  display: flex;
  flex-direction: column;
  margin: 0.5rem;
  &:first-child {
  }
  .album-cover {
    img {
      width: $album-size;
      height: $album-size;
    }
  }
}
</style>
