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
                :on-refresh="getData"
        />
    </div>
</template>

<script>
    import BreadCrumbs from '../components/bread-сrumbs';
    import RouteFilter from "../components/filter/filter";
    import List from "../components/route-list/routeListView";

    import Repository from "../repository";

    const repository = new Repository();

    export default {
        name: "RecommendedRoutesList",
        components: {
            BreadCrumbs,
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
        computed: {
            listLink() {
                return [{ name: 'Рекомендованные маршруты'}]
            }
        },
        created() {
            this.getData();
        },

        methods: {
            getData() {
                this.$store.dispatch('showPreloader');
                repository.getRecommendedRoutes(this.$store.getters.getUserId)
                    .then(response => {
                        this.routesList = JSON.parse(response.data);
                    }).finally(() => {
                    this.$store.dispatch('hidePreloader');
                })
            },
            getFilteredData(filter) {
                this.$store.dispatch('showPreloader');
                const formData = new FormData();
                formData.append('regions', filter.regions);
                formData.append('tags', filter.tags);
                formData.append('typesOfMovement', filter.typesOfMovement);
                repository.getRecommendedRoutes(this.$store.getters.getUserId, formData)
                    .then(response => {
                        this.routesList = JSON.parse(response.data);
                    }).finally(() => {
                    this.$store.dispatch('hidePreloader');
                })
            }
        }
    }
</script>

<style lang="less">
    @import "../styles/layout";
</style>
