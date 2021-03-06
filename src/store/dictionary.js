import Repository from "../repository";
import {isEqual, setCoordsToNumeric} from "../utils";

const repository = new Repository();

export default {
    state: {
        regions: [],
        tags: [],
        types: [],
        recommendObjects: [],
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
        },
        getObjectsFromBase(state, payload) {
            state.recommendObjects = payload;
        }
    },
    actions: {
        getDataRegions({commit}) {
            repository.getRegions().then(response => {
                let regions = JSON.parse(response.data);
                commit('getRegionsFromBase', regions.map(region => ({...region, value: String(region.value)})))
            })
        },
        getDataTypes({commit}) {
            repository.getTypes().then(response => {
                let categories = JSON.parse(response.data);
                commit('getTypesFromBase', categories)
            })
        },
        getDataTags({commit}) {
            repository.getTags().then(response => {
                let tags = JSON.parse(response.data);
                commit('getTagsFromBase', tags.map(tag => ({...tag, value: String(tag.name)})));
            })
        },
        getObjects({commit}, payload) {
            const formData = new FormData();
            formData.append('coordinates', JSON.stringify(payload));
            repository.getRecObjects(formData).then(response => {
                let objects = JSON.parse(response.data);

                objects = objects
                    .map(o => ({
                        ...o,
                        value: o.id,
                        position: setCoordsToNumeric(o.position)
                    }))
                    .filter(obj => {
                        let filter = true;
                        payload.forEach(coord => {
                            if (isEqual(coord, obj.position)) {
                                filter = false;
                            }
                        })
                        return filter;
                    })

                commit('getObjectsFromBase', objects);
            })
        }
    },
    getters: {
        getRegions(state) {
            return state.regions;
        },
        getTags(state) {
            return state.tags;
        },
        getTypes(state) {
            return state.types;
        },
        getRecObjects(state) {
            return state.recommendObjects;
        }
    }
}
