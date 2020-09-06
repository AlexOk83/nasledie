<template>
    <div id="map" />
</template>

<script>
    export default {
        name: "Map",
        props: ['from', 'to', 'points'],
        methods: {
            render: function() {
                const { from, to, points } = this;

                ymaps.ready(function () {
                    var myMap = new ymaps.Map('map', {
                        center: [55.753994, 37.622093],
                        zoom: 9,
                        // Добавим панель маршрутизации.
                        controls: ['default']
                    });
                    var pointList = [];
                    pointList.push(from)
                    for(let point of points)
                    {
                        pointList.push(point)
                    }
                    pointList.push(to)
                    var multiRoute = new ymaps.multiRouter.MultiRoute({
                        multiRoute: true,
                        // Точки маршрута. Точки могут быть заданы как координатами, так и адресом.
                        referencePoints: pointList,
                        params: {
                            routingMode: 'masstransit', //— маршрутизация с использованием общественного транспорта. Доступна только для мультимаршрутов (опция multiRoute должна быть выставлена в true);
                            //routingMode: 'auto' автомобильная маршрутизация;
                            //routingMode: 'pedestrian'  — пешеходная маршрутизация. Доступна только для мультимаршрутов (опция multiRoute должна быть выставлена в true);
                            results: 3
                        },

                    }, {
                        // Внешний вид путевых точек.
                        wayPointStartIconLayout: "default#image",
                        wayPointStartIconImageHref: "/src/assets/images/icons/flag_blue.svg",
                        wayPointStartIconImageSize: [30, 30],
                        wayPointStartIconImageOffset: [-5, -25],
                        // Задаем собственную картинку для последней путевой точки.
                        wayPointFinishIconLayout: "default#image",
                        wayPointFinishIconImageHref: "/src/assets/images/icons/flag_blue.svg",
                        wayPointFinishIconImageSize: [30, 30],
                        wayPointFinishIconImageOffset: [-5, -25],

                        wayPointIconLayout: "default#image",
                        wayPointIconImageHref: "/src/assets/images/icons/flag_yellow.svg",
                        wayPointIconImageSize: [30, 30],
                        wayPointIconImageOffset: [-2, -25],
                        // Позволяет скрыть иконки путевых точек маршрута.
                        // wayPointVisible:false,

                        // Внешний вид транзитных точек.

                        viaPointIconLayout: "default#image",
                        viaPointIconImageHref: "/src/assets/images/icons/flag_blue.svg",
                        viaPointIconImageSize: [30, 30],
                        viaPointIconImageOffset: [-5, -25],
                        viaPointDraggable: false,
                        // Позволяет скрыть иконки транзитных точек маршрута.
                        // viaPointVisible:false,

                        // Внешний вид точечных маркеров под путевыми точками.
                        pinIconLayout: "default#image",
                        pinIconImageHref: "/src/assets/images/icons/flag_blue.svg",
                        pinIconImageSize: [30, 30],
                        pinIconImageOffset: [-5, -25],

                        // Позволяет скрыть точечные маркеры путевых точек.
                        // pinVisible:false,

                        // Внешний вид линии маршрута.
                        routeActiveStrokeWidth: [3, 3],
                        routeActiveStrokeColor: ["#ff0000","#00ff00"],

                        // Внешний вид линии пешеходного маршрута.
                        routeActivePedestrianSegmentStrokeStyle: "solid",
                        routeActivePedestrianSegmentStrokeColor: "#00CDCD",

                        boundsAutoApply: true
                    });
                    multiRoute.model.events.add('requestsuccess', function() {
                        // Получение ссылки на активный маршрут.
                        var activeRoute = multiRoute.getActiveRoute();
                        var activeRoutePaths = activeRoute.getPaths();
                        activeRoutePaths.each(function(path) {
                            console.log("Длина пути: " + path.properties.get("distance").text);
                            console.log("Время прохождения пути: " + path.properties.get("duration").text);
                        });
                    });
                    //https://tech.yandex.ru/maps/jsapi/doc/2.1/dg/concepts/router/multiRouter-docpage/#multiRouter__get-active-route
                    myMap.geoObjects.add(multiRoute);


                });
            }
        },
        created() {
            this.render()
        }
    }


</script>

<style lang="less">
    @import "../../styles/mixins";

    .left-form {
        .column(4, 4);
        .column_padding();
    }
    .right-container {
        .column(8, 8);
        .column_padding();
    }
    #map {
        height: 1000px;
    }
</style>
