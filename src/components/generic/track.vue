<template>
  <v-touch class="track clickable" ref="hammer" @click="emitTrack" @click.native="emitTrack" @panright="panningRight"  @panleft="panningLeft" @swipeleft="swipeLeft" @swiperight="swipeRight" @panend="panend">
    <div class="flex track-wrapper animated" :class="{'slideInLeft': swipedLeft, 'slideInRight': swipedRight}" :style="{left: panPosition}">
      <div class="flex-col">
        <div class="track-name">
          <span class="name">{{track.name}}</span>
        </div>
        <div class="track-artist flex">
          <check-icon v-if="addedToCurrentPlaylist" title="Added"></check-icon>
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
    },
    ableToSwipeRight: {
      type: Boolean,
      default () {
        return true
      }
    },
    ableToSwipeLeft: {
      type: Boolean,
      default () {
        return true
      }
    }
  },
  data () {
    return {
      swipedLeft: false,
      swipedRight: false,
      panPosition: 0
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
      if (this.ableToSwipeLeft) {
        console.log('swipeleft')
        this.swipedLeft = true
        this.$emit('swiped-left', {...this.track})
        setTimeout(() => {
          this.swipedLeft = false
        }, 1500)
      }
    },
    swipeRight () {
      if (this.ableToSwipeRight) {
        console.log('swipeRight')
        this.swipedRight = true
        this.$emit('swiped-right', {...this.track})
        setTimeout(() => {
          this.swipedRight = false
        }, 1200)
      }
    },
    // could be just a horizontal pan
    panningRight (e) {
      // console.log('panningRight', e)
      if (this.ableToSwipeRight) {
        this.panPosition = `${e.deltaX}px`
      }
    },
    panningLeft (e) {
      // console.log('panningLeft', e)
      if (this.ableToSwipeLeft) {
        this.panPosition = `${e.deltaX}px`
      }
    },
    panend (e) {
      console.log('panend e', e)
      this.swipedRight = false
      this.swipedLeft = false
      this.panPosition = 0
    }
  },
  mounted () {
    const vt = this.$refs.hammer
    // console.log('vt', vt)
    vt.$on('dragright', (e) => { console.log('dragginright', e) })
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
    &.slideInLeft {
      background-color:rgba(249, 94, 20, 0.54);
    }
    &.slideInRight {
      background-color: rgba(105, 249, 15, 0.52);
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
