export default {
    state: {
        regions: [],
        tags: [],
    },
    mutations: {
        getRegions(state) {
            state.regions = payLoad
        },
    },
    actions: {
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
