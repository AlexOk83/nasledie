<template>

    <router-link tag="div" :to="link" class="route">
        <div class="route__image">
            <img :src="data.image" :alt="data.title" >
            <div class="like" @click="handleAddToMyRoute" :class="{ 'active': data.isActive }"/>
        </div>
        <div class="route__body">
            <div class="title">{{ data.title }}</div>
            <div class="points">
                <span class="label">Точка старта</span>
                <span class="point-value">{{ data.pointStart.name }}</span>

                <span class="label">Точка назначения</span>
                <span class="point-value">{{ data.pointEnd.name }}</span>
            </div>
            <div class="route__params">
                <div class="way">
                    <Icon icon="way" />
                    {{ getWay }}</div>
                <div class="route__hour">
                    <Icon icon="time" />
                    {{ getHour }}</div>
                <div class="route__movement">
                    <div class="item" v-for="item in data.typesOfMovement">
                        <Icon :icon="item" />
                        <span>{{ getMovement(item) }}</span>
                    </div>
                </div>
                <div class="route__types">
                    <div class="item" v-for="item in data.routeTypes">
                        {{ `#${item.title}` }}
                    </div>
                </div>
            </div>
        </div>
    </router-link>
</template>

<script>
    import {Presenter} from "../../presenter";
    import Icon from "../icon"

    const presenter = new Presenter();
    export default {
        name: "index",
        components: {
            Icon,
        },
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
                routeTypes: Array,
            }
        },
        methods: {
            handleAddToMyRoute() {

            },
            getMovement(movement) {
                return presenter.getNameMovement(movement);
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
                return `/view-route/recomend/${this.data.id}`
            },

        }
    }
</script>

<style lang="less">
    @import 'styles';
</style>
