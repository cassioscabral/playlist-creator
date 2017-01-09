<template>
  <table class="table">
    <thead class="thead">
      <tr class="tr">
        <th></th>
        <th></th>
        <th class="th" @click="reorderBy(header)" v-for="header in headers">{{header.label || header.key}}</th>
      </tr>
    </thead>
    <tbody class="tbody">
      <tr class="tr" v-for="(item, index) in items">
        <td>
          <play :song="item" class="mr-5"></play>
        </td>
        <td>
          <add-to-playlist :song="item"></add-to-playlist>
        </td>
        <td class="td" v-for="header in headers">
          <span v-if="header.parser">
            {{header.parser(get(item, header.key))}}
          </span>
          <span v-else>
            {{get(item, header.key)}}
          </span>
        </td>
      </tr>
    </tbody>
  </table>
</template>

<script>
import Play from '../play'
import AddToPlaylist from '../add-to-playlist'
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
  components: {
    Play,
    AddToPlaylist
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
