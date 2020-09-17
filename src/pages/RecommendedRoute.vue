<template>
    <div>
        <h1>{{ headerTitle }}</h1>

        <div class="row">
            <div class="left-form">
                <form>
                    <Field name="name"
                           type="text"
                           title="Название маршрута"
                           placeholder="Название маршрута"
                           :value="name"
                           :save="!isNewRoute && configsForSave.name"
                           @change="changeValue('name', $event)"
                    />
                    <Field name="shortDescription"
                           type="longtext"
                           title="Краткое описание маршрута"
                           placeholder="Описание маршрута"
                           :value="shortDescription"
                           :save="!isNewRoute && configsForSave.description"
                           rows="3"
                           @change="changeValue('shortDescription', $event)"
                    />
                    <Field name="description"
                           type="longtext"
                           title="Полное описание маршрута"
                           placeholder="Описание маршрута"
                           :value="description"
                           :save="!isNewRoute && configsForSave.description"
                           rows="15"
                           @change="changeValue('description', $event)"
                    />
                    <FilterItem
                            title="Тип маршрута"
                            list-title="выбранные типы:"
                            :list-value="listTags"
                            placeholder="Типы #"
                            icon="tag"
                            @change="changeListTags"
                    />
                    <Photos @change="changeValue('files', $event)" :photos="files" />
                    <div v-if="isNewRoute">
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
                        <Added-objects
                                :objects="objects"
                                @change="changeValue('objects', $event)"
                        />
                    </div>
                    <div v-if="!isNewRoute">
                        <Tabs
                                v-if="days && days.length > 0"
                                :data="days"
                                @change="changeValue('days', $event)"
                        />
                    </div>
                    <Field name="isGeoRoute"
                           type="radio"
                           title="Формировать маршрут по географической близости объектов"
                           :value="isGeoRoute"
                           :list-value="listParams"
                           @change="changeValue('isGeoRoute', $event)"
                    />
                    <div class="buttons-container">
                        <Button text="Составить маршрут"
                                :on-click="() => createRoute()"
                                is-shadow
                                v-if="isNewRoute"
                        />
                        <Button text="Пересчитать маршрут"
                                :on-click="() => calcRouteAgain()"
                                is-shadow
                                is-full
                                v-if="!isNewRoute"
                        />
                        <Button text="Сохранить в мои маршруты"
                                :on-click="() => updateRoute()"
                                color="white"
                                icon="check"
                                is-shadow
                                is-full
                                v-if="!isNewRoute"
                        />
                    </div>
                </form>
            </div>
            <div class="right-container">
                <Map
                        v-if="viewMap"
                        :from="startPoint.coordinates"
                        :days="days"
                />
            </div>
        </div>
    </div>
</template>

<script>
    import moment from 'moment';
    import {isEmpty} from "lodash";
    import Field from "../components/form-control/Field";
    import Map from "../components/map/MapTest";
    import Button from "../components/form-control/button/button";
    import AddedObjects from "../components/added-objects/addedObjects";
    import Tabs from "../components/tabs/tabs";
    import Photos from "../components/photos/photos";
    import Repository from '../repository';
    import { Presenter } from "../presenter";
    import { radioButtonOptions, typesOfMovement } from '../constants';
    import FilterItem from "../components/filter/filter-item";

    const repository = new Repository();
    const presenter = new Presenter();

    export default {
        name: "CreateRoute",
        components: {
            Map,
            Field,
            AddedObjects,
            Button,
            Tabs,
            Photos,
            FilterItem
        },
        data() {
            return {
                routeId: null,
                isNewRoute: true,
                listParams: radioButtonOptions,
                listTypesMovement: typesOfMovement,
                listTags: [],
                //-------------------
                name: 'Тестовый маршрут',
                shortDescription: 'краткое описание маршрута',
                description: 'Описание маршрута',
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
                files: [],
                tags: [],
                dateStart: moment(new Date()).format(),
                timeStart: '10:30',
                isGeoRoute: 'yes',
                typeMovement: 'car',
                objects: [],
                // данные для редактирования
                days: [],
                totalTime: 0,
                totalWay: 0,
                otherData: {},
            }
        },
        computed: {
            viewMap() {
                if (isEmpty(this.startPoint.coordinates)) {
                    return false;
                }

                if (isEmpty(this.days)) {
                    return false;
                }

                return true;
            },
            headerTitle() {
                if (this.isNewRoute) {
                    return 'Составить рекомендованный маршрут пользователя'
                }
                return 'Редактировать рекомендованный маршрут пользователя'
            },
            configsForSave() {
                return {
                    name: {
                        editTitle: 'Редактировать название',
                        viewSaveButton: true,
                        method: this.updateRoute
                    },
                    description: {
                        editTitle: 'Редактировать описание',
                        viewSaveButton: true,
                        method: this.updateRoute
                    }
                }
            }
        },
        methods: {
            clearRoute() {
                this.routeId = null;
                this.name = '';
                this.description = '';
                this.shortDescription = '';
                this.startPoint = {};
                this.endPoint = {};
                this.dateStart = moment(new Date()).format();
                this.timeStart = '09:00';
                this.isGeoRoute = 'yes';
                this.typeMovement = '';
                this.objects = [];
                // данные для редактирования
                this.days = [];
                this.totalTime = 0;
                this.totalWay = 0;
                this.otherData = {};
                this.files = [];
            },
            getInfoForCreate() {
                const formData = new FormData();
                const values = {
                    ...this.otherData,
                    id: this.routeId,
                    name: this.name,
                    description: this.description,
                    startPoint: this.startPoint.name,
                    startPointCoordLat: this.startPoint.coordinates[0],
                    startPointCoordLong: this.startPoint.coordinates[1],
                    endPoint: this.endPoint.name,
                    endPointCoordLat: this.endPoint.coordinates[0],
                    endPointCoordLong: this.endPoint.coordinates[1],
                    dateStart: this.dateStart,
                    dateEnd: this.dateStart,
                    timeStart: this.timeStart,
                    timeEnd: this.timeEnd,
                    typeMovement: [this.typeMovement],
                    objects: this.objects.map(o => ({...o, object_id: o.id})),
                    days: this.days,
                    totalTime: this.totalTime,
                    totalWay: this.totalWay,
                    isGeoRoute: this.isGeoRoute,
                    files: this.files,
                    user_id : 1,
                }
                formData.append('ZRouter', JSON.stringify(values));
                formData.append('sessionId', 1);
                console.log('saved...', values);
                return formData
            },
            getInfoForUpdate() {
                const formData = new FormData();
                const values = {
                    ...this.otherData,
                    id: this.routeId,
                    name: this.name,
                    description: this.description,
                    startPoint: this.startPoint.name,
                    startPointCoordLat: this.startPoint.coordinates[0],
                    startPointCoordLong: this.startPoint.coordinates[1],
                    endPoint: this.endPoint.name,
                    endPointCoordLat: this.endPoint.coordinates[0],
                    endPointCoordLong: this.endPoint.coordinates[1],
                    dateStart: this.dateStart,
                    dateEnd: this.dateStart,
                    timeStart: this.timeStart,
                    timeEnd: this.timeEnd,
                    typeMovement: [this.typeMovement],
                    objects: this.objects.map(o => ({...o, object_id: o.id})),
                    days: this.days,
                    totalTime: this.totalTime,
                    totalWay: this.totalWay,
                    isGeoRoute: this.isGeoRoute,
                    files: this.files,
                    user_id : 1,
                }
                formData.append('ZRouter', JSON.stringify(values));
                formData.append('sessionId', 1);
                console.log('saved...', values);
                return formData
            },
            createRoute() {
                presenter.calculatedDaysRoute({
                    ...this,
                }).then(data => {
                    this.days = data.days;
                    this.totalWay = data.totalWay;
                    this.totalTime = data.totalTime;
                    const infoForSave = this.getInfoForCreate();
                    repository.createRecommendedRoute(infoForSave)
                        .then(response => {
                            console.log(response.data);
                            const result = JSON.parse(response.data);
                            if (result && result.id) {
                                this.$router.push(`/edit-recommended-route/${result.id}`)
                            }
                        });
                });
            },
            updateRoute() {
                const data = this.getInfoForUpdate();
                repository.editRecommendedRoute(this.routeId, data)
                    .then(response => {
                        console.log();
                        const data = JSON.parse(response.data);
                        if (data.status) {
                            alert('сохранение выполнено успешно!');
                        }
                    });
            },
            calcRouteAgain() {

            },
            changeValue(field, value) {
                this.$data[field] = value
            },
            getDataRoute() {
                repository.getMyRoute(this.routeId)
                    .then(response => {
                        const route = JSON.parse(response.data).router;
                        console.log(route);
                        this.updateState(route);
                    })
            },
            updateState(data) {
                this.name = data.name;
                this.description = data.description;
                this.typeMovement = data.typesOfMovement[0];
                this.days = presenter.changeFormat(data.days);
                this.isGeoRoute = data.isGeoRoute;
                this.objects = data.objects;
                this.files = data.files || [];
                this.otherData = data; // для того, чтобы не потерять данные
            },
            getListTags() {
                repository.getTags()
                    .then(response => {
                        let tags = JSON.parse(response.data);
                        this.listTags = tags.map(tag => ({ ...tag, value: String(tag.name)}))
                    });
            },
            changeListTags(list) {
                console.log(list);
                this.tags = list
            }
        },
        watch: {
            $route(to, from) {
                if (to.params.id) {
                    this.routeId = to.params.id;
                    this.isNewRoute = false;
                    this.getDataRoute()

                } else {
                    this.routeId = null;
                    this.isNewRoute = true;
                    this.clearRoute();
                }
                this.$forceUpdate();
            }
        },
        created() {
            this.getListTags();
            if (this.$route.params.id) {
                this.routeId = this.$route.params.id;
                this.isNewRoute = false;
                this.getDataRoute();
            }
        },
    }
</script>

<style lang="less">
    @import "../styles/mixins";
    .left-form {
        .filter__item {
            margin-bottom: 30px;
        }
    }
</style>
