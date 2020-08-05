<template>
  <nav app class="bottom-bar">
    <div class="bottom-bar__logo">
      <v-btn icon @click.stop="ToggleNavDrawer()">
        <v-icon color="secondary">mdi-menu</v-icon>
      </v-btn>
    </div>
  </nav>
</template>

<script>
export default {
  components: {},
  methods: {
    ToggleNavDrawer() {
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
}
</style>
