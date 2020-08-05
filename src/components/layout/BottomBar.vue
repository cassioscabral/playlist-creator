<template>
  <nav app dark class="bottom-bar pa-3">
    <div class="bottom-bar__logo">
      <v-btn icon @click.stop="toggleNavDrawer()">
        <v-icon color="secondary">mdi-menu</v-icon>
      </v-btn>
    </div>
    <v-spacer></v-spacer>
    <!-- <v-btn dark color="success" :loading="false" @click.native="savePlaylist">
      Update
    </v-btn> -->
    <v-btn
      v-if="$route.matched.some(({ name }) => name === 'playlists')"
      icon
      to="/"
    >
      <v-icon color="secondary">mdi-home</v-icon>
    </v-btn>
    <v-btn v-else icon to="/playlists">
      <!-- TODO add tooltip -->
      <v-icon color="secondary">mdi-playlist-music</v-icon>
    </v-btn>
  </nav>
</template>

<script>
import { mapActions } from 'vuex'

export default {
  components: {},
  methods: {
    ...mapActions('playlist', {
      addTrackToPlaylist: 'push',
      removeTrackToPlaylist: 'remove'
    }),
    addToPlaylist(track) {
      console.log('add to playlist', track)
      this.addTrackToPlaylist({ track })
    },
    removeFromPlaylist(track) {
      console.log('remove from playlist', track)
      this.removeTrackToPlaylist({ track })
    },
    toggleNavDrawer() {
      this.$store.commit('TOGGLE_NAV_DRAWER')
    }
  }
}
</script>

<style lang="scss" scoped>
.bottom-bar {
  position: fixed;
  bottom: 0;
  left: 0;
  display: flex;
  align-items: center;
  width: 100%;
  height: 56px;
  background-color: #1db954;
}
</style>
