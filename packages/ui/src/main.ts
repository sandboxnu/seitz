import { createApp } from "vue";
import "./style.css";
import App from "./App.vue";
import router from "./router";
import ElementPlus from "element-plus";
import { VueQueryPlugin } from "@tanstack/vue-query";
import "element-plus/dist/index.css";

createApp(App).use(router).use(ElementPlus).use(VueQueryPlugin).mount("#app");
