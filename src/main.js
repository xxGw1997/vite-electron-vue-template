import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import directive from "./directives";

createApp(App)
  .use(router)
  .use(directive)
  .mount("#app");
