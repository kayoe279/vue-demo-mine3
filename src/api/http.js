import axios from 'axios';
import QS from 'qs';
import objconfig from './config' //开发环境域名配置
import store from '../store/index';
import router from '../router/index';

import utils from "../tools/utils"

/**axios封装
 * 请求拦截、相应拦截、错误统一处理
 */
// 根据环境变量来进行判读是开发环境还是生产环境



// 创建axios实例
var instance = axios.create({ timeout: 1000 * 12 });
// 设置post请求头
instance.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';

// 请求拦截器
instance.interceptors.request.use(config => {
  // 每次发送请求之前判断是否存在token，如果存在，则统一在http请求的header都加上token，不用每次请求都手动添加了
  // 即使本地存在token，也有可能token是过期的，所以在响应拦截器中要对返回状态进行判断
  const token = store.state.token;
  token && (config.headers.Authorization = token);
  return config;
}, error => {
  return Promise.error(error);
})
const errorHandle = (status, other) => {
  // 状态码判断
  switch (status) {
    // 401: 未登录状态，跳转登录页
    case 401:
      // toLogin();
      break;
    // 403 token过期
    // 清除token并跳转登录页
    case 403:
      // tip('登录过期，请重新登录');
      localStorage.removeItem('token');
      store.commit('loginSuccess', null);
      setTimeout(() => {
        toLogin();
      }, 1000);
      break;
    // 404请求不存在
    case 404:
      // tip('请求的资源不存在');
      break;
    default:
      console.log(other);
  }
}
// 响应拦截器
instance.interceptors.response.use(response => {
  if (response.status === 200) {
    // console.log(response.data.ErrorCode)
    // if (response.data.ErrorCode == 0) { // res为服务端返回值
      return Promise.resolve(response);
    // } else {
    //   utils.toast(response.data.ErrorMessage);
    //   return;
    // }
  } else {
    return Promise.reject(response);
  }
}, error => {
  const { response } = error;
  if (response) {
    // 请求已发出，但是不在2xx的范围 
    errorHandle(response.status, response.data.message);
    return Promise.reject(response);
  } else {
    // 处理断网的情况
    // eg:请求超时或断网时，更新state的network状态
    // network状态在app.vue中控制着一个全局的断网提示组件的显示隐藏
    // 关于断网组件中的刷新重新获取数据，会在断网组件中说明
    if (!window.navigator.onLine) {
      store.commit('changeNetwork', false);
    } else {
      return Promise.reject(error);
    }
  }
})


/** 
 * get方法，对应get请求 
 * @param {String} url [请求的url地址] 
 * @param {Object} params [请求时携带的参数] 
 */
function get(url, params) {
  let path = url.indexOf('https://') == -1 && url.indexOf('http://') == -1 ? objconfig.host + url : url
  return new Promise((resolve, reject) => {
    instance.get(path, {
      params: params
    })
      .then(res => {
        resolve(res.data);
      })
      .catch(err => {
        reject(err.data)
      })
  });
}
/** 
 * post方法，对应post请求 
 * @param {String} url [请求的url地址] 
 * @param {Object} params [请求时携带的参数] 
 */

function post(url, params) {
  let path = url.indexOf('https://') == -1 && url.indexOf('http://') == -1 ? objconfig.host + url : url
  return new Promise((resolve, reject) => {
    instance.post(path, QS.stringify(params))
      .then(res => {
        resolve(res.data);
      })
      .catch(err => {
        reject(err.data)
      })
  });
}

export default {
  get,
  post
};