<template>
    <div>
        <h1>Мои маршруты</h1>
        <List
                :data="routesList"
                :config="config"
        />
    </div>
</template>

<script>
    import List from "../components/route-list/index";

    export default {
        name: "MyRoutes",
        components: {
            List,
        },
        data() {
            return {
                resource: null,
                config: {

                },
                routesList: [],
            }
        },
        created() {

            this.getData();
        },
        methods: {
            getData() {
                this.$resource('myRoutes').get()
                    .then(response => response.json())
                    .then(routes => {
                        this.routesList = routes;
                    })
            }
        }
    }
</script>

<style scoped>

</style>