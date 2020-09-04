import axios from 'axios';

const API = {
    BASE: () => 'https://api.zhivoe-nasledie.ga',
    GET_OBJECTS: (category, region, query) => {
        let params = '?';
        let paramsJoin = '';
        if (category) {
            params = params + `type=${category}`
            paramsJoin = '&';
        }
        if (region) {
            params = params + `${paramsJoin}region=${region}`
            paramsJoin = '&';
        }
        if (query) {
            params = params + `${paramsJoin}query=${query}`
        }
        return `${API.BASE()}/object${params}`
    },
    GET_REGION: () => `${API.BASE()}/region`,
    GET_TYPE: () => `${API.BASE()}/type`
};

export default class Repository {
    

    getObjects(category, region, query) {
        return axios.get(API.GET_OBJECTS(category, region, query));
    }

    getRegion() {
        return axios.get(API.GET_REGION());
    }

    getType() {
        return axios.get(API.GET_TYPE());
    }

}