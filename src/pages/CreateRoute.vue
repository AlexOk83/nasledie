<template>
    <div>
        <h1>Составить маршрут пользователя</h1>
        <div class="row">
            <div class="left-form">
                <form>
                    <Field name="name" type="text" title="Название маршрута" placeholder="Название маршрута" :value="name" />
                    <Field name="description" type="longtext" title="Описание маршрута" placeholder="Описание маршрута" :value="description" />
                    <Field name="start-point" type="search" title="Точка старта" placeholder="Поиск мест и адресов" :value="startPoint" />
                    <Field name="end-point" type="search" title="Точка назначения" placeholder="Поиск мест и адресов" :value="endPoint" />
                    <Field name="date-start" type="date" title="Дата старта" placeholder="Дата" :value="dateStart" />
                    <Field name="time-start" type="time" title="Время старта" :value="timeStart" />
                    <button class="button button--shadow" @click="" >Составить маршрут</button>
                </form>
            </div>
            <div class="right-container">
                <Map :from="[53.537850, 49.362708]" :to="[53.537850, 49.352708]"></Map>
            </div>
        </div>
    </div>
</template>

<script>
    import Field from "../components/formControl/Field";
    import Map from "../map/Map";

    export default {
        name: "CreateRoute",
        components: {
            Map,
            Field,
        },
        data() {
            return {
                name: 'Тестовый маршрут',
                description: 'Описание маршрута',
                startPoint: {
                    coordinates: '',
                    name: '',
                    description: ''
                },
                endPoint: {
                    coordinates: '',
                    name: '',
                    description: ''
                },
                dateStart: '',
                timeStart: '',
            }
        },
        created() {

        }
    }
</script>

<style lang="less">
    @import "../styles/mixins";

    .left-form {
        .column(4, 3);
        .column_padding();
    }
    .right-container {
        .column(8, 9);
        .column_padding();

    }
    #map {
        .img_wrapper(100%);
        background-color: grey;
    }
</style>
