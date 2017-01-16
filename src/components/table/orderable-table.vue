<template>
  <table class="table">
    <thead class="thead">
      <tr class="tr">
        <th></th>
        <th></th>
        <th class="th" :colspan="header.colspan || 1" @click="reorderBy(header)" v-for="header in headerWithIcons">
          {{header.label || header.key}}
        </th>
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
        <td class="td" :colspan="header.colspan || 1" v-for="header in headerWithIcons">
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
    },
    // TODO maybe generate all the labels with the icons inside a computed property
    icon (header) {
      if (this.orderBy[0] === header.key) {
        if (this.orderBy[1]) {
          return this.orderBy[1] === 'asc' ? '▴' : '▾'
        }
      }
      return ''
    }
  },
  components: {
    Play,
    AddToPlaylist
  },
  computed: {
    headerWithIcons () {
      let [key, order = 'asc'] = this.orderBy
      return this.headers.map(h => {
        if (h.key === key) {
          let copyH = Object.assign({}, h)
          if (order === 'asc') {
            if (copyH.label.includes('▾')) {
              copyH.label[copyH.label.length - 1] = '▴'
            } else {
              copyH.label += '▴'
            }
          } else {
            if (copyH.label.includes('▴')) {
              copyH.label[copyH.label.length - 1] = '▾'
            } else {
              copyH.label += '▾'
            }
          }
          return copyH
        }
        return h
      })
    }
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
  padding: 0.4rem
  text-align: left

th
  cursor: pointer
</style>
