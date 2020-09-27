<template>
    <div id="app">
        <Preloader
            v-show="viewPreloader"
        />
        <Modals />
        <div class="container">
            <div class="menu">
                <router-link tag="a" to="/" >Составить маршрут пользователя</router-link>
                <router-link tag="a" to="/create-recommended-route" >Составить рекомендованный маршрут</router-link>
                <router-link tag="a" to="/list-recommended-routes" >Рекомендованные маршруты</router-link>
                <router-link tag="a" to="/list-my-routes" >Мои маршруты</router-link>
            </div>

            <router-view />
        </div>
    </div>
</template>

<script>
    import Preloader from './components/preloader';
    import Modals from './components/modals/modals';
    export default {
        components: {
            Preloader,
            Modals,
        },
        computed: {
            viewPreloader() {
                return this.$store.getters.viewPreloader
            }
        },
        created() {
            this.$store.dispatch('getDataRegions');
            this.$store.dispatch('getDataTags');
            this.$store.dispatch('getDataTypes');
            this.$store.dispatch('aUserId', 1);
        }
    }
</script>

<style lang="less">
    @import "./styles/layout.less";
</style>