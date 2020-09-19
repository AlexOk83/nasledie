export default {
    state: {
        regions: [],
        tags: [],
    },
    mutations: {
        getRegions(state, payLoad) {
            state.regions = payLoad
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
        getRegions (state) {
            return state.regions;
        },
        getTags (state) {
            return state.tags;
        }
    }
}
