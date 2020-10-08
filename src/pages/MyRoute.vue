<!-- создание и редактирование моего маршрута -->
<template>
    <div>
        <Bread-crumbs
                :list-link="links"
        />
        <h1>{{ headerTitle }}</h1>

        <div class="row" v-if="!reload">
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
                            @setActiveDay="setActiveDay"
                            :indexActiveDay="indexActiveDay"
                            :data-is-change="needUpdateDayData"
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
                                :on-click="() => calculatedRoute()"
                                is-shadow
                                v-if="isNewRoute"
                        />
                        <Button text="Пересчитать маршрут"
                                :on-click="() => onCalcRoute()"
                                is-shadow
                                is-full
                                v-if="!isNewRoute"
                                :disabled="disabledUpdateButton"
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
                    <Map-routes
                            v-if="viewMap"
                            :from="startPoint.position"
                            :days="days"
                            @addPoint="addPointToActiveDay"
                            :index-active-day="indexActiveDay"
                            :read-only="false"
                    />
                    <Map-objects
                            v-if="viewMapCreate"
                            :from="startPoint"
                            :to="endPoint"
                            :points="mapPoints"
                            @addPoint="addPoint"
                    />
                    <Map-calc
                            v-if="showCalcMap"
                            :from="startPoint"
                            :to="endPoint"
                            :points="pointList"
                            :timeStart="timeStart"
                            :dateStart="dateStart"
                            :days="days"
                            :is-update="calcMapUpdate"
                            @calc="createRoute"
                            @update="updateData"
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
    import MapRoutes from "../components/map/map-with-routes";
    import MapObjects from "../components/map/map-with-objects";
    import MapCalc from "../components/map/map-for-create";
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
            MapRoutes,
            MapObjects,
            MapCalc,
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
                name: 'полеты между островами №1',
                description: 'Описание маршрута',
                startPoint: {"position":[61.77262930226311,9.061672256870137],"name":"Лемоншёэн","description":"Норвегия, Иннланнет, Вого"},
                endPoint: {"position":[78.82681866187409,-38.94044134486984],"name":"Гренландия","description":""},
                dateStart: moment(new Date()).format(),
                timeStart: '10:30',
                isGeoRoute: 'yes',
                typeMovement: 'car',
                objects: [],
                mapPoints: [{"position":[64.62714162559112,-18.448093368129907],"name":"округ Сюдюрланд","description":"Исландия"},{"position":[70.29661713080031,-35.41098399312991],"name":"Гренландия","description":""},{"position":[73.39899723801369,-35.23520274312994],"name":"Гренландия","description":""}], // точки на карте, которые будут отображаться
                pointList: [], // список точек после составления маршрута
                regions: [],
                // данные для редактирования
                days: [],
                indexActiveDay: 0,          // индекс активного дня в this.days
                globalIndexActiveDay: 0,    // индекс активного дня в this.pointList
                countObjectActiveDay: 0,
                totalTime: 0,
                totalWay: 0,
                files: [],
                otherData: {},
                needUpdateDayData: false,
                canUpdateDayData: false,
                showMap: false,
                reload: false,
                showCalcMap: false,
                calcMapUpdate: false, // флаг, который говорит что нужно не считать а пересчитывать маршрут
            }
        },
        computed: {
            disabledUpdateButton() {
                return !this.needUpdateDayData && !this.canUpdateDayData
            },
            countObjectToDays() {
                return this.days.map(day => (day.objects && day.objects.length));
            },
            globalIndex() {
                const indexes = [0];
                let l = 0; // индекс первого элемента 1 дня
                this.days.forEach((day, i) => {

                    // добавляем пока сл. дня уже не будет
                    if (i !== this.days.length - 1) {
                        l += day.objects.length - 1; // индекс 1 элемента сл. дня
                        indexes.push(l)
                    }
                });
                return indexes;
            },
            validation() {
                if (!this.name || this.name === '') {
                    return 'Не заполнено название маршрута'
                }
                if (isEmpty(this.startPoint)) {
                    return 'Не указана точка старта'
                }
                if (isEmpty(this.endPoint)) {
                    return 'Не указана точка назначения'
                }
                if (isEmpty(this.objects) && isEmpty(this.mapPoints)) {
                    return 'Не заданы точки остановки, объекты на карте'
                }
                return null;
            },
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
            calculatedRoute() {
                this.calcMapUpdate = false;
                this.showCalcMap = false;
                const validation = this.validation;
                if (validation) {
                    this.$store.dispatch('showModal', validation);
                    return null;
                }
                this.pointList = presenter.getAllPoints(this);
                setTimeout(() => {
                    this.showMap = false;
                    this.showCalcMap = true;
                }, 200)

            },

            createRoute(result) {
                if (!result.days) {
                    this.showCalcMap = false;
                    this.showMap = true;
                    this.$store.dispatch('showModal', `маршрут от "${result.start}" до "${result.end}" составил ${presenter.getTime(result.time)}, необходимо его разбить на более маленькие маршруты`);
                    return null;
                }
                this.$store.dispatch('showPreloader');

                this.days = result.days;
                this.totalWay = result.totalWay;
                this.totalTime = result.totalTime;
                this.pointList = result.pointList;

                const infoForSave = this.getInfoForCreate();
                repository.createMyRoute(this.userId, infoForSave)
                    .then(response => {
                        const result = JSON.parse(response.data);
                        if (result && result.id) {
                            this.$store.dispatch('showModalSuccess', {
                                text: 'Маршрут составлен!',
                                onSuccess: () => {
                                    this.showCalcMap= false;
                                    this.showMap = false;
                                    this.$router.push(`/edit-my-route/${result.id}`)
                                }
                            });
                        }
                    })
                    .finally(() => {
                        this.$store.dispatch('hidePreloader');
                    });
            },

            onCalcRoute() {
                this.calcMapUpdate = true;
                this.showCalcMap = false;
                this.pointList = presenter.updateAllPoints(this);
                this.showMap = true;
                setTimeout(() => {
                    this.showCalcMap = true;
                    this.showMap = false;
                    this.$store.dispatch('showPreloader');
                }, 200);
            },
            updateData(result) {
                if (!result.days) {
                    this.showCalcMap = false;
                    this.showMap = true;
                    this.$store.dispatch('showModal', `маршрут от "${result.start}" до "${result.end}" составил ${presenter.getTime(result.time)}, необходимо его разбить на более маленькие маршруты`);
                    return null;
                }
                this.days = result.days.map(day => {
                    let pointStart = {
                        date: day.dateStart,
                        time: day.timeStart
                    };
                    let pointEnd = {
                        date: day.dateEnd,
                        time: day.timeEnd
                    }
                    let objects = day.objects.map(o => ({
                        ...o,
                        coordinates: o.position,
                    }))
                    return {
                        ...day,
                        pointStart,
                        pointEnd,
                        objects
                    }
                });
                this.totalWay = result.totalWay;
                this.totalTime = result.totalTime;
                this.pointList = result.pointList;
                this.showCalcMap = false;
                this.showMap = true;
                this.needUpdateDayData = false;
                this.canUpdateDayData = false;
                this.$store.dispatch('showModalSuccess', {text: 'Маршрут пересчитан!'});
                this.$store.dispatch('hidePreloader');
                setTimeout(() => {
                    this.$store.dispatch('hideModal');
                }, 500);

            },

            updateRoute() {
                this.$store.dispatch('showPreloader');
                const data = this.getInfoForUpdate();
                repository.editMyRoute(this.userId, this.routeId, data)
                    .then(response => {
                        const data = JSON.parse(response.data);
                        if (data.status) {
                            this.$store.dispatch('showModalSuccess', { text: 'сохранение выполнено успешно!' });
                            setTimeout(() => {
                                this.$store.dispatch('hideModal');
                            }, 500);
                        }
                    }).finally(() => {
                    this.$store.dispatch('hidePreloader');
                });
            },
// ------------------------------------далее доделанные методы V
            addPointToActiveDay(point) {
                // мы знаем позиции активного дняи нам надо эту точку добавить в 1 месте
                let wellPoint = {
                    ...point,
                    startPointCoordLat: point.position[0],
                    startPointCoordLong: point.position[1],
                    time: 0,
                    object_id: null,
                    timeInWay: 0,
                    stopTime: 0,
                    way: 0,
                    typeMovement: ['car']
                }
                this.days[this.indexActiveDay].objects.splice(this.countObjectActiveDay - 1, 0, wellPoint);
                this.pointList.splice(this.globalIndexActiveDay + this.countObjectActiveDay - 1, 0, wellPoint)
                this.needUpdateDayData = true;
            },
            setActiveDay(index) {
                if (this.needUpdateDayData) {
                    this.onCalcRoute();
                }
                this.indexActiveDay = index;
                this.globalIndexActiveDay = this.globalIndex[index];
                this.countObjectActiveDay = this.countObjectToDays[index];
            },
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
                this.pointList = [];
                this.mapPoints = [];
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
                    regions: this.regions,
                    map_points: JSON.stringify(this.pointList),
                    user_id : this.$store.getters.getUserId,
                }
                formData.append('ZRouter', JSON.stringify(values));
                formData.append('sessionId', 1);
                return formData
            },
            changeValue(field, value) {
                if (field === 'days') {
                    const activeDayObjects = value[this.indexActiveDay].objects;
                    if (this.days.length === 1) {
                        this.pointList = activeDayObjects;
                    }
                    else {
                        this.pointList.splice(this.globalIndexActiveDay, this.countObjectActiveDay, ...activeDayObjects);
                    }
                    this.needUpdateDayData = true;
                }
                if (field === 'isGeoRoute') {
                    this.canUpdateDayData = true;
                }
                this.$data[field] = value;
                this.countObjectActiveDay = this.countObjectToDays[this.indexActiveDay];
                if (field === 'objects') {
                    this.regions = value.map(obj => ({ id: obj.region }));
                    this.mapPoints = value;
                }
            },
            getDataRoute() {
                this.$store.dispatch('showPreloader');
                repository.getMyRoute(this.userId, this.routeId)
                    .then(response => {
                        this.$store.dispatch('hidePreloader');
                        const route = JSON.parse(response.data).router;
                        this.showMap = true;
                        this.updateState(route);
                    })
            },
            updateState(data) {
                if (isNil(data)) {
                    return;
                }
                this.routeId = data.id;
                this.dateStart = data.dateStart;
                this.timeStart = data.timeStart;
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
                this.regions = data.regions;
                this.otherData = data; // для того, чтобы не потерять данные
                this.showMap = true;
                this.setActiveDay(0);
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
            },
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
            } else {
                this.showMap = true;
            }
        },
    }
</script>

<style lang="less">
    @import "../styles/mixins";

    .map-stiky {
        position: sticky;
        top: 0;
    }
</style>
