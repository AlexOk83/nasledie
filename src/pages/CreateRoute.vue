<template>
    <div>
        <h1>Составить маршрут пользователя</h1>

        <div class="row">
            <div class="left-form">
                <form>
                    <Field name="name"
                           type="text"
                           title="Название маршрута"
                           placeholder="Название маршрута"
                           :value="name"
                           @change="changeValue('name', $event)"
                    />
                    <Field name="description"
                           type="longtext"
                           title="Описание маршрута"
                           placeholder="Описание маршрута"
                           :value="description"
                           @change="changeValue('description', $event)"
                    />
                    <Field name="start-point"
                           type="search"
                           title="Точка старта"
                           placeholder="Поиск мест и адресов"
                           :value="startPoint"
                           @change="changeValue('startPoint', $event)"
                    />
                    <Field name="end-point"
                           type="search"
                           title="Точка назначения"
                           placeholder="Поиск мест и адресов"
                           :value="endPoint"
                           @change="changeValue('endPoint', $event)"
                    />
                    <Field name="date-start"
                           type="date"
                           title="Дата старта"
                           placeholder="Дата"
                           :value="dateStart"
                           @change="changeValue('date-start', $event)"
                    />
                    <Field name="time-start"
                           type="time"
                           title="Время старта"
                           :value="timeStart"
                           @change="changeValue('time-start', $event)"
                    />
                    <Field name="type-movement"
                           type="select"
                           title="Способ передвижения"
                           placeholder="способ передвижения"
                           :value="typeMovement"
                           :list-value="listTypesMovement"
                           @change="changeValue('type-movement', $event)"
                    />
                    <Objects
                        :objects="objects"
                        @change="changeValue('objects', $event)"
                    />
                    <Field name="is-geo-route"
                           type="radio"
                           title="Сформировать маршрут по географической близости объектов"
                           :value="isGeoRoute"
                           :list-value="listParams"
                           @change="changeValue('is-geo-route', $event)"
                    />
                    <Button text="Составить маршрут"
                            :on-click="submitForm"
                            is-shadow
                            is-full
                    />
                </form>
            </div>
            <div class="right-container">
                <Map :from="[53.537850, 49.362708]" :to="[53.537850, 49.352708]"
                     :points="[[53.537055, 49.352733], [53.537055, 49.351733]]"></Map>
            </div>
        </div>
    </div>
</template>

<script>
    import Field from "../components/form-control/Field";
    import Map from "../components/map/index";
    import Button from "../components/form-control/button/index";
    import Objects from "../components/added-objects";

    export default {
        name: "CreateRoute",
        components: {
            Map,
            Field,
            Objects,
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
                dateStart: '2020-08-05',
                timeStart: '10:30',
                isGeoRoute: 'yes',
                typeMovement: '',
                listParams: [
                    {name: 'Да', value: 'yes'}, {name: 'Нет', value: 'no'}
                ],
                listTypesMovement: [
                    {name: 'Пеший', value: 'people', icon: 'people'},
                    {name: 'Автомобильный', value: 'car', icon: 'car'}
                ],
                objects: [],
            }
        },
        methods: {
            submitForm() {
                console.clear()
                console.log('is work...')
                console.log(this.name)
                console.log(this.description);
                console.log(this.startPoint);
                console.log(this.endPoint);
                console.log(this.dateStart);
                console.log(this.timeStart);
                console.log(this.isGeoRoute);
                console.log(this.typeMovement);
            },
            changeValue(field, value) {
                this.$data[field] = value
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

        form > .button {
            margin-top: 50px;
        }
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
