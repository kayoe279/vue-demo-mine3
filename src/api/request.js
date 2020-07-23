import axios from 'axios';
import utils from "../utils/utils"
// import QS from 'qs';
import config from './config' //开发环境域名配置
import store from '../store/index'; // 携带参数可使用
// import router from '../router/index'; // 路由登录跳转可使用


// 判断是否http|https开头的URL
const isHttp = (url) => {
    return /(http|https):\/\/([\w.]+\/?)\S*/.test(url)
}
// 对参数进行处理
const queryString = (url, params) => {
    let paramsStr = '';
    Object.keys(params).forEach(key => {
        paramsStr += key + '=' + params[key] + '&';
    });
    return `${url}?${paramsStr.substr(0, paramsStr.length - 1)}`
}


let instance = axios.create({
    timeout: 30 * 1000
})

// request请求拦截器
instance.interceptors.request.use(config => {
    const token = store.state.token;
    const UserId = store.getters.getUserInfo.UserId || "";
    if (token) {
        config.headers.token = token;
    }
    if (UserId) {
        config.headers.UserId = UserId
    }
    return config;
}, error => {
    return Promise.error(error);
})

// response响应拦截器
instance.interceptors.response.use(response => {
    const { status, data } = response;
    const { ErrorCode, ErrorMessage } = data;
    if (status == 200) {
        utils.hideLoading();
        if (ErrorCode !== 0) {
            utils.toast(ErrorMessage);
        }
        return Promise.resolve(response);
    } else {
        utils.hideLoading();
        utils.toast('请求失败:' + status);
        return Promise.reject(response);
    }
}, error => {
    utils.hideLoading();
    if (/timeout\sof\s\d+ms\sexceeded/.test(error.message)) {
        utils.toast('网络出了点问题，请稍后重试！')  // 超时
    }
    if (error.response) {
        // http状态码判断
        switch (error.response.status) {
            case 404:
                utils.toast('请求的资源不存在！')
                break
            case 500:
                utils.toast('内部错误，请稍后重试！')
                break
            case 503:
                utils.toast('服务器正在维护，请稍等！')
                break
        }
    }
    return Promise.reject(error) // 接口返回的错误信息
})

// 请求部分
const request = function (url, data, method, options = {}) {
    options.headers = options.headers || {};
    let headers = {
        "Content-Type": options.headers.ContentType || "application/x-www-form-urlencoded"
    }
    var requestData = new FormData();
    for (var key in data) {
        requestData.append(key, data[key])
    }
    // 判断传递的URL是否http/https开头,是否少/
    let path = isHttp(url) ? url : (config.host + (url.indexOf('/') == 0 ? url : '/' + url));
    return new Promise((resolve, reject) => {
        instance({
            url: path,
            data: requestData,
            method: method,
            headers: headers
        })
            .then(response => {
                resolve(response.data);
            }).catch(err => {
                reject(err)
            })
    })
}


// get请求
const get = (url, data = {}, options = {}) => {
    return request(queryString(url, data), {}, "GET", options)
}

// post请求
const post = (url, data = {}, options = {}) => {
    return request(url, data, "POST", options);
}

export default {
    get,
    post
}
