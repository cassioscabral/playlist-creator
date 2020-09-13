import Vue from "vue";
import Vuetify from "vuetify/lib";
Vue.use(Vuetify);

const opts = {
  theme: {
    themes: {
      light: {
        primary: "#1DB954",
        secondary: "#29C45B",
        accent: "#4ae54a",
        error: "#b71c1c",
        info: "#2196F3",
        success: "#4CAF50",
        warning: "#FB8C00"
      },
      dark: {
        primary: "#1DB954",
        secondary: "#29C45B",
        accent: "#4ae54a",
        error: "#b71c1c",
        info: "#2196F3",
        success: "#4CAF50",
        warning: "#FB8C00"
      }
    }
  }
};
export default new Vuetify(opts);
