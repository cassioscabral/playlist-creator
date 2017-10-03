<template>
  <div class="track clickable">
    <div class="track-name">
      {{track.name}}
    </div>
    <div class="track-duration">
      {{msToTime(track.duration_ms)}}
    </div>
  </div>
</template>

<script>
import {msToTime} from 'src/utils'

export default {
  name: 'track',
  props: {
    track: {
      type: Object,
      required: true
    }
  },
  methods: {
    msToTime
  }
}
</script>

<style lang="scss" scoped>
.track {
  display: flex;
  padding-bottom: 0.4rem;
  justify-content: space-between;
  &:first-child {
    margin-top: 1.4rem;
  }
  &:not(:last-child) {
    border-bottom: 1px solid grey;
    margin-bottom: 1.4rem;
  }
}
</style>
