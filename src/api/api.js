import axios from 'axios'
import objconfig from './config' //开发环境域名配置

const baseURL = process.env.NODE_ENV !== 'production' ? objconfig.devHttpUrl : objconfig.buildHttpUrl;


// get请求
export const get = (path, params = {}) => {
    const ret = axios({
        method: 'get',
        url: baseURL + path,
        params
    })
    return dataCheck(ret)
}

// post 默认格式
export const post = (path, data = {}) => {
    const ret = axios({
        method: 'post',
        url: baseURL + path,
        data
    });
    return dataCheck(ret)
}

// post请求序列化参数
export const ajaxPost = (path, data = {}) => {
    const ret = axios({
        method: 'post',
        url: baseURL + path,
        transformRequest: (data) => {
            let ret = [];
            for (let it in data) {
                ret.push(encodeURIComponent(it) + '=' + encodeURIComponent(data[it]));
            }
            return ret.join('&');
        },
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        data,
    })
    return dataCheck(ret)
}

// // 对参数进行处理
// const queryString = (url, params) => {
//     let paramsStr = '';
//     Object.keys(params).forEach(key => {
//         paramsStr += key + '=' + params[key] + '&';
//     });
//     return `${url}?${paramsStr.substr(0, paramsStr.length - 1)}&timestamp=${randomCode(20)}`
// }
// /*生成指定长度的随机数*/
// function randomCode(length) {
//     let chars = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
//     let result = "";
//     for (let i = 0; i < length; i++) {
//         let index = Math.ceil(Math.random() * 9);
//         result += chars[index];
//     }
//     return result;
// }

// 数据监测
function dataCheck(ret) {
    return new Promise((resolve, reject) => {
        ret.then((response) => {
            resolve(response.data);
        }).catch(error => {
            reject(error)
        })
    })
}

export default {
    get,
    post,
    ajaxPost,
}