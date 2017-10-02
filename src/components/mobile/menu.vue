<template>
<div class="menu">

  <router-link to="/">
    <home-icon title="home"></home-icon>
  </router-link>
  <router-link to="/search">
    <magnify-icon title="search"></magnify-icon>
  </router-link>
  <router-link to="/playlists">
    <playlist-icon title="playlists"></playlist-icon>
  </router-link>
  <person-icon title="account"></person-icon>
</div>
</template>

<script>
// https://gitlab.com/robcresswell/vue-material-design-icons
import HomeIcon from 'vue-material-design-icons/home.vue'
import PersonIcon from 'vue-material-design-icons/account.vue'
import MagnifyIcon from 'vue-material-design-icons/magnify.vue'
import PlaylistIcon from 'vue-material-design-icons/playlist-play.vue'

export default {
  components: {
    HomeIcon,
    PersonIcon,
    MagnifyIcon,
    PlaylistIcon
  }
}
</script>

<style lang="scss" scoped>
.menu {
  display: flex;
  justify-content: space-between;
  padding-bottom: 0.2rem;
  border-top: 1px solid gray;
}


.material-design-icon {
  width: 3rem;
  height: 3rem;
  display: flex;
  justify-content: center;
  align-items: center;

}

</style>
