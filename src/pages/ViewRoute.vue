<template>
    <div class="container">
        <Bread-crumbs
            :list-link="listLink"
        />
        <div class="detail" v-if="this.route.id">
            <div class="detail__title">{{ title }}</div>
            <div class="detail__name">{{ route.name }}</div>
            <div class="detail__description">{{ route.description }}</div>
            <div class="detail__tags">
                <div class="item" v-for="item in route.tags">
                    <span>#{{ item.name }}</span>
                </div>
            </div>
            <Slider :files="route.files"/>

            <div class="detail__description">{{ route.content }}</div>
            <div v-if="route.objects">
                <div class="detail--title">Объекты в маршруте:</div>
                <List is-object :data="route.objects" :config="config" />
            </div>

            <div class="detail--title">Подробный маршрут: {{ route.name }}</div>
            <Map v-if="visibleMap" :from="route.pointStart.coordinates" :days="route.days" />

            <Table :columns="columns" :days="route.days" />
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
            BreadCrumbs
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
                this.$router.push('/list-my-routes')
            },
            getData() {
                this.id = this.$route.params.id;
                this.type = this.$route.params.type;
                this.$store.dispatch('showPreloader');
                repository.getMyRoute(this.id).then(response => {
                    console.log(JSON.parse(response.data));
                    const data = JSON.parse(response.data);
                    this.route = data.router;
                }).finally(() => {
                    this.$store.dispatch('hidePreloader');
                })
            },
            remove() {
                if (confirm(`Вы действительно хотите удалить маршрут "${this.route.name}"`)) {
                    repository.deleteRoute(this.route.id)
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
            font-size: 32px;
            font-weight: 500;
            line-height: 40px;
            margin-top: 20px;
            margin-bottom: 40px;
        }
        &__name {

        }
        &--title {
            font-size: 24px;
            font-weight: 500;
            line-height: 30px;
            margin-bottom: 20px;
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
