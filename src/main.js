import Vue from 'vue'
import VueRouter from 'vue-router'
import store from './store'
import App from './App.vue'
import router from './routes'
import VueResource from 'vue-resource'
import VueAwesomeSwiper from 'vue-awesome-swiper'

Vue.use(VueRouter);
Vue.use(VueResource);
Vue.use(VueAwesomeSwiper);

Vue.http.options.root = 'http://localhost:3000/';

Vue.http.interceptors.push(request => {
    request.headers.set('Auth', 'RAND TOKEN ' + Math.random())
});
//
// Vue.config.errorHandler = function(err, vm, info) {
//     console.log(`Error: ${err.toString()}\nInfo: ${info}`);
// }
//
// Vue.config.warnHandler = function(msg, vm, trace) {
//     console.log(`Warn: ${msg}\nTrace: ${trace}`);
// }

new Vue({
    el: '#app',
    store,
    render: h => h(App),
    renderError (h, err) {
        return h('pre', { style: { color: 'red' }}, err.stack)
    },
    router
});
