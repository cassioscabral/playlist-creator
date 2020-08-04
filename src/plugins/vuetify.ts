import Vue from "vue";
import Vuetify from "vuetify/lib";
Vue.use(Vuetify);

const opts = {
  theme: {
    themes: {
      light: {
        primary: "#1DB954",
        secondary: "#b3b3b3",
        accent: "#8c9eff",
        error: "#b71c1c",
        info: "#2196F3",
        success: "#4CAF50",
        warning: "#FB8C00"
      },
      dark: {
        primary: "#191414",
        secondary: "#212121",
        accent: "#8c9eff",
        error: "#b71c1c",
        info: "#2196F3",
        success: "#4CAF50",
        warning: "#FB8C00"
      }
    }
  }
};
export default new Vuetify(opts);
