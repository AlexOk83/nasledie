<template>
    <div class="container">
        <div class="detailRouter">
            <div class="detailRouter__title">{{ route.title }}</div>
            <div class="detailRouter__text">{{ route.description }}</div>
            <div class="detailRouter__tags">
                <div class="item" v-for="item in route.routeTypes">
                    <span>#{{ item.title }}</span>
                </div>
            </div>

            <div class="detailRouter__content">
                {{ route.content }}
            </div>
            <div class="detailRouter--title">Объекты в маршруте:</div>
            <List is-object :data="route.objects" :config="config" />
            <div class="detailRouter--title">Подробный маршрут: {{ route.title }}</div>
            <Map :from="[53.537850, 49.362708]" :to="[53.537850, 49.352708]" :points="[[53.537055, 49.352733], [53.537055, 49.351733]]"></Map>

            <Table :columns="columns" :days="route.days" />

            <Button text="В мои маршруты" icon-right icon="arrow-right" is-shadow color="green" :on-click="moveBack" />
        </div>

    </div>

</template>
<script>
    import Button from '../components/form-control/button'
    import Map from "../components/map/index";
    import { Swiper, SwiperSlide } from 'vue-awesome-swiper'
    import List from "../components/route-list/index";
    import Table from "../components/table/index";

    export default {
        name: "ViewRecommendedRoute",
        components: {
            Button,
            Map,
            Swiper,
            SwiperSlide,
            List,
            Table
        },
        data() {
            return {
                resource: null,
                id: null,
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
        methods: {
            moveBack() {
                this.$router.push('/my-routes')
            },
            getData() {
                this.resource.get({id: this.id})
                    .then(response => response.json())
                    .then(route => {
                        this.route = route;
                        this.routesList = route.objects;
                    })
            }
        },
        created() {
            this.id = this.$route.params.id;
            const resourceLink = this.$route.params.type === 'my' ? 'myRoutes{/id}' : 'recomendRoutes{/id}'
            this.resource = this.$resource(resourceLink);
            this.getData();
        }
    }

</script>


<style lang="less">
    @import "../styles/layout";
    /*@import "../components/recomended-route/styles";*/

    .detailRouter {
        &__title {
            .h1();
            margin-bottom: 20px;
        }
        &__text {
            .text();
            margin-top: 20px;
        }
        &__tags {
            display: flex;
            flex-wrap: wrap;
            margin-top: 20px;
            .item {
                background: @greyButton;
                border-radius: 30px;
                float: left;
                margin-right: 20px;
                padding: 10px 20px;
                .text();
                color: @colorLink;
            }
        }
        &__content {
            .text();
            margin: 20px 0;
        }
    }
</style>
