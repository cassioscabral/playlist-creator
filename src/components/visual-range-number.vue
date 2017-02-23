<template>
  <div class="visual-range-number">
    <div :class="`inner ${size}`" :style="{width: widthPercentage}">
    </div>
  </div>
</div>
</template>

<style lang="sass" scoped>
.visual-range-number
  min-width: 50px
  border: 1px solid #6f6f6f
  .inner
    background-color: #29C45B
    &.small
      height: 12px
    &.large
      height: 20px
</style>

<script>
export default {
  name: 'visual-range-number',
  props: {
    min: {
      type: Number,
      default () {
        return 0
      }
    },
    max: {
      type: Number,
      default () {
        return 1
      }
    },
    size: {
      type: String,
      default: 'small'
    },
    value: {
      type: Number,
      required: true
    }
  },
  computed: {
    widthPercentage () {
      let percentage = (this.value / this.max) * 100
      console.log(percentage)
      return `${percentage}%`
    }
  }
}
</script>
