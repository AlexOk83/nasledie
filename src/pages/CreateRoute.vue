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
                    <Field name="is-geo-route" type="radio" title="Сформировать маршрут по географической близости объектов" :value="isGeoRoute" :list-value="listParams" />
                    <Field name="type-movement" type="select" title="Способ передвижения" placeholder="способ передвижения" :value="typeMovement" :list-value="listTypesMovement" />
                    <Button text="Составить маршрут" :on-click="submitForm" is-shadow is-full />
                </form>
            </div>
            <div class="right-container">
                <Map :from="[53.537850, 49.362708]" :to="[53.537850, 49.352708]" :points="[[53.537055, 49.352733], [53.537055, 49.351733]]"></Map>
            </div>
        </div>
    </div>
</template>

<script>
    import Field from "../components/form-control/Field";
    import Map from "../components/map/index";
    import Button from "../components/form-control/button/index";

    export default {
        name: "CreateRoute",
        components: {
            Map,
            Field,
            Button,
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
                isGeoRoute: 'yes',
                typeMovement: '',
                listParams: [
                    { name: 'Да', value: 'yes' }, { name: 'Нет', value: 'no' }
                ],
                listTypesMovement: [
                    { name: 'Пеший', value: 'people', icon: 'people' },
                    { name: 'Автомобильный', value: 'car', icon: 'car' }
                ]
            }
        },
        methods: {
            submitForm() {
                console.clear()
                console.log('is work...')
                console.log(this.dateStart)
                console.log(this._data)
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
