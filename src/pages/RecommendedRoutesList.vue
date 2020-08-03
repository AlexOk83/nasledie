<template>
    <div>
        <h1>Рекомендованные маршруты</h1>
        <List
                :data="routesList"
                is-recomended
                :config="config"
        />
    </div>
</template>

<script>
    import List from "../components/route-list";

    export default {
        name: "RecommendedRoutesList",
        components: {
            List,
        },
        data() {
            return {
                config: {
                    colDesktop: 2,
                    colTablet: 2,
                },
                routesList: [],
            }
        },
        created() {

            this.getData();
        },
        methods: {
            getData() {
                this.$resource('recomendRoutes').get()
                    .then(response => response.json())
                    .then(routes => {
                        this.routesList = routes;
                    })
            }
        }
    }
</script>

<style lang="less">


</style>
