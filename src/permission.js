import router from "./router";
import utils from "./utils";

// // 微信路由守卫
// router.beforeEach((to, from, next) => {
//   // 模拟数据
//   if (utils.configObj().isDebug) {
//     utils.setStorage("userInfo", JSON.stringify(fakeUser.userInfo));
//     // utils.setStorage("phone", fakeUser.phone);
//     utils.setStorage("user", fakeUser.user);
//     // store.commit('setUserToken',fakeUser.userToken)// 登录成功的userToken
//     next();
//     return;
//   }
//   // 不用授权
//   if (to.meta.noAuth) {
//     next();
//     return;
//   }
//   // 没有openid获取授权
//   if (!utils.checkWxOpenId()) {
//     const code = utils.getCode();
//     if (code) {
//       utils.showLoading("正在授权");
//       wxOpenid({ code: code })
//         .then(res => {
//           utils.hideLoading();
//           if (res && res.code == 200) {
//             let userInfo = {
//               nickname: res.data.nickname,
//               sex: res.data.sex,
//               avatar: res.data.avatar,
//               thirdid: res.data.openid,
//               openid: res.data.openid
//             };
//             utils.setCookie("openid", res.data.openid);
//             store.commit("setWxOpenId", res.data.openid);
//             utils.setStorage("userInfo", JSON.stringify(userInfo));
//             store.commit("setUserInfo", userInfo);
//             // 2.第三方登录获取user和userToken
//             userLoginThird({ thirdid: res.data.openid, type: "wechat" })
//               .then(response => {
//                 if (response.code == 200) {
//                   if (response.data) {
//                     utils.setStorage("user", response.data.user); // 用户的id
//                     if (!!response.data.phone) {
//                       utils.setStorage("phone", response.data.phone); // 用户的phone
//                       store.commit('setUserToken', response.data.userToken)// 登录成功的userToken
//                     }
//                   }
//                 }
//                 next(); // 执行
//               })
//               .catch(err => {
//                 console.log(err);
//                 utils.hideLoading();
//                 utils.toast("登录失败" + err);
//               });
//           }
//         })
//         .catch(err => {
//           console.log(err);
//           utils.hideLoading();
//           utils.toast("微信授权失败" + err);
//         });
//     } else {
//       let route = location.hash || "";
//       utils.wxAuthorization(route);
//     }
//   } else {
//     next();
//   }
// });

// // 系统路由导航
// router.beforeEach((to, from, next) => {
//   // 如果需要登录并且无用户手机号
//   if (
//     to.meta.requireAuth &&
//     (!utils.getStorage("phone") || !utils.getStorage("user"))
//   ) {
//     if (typeof bindTelAlert == "function") {
//       bindTelAlert();
//       next(false);
//     } else {
//       next();
//     }
//     // store.commit("setShowBindPopup",new Date())
//   } else {
//     next();
//   }
// });

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

