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
                    <span class="icon " :class="data.wayIcon" />
                    {{ getWay }}</div>
                <div class="route__hour">
                    <span class="icon " :class="data.hoursIcon" />
                    {{ getHour }}</div>
                <div class="route__movement">
                    <div class="item" v-for="item in data.typesOfMovement">
                        <span class="icon " :class="item.icon" />
                        <span>{{ item.title }}</span>
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

    const presenter = new Presenter();
    export default {
        name: "index",
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
            }
        }
    }
</script>

<style lang="less">
    @import 'styles';
</style>
