<!-- плашка рекомендованного маршрута - не готово! -->
<!-- надо проверить, после завершения создания и редактирования маршрута -->
<template>
    <router-link tag="div" :to="link" class="route">
        <div class="route__image">
            <img :src="image" :alt="data.name" >
            <div class="like" @click="handleAddToMyRoute" :class="{ 'active': isLike }"/>
        </div>
        <div class="route__body without-scroll-area">
            <div class="title">{{ data.name }}</div>
            <div class="points">
                <span class="label">Точка старта</span>
                <span class="point-value">{{ data.pointStart.name }}</span>

                <span class="label">Точка назначения</span>
                <span class="point-value">{{ data.pointEnd.name }}</span>
            </div>
            <div class="route__params">
                <div class="way" v-if="getWay">
                    <Icon icon="way" />
                    {{ getWay }}</div>
                <div class="route__hour" v-if="getHour">
                    <Icon icon="time" />
                    {{ getHour }}</div>
                <div class="route__movement">
                    <div class="item" v-for="item in data.typesOfMovement">
                        <Icon :icon="item" />
                        <span>{{ getMovement(item) }}</span>
                    </div>
                </div>
                <div class="route__types">
                    <div class="item" v-for="item in data.tags">
                        {{ `#${item.name}` }}
                    </div>
                </div>
            </div>
        </div>
    </router-link>
</template>

<script>
    import {Presenter} from "../../presenter";
    import Icon from "../icon"
    import {isEmpty} from "lodash";
    import Repository from "../../repository";

    const presenter = new Presenter();
    const repository = new Repository();
    export default {
        name: "index",
        components: {
            Icon,
        },
        props: {
            data: {
                id: [Number, String],
                like: Boolean,
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
            },
            onRefresh: Function,
        },
        methods: {
            handleAddToMyRoute(e) {
                e.preventDefault();
                const formData = new FormData();
                formData.append('id_user', 1)
                formData.append('id_router', this.data.id)
                repository.likeRoute(formData).then(this.onRefresh);
            },
            getMovement(movement) {
                return presenter.getNameMovement(movement);
            }
        },
        computed: {
            isLike() {
                return this.data.like === 1;
            },
            image() {
                if (isEmpty(this.data.files)) {
                    return null;
                }
                return `https://api.zhivoe-nasledie.ga/${this.data.files[0].url}`;
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
                return `/view-route/recomend/${this.data.id}`
            },

        }
    }
</script>

<style lang="less">
    @import 'styles';
</style>
