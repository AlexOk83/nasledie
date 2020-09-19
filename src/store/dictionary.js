import Repository from "../repository";
const repository = new Repository();

export default {
    state: {
        regions: [],
        tags: [],
        types: [],
    },
    mutations: {
        getRegionsFromBase(state, payLoad) {
            state.regions = payLoad;
        },
        getTagsFromBase(state, payload) {
            state.tags = payload;
        },
        getTypesFromBase(state, payload) {
            state.types = payload;
        }
    },
    actions: {
        getDataRegions({commit}) {
            repository.getRegions().then(response => {
                let regions = JSON.parse(response.data);
                commit('getRegionsFromBase', regions.map(region => ({ ...region, value: String(region.value)})) )
            })
        },
        getDataTypes({commit}) {
            repository.getTypes().then(response => {
                let categories = JSON.parse(response.data);
                commit('getTypesFromBase', categories )
            })
        },
        getDataTags({commit}) {
            repository.getTags().then(response => {
                let tags = JSON.parse(response.data);
                commit('getTagsFromBase', tags.map(tag => ({ ...tag, value: String(tag.name)})) );
            })
        },
    },
    getters: {
        getRegions (state) {
            return state.regions;
        },
        getTags (state) {
            return state.tags;
        },
        getTypes (state) {
            return state.types;
        }
    }
}
