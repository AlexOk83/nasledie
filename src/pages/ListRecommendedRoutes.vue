<template>
    <div>
        <h1>Рекомендованные маршруты</h1>
        <RouteFilter />
        <List
                :data="routesList"
                is-recomended
                :config="config"
        />
    </div>
</template>

<script>
    import RouteFilter from "../components/filter/filter";
    import List from "../components/route-list/routeListView";

    export default {
        name: "RecommendedRoutesList",
        components: {
            RouteFilter,
            List,
        },
        data() {
            return {
                config: {
                    colDesktop: 2,
                    colTablet: 2,
                },
                routesList: [],
                typeMovement: '',
                typeRegion: '',
                listParams: [
                    {name: 'Да', value: 'yes'}, {name: 'Нет', value: 'no'}
                ],
                listTypesMovement: [
                    {name: 'Пеший', value: 'people', icon: 'people'},
                    {name: 'Автомобильный', value: 'car', icon: 'car'}
                ],
                listTypesRegion: [
                    {name: 'Московская область', value: 'moscow', icon: false},
                    {name: 'Пензинский район', value: 'penza', icon: false},
                    {name: 'Краснадарский край', value: 'penza', icon: false}
                ],
                listTypesType: [
                    {name: 'Кольцевой', value: '0', icon: false},
                    {name: 'Горный', value: '1', icon: false},
                    {name: 'Прогулочный', value: '2', icon: false}
                ],
            }
        },
        created() {

            this.getData();
        },

        methods: {
            getData() {

            },
            changeValue(field, value) {
                this.$data[field] = value
            }
        }
    }
</script>

<style lang="less">
    @import "../styles/layout";
</style>
