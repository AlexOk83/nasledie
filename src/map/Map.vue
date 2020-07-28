<template>
    <div id="map" />
</template>

<script>

    import Field from "../components/formControl/Field";

    export default {
        name: "Map",
        components: {
            Field,
        },
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
                        console.log(point)
                        pointList.push(point)
                    }
                    pointList.push(to)
                    var multiRoute = new ymaps.multiRouter.MultiRoute({
                        multiRoute: true,
                        // Точки маршрута. Точки могут быть заданы как координатами, так и адресом.
                        referencePoints: pointList,
                        params: {
                            routingMode: 'masstransit' //— маршрутизация с использованием общественного транспорта. Доступна только для мультимаршрутов (опция multiRoute должна быть выставлена в true);
                            //routingMode: 'auto' автомобильная маршрутизация;
                            //routingMode: 'pedestrian'  — пешеходная маршрутизация. Доступна только для мультимаршрутов (опция multiRoute должна быть выставлена в true);
                        }
                    }, {
                        // Автоматически устанавливать границы карты так,
                        // чтобы маршрут был виден целиком.
                        boundsAutoApply: true
                    });

// Добавление маршрута на карту.
                    myMap.geoObjects.add(multiRoute);


                    // myMap.controls.add(switchPointsButton);
                });
            }
        },
        created() {
            this.render()
        }
    }


</script>

<style lang="less">
    @import "../styles/mixins";

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
