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
            <div class="detailRouter__objects " v-if="1 == 2">
                <div class="row">
                    <div class="list__item col-xl-6 col-l-6 " v-for="object in route.objects">
                        <div class="route">
                            <div class="route__image">
                                <img :src="object.image" :alt="object.name" >
                            </div>
                            <div class="route__body">
                                <div class="title">{{ object.name }}</div>
                                <div class="text">{{ object.description }}</div>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
            <List is-object :data="route.objects" :config="config" />
            <div class="detailRouter--title">Подробный маршрут: {{ route.title }}</div>
            <Map :from="[53.537850, 49.362708]" :to="[53.537850, 49.352708]" :points="[[53.537055, 49.352733], [53.537055, 49.351733]]"></Map>

            <table class="tableDays">
                <thead>
                    <th>День/старт/финиш</th>
                    <th>Путь до объекта</th>
                    <th>Способ передвижения</th>
                    <th>Остановка</th>
                    <th>Посещение объекта</th>
                </thead>
                <tbody>
                    <template  v-for="day in route.days" >
                        <tr class="day" :class="day.class">
                            <td class="day__desc" :rowspan="day.objects.length + 1">
                                <div class="title blue">{{ day.title }}</div>

                                <div class="title--sub">Точка старта</div>
                                <div class="title">{{ day.pointStart.name }}</div>
                                <div class="title--sub">Дата старта</div>
                                <div class="title">{{ day.pointStart.date }}</div>
                                <div class="title--sub">Время старта</div>
                                <div class="title">{{ day.pointStart.time }}</div>

                                <div class="title--sub">Точка назначения</div>
                                <div class="title">{{ day.pointEnd.name }}</div>
                                <div class="title--sub">Дата старта</div>
                                <div class="title">{{ day.pointEnd.date }}</div>
                                <div class="title--sub">Время старта</div>
                                <div class="title">{{ day.pointEnd.time }}</div>
                            </td>
                        </tr>
                        <tr v-for="object in day.objects">

                            <td  class="day__object" v-for="param in object.params" >
                                <div class="title" v-if="param.title != ''">{{ param.title }}</div>
                                <div class="day__object--Param" v-for="attribute in param.attributes">
                                    <span class="icon " :class="attribute.icon" />
                                    <span>{{ attribute.title }}</span>
                                </div>
                            </td>
                        </tr>
                    </template>

                </tbody>
            </table>

            <Button text="редактировать маршрут" color="green"/>
            <Button text="посмотреть маршрут" icon-right icon="arrow-right" is-shadow color="green" />
            <Button text="удалить маршрут" icon="remove" is-shadow color="grey" />
        </div>

    </div>

</template>
<script>
    import Button from '../components/form-control/button'
    import Map from "../components/map/index";
    import { Swiper, SwiperSlide } from 'vue-awesome-swiper'
    import List from "../components/route-list/index";

    export default {
        name: "ViewRecommendedRoute",
        components: {
            Button,
            Map,
            Swiper,
            SwiperSlide,
            List
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
        .tableDays {
            margin: 20px 0px;
            border-collapse: separate;
            width: 100%;
            thead {
                th {
                    padding: 20px;
                    color: @colorWhite;
                }
                th:first-child {
                    border-top-left-radius: 20px;
                }
                th:last-child {
                    border-top-right-radius: 20px;
                }
                background: @base;

            }

            tr:last-child {
                td:last-child {
                    border-bottom-right-radius: 20px;
                }

            }
            tr {
                width: 100%;

            }
            td {
                padding: 30px 20px;
                min-width: 150px;

            }

            .day {
                &__desc {
                    border-bottom: 1px solid @greyBorder;
                    border-right: 1px solid @greyBorder;
                    .title {
                        .tableTitle();
                        font-weight: bold;
                        margin-top: 3px;
                        &.blue {
                            color: @colorLink;
                            font-weight: normal;
                        }
                    }
                    .title--sub {
                        .text();
                        color: @greyBorder;
                    }
                }
                &__object {
                    border-bottom: 1px solid @greyBorder;
                    border-right: 1px solid @greyBorder;
                    .title {
                        .tableTitle();
                    }
                    &--Param {
                        padding-left: 30px;
                        position: relative;
                        margin-bottom: 10px;
                        .icon {
                            left: 0px;
                        }
                        span {
                            .text();
                            line-height: 17px;
                        }
                    }
                }
                &.blue {
                    .day__desc {
                        border-left: 10px solid @base;
                    }
                }
                &.green {
                    .day__desc {
                        border-left: 10px solid @greenButton;
                    }
                }
                &.yellow {
                    .day__desc {
                        border-left: 10px solid @colorYellow;
                    }

                }
                &.last {
                    td {
                        border-bottom-left-radius: 20px;
                    }
                }
            }
        }
    }
</style>
