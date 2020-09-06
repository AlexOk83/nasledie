<template>
    <div>
        <h1>Мои маршруты</h1>
        <List
                :data="routesList"
                :config="config"
                :on-refresh="getData"
        />
    </div>
</template>

<script>
    import List from "../components/route-list/index";
    import Repository from "../repository";

    const repository = new Repository();

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
        mounted() {
            this.getData();
        },
        methods: {
            getData() {
                repository.getMyRoutes(1)
                    .then(response => {
                        this.routesList = JSON.parse(response.data);
                    })
            }
        }
    }
</script>

<style scoped>

</style>