<template>
  <table class="table">
    <thead>
      <tr>
        <th v-for="header in headers">{{header.label || header.key}}</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="(object, index) in objects">
        <td v-for="header in headers">{{get(object, header.key)}}</td>
      </tr>
    </tbody>
  </table>
</template>

<script>
import {get} from 'lodash'
export default {
  name: 'orderable-table',
  mounted () {
    window.fetch('https://api.randomuser.me/?results=20')
    .then(response => response.json())
    .then(({results}) => {
      this.objects = results
    })
  },
  data () {
    return {
      headers: [
        {key: 'name.first', label: 'name'},
        {key: 'name.last', label: 'surname'},
        {key: 'gender'},
        {key: 'phone+cell', label: 'contacts'},
        {key: 'picture.thumbnail', label: 'avatar'},
        {key: 'nat', label: 'nationality'}
      ],
      orderBy: `['name.first', 'name.last']`,
      objects: []
    }
  },
  methods: {
    get
  }
}
</script>

<style lang="css">
</style>
