<template>
    <div>
        <h1>Мои маршруты</h1>
        <List
                :data="routesList"
                :config="{}"
                :on-refresh="getData"
        />
    </div>
</template>

<script>
    import List from "../components/route-list/routeListView";
    import Repository from "../repository";

    const repository = new Repository();

    export default {
        name: "MyRoutes",
        components: {
            List,
        },
        data() {
            return {
                routesList: [],
            }
        },
        mounted() {
            this.getData();
        },
        methods: {
            getData() {

                repository.getMyRoutes(this.$store.getters.getUserId)
                    .then(response => {
                        this.routesList = JSON.parse(response.data);
                        console.log(this.routesList)
                    })
            }
        }
    }
</script>

<style scoped>

</style>