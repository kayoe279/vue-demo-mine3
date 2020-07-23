import Vue from 'vue';
import Vuex from 'vuex';
import collection from './modules/collection'
import footerStatus from './modules/footerStatus'
import persistedState from 'vuex-persistedstate'
Vue.use(Vuex) 

export default new Vuex.Store({
    modules: {
        footerStatus,
        collection
    },
    plugins: [persistedState()]
});