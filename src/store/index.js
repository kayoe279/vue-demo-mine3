import Vue from 'vue';
import Vuex from 'vuex';
import persistedState from 'vuex-persistedstate'
Vue.use(Vuex)

export default new Vuex.Store({
    state: {
        title: '默认标题',
        count: 0,
        List: [], // 保存列表
        userInfo: {
            UserId: "Add_user_2019111900171",
            UserName: "海沧区",
            OfficeId: "350205",
            OfficeName: "海沧区",
            DepartmentId: "350205",
            DepartmentName: null,
            Token: "FB03CB543F9E5ABEC9549C24F91B5419"
        }, // 用户信息
    },
    // getters相当于vuex的计算属性 获取到state的一些派生状态
    getters: {
        getTitle(state) {
            return state.title
        },
        getCount(state) {
            return state.count || 0
        },
        getList(state) {
            return state.List
        },
        getUserInfo(state) {
            return state.userInfo || {}
        },
    },
    //触发的方法(同步) 
    mutations: {
        setTitle(state, newTitle) {
            state.title = newTitle
        },
        increment(state, newCount) {
            state.count += newCount
        },
        // 列表
        setList(state, item) {
            state.List.push(item)
        },
        // 清空列表
        clearList(state) {
            state.count = 0;
            state.List = []
        },
        setUserInfo(state, userInfo) {
            state.userInfo = userInfo || {}
        },
    },
    // 异步 出发mutations方法
    actions: {
        // context ==store对象差不多写成 {commit,state}等等 
        invokeList(context, item) {
            context.commit('setList', item)
        },
        clearList(context) {
            context.commit('clearList')
        }
    },
    // 持久化vuex  
    // 1.默认是在localstorage里
    plugins: [persistedState()]
    // 2.如要在无痕模式在浏览 可以存在sessionstorage里 for example :
    /**plugins: [
            persistedState({ storage: window.sessionStorage })
        ]
     //3. 以下为cookie:
        plugins: [
            persistedState({
            storage: {
                getItem: key => Cookies.get(key),
                setItem: (key, value) => Cookies.set(key, value, { expires: 7 }),
                removeItem: key => Cookies.remove(key)
            }
            })
        ]
     * **/
})
