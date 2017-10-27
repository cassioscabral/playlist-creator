<template>
<div class="tracks">
  <header class="flex" v-show="tracks.length > 0">
    <span class="title">Track</span>
    <div class="flex duration"><clock-icon title="duration"></clock-icon></div>
  </header>
  <div class="tracks-wrapper">
      <trackc
      v-for="track in tracks" :key="track.id"
      @doubletap="emitDoubleTap"
      @select-track="selectTrack"
      @swiped-right="swipedRight"
      @swiped-left="swipedLeft"
      :added-to-current-playlist="isInThePlaylist(track)"
      :track="track"></trackc>
  </div>
</div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import Trackc from 'components/generic/track'
import ClockIcon from 'vue-material-design-icons/clock.vue'
import { find, isEmpty } from 'lodash'
export default {
  name: 'tracks',
  props: {
    tracks: {
      type: Array,
      required: true
    }
  },
  data () {
    return {
    }
  },
  methods: {
    ...mapActions('player', [
      'playTrack'
    ]),
    ...mapActions('playlist', [
      'push',
      'remove'
    ]),
    selectTrack (track) {
      this.$emit('select-track', track)
      this.changeTrack(track)
    },
    changeTrack (track) {
      this.playTrack({ track })
    },
    panning () {
      console.log('panning')
    },
    emitDoubleTap (track) {
      console.log('emiting doubletap-track')
      this.$emit('doubletap-track', track)
    },
    swipedLeft (track) {
      this.$emit('swiped-left', track)
    },
    swipedRight (track) {
      this.$emit('swiped-right', track)
    },
    isInThePlaylist (track) {
      return !isEmpty(find(this.playlist, {id: track.id}))
    }
  },
  computed: {
    ...mapGetters('playlist', [
      'playlist'
    ])
  },
  components: {
    Trackc,
    ClockIcon
  }
}
</script>

<style lang="scss" scoped>
@import 'src/assets/colors';

.tracks {
  .tracks-wrapper {
    overflow-y: scroll; // has to be scroll, not auto
    -webkit-overflow-scrolling: touch;
    max-height: 72vh;
  }
  header {
    padding: 0 1rem 0.5rem 0.3rem;
    display: flex;
    align-items: center;
    justify-content: space-between;
    border-bottom: 1px solid $base-gray;
  }
}
</style>
