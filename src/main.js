import Vue from 'vue'
import VueRouter from 'vue-router'
import store from './store'
import App from './App.vue'
import router from './routes'
import VueResource from 'vue-resource'

Vue.use(VueRouter);
Vue.use(VueResource);

Vue.http.options.root = 'http://localhost:3000/';

Vue.http.interceptors.push(request => {
    request.headers.set('Auth', 'RAND TOKEN ' + Math.random())
});


new Vue({
    el: '#app',
    store,
    render: h => h(App),
    router
});
