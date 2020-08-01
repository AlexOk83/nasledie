<template>
    <div class="myRoute">
        <div class="myRoute__image">
            <img :src="data.image" :alt="data.title" >
            <div class="like" @click="handleAddToMymyRoute" :class="{ 'active': data.isActive }"/>
        </div>
        <div class="myRoute__body">
            <div class="title">{{ data.title }}</div>
            <div class="text">{{ data.description }}</div>

            <div class="myRoute__params">
                <div class="way">
                    <span class="icon " :class="data.wayIcon" />
                    {{ getWay }}</div>
                <div class="myRoute__hour">
                    <span class="icon " :class="data.hoursIcon" />
                    {{ getHour }}</div>
                <div class="myRoute__movement">
                    <div class="item" v-for="item in data.typesOfMovement">
                        <span class="icon " :class="item.icon" />
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
                <Button text="Редактировать маршрут" isShadow=true color="blue" ></Button>
                <div class="button_space"></div>
                <Button text="Редактировать маршрут"  color="grey" icon="delete"></Button>

            </div>

        </div>
    </div>
</template>

<script>
    import Button from "../form-control/Button";
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
            }
        },
        methods: {
            handleAddToMymyRoute() {

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
                return `${this.data.hours} часов`
            }
        }
    }
</script>

<style lang="less">
    @import 'styles';
</style>
