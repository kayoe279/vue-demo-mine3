import Vue from "vue";
import App from "./App.vue";
import "./registerServiceWorker";
import router from "./router";
import store from "./store";
import "./assets/js/rem-common"; //rem适配
import "./styles/index.scss"; // 全局样式
import VueCookie from 'vue-cookie'
Vue.use(VueCookie)

// 全局自定义组件
import vPopup from "./components/v-popup";
Vue.component("v-popup", vPopup);

// 工具,请求
import request from "./api/request";
import utils from "./utils/utils";
import constant from "./utils/constant";
Vue.prototype.$request = request;
Vue.prototype.$utils = utils;
Vue.prototype.$constant = constant;



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


// 路由守卫 
router.beforeEach((to, from, next) => {
  if (to.meta.title) {
    document.title = to.meta.title
  }
  if (to.path == "/first" && from.path == "/") {
    next()
  }
  if (to.matched.length === 0) { //匹配前往的路由不存在
    next(from.name ? { name: from.name } : '/error') //判断此跳转路由的来源路由是否存在，存在的情况跳转到来源路由，否则跳转到404页面
  } else {
    next(); //如果匹配到正确跳转
  }
})
