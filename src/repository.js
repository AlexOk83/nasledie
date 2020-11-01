import axios from 'axios';

export const API = {
    BASE: () => 'https://api.zhivoe-nasledie.ga',
    GET_BRANDS: (category, region, query) => {
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
    GET_RECOM_OBJECTS: () => `${API.BASE()}/objectradius`,
    GET_TYPE: () => `${API.BASE()}/type`,
    GET_TAG: () => `${API.BASE()}/tag`,

    GET_MY_ROUTES: (userId) => `${API.BASE()}/routerlist?user_id=${userId}`,
    GET_MY_ROUTE: (userId, id) => `${API.BASE()}/routerget?user_id=${userId}&id=${id}`, // 14
    EDIT_MY_ROUTE: (userId, id) => `${API.BASE()}/routeredit?user_id=${userId}&id=${id}`,
    REMOVE_ROUTE: (userId, id) => `${API.BASE()}/routerdelete?user_id=${userId}&id=${id}`,

    GET_RECOMMENDED_ROUTES: (userId) => `${API.BASE()}/routerreclist?user_id=${userId}`,
    GET_RECOMMENDED_ROUTE: (userId, id) => `${API.BASE()}/routerrecget?user_id=${userId}&id=${id}`,
    EDIT_RECOMMENDED_ROUTE: (userId, id) => `${API.BASE()}/routerrecedit?user_id=${userId}&id=${id}`,

    CREATE_ROUTE: (userId) => `${API.BASE()}/router?user_id=${userId}`,
    CREATE_RECOMMENDED_ROUTE: (userId) => `${API.BASE()}/routerrec?user_id=${userId}`,

    LIKE: () => `${API.BASE()}/routerlike`,
};

export default class Repository {
    getBrands(category, region, query) {
        return axios.get(API.GET_BRANDS(category, region, query));
    }

    getRecObjects(data) {
        return axios.post(API.GET_RECOM_OBJECTS(), data);
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

    createMyRoute(userId, data) {
        return axios.post(API.CREATE_ROUTE(userId), data);
    }

    getMyRoute(userId, routeId) {
        return axios.get(API.GET_MY_ROUTE(userId, routeId));
    }

    editMyRoute(userId, routeId, data) {
        return axios.post(API.EDIT_MY_ROUTE(userId, routeId), data);
    }

    deleteRoute(userId, routeId) {
        return axios.get(API.REMOVE_ROUTE(userId, routeId));
    }

    createRecommendedRoute(userId, data) {
        return axios.post(API.CREATE_RECOMMENDED_ROUTE(userId), data);
    }

    getRecommendedRoutes(userId, filter) {
        return axios.post(API.GET_RECOMMENDED_ROUTES(userId), filter);
    }

    getRecommendedRoute(userId, routeId) {
        return axios.get(API.GET_RECOMMENDED_ROUTE(userId, routeId));
    }

    editRecommendedRoute(userId, routeId, data) {
        return axios.post(API.EDIT_RECOMMENDED_ROUTE(userId, routeId), data);
    }

    likeRoute(data) {
        return axios.post(API.LIKE(), data);
    }


}