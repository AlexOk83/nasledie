<template>
    <div class="route">
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
    </div>
</template>

<script>
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
                const way = this.data.way / 1000;
                if (way < 1) {
                    return `${this.data.way} м`
                }

                return `${way} км`
            },
            getHour() {
                const { hours } = this.data;
                const stringHour = String(hours);
                const lastSimbol = stringHour[stringHour.length - 1];
                const balance = Number(lastSimbol);

                if (balance === 1) {
                    return `${hours} час`
                }
                if (balance < 5 && balance !== 0) {
                    return `${hours} часа`
                }
                return `${hours} часов`
            }
        }
    }
</script>

<style lang="less">
    @import 'styles';
</style>
