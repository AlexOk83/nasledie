<!-- плашка моего маршрута - не готово! -->
<!--
    нужно после того как отладим сохранение и редактирование моего маршрута - убедиться, что тут все хорошо
    не проработано добавление в мои маршруты, каким образом мы понимаем что данный маршрут есть в моих маршрутах.. надо подумать
-->
<template>
    <router-link tag="div" :to="link" class="myRoute">
        <div class="myRoute__image">
            <img :src="image" :alt="data.name" v-if="image">
            <div class="like" v-if="data.parent_id" />
        </div>
        <div class="myRoute__body">
            <div class="title">Маршрут «{{ data.name }}»</div>
            <div class="text">{{ data.description }}</div>

            <div class="myRoute__params">
                <div class="way">
                    <Icon icon="way" />
                    {{ getWay }}
                </div>
                <div class="hour">
                    <Icon icon="time" />
                    {{ getHour }}
                </div>
                <div class="myRoute__movement">
                    <div class="item" v-for="item in data.typesOfMovement">
                        <Icon :icon="item" />
                        <span>{{ getNameMovement(item) }}</span>
                    </div>
                </div>

            </div>
            <div class="points">
                <span class="label">Точка старта</span>
                <span class="point-value">{{ data.startPoint }}</span>

                <span class="label label--end">Точка назначения</span>
                <span class="point-value">{{ data.endPoint }}</span>
            </div>
            <div class="myRoute__objects">
                <div class="title__sub">Объекты для посещения</div>
                <div class="item" v-for="item in data.objects">
                    <Icon icon="object" />
                    {{ item.name }}
                </div>
            </div>
            <div class="myRoute__buttons">
                <Button text="Редактировать маршрут" is-shadow :on-click="() => moveToEdit()" />
                <Button text="Удалить маршрут"  is-shadow color="grey" icon="delete" :on-click="() => deleteRoute()" />
            </div>

        </div>
    </router-link>
</template>

<script>
    import Button from "../form-control/button/button";
    import Icon from "../icon";
    import {Presenter} from "../../presenter";
    import Repository, { API } from "../../repository";
    import { isEmpty } from 'lodash';
    import {BASE_PATH} from '../../constants';

    const presenter = new Presenter();
    const repository = new Repository();
    export default {
        name: "my-myRoute",
        components: {Button, Icon},
        props: {
            data: {
                name: String,
                description: String,
                startPoint: String,
                endPoint: String,
                typesOfMovement: Array,
                totalWay: Number,
                totalTime: Number,
                parent_id: Number,
            },
            onRefresh: Function,
        },
        methods: {
            moveToEdit() {
                //this.$router.push(`${BASE_PATH}/edit-my-route/${this.data.id}`)
              window.location.href = `http://zhivoe-nasledie.ga:81/route/edit#/edit-my-route/${this.data.id}`;
            },
            deleteRoute() {
                this.$store.dispatch('showModalConfirm', {
                    text: 'Вы действительно хотите удалить этот маршрут?',
                    onConfirm: this.onDelete
                })
            },
            onDelete() {
                this.$store.dispatch('showPreloader');
                repository.deleteRoute(this.$store.getters.getUserId, this.data.id)
                    .then(this.onRefresh)
                    .finally(() => {
                        this.$store.dispatch('hidePreloader');
                    })
            },
            getNameMovement(movement) {
                return presenter.getNameMovement(movement);
            }
        },
        computed: {
            image() {
                if (isEmpty(this.data.files)) {
                    return null;
                }
                return `${API.BASE()}/${this.data.files[0].url}`;
            },
            getWay() {
                if (!this.data.totalWay) {
                    return null;
                }
                return presenter.getWay(this.data.totalWay);
            },
            getHour() {
                if (!this.data.totalTime) {
                    return null;
                }
                return presenter.getTime(this.data.totalTime)
            },
            link() {
                return `${BASE_PATH}/view-route/my/${this.data.id}`
            }
        }
    }
</script>

<style lang="less">
    @import 'styles';
</style>
