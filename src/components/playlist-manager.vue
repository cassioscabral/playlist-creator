<template>
  <div class="playlist-manager">
    <div class="column user-playlists" v-if="userPlaylists">
      <div class="text vertical-space">
        My Playlists
      </div>
      <div class="create-playlist text vertical-space">
        <input
          type="text"
          class="input"
          v-model.trim="name"
          placeholder="Playlist name"
          @keyup.enter="isEditing = false"
          @change="changePlaylistName({name})">
        <button
          class="button add-button spotify-green"
          @click="createPlaylist({name, clean: true})"
          :disabled="this.name.length === 0">
          Create
        </button>
      </div>
      <ul class="playlists">
        <li
          class="playlist clickable"
          :class="{'is-selected': playlistObject.id === playlist.id}"
          v-for="playlist in userPlaylists"
          @click="loadPlaylist({playlist})">
          {{playlist.name}}
        </li>
      </ul>
    </div>
    <div class="current-playlist column">
      <div class="text vertical-space">
        <!-- TODO add change playlist name feature -->
        <!-- <div  v-if="!isEditing" class="name" @click="(isEditing = true) && (name = playlistName)">
          Playlist name: {{playlistName}}
        </div>
        <input v-else type="text" class="input" v-model="name" @keyup.enter="isEditing = false" @change="changePlaylistName({name})"> -->
        <div  class="name">
          {{playlistName}} ({{totalSongs}}) ({{msToTime(totalDurationPlaylist)}})
          <span class="clickable" v-if="previousPlaylist"><a @click="undo() && cleanOrderedBy()">undo ↺</a></span>
          <button class="button save-button spotify-green" @click="savePlaylist">
            Save
          </button>
        </div>
        <div class="text vertical-space">
          <input type="checkbox" v-model="showGraph" class="checkbox"> Show Graph
        </div>
        <canvas v-show="showGraph && playlist.length > 0" ref="canvas" id="myChart" width="400" height="100"></canvas>
      </div>
      <orderable-table
        :headers="tableHeaders"
        :items="playlist"
        :order-by="orderedBy"
        @reorder="reorderBy">

      </orderable-table>
    </div>
  </div>
</template>

<script>
import {store} from '../stores'
import { mapGetters, mapActions } from 'vuex'
import SongList from './song-list'
import OrderableTable from './table/orderable-table'
import {orderBy, get} from 'lodash'
import {msToTime} from 'src/utils'

export default {
  name: 'playlist-manager',
  data () {
    return {
      isEditing: false,
      name: this.playlistName || '',
      orderedBy: [],
      chart: null,
      showGraph: false
    }
  },
  computed: {
    ...mapGetters([
      'accessToken',
      'currentUser',
      'playlist',
      'playlistName',
      'userPlaylists',
      'totalDurationPlaylist',
      'totalSongs',
      'previousPlaylist',
      'playlistObject'
    ]),
    tableHeaders () {
      return [
        {key: 'name', label: 'Name', colspan: 2, hideOnGraph: true},
        {key: 'artists[0].name', label: 'Artist', colspan: 2, hideOnGraph: true},
        {key: 'features.duration_ms', label: 'Duration', parser: this.msToTime, hideOnGraph: true},
        {key: 'features.valence', label: 'Happiness'},
        {key: 'features.instrumentalness', label: 'Instrumental'},
        {key: 'features.energy', label: 'Energy'},
        {key: 'features.acousticness', label: 'Acousticness'},
        {key: 'features.danceability', label: 'Danceability'},
        {key: 'features.speechiness', label: 'Speechiness'},
        {key: 'features.tempo', label: 'Tempo(BPM)', hideOnGraph: true}
      ]
    }
  },
  watch: {
    showGraph () {
      if (this.showGraph) {
        this.mountGraph()
      }
    }
  },
  methods: {
    ...mapActions([
      'changePlaylistName',
      'loadPlaylist',
      'addTracksToPlaylist',
      'reorder',
      'undo',
      'savePlaylist',
      'createPlaylist'
    ]),
    cleanOrderedBy () {
      this.orderedBy = []
    },
    reorderBy (header) {
      let reorderedPlaylist = []
      if (this.orderedBy.includes(header.key)) {
        if (this.orderedBy.includes('desc')) {
          // remove from orderedBy
          this.orderedBy = []
          this.reorderBy(header)
        } else { // change order
          this.orderedBy.push('desc')
          let [property, order] = this.orderedBy
          reorderedPlaylist = orderBy(this.playlist, [property], [order])
          store.dispatch('reorder', {playlist: reorderedPlaylist})
        }
      } else {
        this.orderedBy = []
        this.orderedBy.push(header.key)
        let [property] = this.orderedBy
        reorderedPlaylist = orderBy(this.playlist, [property], ['asc'])
        store.dispatch('reorder', {playlist: reorderedPlaylist})
      }
    },
    msToTime,
    mountGraph () {
      const ctx = this.$refs.canvas

      // let colors = ['green', 'yellow', 'red', 'blue', 'orange', '#d3c2a1', 'magenta', '#d1d1d1', '#babaca', '#a2b2c2']
      let datasets = []
      this.tableHeaders.forEach((th, i) => {
        let time = 0
        if (th.hideOnGraph) {
          // continue
        } else {
          let r = Math.floor(Math.random() * 256)
          let g = Math.floor(Math.random() * 256)
          let b = Math.floor(Math.random() * 256)
          let a = 0.2

          let backgroundColor = `rgba(${r}, ${g}, ${b}, ${a})`
          let borderColor = `rgba(${r}, ${g}, ${b}, 1)`
          datasets.push({
            label: th.label,
            backgroundColor,
            borderColor,
            data: this.playlist.map(t => {
              time += ((t.duration_ms / 1000) / 60) / 60 // minutes
              // console.log('time', time)
              return {
                x: time,
                y: th.parser ? th.parser(get(t, th.key)) : get(t, th.key)
              }
            })
          })
        }
      })
      this.chart = new window.Chart.Line(ctx, {
        data: {
          datasets
        },
        options: {
          responsive: true,
          scales: {
            xAxes: [{
              type: 'linear',
              position: 'bottom'
            }],
            yAxes: [{
              type: 'linear',
              stacked: true
            }]
          }
        }
      })
    }
  },
  mounted () {
  },
  components: {
    SongList,
    OrderableTable
  }
}
</script>

<style lang="sass">
@import '../assets/colors'

.playlist-manager
  display: flex

.user-playlists
  width: 20%

.current-playlist
  width: 80%

.save-button
  background: #1ED760
  width: 20%
  align-self: flex-end



.playlists
  padding: 0 0.4rem
  .playlist
    text-decoration: none
    list-style: none
    padding: 0.5rem 0 0.5rem 0.5rem
    margin: 0
    border-bottom: 1px solid $base-color
    &:hover
      background: $base-hover
    &:last-child
      border-bottom: none
    &.is-selected
      background: $base-selected
      &:hover
        background: $base-hover

.create-playlist
  display: flex
  flex-wrap: wrap
  .input
    margin: 2% 0
    width: 98%
  .add-button
    width: 98%
    margin: 2% 0


</style>
