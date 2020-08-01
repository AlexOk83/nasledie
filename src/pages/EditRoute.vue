<template>
    <h1>Изменить маршрут пользователя</h1>
</template>

<script>
    export default {
        name: "EditRoute",
        data() {
            return {
                route: {},
                resource: null,
                id: null
            }
        },
        computed: {

        },
        methods: {
            getData() {
                console.log(this.id);
            this.resource.get({ id: this.id })
                .then(response => response.json())
                .then(route => {
                        console.log(route);
                        this.route = route;
                    })
            }
        },
        created() {
            this.id = this.$route.params.id;
            this.resource = this.$resource('myRoutes{/id}');
            this.getData();
        }
    }
</script>

<style lang="less">

</style>