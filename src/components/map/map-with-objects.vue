<template>
    <div id="map" v-if="visibleMap"/>
</template>

<script>
    import { isEmpty } from 'lodash';
    import { Presenter } from '../../presenter';
    const presenter = new Presenter();
    export default {
        name: "Map-with-objects",
        props: {
            from: Array,
        },
        data() {
            return {
                visibleMap: false,
            }
        },
        methods: {

        },
        computed: {
            points() {
                return this.$store.getters.getRecObjects
            }
        },
        watch:{
            points() {
                if (!isEmpty(this.points)) {
                    this.visibleMap = true;

                    console.log(this.points);
                    console.log(this.points && this.points.map(obj => (obj.position)));

                    ymaps.ready(init);
                    var myMap;
                    var pointList = this.points.map(obj => (obj.position));
                    const { from } = this;

                    function init () {
                        myMap = new ymaps.Map("map", {
                            center: from, // Углич
                            zoom: 11
                        }, {
                            balloonMaxWidth: 200,
                            searchControlProvider: 'yandex#search'
                        });

                        // Обработка события, возникающего при щелчке
                        // левой кнопкой мыши в любой точке карты.
                        // При возникновении такого события откроем балун.
                        myMap.events.add('click', function (e) {
                            if (!myMap.balloon.isOpen()) {
                                var coords = e.get('coords');
                                myMap.balloon.open(coords, {
                                    contentHeader:'Событие!',
                                    contentBody:'<p>Кто-то щелкнул по карте.</p>' +
                                        '<p>Координаты щелчка: ' + [
                                            coords[0].toPrecision(6),
                                            coords[1].toPrecision(6)
                                        ].join(', ') + '</p>',
                                    contentFooter:'<sup>Щелкните еще раз</sup>'
                                });
                            }
                            else {
                                myMap.balloon.close();
                            }
                        });

                        // Обработка события, возникающего при щелчке
                        // правой кнопки мыши в любой точке карты.
                        // При возникновении такого события покажем всплывающую подсказку
                        // в точке щелчка.
                        myMap.events.add('contextmenu', function (e) {
                            myMap.hint.open(e.get('coords'), 'Кто-то щелкнул правой кнопкой');
                        });

                        // Скрываем хинт при открытии балуна.
                        myMap.events.add('balloonopen', function (e) {
                            myMap.hint.close();
                        });
                    }
                }
            }
        },
        created() {

        }
    }
</script>

<style lang="less">
    #map {
        height: 95vh;
    }
</style>