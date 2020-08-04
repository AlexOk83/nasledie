<template>
    <div class="container">
        <div class="detailRouter">
            <div class="detailRouter--title">{{ route.title }}</div>
            <div class="detailRouter--text">{{ route.description }}</div>
            <div class="detailRouter--tags">
                <div class="item" v-for="item in route.routeTypes">

                    <span>#{{ item.title }}</span>
                </div>
            </div>




            <div class="detailRouter__sliders" v-if="1 == 2">
                <swiper ref="mySwiper" class="swiper" :options="swiperOptions">
                    <swiper-slide v-for="slide in route.routeSliders">
                        <img :src="slide.url" v-if="slide.type == 'image'" />
                    </swiper-slide>
                    <div class="swiper-pagination" slot="pagination"></div>
                </swiper>


            </div>
            <div class="row" v-if="1 == 2">
                <div class="sound">
                    <span class="icon icon--sound"> </span>
                    <span class="sound--title">Шум водопада </span>
                    <span class="sound--time">03:30</span>
                </div>
            </div>
            <div class="detailRouter__content">
                {{ route.content }}
            </div>
            <div class="detailRouter--title">Объекты в маршруте:</div>
            <List is-object :data="route.objects" :config="config" />
            <div class="detailRouter--title">Подробный маршрут: {{ route.title }}</div>
            <Map :from="[53.537850, 49.362708]" :to="[53.537850, 49.352708]" :points="[[53.537055, 49.352733], [53.537055, 49.351733]]"></Map>

            <Table :days="route.days" />

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
                swiperOptions: {
                    pagination: {
                        el: '.swiper-pagination'
                    },

                },
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
            var mySwiper = new Swiper('.swiper-container', {
                speed: 400,
                spaceBetween: 100
            });
            console.log(mySwiper)
        }
    }

</script>


<style lang="less">
    @import "../styles/mixins";
    @import "../styles/layout";
    @import "../components/recomended-route/styles";

    .detailRouter {
        &--title {
            .h1();
        }
        &--text {
            .text();
            margin-top: 20px;
        }
        &--tags {
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
            margin: 20px 0px;
        }
        &--title {
            .h1();
            margin-bottom: 20px;
        }
        .icon--man_base {
            background-image: url("../assets/images/icons/man_base.svg");
            background-repeat: no-repeat;
            position: absolute;
            width: 20px;
            height: 20px;
        }
        .icon--time {
            background-image: url("../assets/images/icons/clock.svg");
            background-repeat: no-repeat;
            position: absolute;
            width: 16px;
            height: 17px;
        }
        .icon--marker {
            background-image: url("../assets/images/icons/marker.svg");
            background-repeat: no-repeat;
            position: absolute;
            width: 12px;
            height: 17px;
        }

    }
</style>
