<template>
  <table class="table">
    <thead class="thead">
      <tr class="tr">
        <th class="th" @click="reorderBy(header)" v-for="header in headers">{{header.label || header.key}}</th>
      </tr>
    </thead>
    <tbody class="tbody">
      <tr class="tr" v-for="(item, index) in items">
        <td class="td" v-for="header in headers">{{get(item, header.key)}}</td>
      </tr>
    </tbody>
  </table>
</template>

<script>
import {get} from 'lodash'
export default {
  name: 'orderable-table',
  props: {
    headers: {
      type: Array // of objects {key: 'name.first', label: 'name'}
    },
    orderBy: {
      type: Array // of strings ['name.first', 'name.last']
    },
    items: {
      type: Array // of objects
    }
  },
  data () {
    return {
    }
  },
  methods: {
    get,
    reorderBy (header) {
      this.$emit('reorder', header)
    }
  },
  computed: {
  }
}
</script>

<style lang="sass">
.table
  border-collapse: collapse
  margin-bottom: 5px
  .thead
    border-bottom: 1px solid #999
  .tr
    border-bottom: 1px solid #999
    &:last-child
      border-bottom: none

.td, .th
  padding: 0.5rem
  text-align: left

th
  cursor: pointer
</style>
