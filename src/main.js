import Vue from 'vue'
import VueRouter from 'vue-router'
import store from './store'
import App from './App.vue'
import router from './routes'
import VueAwesomeSwiper from 'vue-awesome-swiper'

Vue.use(VueRouter);

Vue.use(VueAwesomeSwiper);

new Vue({
    el: '#app',
    store,
    render: h => h(App),
    renderError (h, err) {
        return h('pre', { style: { color: 'red' }}, err.stack)
    },
    router
});
