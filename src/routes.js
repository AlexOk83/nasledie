import VueRouter from 'vue-router'
import MyRoute from './pages/MyRoute'
import RecommendedRoute from './pages/RecommendedRoute'
import ListRecommendedRoutes from './pages/ListRecommendedRoutes'
import ListMyRoutes from './pages/ListMyRoutes'
import ViewRoute from './pages/ViewRoute'
import {BASE_PATH} from './constants'

export default new VueRouter({
    routes: [
        {
            name: 'Составить маршрут пользователя',
            path: BASE_PATH,
            component: MyRoute,
        },
        {
            name: 'Редактирование маршрута пользователя',
            path: BASE_PATH + '/edit-my-route/:id',
            component: MyRoute,
        },
        {
            name: 'Составить рекомендованный маршрут',
            path: BASE_PATH + '/create-recommended-route',
            component: RecommendedRoute,
        },
        {
            name: 'Редактирование рекомендованного маршрута',
            path: BASE_PATH + '/edit-recommended-route/:id',
            component: RecommendedRoute,
        },
        {
            name: 'Рекомендованные маршруты',
            path: BASE_PATH + '/list-recommended-routes',
            component: ListRecommendedRoutes,
        },
        {
            name: 'Мои маршруты',
            path: BASE_PATH + '/list-my-routes',
            component: ListMyRoutes,
        },
        {
            name: 'Просмотр маршрута',
            path: BASE_PATH + '/view-route/:type/:id',
            component: ViewRoute,
        },
    ],
})

