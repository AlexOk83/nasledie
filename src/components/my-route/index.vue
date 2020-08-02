<template>
    <router-link tag="div" :to="link" class="myRoute">
        <div class="myRoute__image">
            <img :src="data.image" :alt="data.title" >
            <div class="like" @click="handleAddToMymyRoute" :class="{ 'active': data.isActive }"/>
        </div>
        <div class="myRoute__body">
            <div class="title">Маршрут «{{ data.title }}»</div>
            <div class="text">{{ data.description }}</div>

            <div class="myRoute__params">
                <div class="way">
                    <span class="icon icon--way" />
                    {{ getWay }}</div>
                <div class="hour">
                    <span class="icon icon--time" />
                    {{ getHour }}</div>
                <div class="myRoute__movement">
                    <div class="item" v-for="item in data.typesOfMovement" :data="item.type">
                        <span class="icon " :class="'icon--' + item.type" />
                        <span>{{ item.title }}</span>
                    </div>
                </div>

            </div>
            <div class="points">
                <span class="label">Точка старта</span>
                <span class="point-value">{{ data.pointStart.name }}</span>

                <span class="label">Точка назначения</span>
                <span class="point-value">{{ data.pointEnd.name }}</span>
            </div>
            <div class="myRoute__objects">
                <div class="title__sub">Объекты для посещения</div>
                <div class="item" v-for="item in data.objects">
                    <span class="icon icon--object"  />
                    {{ item.name }}
                </div>
            </div>
            <div class="myRoute__buttons">
                <Button text="Редактировать маршрут" is-shadow :on-click="moveToEdit" />
                <Button text="Удалить маршрут"  is-shadow color="grey" icon="delete" :on-click="deleteRoute" />
            </div>

        </div>
    </router-link>
</template>

<script>
    import Button from "../form-control/button";
    import {Presenter} from "../../presenter";

    const presenter = new Presenter();
    export default {
        name: "my-myRoute",
        components: {Button},
        props: {
            data: {
                title: String,
                description: String,
                pointStart: {
                    coordinates: Array,
                    name: String
                },
                pointEnd: {
                    coordinates: Array,
                    name: String
                },
                typesOfMovement: Array,
                myRouteTypes: Array,
            },
            onRefresh: Function,
        },
        methods: {
            handleAddToMymyRoute() {

            },
            moveToEdit() {
                this.$router.push(`/edit-route/${this.data.id}`)
            },
            deleteRoute() {
                this.$resource('myRoutes/' + this.data.id).remove()
                    .then(this.onRefresh)
            }
        },
        computed: {
            getWay() {
                return presenter.getWay(this.data.way);
            },
            getHour() {
                return presenter.getDeclinedRemainder(this.data.hours, ['час', 'часа', 'часов'])
            },
            link() {
                return `/view-route/my/${this.data.id}`
            }
        }
    }
</script>

<style lang="less">
    @import 'styles';
</style>
