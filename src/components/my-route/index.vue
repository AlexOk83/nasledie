<!-- плашка моего маршрута - не готово! -->
<!--
    нужно после того как отладим сохранение и редактирование моего маршрута - убедиться, что тут все хорошо
    не проработано добавление в мои маршруты, каким образом мы понимаем что данный маршрут есть в моих маршрутах.. надо подумать
-->
<template>
    <router-link tag="div" :to="link" class="myRoute">
        <div class="myRoute__image">
            <img :src="image" :alt="data.name" v-if="image">
            <div class="like" @click="handleAddToMyRoute" :class="{ 'active': data.isActive }"/>
        </div>
        <div class="myRoute__body">
            <div class="title">Маршрут «{{ data.name }}»</div>
            <div class="text">{{ data.description }}</div>

            <div class="myRoute__params">
                <div class="way">
                    <Icon icon="way" />
                    {{ getWay }}</div>
                <div class="hour">
                    <Icon icon="time" />
                    {{ getHour }}</div>
                <div class="myRoute__movement">
                    <div class="item" v-for="item in data.typesOfMovement">
                        <Icon :icon="item" />
                        <span>{{ getNameMovement(item) }}</span>
                    </div>
                </div>

            </div>
            <div class="points">
                <span class="label">Точка старта</span>
                <span class="point-value">{{ data.startPoint.name }}</span>

                <span class="label">Точка назначения</span>
                <span class="point-value">{{ data.endPoint.name }}</span>
            </div>
            <div class="myRoute__objects">
                <div class="title__sub">Объекты для посещения</div>
                <div class="item" v-for="item in data.objects">
                    <Icon icon="object" />
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
    import Icon from "../icon";
    import {Presenter} from "../../presenter";
    import Repository from "../../repository";

    const presenter = new Presenter();
    const repository = new Repository();
    export default {
        name: "my-myRoute",
        components: {Button, Icon},
        props: {
            data: {
                name: String,
                description: String,
                startPoint: {
                    coordinates: Array,
                    name: String
                },
                endPoint: {
                    coordinates: Array,
                    name: String
                },
                typesOfMovement: Array,
                totalWay: Number,
                totalTime: Number,
            },
            onRefresh: Function,
        },
        methods: {
            handleAddToMyRoute() {
                repository.createMyRoute()
            },
            moveToEdit() {
                this.$router.push(`/edit-my-route/${this.data.id}`)
            },
            deleteRoute() {
                repository.deleteMyRoute(this.data.id)
                    .then(this.onRefresh)
            },
            getNameMovement(movement) {
                return presenter.getNameMovement(movement);
            }
        },
        computed: {
            image() {
                return data.files ? data.files[0].base64 : null;
            },
            getWay() {
                if (!this.data.totalWay) {
                    return null;
                }
                return presenter.getWay(this.data.way);
            },
            getHour() {
                if (!this.data.totalTime) {
                    return null;
                }
                return presenter.getDeclinedRemainder(this.data.totalTime, ['час', 'часа', 'часов'])
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
