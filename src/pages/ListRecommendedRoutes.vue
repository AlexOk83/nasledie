<template>
    <div>
        <h1>Рекомендованные маршруты</h1>
        <RouteFilter
            @filter="getFilteredData"
        />
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

    import Repository from "../repository";

    const repository = new Repository();

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

            }
        },
        created() {
            this.getData();
        },

        methods: {
            getData() {
                repository.getRecommendedRoutes()
                    .then(response => {
                        this.routesList = JSON.parse(response.data);
                        console.log(this.routesList)
                    })
            },
            getFilteredData(filter) {
                repository.getRecommendedRoutes(filter)
                    .then(response => {
                        this.routesList = JSON.parse(response.data);
                        console.log(this.routesList)
                    })
            }
        }
    }
</script>

<style lang="less">
    @import "../styles/layout";
</style>
