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
            addObject(e) {
                console.log(e);
                this.$store.dispatch('showModalConfirm', {
                    text: 'Добавить объект в маршрут?',
                    onConfirm: () => { this.$emit('add', e) }
                })
            }
        },
        computed: {
            points() {
                return this.$store.getters.getRecObjects
            }
        },
        watch:{
            points(newVal, oldVal) {
                if (!isEmpty(newVal) && newVal !== oldVal) {
                    this.visibleMap = false;
                    let myMap;
                    let pointList = this.points;
                    const { from, addObject } = this;
                    setTimeout(() => {
                        this.visibleMap = true;
                        ymaps.ready(() => init(myMap, from, pointList, addObject));
                    },100)

                    function init (myMap, from, pointList, addObject) {
                        if (myMap){
                            myMap.destroy();
                        }
                        myMap = new ymaps.Map("map", {
                            center: from, // Углич
                            zoom: 11
                        }, {
                            balloonMaxWidth: 200,
                            searchControlProvider: 'yandex#search'
                        });
                        var placemarks = []
                        pointList.forEach((obj, index) => {
                            let point = obj.position.split(', ');
                            let text = obj.name
                            placemarks[index] = new ymaps.Placemark(point, {
                                balloonContent: text
                            }, {
                                // Опции.
                                // Необходимо указать данный тип макета.
                                iconLayout: 'default#imageWithContent',
                                // Своё изображение иконки метки.
                                iconImageHref: '/assets/images/icons/marker_blue.svg',
                                // Размеры метки.
                                iconImageSize: [10, 10],
                                // Смещение левого верхнего угла иконки относительно
                                // её "ножки" (точки привязки).
                                iconImageOffset: [-5, -5],
                                // Смещение слоя с содержимым относительно слоя с картинкой.
                                iconContentOffset: [15, 15],
                            });
                            console.log(placemarks[index]);
                            placemarks[index].events.add('click', function (e) {
                                addObject(obj);
                                // placemarks[index].options.set('iconImageHref', '/assets/images/icons/marker_green.svg');
                            });
                            myMap.geoObjects.add(placemarks[index])
                        })
                        // Обработка события, возникающего при щелчке
                        // левой кнопкой мыши в любой точке карты.
                        // При возникновении такого события откроем балун.


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
                if (isEmpty(newVal)) {
                    this.visibleMap = false;
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