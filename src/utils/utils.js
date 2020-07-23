import config from '../api/config' //开发环境域名配置
import CONST from "./constant"
import Vue from "vue";
//操作反馈
import { vLoading, vToast, vModal } from "../plugins/index"
Vue.use(vLoading, { theme: "dark" }).use(vToast).use(vModal);
let that = Vue.prototype;

var Utils = {};
// 统一处理
Utils.route = function (path) {
    that.$router.push(path);
}

// 获取版本号
Utils.getVersion = function () {
    return config.version;
}

// 获取环境链接变量
Utils.getHost = function (scene) {
    return config.host(scene)
}

Utils.getfileUrlById = function (id) {
    return Utils.getHost() + '/system/file/download?Id=' + id;
}

Utils.getCookie = function (key) {
    return that.$cookie.get(CONST.CookiePrefix + key)
}
Utils.setCookie = function (key, value) {
    that.$cookie.set(CONST.CookiePrefix + key, value, { expires: CONST.CookieExpires })
}
Utils.deleteCookie = function (key) {
    that.$cookie.delete(CONST.CookiePrefix + key)
}

// storage保存
Utils.getStorage = function (store) {
    return localStorage.getItem(CONST.StoragePrefix + store);
};
Utils.setStorage = function (store, value) {
    localStorage.setItem(CONST.StoragePrefix + store, JSON.stringify(value));
}
Utils.removeStorage = function (store) {
    localStorage.removeItem(CONST.StoragePrefix + store);
}

/**
 * 时间格式化
 * @param {Date} date Date实例
 * @param {String} fmt fmt：时间格式 yyyy-MM-dd hh:mm:ss
 */
Utils.dateFormatter = function (date, fmt) {
    fmt = fmt || "yyyy-MM-dd hh:mm:ss";
    var o = {
        'M+': date.getMonth() + 1,                   // 月份
        'd+': date.getDate(),                        // 日
        'h+': date.getHours(),                       // 小时
        'm+': date.getMinutes(),                     // 分
        's+': date.getSeconds(),                     // 秒
        'q+': Math.floor((date.getMonth() + 3) / 3), // 季度
        'S': date.getMilliseconds()                  // 毫秒
    }
    if (/(y+)/.test(fmt)) {
        fmt = fmt.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length))
    }
    for (var k in o) {
        if (new RegExp('(' + k + ')').test(fmt)) {
            fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? (o[k]) : (('00' + o[k]).substr(('' + o[k]).length)))
        }
    }
    return fmt
}

/* 时间转换dateStr： - yyyy-MM-ddThh:mm:ss */
Utils.dateFromDatetimeStr = function (dateStr) {
    dateStr = dateStr.replace('T', ' ').replace(/-/g, '/').replace('Z', '')
    return new Date(dateStr)
}

// 转换时间戳 '/Date(1540396802000)/'
Utils.dateTransformerFromDateStr = function (dateStr) {
    var date = null
    if (dateStr) {
        var time = parseInt(dateStr.replace('/Date(', '').replace('(/', ''))
        if (!isNaN(time)) {
            date = new Date(time)
        }
    }
    return date ? date : ''
}

// 从地址中获取指定参数
Utils.getQueryString = function (name, url) {
    url = url || window.location.search;
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
    var r = url.substr(1).match(reg);
    if (r != null) return decodeURI(r[2]); return null;
}

/**
 * @description 将url请求参数转为json格式
 * @param url
 * @returns {{}|any}
 */
Utils.param2Obj = function (url) {
    const search = url.split("?")[1];
    if (!search) {
        return {};
    }
    return JSON.parse(
        '{"' +
        decodeURIComponent(search)
            .replace(/"/g, '\\"')
            .replace(/&/g, '","')
            .replace(/=/g, '":"')
            .replace(/\+/g, " ") +
        '"}'
    );
}

// 生成随机字符串 - 默认32位
Utils.getRandomUuid = function (length = 32) {
    const num = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890";
    let str = "";
    for (let i = 0; i < length; i++) {
        str += num.charAt(Math.floor(Math.random() * num.length));
    }
    return str;
}

/* 判断是否安卓 */
Utils.isAndroid = function () {
    var u = navigator.userAgent;
    return u.indexOf('Android') > -1 || u.indexOf('Adr') > -1;
}

/* 判断是否iOS */
Utils.isIOS = function () {
    var u = navigator.userAgent;
    return !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/);
}

//  判读是否为外链
Utils.isExternal = function (path) {
    return /^(https?:|mailto:|tel:)/.test(path);
}

// 判断是否为IP
Utils.isIP = function (ip) {
    const reg = /^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])$/;
    return reg.test(ip);
}

// 校验日期是否正确
Utils.isValidDate = function (date) {
    return date instanceof Date && !isNaN(date.getTime())
}

// 校验手机号码
Utils.checkPhone = function (phone) {
    return /^1[3456789]\d{9}$/.test(phone)
}

// 验证身份证
Utils.checkIdCard = function (idcard) {
    let regIdCard = /(^\d{18}$)|(^\d{17}(\d|X|x)$)/;
    if (!regIdCard.test(idcard)) {
        return false;
    } else {
        let year = idcard.substr(6, 4)
        let month = idcard.substr(10, 2)
        let day = idcard.substr(12, 2)
        return Utils.isValidDate(new Date(year + '/' + month + '/' + day))
    }
}

// 失去焦点重置滚动条blurResetScroll
Utils.blurResetScroll = function () {
    setTimeout(function () {
        let scrollHeight =
            document.documentElement.scrollTop || document.body.scrollTop || 0;
        window.scrollTo(0, Math.max(scrollHeight - 1, 0));
    }, 100);
}

// 显示toast
Utils.toast = function (toastData, cb) {
    if (Vue) {
        that.$toast(toastData, cb)
    }
}

// 显示loading
Utils.showLoading = function (loadingData, cb) {
    if (Vue) {
        that.$loading.show(loadingData, cb)
    }
}
Utils.coverLoading = function (loadingData, cb) {
    if (Vue) {
        that.$loading.cover(loadingData, cb)
    }
}

// 隐藏loading
Utils.hideLoading = function (cb) {
    if (Vue) {
        that.$loading.hide(cb)
    }
}

// 显示alert,modal弹窗
Utils.showModal = function (moadlData) {
    if (Vue) {
        that.$modal(moadlData)
    }
}



export default Utils