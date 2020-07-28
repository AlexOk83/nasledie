import VueRouter from 'vue-router'
import CreateRoute from './pages/CreateRoute'
import Map from './map/Map'
import EditRoute from './pages/EditRoute'
import CreateRecommendedRoute from './pages/CreateRecommendedRoute'
import RecommendedRoutesList from './pages/RecommendedRoutesList'
import ViewRecommendedRoute from './pages/ViewRecommendedRoute'
import MyRoutes from './pages/MyRoutes'

export default new VueRouter({
    routes: [
        {
            name: 'Open map',
            path: '/map',
            component: Map,
        },
        {
            name: 'Создание маршрута',
            path: '/',
            component: CreateRoute,
        },
        {
            name: 'Редактирование маршрута',
            path: '/edit-route/:id',
            component: EditRoute,
        },
        {
            name: 'Создание рекомендованных маршрутов',
            path: '/edit-recommended-route/:id',
            component: CreateRecommendedRoute,
        },
        {
            name: 'Рекомендованные маршруты',
            path: '/create-recommended-route',
            component: RecommendedRoutesList,
        },
        {
            name: 'Просмотр рекомендованного маршрута',
            path: '/recommended-route/:id',
            component: ViewRecommendedRoute,
        },
        {
            name: 'Мои маршруты',
            path: '/my-routes',
            component: MyRoutes,
        },
    ],
})

