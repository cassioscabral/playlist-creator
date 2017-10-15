<template>
  <div class="header">
    <slot>
      <div v-if="selectedArtistExists" class="flex a-center has-selected-artist">
        <avatar class="m-around" :images="selectedArtist.images" :alt="selectedArtist.name"></avatar>
        <span>{{selectedArtist.name}}</span>
      </div>
      <div v-else class="flex a-center has-not-selected-artist">
        <router-link to="/search" class="flex a-center">
          <person-outline-icon title="Artist"></person-outline-icon>
          Search for an Artist...
        </router-link>
      </div>
    </slot>
  </div>
</template>

<script>
// https://gitlab.com/robcresswell/vue-material-design-icons
import PersonOutlineIcon from 'vue-material-design-icons/account-outline.vue'
import { mapGetters } from 'vuex'
import Avatar from 'components/generic/avatar'
export default {
  name: 'header',
  computed: {
    ...mapGetters('application', [
      'selectedArtist'
    ]),
    selectedArtistExists () {
      const artist = this.selectedArtist
      return artist && artist.name && artist.name.length > 0
    }
  },
  components: {
    PersonOutlineIcon,
    Avatar
  }
}
</script>

<style lang="scss" scoped>
@import 'src/assets/colors';

.header {
  display: flex;
  align-items: center;
  border-bottom: 1px solid $base-gray;
}


.material-design-icon {
  width: 3rem;
  height: 3rem;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
