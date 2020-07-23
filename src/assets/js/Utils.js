import CONST from './const'
var Utils = {
    getCookie(app, key) {
        return app.$cookie.get(CONST.cookiePrefix + key)
    },
    setCookie(app, key, value) {
        return app.$cookie.set(CONST.cookiePrefix + key, value, { expires: CONST.cookieExpires })
    },
    deleteCookie(app, key) {
        return app.$cookie.delete(CONST.cookiePrefix + key)
    },
    // 判断是不是微信内置浏览器
    isWxBrowser() {
        const ua = window.navigator.userAgent.toLowerCase();
        if (ua.match(/MicroMessenger/i) == 'micromessenger') {
            return true;
        } else {
            return false;
        }
    },
    weChatLogin(app) {
        if (Utils.isWxBrowser()) {
            // appid公众号的唯一标识
            // https://open.weixin.qq.com/connect/oauth2/authorize?appid=APPID&redirect_uri=REDIRECT_URI&response_type=code&scope=SCOPE&state=STATE#wechat_redirect 
            var wechatId = app.$store.state.wechatId || Utils.getCookie('wechatId');
            // 用户列表筛选,如果存在即授权过 使用snsapi_base静默登录. 默认用这个吧=>获取用户信息snsapi_userinfo 
            var userList = app.$store.state.userList;
            var url = encodeURIComponent('http://localhost:8080/#/index');
            var onlyUser = [
                userList.find(function (item) {
                    return item.openid == wechatId
                })
            ];
            var SCOPE = onlyUser.length == 0 ? 'snsapi_userinfo' : 'snsapi_base';
            axios.post('https://open.weixin.qq.com/connect/oauth2/authorize?appid=APPID&redirect_uri=' + url + '&response_type=code&scope=' + SCOPE + '&state=123#wechat_redirect ').then(res => {
                if (res.code) {
                    //缓存code 5分钟未被使用自动过期
                    Utils.setCookie(app, 'code', res.code)
                    // 通过code换取网页acess_token,如果是snsapi_base 同时还会获取用户openid 到此结束
                    axios.post('https://api.weixin.qq.com/sns/oauth2/access_token?appid=APPID&secret=SECRET&code=' + Utils.getCookie(app, 'code') + '&grant_type=authorization_code').then(res => {
                        if (res) {
                            let tokens = res.acess_token;
                            Utils.setCookie(app, 'token', tokens)
                            app.$store.commit('setWeChatId', res.openid);
                            Utils.setCookie(app, 'wechatId', res.openid)
                            // 检验token是否有效
                            axios.post('https://api.weixin.qq.com/sns/auth?access_token=' + tokens + '&openid=' + Utils.getCookie('wechatId')).then(res => {
                                if (res.errcode == 40003) {
                                    axios.post('https://api.weixin.qq.com/sns/oauth2/access_token?appid=APPID&secret=SECRET&code=' + Utils.getCookie(app, 'code') + '&grant_type=authorization_code').then(res => {
                                        console.log('新的acess__token', res.acess_token)
                                    }).catch(res => {
                                        app.$vux.toast(res.errmsg)
                                    })
                                }
                            })
                            if (SCOPE == 'snsapi_userinfo') {
                                // 获取用户信息
                                axios.post('https://api.weixin.qq.com/sns/userinfo?access_token=' + res.acess_token + '&openid=' + res.openid + '&lang=zh_CN').then(res => {
                                    if (res) {
                                        app.$store.commit('setUserInfo', res)
                                        app.$store.commit('setUserList', res)
                                        Utils.setCookie(app, 'userId', res)
                                    }
                                })
                            }
                        }
                    }).catch(res => {
                        if (res.errcode) app.$vux.toast(res.errmsg)
                    })
                }
            }).catch(res => {
                if (res.errcode) app.$vux.toast('错误')
            })
        }
    },
    others() {
        console.log('还有些什么其他的吗?')
    }

}

export default Utils;
