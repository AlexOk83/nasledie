<template>
    <div id="map" v-if="visibleMap" />
</template>

<script>
    import { isEmpty } from 'lodash';
    import { Presenter } from '../../presenter';
    const presenter = new Presenter();
    export default {
        name: "MapTest",
        props: {
            from: Array,
            days: Array,
        },
        data() {
            return {
                routes: null,
                visibleMap: true,
            }
        },
        methods: {
            getRoutes() {
                console.log('1');
                let currentRoutingMode = '';
                let currentPointList = [];
                let routes = [];

                this.days.forEach((day, indexDay) => {
                    routes[indexDay] = [];
                    currentRoutingMode = '';

                    day.objects.forEach((obj, indexObj) => {
                        let coordinates = obj.coordinates;
                        let routingMode = presenter.getRoutingMode(obj.typeMovement[0]);
                        if (indexObj === 0) {
                            currentPointList = [coordinates]; // 1 точка в текущем дне
                        }
                        else {
                            let prevCoordinates = day.objects[indexObj - 1].coordinates;

                            if (currentRoutingMode === '') { // если это вторая точка
                                currentRoutingMode = routingMode; // присваиваем для сравнения
                                currentPointList.push(coordinates); // записываем в pointList
                            }
                            else if (routingMode === currentRoutingMode ) { // если это 3, 4.. точка, и режим перемещения не изменился
                                currentPointList.push(coordinates);
                            }
                            else { // режим изменился
                                routes[indexDay].push({
                                    pointList: currentPointList,
                                    routingMode: currentRoutingMode,
                                });
                                currentPointList = [prevCoordinates, coordinates];
                                currentRoutingMode = routingMode;
                            }
                            if (indexObj === day.objects.length - 1) { // если точка была последняя
                                routes[indexDay].push({
                                    pointList: currentPointList,
                                    routingMode: currentRoutingMode,
                                });
                            }
                        }


                    })
                });
                console.log(routes);
                this.routes = routes;
            },
        },
        created() {
            this.getRoutes();
            const {from, routes} = this;

            this.visibleMap = false;
            let myMap;
            setTimeout(() => {
                this.visibleMap = true;
                ymaps.ready(() => init(myMap, from, routes));
            },100)

            function init(myMap, from, routes) {
                if (myMap){
                    myMap.destroy();
                }
                myMap = new ymaps.Map('map', {
                    center: from,
                    zoom: 8,
                    controls: []
                });

                let multiRoute = [];
                routes.forEach((day, index) => {
                    multiRoute[index] = [];
                    let styles = presenter.getStylesPoints(index);
                    day.forEach((route, i) => {
                        // Создаем мультимаршрут.
                        multiRoute[index][i] = new ymaps.multiRouter.MultiRoute(
                            {
                                referencePoints: route.pointList,
                                params: {
                                    routingMode: route.routingMode,
                                }
                            },
                            {
                                // Внешний вид путевых точек.
                                wayPointStartIconLayout: "default#image",
                                wayPointStartIconImageHref: styles.imagePoint,
                                wayPointStartIconImageSize: [15, 15],
                                wayPointStartIconImageOffset: [-7, -7],
                                // промежуточные точки
                                wayPointIconLayout: "default#image",
                                wayPointIconImageHref: styles.imagePoint,
                                wayPointIconImageSize: [15, 15],
                                wayPointIconImageOffset: [-7, -7],
                                // Задаем собственную картинку для последней путевой точки.
                                wayPointFinishIconLayout: "default#image",
                                wayPointFinishIconImageHref: styles.imageFlag,
                                wayPointFinishIconColor: styles.color,
                                wayPointFinishIconImageSize: [45, 45],
                                wayPointFinishIconImageOffset: [-7, -37],
                                // Позволяет скрыть иконки путевых точек маршрута.
                                // wayPointVisible:false,

                                // Внешний вид транзитных точек.
                                viaPointIconRadius: 7,
                                viaPointIconFillColor: styles.color,
                                viaPointActiveIconFillColor: styles.color,
                                // Транзитные точки можно перетаскивать, при этом
                                // маршрут будет перестраиваться.
                                viaPointDraggable: false,
                                // Позволяет скрыть иконки транзитных точек маршрута.
                                // viaPointVisible:false,

                                // Внешний вид точечных маркеров под путевыми точками.
                                pinIconFillColor: styles.color,
                                pinActiveIconFillColor: styles.color,
                                // Позволяет скрыть точечные маркеры путевых точек.
                                // pinVisible:false,

                                // Внешний вид линии маршрута.
                                routeStrokeWidth: 2,
                                routeStrokeColor: styles.color,
                                routeActiveStrokeWidth: 6,
                                routeActiveStrokeColor: styles.color,

                                // Внешний вид линии пешеходного маршрута.
                                // routeActivePedestrianSegmentStrokeStyle: "solid",
                                routeActivePedestrianSegmentStrokeColor: styles.color,

                                // Автоматически устанавливать границы карты так, чтобы маршрут был виден целиком.
                                boundsAutoApply: true
                            }
                        );

                        // Добавляем мультимаршрут на карту.
                        myMap.geoObjects.add(multiRoute[index][i]);
                    })
                })


            }

        },
    }
</script>

<style lang="less">
    #map {
        height: 95vh;
    }
</style>