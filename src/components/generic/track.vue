<template>
  <div class="track clickable" :class="{'showing-artist': showArtist}" @click="emitTrack">
    <div class="flex-col">
      <div class="track-name">
        {{track.name}}
      </div>
      <div class="track-artist" v-if="showArtist">
        {{get(track, 'artists[0].name')}} • {{get(track, 'album.name')}}
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
    },
    showArtist: {
      type: Boolean,
      default () {
        return false
      }
    }
  },
  methods: {
    get,
    msToTime,
    emitTrack () {
      this.$emit('select-track', {...this.track})
    }
  }
}
</script>

<style lang="scss" scoped>
@import 'src/assets/colors';

.track {
  display: flex;
  padding-bottom: 0.4rem;
  justify-content: space-between;
  font-size: 1.2rem;
  &:first-child {
    margin-top: 1.4rem;
  }
  &:not(:last-child) {
    border-bottom: 1px solid $base-gray;
    margin-bottom: 1rem;
  }
  &.showing-artist {
    font-size: 0.9rem;
    .track-artist {
      font-size: 0.75rem;
    }
    .track-name {
      margin-bottom: 0.5rem;
    }
  }
}
</style>
