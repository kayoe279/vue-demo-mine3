// 全局过滤器
/**
 * 时间格式化
 * @param {Object} date  /Date(xxxxxx)/ 或者 2020-12-14T14:25
 * @param {String} fmt 时间格式 - yyyy-MM-dd hh:mm:ss
 */
const dateFormatter = function (dateStr, fmt) {
    fmt = fmt || " yyyy-MM-dd hh:mm:ss";
    dateStr = String(dateStr);
    let date;
    if (dateStr) {
        dateStr = dateStr.replace('/Date(', '').replace(')/', '').replace('T', ' ').replace(/-/g, '/');
        date = new Date(dateStr)
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
        return ''
    }
}

const formatNumber = function (num) {
    if (isNaN(num)) {
        return ""
    } else {
        return num < 10 ? '0' + num : num
    }

}

export {
    dateFormatter,
    formatNumber
}