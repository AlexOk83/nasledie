import VueRouter from 'vue-router'
import MyRoute from './pages/MyRoute'
import RecommendedRoute from './pages/RecommendedRoute'
import ListRecommendedRoutes from './pages/ListRecommendedRoutes'
import ListMyRoutes from './pages/ListMyRoutes'
import ViewRoute from './pages/ViewRoute'

export default new VueRouter({
    routes: [
        {
            name: 'Составить маршрут пользователя',
            path: '/',
            component: MyRoute,
        },
        {
            name: 'Редактирование маршрута пользователя',
            path: '/edit-my-route/:id',
            component: MyRoute,
        },
        {
            name: 'Составить рекомендованный маршрут',
            path: '/create-recommended-route',
            component: RecommendedRoute,
        },
        {
            name: 'Редактирование рекомендованного маршрута',
            path: '/edit-recommended-route/:id',
            component: RecommendedRoute,
        },
        {
            name: 'Рекомендованные маршруты',
            path: '/list-recommended-routes',
            component: ListRecommendedRoutes,
        },
        {
            name: 'Мои маршруты',
            path: '/list-my-routes',
            component: ListMyRoutes,
        },
        {
            name: 'Просмотр маршрута',
            path: '/view-route/:type/:id',
            component: ViewRoute,
        },
    ],
})

