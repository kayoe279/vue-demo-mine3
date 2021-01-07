import Vue from "vue";
import axios from 'axios';
import store from '../store/index'; // 携带参数可使用

let that = Vue.prototype;

// 判断是否http|https开头的URL
// const isHttp = (url) => {
//     return /(http|https):\/\/([\w.]+\/?)\S*/.test(url)
// }

// 对参数进行处理
// const queryString = (url, params) => {
//     let paramsStr = '';
//     Object.keys(params).forEach(key => {
//         paramsStr += key + '=' + params[key] + '&';
//     });
//     return `${url}?${paramsStr.substr(0, paramsStr.length - 1)}`
// }


const service = axios.create({
    baseURL: process.env.VUE_APP_BASE_API, // url = base url + request url
    timeout: 30 * 1000
})

// request请求拦截器
service.interceptors.request.use(config => {
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
    console.log(error) // for debug
    return Promise.error(error);
})

// response响应拦截器
service.interceptors.response.use(response => {
    const { status, data } = response;
    const { ErrorCode, ErrorMessage } = data;
    if (status == 200) {
        that.$hideLoading();
        if (ErrorCode !== 0) {
            that.$toast(ErrorMessage);
        }
        return Promise.resolve(response);
    } else {
        that.$hideLoading();
        that.$toast('请求失败:' + status);
        return Promise.reject(response);
    }
}, error => {
    that.$hideLoading();
    if (/timeout\sof\s\d+ms\sexceeded/.test(error.message)) {
        that.$toast('网络出了点问题，请稍后重试！')  // 超时
    }
    if (error.response) {
        // http状态码判断
        switch (error.response.status) {
            case 404:
                that.$toast('请求的资源不存在！')
                break
            case 500:
                that.$toast('内部错误，请稍后重试！')
                break
            case 503:
                that.$toast('服务器正在维护，请稍等！')
                break
        }
    }
    return Promise.reject(error) // 接口返回的错误信息
})

// 请求部分
export default function (options = {}) {
    // 判断传递的URL是否http/https开头,是否少/
    // let path = isHttp(url) ? url : (config.host + (url.indexOf('/') == 0 ? url : '/' + url));
    return new Promise((resolve, reject) => {
        service(options)
            .then(response => {
                resolve(response.data);
            }).catch(err => {
                reject(err)
            })
    })
}


// // get请求
// export const get = (url, params = {}, options = {}) => {
//     return request({
//         url,
//         method: "GET",
//         params: params,
//         ...options
//     })
// }

// // post请求
// export const post = (url, data = {}, options = {}) => {
//     return request({
//         url,
//         method: "POST",
//         data: data,
//         ...options
//     })
// }
