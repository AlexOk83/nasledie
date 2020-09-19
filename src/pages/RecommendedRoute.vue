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
                           :rows="3"
                           @change="changeValue('shortDescription', $event)"
                    />
                    <Field name="description"
                           type="longtext"
                           title="Полное описание маршрута"
                           placeholder="Описание маршрута"
                           :value="description"
                           :save="!isNewRoute && configsForSave.description"
                           :rows="15"
                           @change="changeValue('description', $event)"
                    />
                    <FilterItem
                            title="Тип маршрута"
                            list-title="выбранные типы:"
                            :list-value="listTags"
                            :list="tags"
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
    import {isEmpty, isNil} from "lodash";
    import Field from "../components/form-control/Field";
    import Map from "../components/map/MapTest";
    import Button from "../components/form-control/button/button";
    import AddedObjects from "../components/added-objects/addedObjects";
    import Tabs from "../components/tabs/tabs";
    import Photos from "../components/photos/photos";
    import Repository from '../repository';
    import { Presenter } from "../presenter";
    import vueCustomScrollbar from 'vue-custom-scrollbar'
    import { radioButtonOptions, typesOfMovement } from '../constants';
    import FilterItem from "../components/filter/filter-item";

    const repository = new Repository();
    const presenter = new Presenter();

    export default {
        name: "CreateRoute",
        components: {
            vueCustomScrollbar,
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
                name: 'Тестовый рекомендованный маршрут',
                shortDescription: 'краткое описание маршрута',
                description: 'полное описание маршрута',
                startPoint: {
                    coordinates: [53.5088, 49.41918],
                    name: 'Тольятти',
                    description: 'Россия, Самарская область'
                },
                endPoint: {
                    coordinates: [53.5088, 49.41918],
                    name: 'Тольятти',
                    description: 'Россия, Самарская область'
                },
                files: [],
                tags: [],
                regions: [],
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
                needUpdateDayData: false,
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
            settings() {
                return {
                    wheelPropagation: false,
                    suppressScrollX: true,
                }
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
                    },
                    description: {
                        editTitle: 'Редактировать описание',
                        viewSaveButton: true,
                    }
                }
            }
        },
        methods: {
            clearRoute() {
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
                this.regions = [];
                this.tags = [];
            },
            getInfoForCreate() {
                const formData = new FormData();
                if (isEmpty(this.startPoint) || isEmpty(this.endPoint) || isEmpty(this.objects)) {
                    alert('Не заполнены обязательные поля');
                    return null;
                }
                const values = {
                    id: this.routeId,
                    recommendation: 1,
                    name: this.name,
                    description: this.shortDescription,
                    content: this.description,
                    tags: this.tags,
                    files: this.files,
                    startPoint: this.startPoint.name,
                    startPointCoordLat: this.startPoint.coordinates[0],
                    startPointCoordLong: this.startPoint.coordinates[1],
                    endPoint: this.endPoint.name,
                    endPointCoordLat: this.endPoint.coordinates[0],
                    endPointCoordLong: this.endPoint.coordinates[1],
                    dateStart: this.dateStart,
                    timeStart: this.timeStart,
                    timeEnd: this.timeEnd,
                    typeMovement: [this.typeMovement],
                    objects: this.objects.map(o => ({...o, object_id: o.id})),
                    regions: this.regions,
                    days: this.days,
                    totalTime: this.totalTime,
                    totalWay: this.totalWay,
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
                    recommendation: 1,
                    name: this.name,
                    description: this.shortDescription,
                    objects: this.otherData.objects.map(o => ({...o, object_id: o.id})),
                    content: this.description,
                    tags: this.tags,
                    files: this.files,
                    days: this.days, // будут пересчитываться
                    user_id : 1,
                }
                formData.append('ZRouter', JSON.stringify(values));
                formData.append('sessionId', 1);
                console.log('saved...', values);
                return formData
            },
            createRoute() {
                this.$store.dispatch('showPreloader');
                presenter.calculatedDaysRoute({
                    ...this,
                })
                    .then(data => {
                    console.log('сгенерировали дни и растояние', data);
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
                }).finally(() => {
                    this.$store.dispatch('hidePreloader');
                });
            },
            updateRoute() {
                this.$store.dispatch('showPreloader');
                const data = this.getInfoForUpdate();
                repository.editRecommendedRoute(this.routeId, data)
                    .then(response => {

                        const data = JSON.parse(response.data);
                        if (data.status) {
                            alert('сохранение выполнено успешно!');
                        }
                    })
                    .finally(() => {
                        this.$store.dispatch('hidePreloader');
                    });
            },
            calcRouteAgain() {

            },
            changeValue(field, value) {
                this.$data[field] = value;
                if (field === 'objects') {
                    this.regions = value.map(obj => ({ id: Number(obj.region) }));
                }
                if (field === 'days') {
                    this.needUpdateDayData = true;
                }
            },
            getDataRoute() {
                this.$store.dispatch('showPreloader');
                repository.getRecommendedRoute(this.routeId)
                    .then(response => {
                        this.$store.dispatch('hidePreloader');
                        const route = JSON.parse(response.data).router;
                        console.log(route);
                        this.clearRoute();
                        this.updateState(route);
                    })
            },
            updateState(data) {
                if (isNil(data)) {
                    // this.$router.push('/list-recommended-routes');
                    return;
                }
                console.log(data);
                this.routeId = data.id;
                this.startPoint = {
                    coordinates: [data.startPointCoordLat, data.startPointCoordLong],
                }
                this.name = data.name;
                this.description = data.content;
                this.shortDescription = data.description;
                this.days = presenter.changeFormat(data.days);
                this.tags = data.tags;
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
