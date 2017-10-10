import { get } from 'lodash'

export default {
  namespaced: true,
  state: {
    autoplay: false,
    playerPlaylist: [],
    currentTrack: {
      // default fallback
      title: 'Preparation',
      author: 'Hans Zimmer/Richard Harvey',
      url: 'http://devtest.qiniudn.com/Preparation.mp3',
      pic: 'http://devtest.qiniudn.com/Preparation.jpg',
      lrc: '[00:00.00]lrc here\n[00:01.00]aplayer'
    },
    isPlaying: false
  },
  getters: {
    playerPlaylist: state => state.playerPlaylist,
    currentTrack: state => state.currentTrack,
    isPlaying: state => state.isPlaying,
    autoplay: state => state.autoplay
  },
  actions: {
    play ({commit}, {track}) {
      commit('PLAY', {track})
    },
    playTrack ({commit, rootState}, {track, artist, album}) {
      const { name: title, preview_url: url } = track
      const author = get(track, 'artists[0].name') || get(rootState.application.selectedArtist, 'name')
      const pic = get(track, 'album.images[1].url') || get(rootState.application.selectedAlbum, 'images[1].url')
      // format to vue-aplayer which has a similar API to aplayer
      if (!url) {
        console.warn('song without preview')
      }
      const formattedTrack = {
        title,
        author,
        url,
        pic
      }
      commit('PLAY_TRACK', {track: formattedTrack})
    },
    pause ({commit}, {track}) {
      commit('PAUSE', {track})
    }
  },
  mutations: {
    PLAY_TRACK (state, {track}) {
      state.autoplay = true // after clicking to play it should change to true so vue-aplayer start right away
      state.currentTrack = {...track}
      // state.isPlaying = true
    },
    PLAY (state, {track}) {
      state.isPlaying = true
    },
    PAUSE (state, {track}) {
      state.isPlaying = false
    }
  }
}
