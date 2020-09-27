<template>
    <div id="map" />
</template>

<script>
    import { isEmpty } from 'lodash';
    import { Presenter } from '../../presenter';
    import {getAdress, isEqual} from "../../utils";
    const presenter = new Presenter();
    export default {
        name: "Map-with-routes",
        props: {
            from: Array,
            days: Array,
            indexActiveDay: Number,
            readOnly: {
                type: Boolean,
                default: true,
            }
        },
        data() {
            return {
                map: {},
                multiRoutes: [],
                currentPoints: [],
                hasFlyRoutes: false,
            }
        },
        methods: {
            routes() {
                let currentRoutingMode = '';
                let currentPointList = [];
                let routes = [];
                console.log(this.days);
                this.days.forEach((day, indexDay) => {
                    routes[indexDay] = [];
                    currentRoutingMode = '';

                    day.objects.forEach((obj, indexObj) => {
                        let coordinates = obj.coordinates;
                        let routingMode = presenter.getRoutingMode(obj.typeMovement[0]);
                        // 1 точка в текущем дне
                        if (indexObj === 0) {
                            currentPointList = [coordinates];
                        }
                        // все остальные точки
                        else {
                            let prevCoordinates = day.objects[indexObj - 1].coordinates;
                            // если в эту точку не попасть
                            // сохраняем этот отрезок как полет
                            if (day.objects[indexObj].way_false) {
                                if (currentRoutingMode !== '') {
                                    routes[indexDay].push({
                                        pointList: currentPointList,
                                        routingMode: currentRoutingMode,
                                        veryLong: obj.routeVeryLong,
                                    });
                                }
                                routes[indexDay].push({
                                    pointList: [prevCoordinates, coordinates],
                                    routingMode: 'fly',
                                    veryLong: obj.routeVeryLong,
                                });
                                currentPointList = [coordinates];
                                currentRoutingMode = routingMode;
                            }
                            // если попасть...
                            else {
                                // если это только 2 точка
                                if (currentRoutingMode === '') { // только если это вторая точка
                                    currentRoutingMode = routingMode;
                                    currentPointList.push(coordinates);
                                }
                                // если режим не изменился
                                else if (routingMode === currentRoutingMode) {
                                    currentPointList.push(coordinates);
                                }
                                // если изменился
                                else { // режим изменился
                                    routes[indexDay].push({
                                        pointList: currentPointList,
                                        routingMode: currentRoutingMode,
                                        veryLong: obj.routeVeryLong,
                                    });
                                    currentPointList = [prevCoordinates, coordinates];
                                    currentRoutingMode = routingMode;
                                }
                                // если точка последняя
                                if (indexObj === day.objects.length - 1) { // если точка была последняя
                                    routes[indexDay].push({
                                        pointList: currentPointList,
                                        routingMode: currentRoutingMode,
                                        veryLong: obj.routeVeryLong,
                                    });
                                }
                            }
                        }
                    })
                });
                console.log(routes);
                return routes;
            },
            addPoint(point) {
                this.$store.dispatch('showModalConfirm', {
                    text: `Добавить в выбранном дне точку: ${getAdress(point)}?`,
                    onConfirm: () => {
                        let image = presenter.getStylesPoints(this.indexActiveDay).imagePoint;
                        let size = [10, 10];
                        let offset = [-5, -5];
                        const l = this.currentPoints[this.indexActiveDay].length || 0;
                        this.currentPoints[this.indexActiveDay][l] = new ymaps.Placemark(point.position, {
                            hintContent: getAdress(point),
                        }, {
                            // Опции.
                            // Необходимо указать данный тип макета.
                            iconLayout: 'default#imageWithContent',
                            // Своё изображение иконки метки.
                            iconImageHref: image,
                            // Размеры метки.
                            iconImageSize: size,
                            // Смещение левого верхнего угла иконки относительно
                            // её "ножки" (точки привязки).
                            iconImageOffset: offset,
                            // Смещение слоя с содержимым относительно слоя с картинкой.
                        });

                        this.map.geoObjects.add(this.currentPoints[this.indexActiveDay][l]);
                        this.$emit('addPoint', point);
                    }
                });
            },
            init() {
                const {from, addPoint} = this;
                this.map = new ymaps.Map("map", {
                    center: from, // по умолчанию москва
                    zoom: 13,
                    controls: [],
                }, {
                    // searchControlProvider: 'yandex#search',
                    yandexMapDisablePoiInteractivity: true // отключил интерактивность маркеров
                });

                if (!this.readOnly) {
                    var cursor = this.map.cursors.push('crosshair');

                    this.map.events.add('click', function (e) {
                        var coords = e.get('coords');
                        const geocoder = ymaps.geocode(coords);
                        let pointList = [];

                        // После того, как поиск вернул результат, вызывается callback-функция
                        geocoder.then(
                            function (res) {
                                res.geoObjects.each(function (el) {
                                    let point = {
                                        position: el.geometry.getCoordinates(),
                                        name: el.properties.get('name'),
                                        description: el.properties.get('description'),
                                    }
                                    pointList.push(point);
                                });
                                addPoint(pointList[0]);
                            }
                        );

                    });

                }

                // добавление маршрутов
                this.routes().forEach((day, index) => {
                    this.multiRoutes[index] = [];
                    let styles = presenter.getStylesPoints(index);

                    day.forEach((route, i) => {
                        const color = route.veryLong ? '#ff1b10' : styles.color
                        // Создаем мультимаршрут.
                        if (route.routingMode === 'fly') {
                            this.multiRoutes[index][i] = new ymaps.Polyline(
                                // Указываем координаты вершин ломаной.
                                route.pointList
                            , {

                            }, {
                                // Цвет линии.
                                strokeColor: color,
                                // Ширина линии.
                                strokeWidth: 6,
                                // Коэффициент прозрачности.
                                strokeOpacity: 1
                            });
                            this.hasFlyRoutes = true;
                        }
                        else {
                            this.multiRoutes[index][i] = new ymaps.multiRouter.MultiRoute(
                                {
                                    referencePoints: route.pointList,
                                    params: {
                                        routingMode: route.routingMode,
                                        hintContent: 'asdasd'
                                    }
                                },
                                {
                                    // Внешний вид путевых точек.
                                    wayPointStartIconLayout: "default#image",
                                    wayPointStartIconImageHref: styles.imagePoint,
                                    wayPointStartIconImageSize: [2, 2],
                                    wayPointStartIconImageOffset: [-1, -1],
                                    // промежуточные точки
                                    wayPointIconLayout: "default#image",
                                    wayPointIconImageHref: styles.imagePoint,
                                    wayPointIconImageSize: [2, 2],
                                    wayPointIconImageOffset: [-1, -1],
                                    // Задаем собственную картинку для последней путевой точки.
                                    wayPointFinishIconLayout: "default#image",
                                    wayPointFinishIconImageHref: styles.imagePoint,
                                    wayPointFinishIconColor: color,
                                    wayPointFinishIconImageSize: [2, 2],
                                    wayPointFinishIconImageOffset: [-1, -1],
                                    // Позволяет скрыть иконки путевых точек маршрута.
                                    // wayPointVisible:false,

                                    // Внешний вид транзитных точек.
                                    viaPointIconRadius: 7,
                                    viaPointIconFillColor: color,
                                    viaPointActiveIconFillColor: color,
                                    // Транзитные точки можно перетаскивать, при этом
                                    // маршрут будет перестраиваться.
                                    viaPointDraggable: false,
                                    // Позволяет скрыть иконки транзитных точек маршрута.
                                    // viaPointVisible:false,

                                    // Внешний вид точечных маркеров под путевыми точками.
                                    pinIconFillColor: color,
                                    pinActiveIconFillColor: color,
                                    // Позволяет скрыть точечные маркеры путевых точек.
                                    // pinVisible:false,

                                    // Внешний вид линии маршрута.
                                    routeStrokeWidth: 2,
                                    routeStrokeColor: color,
                                    routeActiveStrokeWidth: 6,
                                    routeActiveStrokeColor: color,

                                    // Внешний вид линии пешеходного маршрута.
                                    // routeActivePedestrianSegmentStrokeStyle: "solid",
                                    routeActivePedestrianSegmentStrokeColor: color,

                                    // Автоматически устанавливать границы карты так, чтобы маршрут был виден целиком.
                                    boundsAutoApply: false
                                }
                            );
                        }


                        // Добавляем мультимаршрут на карту.
                        this.map.geoObjects.add(this.multiRoutes[index][i]);
                    })
                });

                // добавление маркеров на карту
                this.days.forEach((day, indexDay ) => {
                    this.currentPoints[indexDay] = [];
                    let styles = presenter.getStylesPoints(indexDay);
                    let finalObject = day.objects[day.objects.length - 1]
                    day.objects.forEach((obj, indexObj) => {
                        let image = isEqual(finalObject.coordinates, obj.coordinates) ? styles.imageFlag : styles.imagePoint;
                        let size = isEqual(finalObject.coordinates, obj.coordinates) ? [45, 45] : [10, 10];
                        let offset = isEqual(finalObject.coordinates, obj.coordinates) ? [-7, -37] : [-5, -5];
                        let time = obj.timeInWay === 0 ? 'Начало маршрута' : presenter.getTime(obj.timeInWay)
                        this.currentPoints[indexDay][indexObj] = new ymaps.Placemark(obj.coordinates, {
                            hintContent: '<div><p>' + getAdress(obj) + '</p><p>' + time + '</p></div>',
                        }, {
                            // Опции.
                            // Необходимо указать данный тип макета.
                            iconLayout: 'default#imageWithContent',
                            // Своё изображение иконки метки.
                            iconImageHref: image,
                            // Размеры метки.
                            iconImageSize: size,
                            // Смещение левого верхнего угла иконки относительно
                            // её "ножки" (точки привязки).
                            iconImageOffset: offset,
                            // Смещение слоя с содержимым относительно слоя с картинкой.
                        });

                        this.map.geoObjects.add(this.currentPoints[indexDay][indexObj])
                    })
                });

                this.map.setBounds(this.map.geoObjects.getBounds(),{checkZoomRange:true, zoomMargin:35});
            }
        },
        computed: {

        },
        watch: {

        },
        mounted() {
            ymaps.ready(this.init);
        }
    }
</script>

<style lang="less">
    #map {
        height: 95vh;
    }
</style>