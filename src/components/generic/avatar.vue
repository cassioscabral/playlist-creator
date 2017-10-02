<template>
<div class="avatar">
  <img :src="image()" :alt="alt">
</div>
</template>

<script>
  export default {
    name: 'avatar',
    props: {
      alt: {
        type: String,
        default () {
          return 'avatar image'
        }
      },
      images: {
        type: [Array, String],
        required: true
      }
    },
    methods: {
      image (index = -1) {
        if (index === -1) {
          if (this.images.length > 2) {
            return this.images[this.images.length - 2].url // better resolution
          }
          return this.images[this.images.length - 1].url
        }
        return this.images[index].url
      }
    }
  }
</script>


<style lang="scss" scoped>
.avatar {
  display: flex;
  align-items: center;
  img {
    border-radius: 50%;
    width: 38px;
    height: 38px;
  }
}
</style>
