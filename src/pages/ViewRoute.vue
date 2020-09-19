<template>
    <div class="container">
        <Bread-crumbs
            :list-link="listLink"
        />
        <div class="detail" v-if="this.route.id">
            <div class="detail__title">{{ title }}</div>
            <div class="detail__header">
                <div class="detail__name">{{ route.name }}</div>
                <Button text="В мои маршруты" icon-right icon="arrow-right" is-shadow color="green" :on-click="addToMyRoute" v-if="type === 'recomend'"/>
            </div>

            <div class="detail__description">{{ route.description }}</div>
            <div class="detail__tags">
                <div class="item" v-for="item in route.tags">
                    <span>#{{ item.name }}</span>
                </div>
            </div>
            <div class="detail__tags">
                <div class="item item-with-icon" v-for="item in route.regions">
                    <Icon icon="way" />
                    <span>{{ item.name }}</span>
                </div>
            </div>
            <Slider :files="route.files" :like="isLike" />

            <div class="detail__description">{{ route.content }}</div>
            <div v-if="route.objects">
                <div class="detail--title">Объекты в маршруте:</div>
                <List is-object :data="route.objects" :config="config" />
            </div>

            <div class="detail--title">Подробный маршрут: {{ route.name }}</div>
            <div class="detail__map">
                <Map v-if="visibleMap" :from="route.pointStart.coordinates" :days="route.days" />
            </div>

            <Table :columns="columns" :days="route.days" v-if="route.days && route.days.length > 0" />

            <div class="buttons-container">
                <Button text="В мои маршруты" icon-right icon="arrow-right" is-shadow color="green" :on-click="addToMyRoute" v-if="type === 'recomend'"/>
                <Button text="Удалить маршрут" is-shadow color="white" :on-click="remove" />
                <Button text="Редактировать маршрут" is-shadow color="white" :on-click="edit" />
            </div>

        </div>

    </div>

</template>
<script>
    import Button from '../components/form-control/button/button'
    import Map from "../components/map/MapTest";
    import Slider from "../components/slider/slider";
    import List from "../components/route-list/routeListView";
    import Table from "../components/table/table";
    import { Presenter } from "../presenter";
    import Repository from "../repository";
    import BreadCrumbs from '../components/bread-сrumbs'
    import { isEmpty } from 'lodash';
    import Icon from '../components/icon'
    const presenter = new Presenter();
    const repository = new Repository();


    export default {
        name: "ViewRecommendedRoute",
        components: {
            Button,
            Map,
            Slider,
            List,
            Table,
            BreadCrumbs,
            Icon
        },
        data() {
            return {
                id: null,
                type: null,
                route: {},
                columns: [
                    'День/старт/финиш',
                    'Путь до объекта',
                    'Способ передвижения',
                    'Остановка',
                    'Посещение объекта'
                ],
                config: {
                    colDesktop: 2,
                    colTablet: 2,
                },
                routesList: [],
                isObject: true
            }
        },
        computed: {
            isLike() {
                return this.route.like > 0
            },
            visibleMap() {
                if (isEmpty(this.route.pointStart)) {
                    return false;
                }

                if (isEmpty(this.route.days)) {
                    return false;
                }

                return true;
            },
            title() {
                if (this.type === 'recomend') {
                    return "Рекомендованные маршруты"
                } else {
                    return "Мои маршруты"
                }
            },
            listLink() {
                const list = this.type === 'recomend' ? {
                    url: '/list-recommended-routes',
                    name: 'Рекомендованные маршруты'
                } : {
                    url: '/list-my-routes',
                    name: 'Мои маршруты'
                }
                return [list, { name: this.route.name}]
            }
        },
        methods: {
            addToMyRoute() {
                const formData = new FormData();
                formData.append('id_user', this.$store.getters.getUserId)
                formData.append('id_router', this.route.id)
                repository.likeRoute(formData).then(this.getData);
            },
            getData() {
                this.id = this.$route.params.id;
                this.type = this.$route.params.type;
                this.$store.dispatch('showPreloader');
                console.log(this.$store.getters.getUserId)
                repository.getMyRoute(this.$store.getters.getUserId, this.id).then(response => {
                    console.log(JSON.parse(response.data));
                    const data = JSON.parse(response.data);
                    this.route = data.router;
                }).finally(() => {
                    this.$store.dispatch('hidePreloader');
                })
            },
            remove() {
                if (confirm(`Вы действительно хотите удалить маршрут "${this.route.name}"`)) {
                    repository.deleteRoute(this.$store.getters.getUserId, this.route.id)
                        .then(() => {
                            if (this.type === 'recomend') {
                                this.$router.push('/list-recommended-routes')
                            } else {
                                this.$router.push('/list-my-routes')
                            }
                        })
                }
            },
            edit() {
                if (this.type === 'recomend') {
                    this.$router.push(`/edit-recommended-route/${this.route.id}`)
                } else {
                    this.$router.push(`/edit-my-route/${this.route.id}`)
                }
            }
        },
        created() {
            this.getData();
        }
    }

</script>


<style lang="less">
    @import "../styles/mixins";

    .detail {
        &__title {
            font-size: 28px;
            line-height: 33px;
            margin-top: 26px;
            margin-bottom: 50px;
        }
        &__header {
            display: flex;
            justify-content: space-between;
            margin-bottom: 25px;
        }
        &__name {
            font-size: 23px;
        }
        &--title {
            font-size: 24px;
            font-weight: 500;
            line-height: 30px;
            margin-bottom: 20px;
        }
        &__description {
            font-size: 14px;
            margin-bottom: 35px;
        }
        &__map {
            margin-bottom: 50px;
            border-radius: 20px;
            overflow: hidden;
        }
        &__tags {
            display: flex;
            flex-wrap: wrap;
            margin-bottom: 20px;
            .item {
                position: relative;
                background: @greyButton;
                border-radius: 30px;
                float: left;
                margin-right: 20px;
                padding: 10px 20px;
                .text();
                color: @colorLink;
                &-with-icon {
                    padding-left: 50px;
                    .icon {
                        left: 20px;
                    }
                }
            }
        }
        &__content {
            .text();
            margin: 20px 0;
        }
    }
</style>
