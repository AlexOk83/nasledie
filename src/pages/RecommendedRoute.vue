<template>
    <div>
        <h1>Составить рекомендованный маршрут пользователя</h1>

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
                    <Field name="shortDescription"
                           type="longtext"
                           title="Краткое описание маршрута"
                           placeholder="Описание маршрута"
                           :value="shortDescription"
                           rows="3"
                           @change="changeValue('shortDescription', $event)"
                    />
                    <Field name="description"
                           type="longtext"
                           title="Полное описание маршрута"
                           placeholder="Описание маршрута"
                           :value="description"
                           rows="15"
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
                    <Photos @change="changeValue('files', $event)" :photos="files" />
                    <Field name="typeMovement"
                           type="select"
                           title="Способ передвижения"
                           placeholder="способ передвижения"
                           :value="typeMovement"
                           :list-value="listTypesMovement"
                           @change="changeValue('typeMovement', $event)"
                    />
                    <Added-objects
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

            </div>
        </div>
    </div>
</template>

<script>
    import Field from "../components/form-control/Field";
    import Map from "../components/map/index";
    import Button from "../components/form-control/button/index";
    import AddedObjects from "../components/added-objects";
    import Photos from "../components/photos/photos";
    import Repository from '../repository';
    import { radioButtonOptions, typesOfMovement } from '../constants';
    const repository = new Repository();

    export default {
        name: "CreateRoute",
        components: {
            Map,
            Field,
            AddedObjects,
            Button,
            Photos
        },
        data() {
            return {
                name: 'Тестовый маршрут',
                shortDescription: 'краткое описание маршрута',
                description: 'Полное описание маршрута',
                startPoint: {
                    coordinates: [55.753215, 37.622504],
                    name: 'Москва',
                    description: 'Россия'
                },
                endPoint: {
                    coordinates: [53.5088, 49.41918],
                    name: 'Тольятти',
                    description: 'Россия, Самарская область'
                },
                dateStart: '2020-08-05',
                timeStart: '10:30',
                files: [],
                isGeoRoute: 'yes',
                typeMovement: 'car',
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

                repository.createRouter(formData)
                    .then(response => {
                        console.log(response.data)
                    });
            },
            changeValue(field, value) {
                this.$data[field] = value
            }
        },
    }
</script>

<style lang="less">
    @import "../styles/mixins";
</style>
