<template>
<div class="tracks">
  <header class="flex" v-show="tracks.length > 0">
    <span class="title">Track</span>
    <div class="duration"><clock-icon title="duration"></clock-icon></div>
  </header>
  <div class="tracks-wrapper">
    <trackc
    v-for="track in tracks"
    :key="track.id"
    :show-artist="showArtist"
    @select-track="selectTrack"
    :track="track"></trackc>
  </div>
</div>
</template>

<script>
// import { mapGetters, mapActions } from 'vuex'
import Trackc from 'components/generic/track'
import ClockIcon from 'vue-material-design-icons/clock.vue'

export default {
  name: 'tracks',
  props: {
    tracks: {
      type: Array,
      required: true
    },
    showArtist: {
      type: Boolean,
      default () {
        return false
      }
    }
  },
  data () {
    return {
    }
  },
  methods: {
    // ...mapActions('player', [
    //   'playTrack'
    // ]),
    selectTrack (track) {
      this.$emit('select-track', track)
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

.albums {
  overflow: auto;
}
.tracks {
  padding: 0 1rem;
  .tracks-wrapper {
    overflow: auto;
    max-height: 72vh;
  }
  header {
    align-items: center;
    justify-content: space-between;
    border-bottom: 1px solid $base-gray;
  }
}
</style>
