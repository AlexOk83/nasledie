<template>
    <div class="container">
        <h1>{{ route.title }}</h1>
        <Button text="редактировать маршрут" />
        <Button text="посмотреть маршрут" icon-right icon="arrow-right" is-shadow color="green" />
        <Button text="удалить маршрут" icon="remove" is-shadow color="grey" />
    </div>
</template>

<script>
    import Button from '../components/form-control/button'
    export default {
        name: "ViewRecommendedRoute",
        components: {
            Button,
        },
        data() {
            return {
                resource: null,
                id: null,
                route: {}
            }
        },
        methods: {
            getData() {
                this.resource.get({id: this.id})
                    .then(response => response.json())
                    .then(route => {
                        this.route = route;
                    })
            }
        },
        created() {
            this.id = this.$route.params.id;
            const resourceLink = this.$route.params.type === 'my' ? 'myRoutes{/id}' : 'recomendRoutes{/id}'
            this.resource = this.$resource(resourceLink);
            this.getData();
        }
    }
</script>

<style scoped>

</style>