import Vue from 'vue'
import Router from 'vue-router'


Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      alias: '/index',
      name: 'Index',
      component: () => import('@/views/Index'),
      meta: { title: "首页" }
    },
    {
      path: "/first",
      name: "First",
      component: () => import('../views/First'),
      redirect: "/first/firstTwo/firstThree",
      children: [
        {
          path: "/first/firstTwo",
          name: "FirstTwo",
          component: () => import('../views/subPage/FirstTwo.vue'),
          children: [
            {
              path: '/first/firstTwo/firstThree',
              name: 'FirstThree',
              component: () => import('../views/subPage/childPage/FirstThree')
            },
            {
              path: '/first/firstTwo/secondThree',
              name: 'SecondThree',
              component: () => import('../views/subPage/childPage/SecondThree.vue')
            }
          ]
        },
        {
          path: "/first/secondTwo",
          name: "SecondTwo",
          component: () => import('../views/subPage/SecondTwo.vue')
        }
      ]
    },
    {
      path: "/second",
      name: "Second",
      component: () => import('../views/Second'),
      children: [
        {
          path: "/second/secondTwo",
          name: "SecondTwo2",
          component: () => import('../views/subPage/SecondTwo.vue')
        }
      ]
    },
    {
      path: '/waterfall',
      name: 'waterfall',
      component: () => import('../views/waterfall.vue')
    },
    {
      path: '/testPage',
      name: 'testPage',
      component: () => import('../views/testPage.vue')
    },
    {
      path: '/vantTest',
      name: 'vantTest',
      component: () => import('../views/test/vantTest.vue')
    },
    {
      path: '/popupTest',
      name: 'popupTest',
      component: () => import('../views/test/popupTest.vue'),
      meta: { title: "Popup弹出层" }
    },
    {
      path: '/loadingTest',
      name: 'loadingTest',
      component: () => import('../views/test/loadingTest.vue'),
      meta: { title: "Loading加载提示" }
    },
    {
      path: '/toastTest',
      name: 'toastTest',
      component: () => import('../views/test/toastTest.vue'),
      meta: { title: "Toast轻提示" }
    },
    {
      path: '/modalTest',
      name: 'modalTest',
      component: () => import('../views/test/modalTest.vue'),
      meta: { title: "Modal模态框" }
    },
    {
      path: '/calendarTest',
      name: 'calendarTest',
      component: () => import('../views/test/calendarTest.vue'),
      meta: { title: "Calendar日历" }
    },
    {
      path: "*",
      component: () => import('../views/Error'),
      hidden: true
    }
  ]
})
