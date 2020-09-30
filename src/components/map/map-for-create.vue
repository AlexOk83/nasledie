<template>
    <div id="map-create" />
</template>

<script>
    import { isEmpty } from 'lodash';
    import { Presenter } from '../../presenter';
    import {getAdress, getDistanceFromLatLonInMeters, isEqual} from "../../utils";
    const presenter = new Presenter();
    export default {
        name: "Map-for-create",
        props: {
            from: Object,
            points: Array,
            timeStart: String,
            dateStart: String,
            isUpdate: Boolean,
            days: Array,
        },
        data() {
            return {
                map: {},
                startPoint: null,
                endPoint: [],
                currentPoints: this.points,
                multiRoutes: [],
                setCounts: 0,
            }
        },
        computed: {
            needCount() {
                return this.setCounts === this.points.length;
            },
            routes() {
                return this.points.map((p, i) => {
                    if (i !== 0) {
                        return {
                            referencePoints: [[this.points[i - 1].startPointCoordLat, this.points[i - 1].startPointCoordLong], [p.startPointCoordLat, p.startPointCoordLong]],
                            routingMode: p.typeMovement[0],
                            point: p
                        }
                    }
                }).filter(item => item);
            },
        },
        methods: {
            setCurrentPoints(point) {
                console.log(this.setCounts);
                this.setCounts ++;
                this.currentPoints = this.currentPoints.map(p => {
                    if (isEqual([point.startPointCoordLat, point.startPointCoordLong], [p.startPointCoordLat, p.startPointCoordLong])) {
                        return point
                    } else {
                        return p
                    }
                })
                    if (this.needCount) {
                        console.log(this.currentPoints);
                        // когда получили назад заполненные точки
                        let days = [];
                        if (this.isUpdate) {
                            days = this.days;
                        }
                        const result = presenter.createDataDays(this.currentPoints, this.dateStart, this.timeStart, days);
                        console.log(result);
                        if (this.isUpdate) {
                            this.$emit('update', result);
                        } else {
                            this.$emit('calc', result);
                        }


                    }
            },
            init() {
                const { from, routes, multiRoutes, setCurrentPoints } = this;
                this.map = new ymaps.Map('map-create', {
                    center: from.position,
                    zoom: 15,
                    controls: []
                });
                this.setCurrentPoints(this.points[0])
                routes.forEach((item, index) => {
                    multiRoutes[index] = new ymaps.multiRouter.MultiRoute({
                        referencePoints: item.referencePoints,
                        params: {
                            routingMode: presenter.getRoutingMode(item.routingMode)
                        }
                    });

                    // Отобразим мультимаршрут на карте.
                    this.map.geoObjects.add(multiRoutes[index]);

                    // Подпишемся на событие построения мультимаршрута.
                    multiRoutes[index].model.events.add('requestsuccess', function() {
                        // Получение информации об активном маршруте.
                        var activeRoute = multiRoutes[index].getActiveRoute();
                        // Получение коллекции путей маршрута.
                        var activeRoutePaths = activeRoute && activeRoute.getPaths();
                        // Проход по коллекции путей.
                        console.log(activeRoutePaths);
                        if (!activeRoutePaths) {
                            let point = item.point;
                            let distance = getDistanceFromLatLonInMeters(item.referencePoints[0], item.referencePoints[1])
                            point.timeInWay = Math.round(distance / 1000 / 800 * 60 );
                            point.way = distance;
                            point.way_false = 1;
                            console.log('вручную', distance);
                            console.log('вручную', point.timeInWay);
                            setCurrentPoints(point)
                        }
                        else {
                            activeRoutePaths && activeRoutePaths.each(function(path) {
                                let point = item.point;
                                let duration = path.properties.get("duration").value;
                                let distance = path.properties.get("distance").value;
                                point.timeInWay = Math.round(duration / 60);
                                point.way = Math.round(distance);
                                console.log("Время прохождения пути: " + path.properties.get("duration").text);
                                console.log("Расстояние: " + path.properties.get("distance").text);
                                point.way_false = 0;
                                setCurrentPoints(point)
                            });
                        }
                    });
                    // Добавление маршрута на карту.
                    this.map.geoObjects.add(multiRoutes[index]);
                })
                if (this.needCount) {
                    this.map.setBounds(this.map.geoObjects.getBounds(),{checkZoomRange:true, zoomMargin:10});
                }


            }

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