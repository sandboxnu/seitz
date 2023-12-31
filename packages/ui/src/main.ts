import { createApp } from "vue";
import "./style.css";
import App from "./App.vue";
import router from "./router";
import ElementPlus from "element-plus";
import { VueQueryPlugin } from "@tanstack/vue-query";
import "element-plus/dist/index.css";
import { createPinia } from "pinia";

import { library } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import {
  faGripVertical,
  faGripHorizontal,
  faPlus,
  faXmark,
  faCheck,
} from "@fortawesome/free-solid-svg-icons";
import { faCopy } from "@fortawesome/free-regular-svg-icons";

const pinia = createPinia();

library.add(faGripVertical, faGripHorizontal, faPlus, faXmark, faCheck, faCopy);

createApp(App)
  .use(router)
  .use(ElementPlus)
  .use(VueQueryPlugin)
  .use(pinia)
  .component("FontAwesomeIcon", FontAwesomeIcon)
  .mount("#app");
