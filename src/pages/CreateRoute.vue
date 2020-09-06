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
                    <Field name="startPoint"
                           type="search"
                           title="Точка старта"
                           placeholder="Поиск мест и адресов"
                           :value="startPoint"
                           @change="changeValue('startPoint', $event)"
                    />
                    <Field name="endPoint"
                           type="search"
                           title="Точка назначения"
                           placeholder="Поиск мест и адресов"
                           :value="endPoint"
                           @change="changeValue('endPoint', $event)"
                    />
                    <Field name="dateStart"
                           type="date"
                           title="Дата старта"
                           placeholder="Дата"
                           :value="dateStart"
                           @change="changeValue('dateStart', $event)"
                    />
                    <Field name="timeStart"
                           type="time"
                           title="Время старта"
                           :value="timeStart"
                           @change="changeValue('timeStart', $event)"
                    />
                    <Field name="typeMovement"
                           type="select"
                           title="Способ передвижения"
                           placeholder="способ передвижения"
                           :value="typeMovement"
                           :list-value="listTypesMovement"
                           @change="changeValue('typeMovement', $event)"
                    />
                    <Objects
                        :objects="objects"
                        @change="changeValue('objects', $event)"
                    />
                    <Field name="isGeoRoute"
                           type="radio"
                           title="Сформировать маршрут по географической близости объектов"
                           :value="isGeoRoute"
                           :list-value="listParams"
                           @change="changeValue('isGeoRoute', $event)"
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
    import Repository from '../repository';
    import { radioButtonOptions, typesOfMovement } from '../constants';
    const repository = new Repository();

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
                    coordinates: [],
                    name: '',
                    description: ''
                },
                endPoint: {
                    coordinates: [],
                    name: '',
                    description: ''
                },
                dateStart: '2020-08-05',
                timeStart: '10:30',
                isGeoRoute: 'yes',
                typeMovement: '',
                listParams: radioButtonOptions,
                listTypesMovement: typesOfMovement,
                objects: [],
            }
        },
        methods: {
            submitForm() {
                console.clear()
                const formData = new FormData();
                formData.append('ZRouter', JSON.stringify({
                    id: null,
                    name : this.name,
                    description : this.description,
                    startPoint : this.startPoint.name,
                    startPointCoord: this.startPoint.coordinates,
                    endPoint : this.endPoint.name,
                    endPointCoord: this.endPoint.coordinates,
                    dateStart : this.dateStart,
                    timeStart : this.timeStart,
                    isGeoRoute : this.isGeoRoute,
                    typeMovement : [this.typeMovement],
                    objects : this.objects,
                    user_id : 1,
                }));
                formData.append('sessionId', 1);
                console.log(formData);
                repository.createRouter(formData)
                    .then(response => {
                        console.log(response.data)
                    });
            },
            changeValue(field, value) {
                // console.clear();
                console.log(field, value)
                this.$data[field] = value
            }
        },
    }
</script>

<style lang="less">
    @import "../styles/mixins";
</style>
