<template>
    <div id="app">
        <div class="container">
            <div class="menu">
                <router-link tag="a" to="/" >Составить маршрут пользователя</router-link>
                <router-link tag="a" to="/edit-my-route/14" >Редактирование маршрута пользователя</router-link>
                <router-link tag="a" to="/create-recommended-route" >Составить рекомендованный маршрут</router-link>
                <router-link tag="a" to="/edit-recommended-route/1" >Редактирование рекомендованного маршрута</router-link>
                <router-link tag="a" to="/list-recommended-routes" >Рекомендованные маршруты</router-link>
                <router-link tag="a" to="/list-my-routes" >Мои маршруты</router-link>
            </div>

            <router-view />
        </div>
    </div>
</template>

<script>
    export default {

    }
</script>

<style lang="less">
    @import "./styles/layout.less";
</style>