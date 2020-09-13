<template>
  <v-list v-if="tracks" two-line>
    <v-list-item-group v-model="selectedTracks" multiple active-class="primary">
      <template v-for="(track, index) in tracks">
        <v-list-item
          :value="track"
          :key="track.id"
          @click="clickTrackHandler(track)"
        >
          <template v-slot:default="{ active }">
            <v-list-item-content>
              <v-list-item-title v-text="track.name"></v-list-item-title>
              <v-list-item-subtitle
                class="text--primary"
                v-text="get(track, 'album.name')"
              ></v-list-item-subtitle>
              <v-list-item-subtitle
                v-text="get(track, 'artists[0].name')"
              ></v-list-item-subtitle>
            </v-list-item-content>

            <v-list-item-action>
              <v-list-item-action-text
                v-text="msToTime(track.duration_ms)"
              ></v-list-item-action-text>
              <v-icon v-if="!active" color="accent">
                mdi-check-box
              </v-icon>
              <v-icon v-else color="success">
                mdi-check-box-outline
              </v-icon>
            </v-list-item-action>
          </template>
        </v-list-item>

        <v-divider v-if="index + 1 < tracks.length" :key="index"></v-divider>
      </template>
    </v-list-item-group>
  </v-list>
</template>

<script>
import get from 'lodash/get'
import { msToTime } from '../utils'

export default {
  name: 'TracksManager',
  props: {
    tracks: {
      type: Array,
      default: () => []
    },
    clickTrackHandler: {
      type: Function,
      required: true
    }
  },
  data() {
    return {
      selectedTracks: [],
      get,
      msToTime
    }
  }
}
</script>

<style lang="scss" scoped></style>
