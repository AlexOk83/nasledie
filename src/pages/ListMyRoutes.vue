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
    import BreadCrumbs from "../components/bread-сrumbs";

    const repository = new Repository();

    export default {
        name: "MyRoutes",
        components: {
            BreadCrumbs,
            List,
        },
        data() {
            return {
                routesList: [],
            }
        },
        computed: {
            listLink() {
                return [{ name: 'Мои маршруты'}]
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
                    })
            }
        }
    }
</script>

<style scoped>

</style>