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
                           :save="!isNewRoute && config.name"
                           @change="changeValue('name', $event)"
                    />
                    <Field name="description"
                           type="longtext"
                           title="Описание маршрута"
                           placeholder="Описание маршрута"
                           :value="description"
                           :save="!isNewRoute && config.description"
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
                                :objects="objects"
                                @change="changeValue('objects', $event)"
                        />
                    </div>
                    <div v-if="!isNewRoute">
                        <Photos @change="changeValue('files', $event)" :photos="files" :max-count=1 />
                        <Tabs
                            v-if="days && days.length > 0"
                            :data="days"
                            @change="changeValue('days', $event)"
                        />
                    </div>
                    <Field name="isGeoRoute"
                           type="radio"
                           title="Сформировать маршрут по географической близости объектов"
                           :value="isGeoRoute"
                           :list-value="listParams"
                           @change="changeValue('isGeoRoute', $event)"
                    />
                    <div class="buttons-container">
                        <Button text="Составить маршрут"
                                :on-click="calcRoute"
                                is-shadow
                                v-if="isNewRoute"
                        />
                        <Button text="Пересчитать маршрут"
                                :on-click="calcRouteAgain"
                                is-shadow
                                is-full
                                v-if="!isNewRoute"
                        />
                        <Button text="Сохранить в мои маршруты"
                                :on-click="saveRoute"
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
                        :to="endPoint.coordinates"
                        :typeMovement="typeMovement"
                        :points="objects.map(o => (o.position))"
                />
            </div>
        </div>
    </div>
</template>

<script>
    import Field from "../components/form-control/Field";
    import Map from "../components/map/index";
    import Button from "../components/form-control/button/index";
    import Objects from "../components/added-objects";
    import Tabs from "../components/tabs";
    import Photos from "../components/photos/photos";
    import Repository from '../repository';
    import { radioButtonOptions, typesOfMovement, MockDays } from '../constants';
    const repository = new Repository();

    export default {
        name: "CreateRoute",
        components: {
            Map,
            Field,
            Objects,
            Button,
            Tabs,
            Photos
        },
        data() {
            return {
                routeId: null,
                isNewRoute: true,
                listParams: radioButtonOptions,
                listTypesMovement: typesOfMovement,
                //-------------------
                name: 'Тестовый маршрут',
                description: 'Описание маршрута',
                startPoint: {
                    coordinates: null,
                    name: '',
                    description: ''
                },
                endPoint: {
                    coordinates: null,
                    name: '',
                    description: ''
                },
                dateStart: '2020-08-05',
                timeStart: '10:30',
                isGeoRoute: 'yes',
                typeMovement: '',
                objects: [],
                days: {},
                otherData: {},
                files: [],
            }
        },
        computed: {
            viewMap() {
                return this.startPoint.coordinates && this.endPoint.coordinates
            },
            headerTitle() {
                if (this.isNewRoute) {
                    return 'Составить маршрут пользователя'
                }
                return 'Редактировать маршрут пользователя'
            },
            config() {
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
            getInfoForSave() {
                const formData = new FormData();
                formData.append('ZRouter', JSON.stringify({
                    ...this.otherData,
                    id: this.routeId,
                    name: this.name,
                    description: this.description,
                    isGeoRoute: this.isGeoRoute,
                    typeMovement: this.routeId ? this.otherData.typeMovement : [this.typeMovement],
                    objects: this.objects,
                    days: this.days,
                    user_id : 1,
                }));
                formData.append('sessionId', 1);
                return formData
            },
            createRoute() {
                const data = this.getInfoForSave();
                repository.createMyRoute(data)
                    .then(response => {
                        console.log(response.data)
                    });
            },
            updateRoute() {
                const data = this.getInfoForSave();
                repository.editMyRoute(this.routeId, data)
                    .then(response => {
                        console.log(response.data)
                    });
            },
            calcRoute() {

            },
            calcRouteAgain() {

            },
            saveRoute() {

            },
            submitForm() {
                console.clear()
                if (this.isNewRoute) {
                    this.createRoute();
                } else {
                    this.updateRoute();
                }
            },
            changeValue(field, value) {
                this.$data[field] = value
            },
            getDataRoute() {
                repository.getMyRoute(this.routeId)
                .then(response => {
                    const route = JSON.parse(response.data).router;
                    this.updateState(route);
                })
            },
            updateState(data) {
                this.name = data.name;
                this.description = data.description;
                this.days = MockDays;
                this.isGeoRoute = data.isGeoRoute;
                this.otherData = data; // для того, чтобы не потерять данные
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
                }
            }
        },
        created() {
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
</style>
