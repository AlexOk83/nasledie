<template>
    <div class="container">
        <div class="detailRouter">
            <div class="detailRouter__title">{{ route.name }}</div>
            <div class="detailRouter__description">{{ route.description }}</div>
            <Slider :files="route.files"/>
<!--            <div class="detailRouter__tags">-->
<!--                <div class="item" v-for="item in route.routeTypes">-->
<!--                    <span>#{{ item.title }}</span>-->
<!--                </div>-->
<!--            </div>-->
            <div v-if="route.objects">
                <div class="detailRouter--title">Объекты в маршруте:</div>
                <List is-object :data="route.objects" :config="config" />
            </div>

            <div class="detailRouter--title">Подробный маршрут: {{ route.name }}</div>
            <Map v-if="route.pointStart && route.pointStart.coordinates" :from="route.pointStart && route.pointStart.coordinates" :days="route.days" />

            <Table :columns="columns" :days="route.days" />

            <Button text="В мои маршруты" icon-right icon="arrow-right" is-shadow color="green" :on-click="moveBack" />
        </div>

    </div>

</template>
<script>
    import Button from '../components/form-control/button'
    import Map from "../components/map/index";
    import Slider from "../components/slider/slider";
    import List from "../components/route-list/index";
    import Table from "../components/table/index";
    import { Presenter } from "../presenter";
    import Repository from "../repository";
    const presenter = new Presenter();
    const repository = new Repository();

    export default {
        name: "ViewRecommendedRoute",
        components: {
            Button,
            Map,
            Slider,
            List,
            Table
        },
        data() {
            return {
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
                this.$router.push('/list-my-routes')
            },
            getData() {
                this.id = this.$route.params.id;
                repository.getMyRoute(this.id).then(response => {
                    console.log(JSON.parse(response.data));
                    const data = JSON.parse(response.data);
                    this.route = data.router;
                })
            }
        },
        created() {
            this.getData();
        }
    }

</script>


<style lang="less">
    @import "../styles/mixins";

    .detailRouter {
        &__title {
            font-size: 32px;
            font-weight: 500;
            line-height: 40px;
            margin-top: 20px;
            margin-bottom: 40px;
        }
        &__description {
            margin-bottom: 20px;
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
