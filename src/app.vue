<template>
    <div id="app">
        <div class="container">
            <div class="menu">
                <router-link tag="a" to="/" >Создание маршрута</router-link>
                <router-link tag="a" to="/edit-route/1" >Редактирование маршрута</router-link>
                <router-link tag="a" to="/create-recommended-route" >Создание рекомендованного маршрута</router-link>
                <router-link tag="a" to="/recommended-routes" >Рекомендованные маршруты</router-link>
                <router-link tag="a" to="/my-routes" >Мои маршруты</router-link>
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