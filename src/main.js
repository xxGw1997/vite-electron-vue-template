import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import directive from "./directives";

import './assets/styles/variable.scss'
import './assets/styles/reset.scss'


createApp(App)
  .use(router)
  .use(directive)
  .mount("#app");
