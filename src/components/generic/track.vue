<template>
  <div class="track clickable" @click="emitTrack">
    <div class="flex-col">
      <div class="track-name">
        {{track.name}}
      </div>
      <div class="track-artist">
        {{get(track, 'artists[0].name')}} {{albumName ? '•' : ''}} {{albumName}}
      </div>
    </div>

    <div class="track-duration">
      {{msToTime(track.duration_ms)}}
    </div>
  </div>
</template>

<script>
import {msToTime} from 'src/utils'
import {get} from 'lodash'
export default {
  name: 'track',
  props: {
    track: {
      type: Object,
      required: true
    }
  },
  methods: {
    get,
    msToTime,
    emitTrack () {
      this.$emit('select-track', {...this.track})
    }
  },
  computed: {
    albumName () {
      return get(this.track, 'album.name')
    }
  }
}
</script>

<style lang="scss" scoped>
@import 'src/assets/colors';

.track {
  display: flex;
  padding: 0.8rem 0.6rem 0.8rem 0.3rem;
  justify-content: space-between;
  font-size: 1rem;
  align-items: center;
  &:first-child {
  }
  &:not(:last-child) {
    border-bottom: 1px solid $base-gray;
  }
  .track-artist {
    font-size: 0.75rem;
  }
  .track-name {
    margin-bottom: 0.5rem;
  }
  .track-duration {
    font-size: 0.75rem;
  }
}
</style>
