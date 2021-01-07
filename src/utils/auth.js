import Cookies from 'js-cookie'
import CONST from "./constant"

const TokenKey = 'Admin-Token'

export function getToken() {
    return Cookies.get(TokenKey)
}

export function setToken(token) {
    return Cookies.set(TokenKey, token)
}

export function removeToken() {
    return Cookies.remove(TokenKey)
}


export function getCookie(key) {
    return Cookies.get(CONST.CookiePrefix + key)
}
export function setCookie(key, value) {
    Cookies.set(CONST.CookiePrefix + key, value, { expires: CONST.CookieExpires })
}
export function deleteCookie(key) {
    Cookies.remove(CONST.CookiePrefix + key)
}

// storage保存
export function getStorage(store, getWay = "localStorage") {
    return getWay == "localStorage" ? localStorage.getItem(CONSTANT.StoragePrefix + store) : sessionStorage.getItem(CONSTANT.StoragePrefix + store);
};
export function setStorage(store, value, setWay = "localStorage") {
    setWay == "localStorage" ? localStorage.setItem(CONSTANT.StoragePrefix + store, value) : sessionStorage.setItem(CONSTANT.StoragePrefix + store, value);
}
export function removeStorage(store, removeWay = "localStorage") {
    removeWay == "localStorage" ? localStorage.removeItem(CONSTANT.StoragePrefix + store) : sessionStorage.removeItem(CONSTANT.StoragePrefix + store);
}