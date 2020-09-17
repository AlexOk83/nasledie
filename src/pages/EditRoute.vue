<template>
    <div>
        <h1>Изменить маршрут пользователя</h1>

        <div class="row">
            <div class="left-form">
                <form>
                    <Field name="title"
                           type="text"
                           title="Название маршрута"
                           placeholder="Название маршрута"
                           :value="route.title"
                           :save="setData"
                           @change="changeValue('title', $event)"
                    />
                    <Field name="shortDescription"
                           type="longtext"
                           title="Краткое описание маршрута"
                           placeholder="Описание маршрута"
                           :value="route.shortDescription"
                           :save="setData"
                           rows="3"
                           @change="changeValue('shortDescription', $event)"
                    />
                    <Field name="description"
                           type="longtext"
                           title="Полное описание маршрута"
                           placeholder="Описание маршрута"
                           :value="route.description"
                           :save="setData"
                           rows="15"
                           @change="changeValue('description', $event)"
                    />
                    <Tabs
                        :data="route.days"
                    />
                    <Field name="is-geo-route"
                           type="radio"
                           title="Сформировать маршрут по географической близости объектов"
                           :value="isGeoRoute"
                           :list-value="listParams"
                           @change="changeValue('is-geo-route', $event)"
                    />

                </form>
            </div>
            <div class="right-container">

            </div>
        </div>
    </div>

</template>

<script>
    import Field from "../components/form-control/Field";
    import Map from "../components/map/index";
    import Button from "../components/form-control/button/button";
    import Tabs from "../components/tabs/tabs";

    export default {
        name: "EditRoute",
        components: {
            Map,
            Field,
            Button,
            Tabs,
        },
        data() {
            return {
                route: {},
                resource: null,
                id: null,
                isGeoRoute: 'yes',
                listParams: [
                    {name: 'Да', value: 'yes'}, {name: 'Нет', value: 'no'}
                ],
            }
        },
        computed: {

        },
        methods: {
            changeValue(field, value) {
                this.route[field] = value
            },
            getData() {
                console.log(this.id);
            this.resource.get({ id: this.id })
                .then(response => response.json())
                .then(route => {
                        console.log(route);
                        this.route = route;
                    })
                this.$forceUpdate();
            },
            setData() {
                this.$http.put(`myRoutes/${this.id}`, this.route)
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