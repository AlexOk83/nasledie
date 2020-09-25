<!-- создание и редактирование моего маршрута -->
<template>
    <div>
        <Bread-crumbs
                :list-link="links"
        />
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
                    <Field name="description"
                           type="longtext"
                           title="Описание маршрута"
                           placeholder="Описание маршрута"
                           :value="description"
                           :save="!isNewRoute && configsForSave.description"
                           @change="changeValue('description', $event)"
                    />
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
                        <Objects
                                :objects="mapPoints"
                                @change="changeValue('objects', $event)"
                        />
                    </div>
                    <div v-if="!isNewRoute">
                        <Photos @change="changeValue('files', $event)" :photos="files" :max-count=1 />
                        <Tabs
                            v-if="days && days.length > 0"
                            :data="days"
                            :start="startPoint"
                            :end="endPoint"
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
                        <Button text="Очистить форму"
                                :on-click="() => onClear()"
                                is-shadow
                                color="red"
                                icon="trash"
                                v-if="isNewRoute"
                        />
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
                                :disabled="!needUpdateDayData"
                        />
                        <Button text="Сохранить в мои маршруты"
                                :on-click="() => updateRoute()"
                                color="white"
                                icon="check"
                                is-shadow
                                is-full
                                v-if="!isNewRoute"
                                :disabled="needUpdateDayData"
                        />
                    </div>

                </form>
            </div>
            <div class="right-container">
                <div class="map-stiky">
                    <Map
                            v-if="viewMap"
                            :from="startPoint.position"
                            :days="days"
                    />
                    <Map-objects
                            v-if="viewMapCreate"
                            :from="startPoint"
                            :to="endPoint"
                            :points="mapPoints"
                            @addPoint="addPoint"
                    />
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import moment from 'moment';
    import {isEmpty, isNil} from "lodash";
    import Field from "../components/form-control/Field";
    import Map from "../components/map/map-with-routes";
    import MapObjects from "../components/map/map-with-objects";
    import Button from "../components/form-control/button/button";
    import Objects from "../components/added-objects/addedObjects";
    import Tabs from "../components/tabs/tabs";
    import Photos from "../components/upload-files/photos";
    import Repository from '../repository';
    import { Presenter } from "../presenter";
    import { radioButtonOptions, typesOfMovement } from '../constants';
    import BreadCrumbs from "../components/bread-сrumbs";

    const repository = new Repository();
    const presenter = new Presenter();

    export default {
        name: "CreateRoute",
        components: {
            Map,
            MapObjects,
            Field,
            Objects,
            Button,
            Tabs,
            BreadCrumbs,
            Photos
        },
        data() {
            return {
                userId: null,
                routeId: null,
                isNewRoute: true,
                //-------------------
                name: 'Тестовый маршрут',
                description: 'Описание маршрута',
                startPoint: {},
                endPoint: {},
                dateStart: moment(new Date()).format(),
                timeStart: '10:30',
                isGeoRoute: 'yes',
                typeMovement: 'car',
                objects: [],
                mapPoints: [], // точки на карте, которые будут отображаться
                pointList: [], // список точек после составления маршрута
                regions: [],
                // данные для редактирования
                days: [],
                totalTime: 0,
                totalWay: 0,
                files: [],
                otherData: {},
                needUpdateDayData: false,
                showMap: false,
            }
        },
        computed: {
            listParams() {
                return radioButtonOptions
            },
            listTypesMovement() {
                return typesOfMovement
            },
            links() {
                if (this.isNewRoute) {
                    return [{name: 'Составить свой маршрут'}]
                }
                else {
                    return [{name: 'Редактировать свой маршрут'}]
                }
            },
            viewMap() {
                if (isEmpty(this.startPoint.position)) {
                    return false;
                }

                if (isEmpty(this.days)) {
                    return false;
                }

                return !this.isNewRoute && this.showMap;
            },
            viewMapCreate() {
                return this.isNewRoute && this.showMap;
            },
            headerTitle() {
                if (this.isNewRoute) {
                    return 'Составить маршрут пользователя'
                }
                return 'Редактировать маршрут пользователя'
            },
            configsForSave() {
                return {
                    name: {
                        editTitle: 'Редактировать название',
                        viewSaveButton: true,
                    },
                    description: {
                        editTitle: 'Редактировать описание',
                        viewSaveButton: true,
                    }
                }
            }
        },
        methods: {
            onClear() {
                this.$store.dispatch('showModalConfirm', {
                    text: 'Форма будет очищена, вы уверены?',
                    onConfirm: this.clearRoute
                })
            },
            clearRoute() {
                this.name = '';
                this.description = '';
                this.startPoint = {};
                this.endPoint = {};
                this.dateStart = moment(new Date()).format();
                this.timeStart = '09:00';
                this.isGeoRoute = 'yes';
                this.typeMovement = 'car';
                this.objects = [];
                    // данные для редактирования
                this.days = [];
                this.totalTime = 0;
                this.totalWay = 0;
                this.otherData = {};
                this.files = [];
                this.regions = [];
            },
            getInfoForCreate() {
                const formData = new FormData();
                const values = {
                    id: null,
                    name: this.name,
                    description: this.description,
                    startPoint: this.startPoint.name,
                    startPointCoordLat: this.startPoint.position[0],
                    startPointCoordLong: this.startPoint.position[1],
                    endPoint: this.endPoint.name,
                    endPointCoordLat: this.endPoint.position[0],
                    endPointCoordLong: this.endPoint.position[1],
                    dateStart: this.dateStart,
                    timeStart: this.timeStart,
                    timeEnd: this.timeEnd,
                    typeMovement: [this.typeMovement],
                    objects: this.objects.map(o => ({...o, object_id: o.id})),
                    days: this.days,
                    totalTime: this.totalTime,
                    totalWay: this.totalWay,
                    files: this.files,
                    regions: this.regions,
                    map_points: JSON.stringify(this.pointList),
                    user_id : this.$store.getters.getUserId,
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
                    objects: this.otherData.objects.map(o => ({...o, object_id: o.id})),
                    days: this.days,
                    files: this.files,
                    user_id : this.$store.getters.getUserId,
                }
                formData.append('ZRouter', JSON.stringify(values));
                formData.append('sessionId', 1);
                console.log('saved...', values);
                return formData
            },
            createRoute() {
                if (isEmpty(this.startPoint) || isEmpty(this.endPoint) || (isEmpty(this.objects) && isEmpty(this.mapPoints)) ) {
                    this.$store.dispatch('showModal','Не заполнены обязательные поля');
                    return null;
                }
                this.$store.dispatch('showPreloader');
                presenter.calculatedDaysRoute({
                    ...this,
                }).then(data => {
                    this.days = data.days;
                    this.totalWay = data.totalWay;
                    this.totalTime = data.totalTime;
                    this.pointList = data.pointsList;
                    const infoForSave = this.getInfoForCreate();
                    repository.createMyRoute(this.userId, infoForSave)
                        .then(response => {
                            console.log(response.data);
                            const result = JSON.parse(response.data);
                            if (result && result.id) {

                                this.$store.dispatch('showModalSuccess', {
                                    text: 'Маршрут составлен!',
                                    onSuccess: () => {
                                        this.showMap = false;
                                        this.$router.push(`/edit-my-route/${result.id}`)
                                    }
                                });

                            }
                        });
                }).finally(() => {
                    this.$store.dispatch('hidePreloader');
                });
            },
            updateRoute() {
                this.$store.dispatch('showPreloader');
                const data = this.getInfoForUpdate();
                repository.editMyRoute(this.userId, this.routeId, data)
                    .then(response => {
                        const data = JSON.parse(response.data);
                        if (data.status) {
                            this.$store.dispatch('showModalSuccess', { text: 'сохранение выполнено успешно!' });
                        }
                    }).finally(() => {
                    this.$store.dispatch('hidePreloader');
                });
            },
            calcRouteAgain() {
                presenter.updateDaysRoute(this.days).then(e => {
                    console.log('', e);
                },
                e => {
                    console.log(e);
                })
            },
            changeValue(field, value) {
                this.$data[field] = value;
                if (field === 'objects') {
                    this.regions = value.map(obj => ({ id: obj.region }));
                    this.mapPoints = value;
                }
                if (field === 'days') {
                    this.needUpdateDayData = true;
                }
            },
            getDataRoute() {
                this.$store.dispatch('showPreloader');
                repository.getMyRoute(this.userId, this.routeId)
                .then(response => {
                    this.$store.dispatch('hidePreloader');
                    const route = JSON.parse(response.data).router;
                    console.log(route);
                    this.updateState(route);
                })
            },
            updateState(data) {
                if (isNil(data)) {
                    return;
                }
                this.routeId = data.id;
                this.startPoint = {
                    position: [data.startPointCoordLat, data.startPointCoordLong],
                }
                this.endPoint = {
                    position: [data.endPointCoordLat, data.endPointCoordLong],
                }
                this.name = data.name;
                this.description = data.description;
                this.days = presenter.changeFormat(data.days);
                this.pointList = JSON.parse(data.map_points);
                this.files = data.files || [];
                this.otherData = data; // для того, чтобы не потерять данные
                this.showMap = true;
            },
            addPoint({ type, point }) {
                if (type === 'startPoint') {
                    this.startPoint = point
                }
                if (type === 'endPoint') {
                    this.endPoint = point
                }
                if (type === 'point') {
                    this.mapPoints.push(point)
                }
                // this.points.push(point);
            }
        },
        watch: {
            $route(to, from) {
                if (to.params.id !== from.params.id && to.params.id) {
                    this.routeId = to.params.id;
                    this.isNewRoute = false;
                    this.getDataRoute()

                } else {
                    this.routeId = null;
                    this.isNewRoute = true;
                    this.clearRoute();
                }
                this.$forceUpdate();
            },
        },
        created() {
            this.userId = this.$store.getters.getUserId;
            if (this.$route.params.id) {
                this.routeId = this.$route.params.id;
                this.isNewRoute = false;
                this.getDataRoute();
            }
        },
        mounted() {
            this.showMap = true;
        }
    }
</script>

<style lang="less">
    @import "../styles/mixins";

    .map-stiky {
        position: sticky;
        top: 0;
    }
</style>
