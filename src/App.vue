<template>
  <v-app id="inspire">
    <v-navigation-drawer v-model="navDrawer" app clipped>
      <v-list dense>
        <v-list-item link>
          <v-list-item-action>
            <v-icon>mdi-view-dashboard</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>Dashboard</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-list-item link>
          <v-list-item-action>
            <v-icon>mdi-cog</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>Settings</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>

    <v-app-bar app clipped-left>
      <v-app-bar-nav-icon
        v-if="$vuetify.breakpoint.mdAndUp"
        @click.stop="$store.commit('TOGGLE_NAV_DRAWER')"
      ></v-app-bar-nav-icon>
      <v-toolbar-title>Spotify Playlist Creator</v-toolbar-title>
    </v-app-bar>

    <v-main>
      <router-view></router-view>
    </v-main>

    <app-bottom-bar v-if="$vuetify.breakpoint.smAndDown" />
  </v-app>
</template>
<script lang="ts">
import Vue from 'vue'
import AppBottomBar from './components/layout/BottomBar.vue'

export default Vue.extend({
  name: 'App',

  components: {
    AppBottomBar
  },

  data: () => ({}),

  created() {
    this.$vuetify.theme.dark = true
  },

  computed: {
    navDrawer: {
      get() {
        return this.$store.state.navDrawer
      },
      set(val) {
        this.$store.commit('SET_NAV_DRAWER', val)
      }
    }
  }
})
</script>
