export default {
    state: {
        view: false
    },
    mutations: {
        changePreloader(state, payLoad) {
            state.view = payLoad
        },
    },
    actions: {
        showPreloader({commit}) {
            commit('changePreloader', true)
        },
        hidePreloader({commit}) {
            commit('changePreloader', false)
        }
    },
    getters: {
        viewPreloader (state) {
            return state.view;
        }
    }
}
