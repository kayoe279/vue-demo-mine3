import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import 'lib-flexible/flexible';//移动端适配
import "./styles/index.scss"; // 全局样式
import "./permission" // 路由守卫
import "./utils/vueGlobal"; // 全局方法

//操作反馈.全局自定义组件
import vLoading from "@/plugins/vLoading/vLoading";
import vToast from "@/plugins/vToast/vToast";
import vModal from "@/plugins/vModal/vModal";
Vue.use(vLoading).use(vToast).use(vModal);
import vPopup from "./components/v-popup";
Vue.component("v-popup", vPopup);

// 工具,请求
import request from "./utils/request";
import constant from "./utils/constant";
import utils from "./utils/index";
import * as auth from "./utils/auth" // 两种写法
Vue.prototype.$request = request;
Vue.prototype.$utils = utils;
Vue.prototype.$constant = constant;
Vue.prototype.$auth = auth;


// 全局过滤器
import * as filters from './utils/filters'
Object.keys(filters).forEach(key => {
  Vue.filter(key, filters[key])
})

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount("#app");


