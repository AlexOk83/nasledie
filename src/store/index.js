import Vue from 'vue'
import Vuex from 'vuex'
import Preloader from './preloader'
import Dictionary from './dictionary'
import Modals from './modals'

Vue.use(Vuex);

export default new Vuex.Store({
    modules: {
        Preloader,
        Dictionary,
        Modals,
    },
    state: {
        userId: null,
    },
    mutations: {
        mUserId(state, payload) {
            state.userId = payload
        }
    },
    actions: {
        aUserId ({commit}, payload) {
            commit('mUserId', payload)
        }
    },
    getters: {
        getUserId (state) {
            return state.userId;
        }
    }
});

