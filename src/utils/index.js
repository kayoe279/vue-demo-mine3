import config from '../api/config' //开发环境域名配置
import CONST from "./constant"
import Vue from "vue";

let that = Vue.prototype;

var utils = {};

// 获取版本号
utils.getVersion = function () {
    return config.version;
}

// 获取环境链接变量
utils.getHost = function (scene) {
    return config.host(scene)
}

utils.getfileUrlById = function (id) {
    return getHost() + '/system/file/download?Id=' + id;
}

/**
 * 时间格式化
 * @param {Date} date Date实例/时间戳等
 * @param {String} fmt fmt：时间格式 yyyy-MM-dd hh:mm:ss
 */
utils.dateFormatter = function (date, fmt) {
    fmt = fmt || "yyyy-MM-dd hh:mm:ss";
    if (typeof date == "string") {
        date = date.replace('/Date(', '').replace(')/', '').replace('T', ' ').replace(/-/g, '/');
        date = new Date(date)
    }
    if (date) {
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
    } else {
        return ""
    }
}

/* 时间转换dateStr： - yyyy-MM-ddThh:mm:ss */
utils.dateFromDatetimeStr = function (dateStr) {
    dateStr = dateStr.replace('T', ' ').replace(/-/g, '/').replace('Z', '')
    return new Date(dateStr)
}

// 转换时间戳 '/Date(1540396802000)/'
utils.dateTransformerFromDateStr = function (dateStr) {
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
utils.getQueryString = function (name, url) {
    url = url || window.location.search;
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
    var r = url.substr(1).match(reg);
    if (r != null) return decodeURI(r[2]); return null;
}
// 获取授权code
utils.getCode = function () {
    const href = window.location.href;
    const code = href.match(/code=(.*?)[&|$]/);
    if (code) {
        return code[1];
    } else {
        return "";
    }
};
/**
 * @description 将url请求参数转为json格式
 * @param url
 * @returns {{}|any}
 */
utils.param2Obj = function (url) {
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
utils.getRandomUuid = function (length = 32) {
    const num = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890";
    let str = "";
    for (let i = 0; i < length; i++) {
        str += num.charAt(Math.floor(Math.random() * num.length));
    }
    return str;
}

/* 判断是否安卓 */
utils.isAndroid = function () {
    var u = navigator.userAgent;
    return u.indexOf('Android') > -1 || u.indexOf('Adr') > -1;
}

/* 判断是否iOS */
utils.isIOS = function () {
    var u = navigator.userAgent;
    return !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/);
}

//  判读是否为外链
utils.isExternal = function (path) {
    return /^(https?:|mailto:|tel:)/.test(path);
}

// 判断是否为IP
utils.isIP = function (ip) {
    const reg = /^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])$/;
    return reg.test(ip);
}

// 校验日期是否正确
utils.isValidDate = function (date) {
    return date instanceof Date && !isNaN(date.getTime())
}

// 校验手机号码
utils.checkPhone = function (phone) {
    return /^1[3456789]\d{9}$/.test(phone)
}

// 验证身份证
utils.checkIdCard = function (idcard) {
    let regIdCard = /(^\d{18}$)|(^\d{17}(\d|X|x)$)/;
    if (!regIdCard.test(idcard)) {
        return false;
    } else {
        let year = idcard.substr(6, 4)
        let month = idcard.substr(10, 2)
        let day = idcard.substr(12, 2)
        return isValidDate(new Date(year + '/' + month + '/' + day))
    }
}

// 失去焦点重置滚动条blurResetScroll
utils.blurResetScroll = function () {
    setTimeout(function () {
        let scrollHeight =
            document.documentElement.scrollTop || document.body.scrollTop || 0;
        window.scrollTo(0, Math.max(scrollHeight - 1, 0));
    }, 100);
}

utils.checkWxOpenId = function () {
    if (store.state.openid) {
        return true;
    } else if (store.getters.getOpenId) {
        return true;
    } else if (Utils.getCookie("openid")) {
        store.commit("setWxOpenId", Utils.getCookie("openid"));
        return true;
    } else {
        return false;
    }
};

// 获取微信授权重定向
utils.wxAuthorization = function (route) {
    route = route ? route : "";
    let routeUrl = "https://xm.jinxinbang.com/" + route;
    window.location.href =
        "https://open.weixin.qq.com/connect/oauth2/authorize?appid=wxdc61b11cf36beff7&redirect_uri=" +
        encodeURIComponent(routeUrl) +
        "&response_type=code&scope=snsapi_userinfo&state=STATE#wechat_redirect";
};



utils.validate = function (reg, emptyMsg, regMsg) {
    let regs = {
        number: /(^0{1}$)|(^[1-9]\d*$)/,
        nickname: /^([\u4e00-\u9fa5]||\w){4,16}$/,
        name: /^\w{4,16}$/,
        phone: /^1[3-8]\d{9}$/,
        term: /^[1-9]\d*$/,
        code: /^[0-9a-zA-Z]*$/
    }
    return (rule, value, callback) => {
        if (emptyMsg && value === '') {
            return callback(new Error(emptyMsg));
        }

        if (regMsg && !regs[reg].test(value)) {
            return callback(new Error(regMsg));
        }

        callback();
    };
}

export default utils;