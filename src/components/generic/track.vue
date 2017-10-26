<template>
  <v-touch class="track clickable" ref="hammer" @doubletap="emitDoubleTap" @click="emitTrack" click.native="emitTrack" @swipeleft="swipeLeft" @swiperight="swipeRight">
    <div class="flex track-wrapper" :class="{'swiped-left': swipedLeft, 'swiped-right': swipedRight}">
      <div class="flex-col">
        <div class="track-name">
          <span class="name">{{track.name}}</span>
        </div>
        <div class="track-artist flex">
          <check-icon :style="{color: 'blue'}" v-if="addedToCurrentPlaylist" title="Added"></check-icon>
          <span class="artist-and-duration">{{get(track, 'artists[0].name')}} {{albumName ? '•' : ''}} {{albumName}}</span>
        </div>
      </div>

      <div class="flex track-duration">
        {{msToTime(track.duration_ms)}}
      </div>
    </div>
  </v-touch>
</template>

<script>
// @click="emitTrack" @click.native="emitTrack"
import {msToTime} from 'src/utils'
import {get} from 'lodash'
import CheckIcon from 'vue-material-design-icons/check.vue'

export default {
  name: 'track',
  props: {
    track: {
      type: Object,
      required: true
    },
    addedToCurrentPlaylist: {
      type: Boolean,
      default () {
        return false
      }
    }
  },
  data () {
    return {
      swipedLeft: false,
      swipedRight: false
    }
  },
  methods: {
    get,
    msToTime,
    emitTrack () {
      console.log('emitTrack')
      this.$emit('select-track', {...this.track})
    },
    emitDoubleTap (e) {
      console.log('emitDoubleTap')

      this.$emit('doubletap', {...this.track})
    },
    swipeLeft () {
      console.log('swipeleft')
      this.swipedLeft = true
    },
    swipeRight () {
      console.log('swipeRight')
      this.swipedRight = true
    }
  },
  mounted () {
    // const vt = this.$refs.hammer
    // const tap = vt.recognizers['tap']
    // const doubleTap = vt.recognizers['doubletap']

    // doubleTap.recognizeWith(tap)
    // tap.requireFailure(doubleTap)
    // vt.recognizers['tap'].requireFailure(vt.recognizers['doubletap'])
  },
  computed: {
    albumName () {
      return get(this.track, 'album.name')
    }
  },
  components: {
    CheckIcon
  }
}
</script>

<style lang="scss" scoped>
@import 'src/assets/colors';

.track {
  display: flex;
  position: relative;
  justify-content: space-between;
  font-size: 1rem;
  align-items: center;
  background-color: white;
  .track-wrapper {
    justify-content: space-between;
    flex-grow: 1;
    padding: 0.8rem 0.6rem 0.8rem 0.3rem;
    align-items: center;
    position: relative;
    &.swiped-left {
      left: -60px;
      background-color: #ff3f3f;
    }
    &.swiped-right {
      left: 60px;
      background-color: #09aa09;
    }
  }

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
