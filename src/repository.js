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
    GET_TYPE: () => `${API.BASE()}/type`,
    GET_TAG: () => `${API.BASE()}/tag`,

    GET_MY_ROUTES: (userId) => `${API.BASE()}/routerlist?user_id=${userId}`,
    GET_MY_ROUTE: (id) => `${API.BASE()}/routerget?id=${id}`, // 14
    EDIT_MY_ROUTE: (id) => `${API.BASE()}/routeredit?id=${id}`,
    REMOVE_MY_ROUTE: (id) => `${API.BASE()}/routerdelete?id=${id}`,

    GET_RECOMMENDED_ROUTES: () => `${API.BASE()}/routerreclist`,
    GET_RECOMMENDED_ROUTE: (id) => `${API.BASE()}/routerrecget?id=${id}`,
    EDIT_RECOMMENDED_ROUTE: (id) => `${API.BASE()}/routerrecedit?id=${id}`,
    REMOVE_RECOMMENDED_ROUTE: (id) => `${API.BASE()}/routerrecdelete?id=${id}`,

    CREATE_ROUTE: () => `${API.BASE()}/router`,
    CREATE_RECOMMENDED_ROUTE: () => `${API.BASE()}/routerrec`,
};

export default class Repository {
    getObjects(category, region, query) {
        return axios.get(API.GET_OBJECTS(category, region, query));
    }

    getRegions() {
        return axios.get(API.GET_REGION());
    }

    getTypes() {
        return axios.get(API.GET_TYPE());
    }

    getTags() {
        return axios.get(API.GET_TAG());
    }

    getMyRoutes(userId) {
        return axios.get(API.GET_MY_ROUTES(userId));
    }

    createMyRoute(data) {
        return axios.post(API.CREATE_ROUTE(), data);
    }

    getMyRoute(routeId) {
        return axios.get(API.GET_MY_ROUTE(routeId));
    }

    editMyRoute(routeId, data) {
        return axios.post(API.EDIT_MY_ROUTE(routeId), data);
    }

    deleteMyRoute(routeId) {
        return axios.get(API.REMOVE_MY_ROUTE(routeId));
    }

    createRecommendedRoute(data) {
        return axios.post(API.CREATE_RECOMMENDED_ROUTE(), data);
    }

    getRecommendedRoutes() {
        return axios.get(API.GET_RECOMMENDED_ROUTES());
    }

    getRecommendedRoute(routeId) {
        return axios.get(API.GET_RECOMMENDED_ROUTE(routeId));
    }

    editRecommendedRoute(routeId, data) {
        return axios.post(API.EDIT_RECOMMENDED_ROUTE(routeId), data);
    }

    deleteRecommendedRoute(routeId) {
        return axios.get(API.REMOVE_RECOMMENDED_ROUTE(routeId));
    }




}