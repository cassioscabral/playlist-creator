<template>
  <div class="visual-range-number">
    {{min}} - {{value}} - {{max}}
  </div>
</template>

<style lang="sass" scoped>
.visual-range-number
  min-width: 50px
  border: 1px solid white
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
    value: {
      type: Number,
      required: true
    }
  }
}
</script>
