<template>
  <div class="playlist-manager">
    <div class="column user-playlists" v-if="userPlaylists">
      <div class="text vertical-space">
        My Playlists:
      </div>
      <div class="text vertical-space">
        <input type="text" class="input" v-model="name" @keyup.enter="isEditing = false" @change="changePlaylistName({name})">
        <button
          class="button"
          @click="createPlaylist"
          :disabled="this.name.length === 0">
          ➕
        </button>
      </div>
      <ul>
        <li
          class="clickable"
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
        </div>
      </div>
      <orderable-table
        :headers="tableHeaders"
        :items="playlist"
        :order-by="orderedBy"
        @reorder="reorderBy">

      </orderable-table>
      <button v-if="this.playlist.length > 0" class="button" @click="addTracksToPlaylist">
        Save
      </button>
    </div>
  </div>
</template>

<script>
import {store} from '../stores'
import { mapGetters, mapActions } from 'vuex'
import SongList from './song-list'
import OrderableTable from './table/orderable-table'
import {orderBy} from 'lodash'
import {msToTime} from 'src/utils'

export default {
  name: 'playlist-manager',
  data () {
    return {
      isEditing: false,
      name: this.playlistName || '',
      orderedBy: []
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
      'previousPlaylist'
    ]),
    tableHeaders () {
      return [
        {key: 'name', label: 'Name'},
        {key: 'artists[0].name', label: 'Artist'},
        {key: 'features.duration_ms', label: 'Duration', parser: this.msToTime},
        {key: 'features.valence', label: 'Happiness'},
        {key: 'features.instrumentalness', label: 'Instrumentalness'},
        {key: 'features.energy', label: 'Energy'},
        {key: 'features.speechiness', label: 'Speechiness'},
        {key: 'features.tempo', label: 'Tempo(BPM)'}
      ]
    }
  },
  methods: {
    ...mapActions([
      'changePlaylistName',
      'loadPlaylist',
      'addTracksToPlaylist',
      'reorder',
      'undo'
    ]),
    cleanOrderedBy () {
      this.orderedBy = []
    },
    createPlaylist () {
      if (this.currentUser.id && this.name.length > 0) {
        // better use the spotifyApi on the App component where the token is set
        this.$emit('create-playlist', this.name)
      }
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
    msToTime
  },
  components: {
    SongList,
    OrderableTable
  }
}
</script>

<style lang="sass">
.playlist-manager
  display: flex

.user-playlists
  width: 30%

.current-playlist
  width: 70%

</style>
