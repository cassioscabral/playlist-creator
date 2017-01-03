<template>
<div class="song-item sm-vertical-space">
  <play :song="song" class="mr-5"></play>
  <add-to-playlist class="mr-5" :song="song"></add-to-playlist>
  <div class="row song-info">
    <div class="song-name">
      {{song.name}}
    </div>
    <div class="song-artist">
      {{song.artists[0].name}}
    </div>
    <div class="song-duration">
      {{msToTime(song.duration_ms)}}
    </div>
    <div class="features" v-if="showFeatures && song.features.uri">
      <div class="happiness valence">
        {{song.features.valence}}
      </div>
      <div class="instrumentalness">
        {{song.features.instrumentalness}}
      </div>
      <div class="energy">
        {{song.features.energy}}
      </div>
      <div class="speechiness">
        {{song.features.speechiness}}
      </div>
      <div class="tempo">
        {{song.features.tempo}}
      </div>
    </div>
  </div>

</div>
</template>

<script>
import Play from './play'
import AddToPlaylist from './add-to-playlist'

export default {
  name: 'song-item',
  props: {
    song: {
      type: Object
    },
    showFeatures: {
      type: Boolean,
      default () {
        false
      }
    }
  },
  data () {
    return {
    }
  },
  computed: {
  },
  methods: {
    msToTime (ms) {
      // 242000
      let totalSeconds = Math.floor(ms / 1000)
      // 242
      let seconds = totalSeconds % 60
      let totalMinutes = (totalSeconds - seconds) / 60

      let minutes = totalMinutes % 60
      // 4.03333
      let hours = (totalMinutes - minutes) / 60

      return `${hours > 0 ? hours + ':' : ''}${minutes < 10 ? '0' + minutes : minutes}:${seconds < 10 ? '0' + seconds : seconds}`
    }
  },
  components: {
    Play,
    AddToPlaylist
  }
}
</script>

<style lang="sass" scoped>
.song-item
  display: flex
  align-items: center
  border-bottom: 1px solid rgba(#2c3e50, 0.82)
  padding-bottom: 2px
  &:last-child
    border-bottom: none

.song-name
  margin-left: 5px
  font-size: 1.2rem

.song-info
  display: flex
  justify-content: space-between
  align-items: center
  & > *
    display: flex
    margin: 0 0.3rem

.features
  display: flex
  justify-content: space-between
  align-items: center
  & > *
    display: flex
    margin: 0 0.3rem
</style>
