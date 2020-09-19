export default {
    state: {
        view: false,
        content: null,
        text: "",
        type: null,
    },
    mutations: {
        viewModals(state, payLoad) {
            state.view = true;
            state.content = payLoad.content;
            state.text
        },
        hideModals(state) {
            state.view = false;
            state.text = "";
            state.type = null;
        }
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
