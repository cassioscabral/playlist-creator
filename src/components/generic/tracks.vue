<template>
<div class="tracks">
  <header class="flex" v-show="tracks.length > 0">
    <span class="title">Track</span>
    <div class="flex duration"><clock-icon title="duration"></clock-icon></div>
  </header>
  <div class="tracks-wrapper">
    <v-touch v-for="track in tracks"  @doubletap="onDoubleTap(track, $event)" :key="track.id">
      <trackc
      @select-track="selectTrack"
      :track="track"></trackc>
    </v-touch>
  </div>
</div>
</template>

<script>
import { mapActions } from 'vuex'
import Trackc from 'components/generic/track'
import ClockIcon from 'vue-material-design-icons/clock.vue'

export default {
  name: 'tracks',
  props: {
    tracks: {
      type: Array,
      required: true
    },
    onDoubleTap: {
      type: Function,
      default () {
        return function () { console.log('double tapped') }
      }
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
    }
  },
  computed: {

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
