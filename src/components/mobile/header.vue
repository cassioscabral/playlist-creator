<template>
  <div class="header">
    <person-outline-icon title="Artist"></person-outline-icon> Pink Floyd
  </div>
</template>

<script>
// https://gitlab.com/robcresswell/vue-material-design-icons
import PersonOutlineIcon from 'vue-material-design-icons/account-outline.vue'

export default {
  components: {
    PersonOutlineIcon
  }
}
</script>

<style lang="scss" scoped>
.header {
  display: flex;
  align-items: center;
  border-bottom: 1px solid gray;

}


.material-design-icon {
  width: 3rem;
  height: 3rem;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
