<template>
    <div id="map" />
</template>

<script>
    import { isEmpty } from 'lodash';
    import { Presenter } from '../../presenter';
    const presenter = new Presenter();
    export default {
        name: "Map-with-objects",
        props: {
            from: Array,
            to: Array,
            points: Array,
        },
        data() {
            return {
                map: {},
                startPoint: null,
                endPoint: [],
                currentPoints: [],
            }
        },
        methods: {
            addObject(e) {
                console.log(e);
                this.$store.dispatch('showModalConfirm', {
                    text: 'Добавить объект в маршрут?',
                    onConfirm: () => { this.$emit('add', e) }
                })
            },
            addPoint(point) {
                this.$store.dispatch('showModalAddPoint', {
                    onConfirm: (type) => {
                        this.$emit('addPoint', {
                            type,
                            point
                        })
                    }
                });
            },
            init() {
                const { from, addPoint } = this;
                this.map = new ymaps.Map("map", {
                    center: from || [55.753215, 37.622504], // по умолчанию москва
                    zoom: 13
                }, {
                    searchControlProvider: 'yandex#search',
                    yandexMapDisablePoiInteractivity: true // отключил интерактивность маркеров
                });

                var cursor = this.map.cursors.push('crosshair');

                this.map.events.add('click', function (e) {
                    var coords = e.get('coords');
                    const geocoder = ymaps.geocode(coords);
                    let pointList = [];

                    // После того, как поиск вернул результат, вызывается callback-функция
                    geocoder.then(
                        function (res) {
                            res.geoObjects.each(function(el) {
                                let point = {
                                    position: el.geometry.getCoordinates(),
                                    name: el.properties.get('name'),
                                    description: el.properties.get('description'),
                                }
                                pointList.push(point);
                            });
                            addPoint(pointList[0]);                        }
                    );

                });

                if (from) {
                    this.startPoint = new ymaps.Placemark(from, {
                    }, {
                        // Опции.
                        // Необходимо указать данный тип макета.
                        iconLayout: 'default#imageWithContent',
                        // Своё изображение иконки метки.
                        iconImageHref: '/assets/images/icons/marker_blue.svg',
                        // Размеры метки.
                        iconImageSize: [20, 20],
                        // Смещение левого верхнего угла иконки относительно
                        // её "ножки" (точки привязки).
                        iconImageOffset: [-10, -10],
                        // Смещение слоя с содержимым относительно слоя с картинкой.

                    });

                    this.map.geoObjects.add(this.startPoint)
                }

            }

        },
        computed: {

        },
        watch: {
            from(newVal, oldVal) {
                if (newVal !== oldVal) {
                    this.map.setCenter(newVal);
                    if (this.startPoint) {
                        this.map.geoObjects.remove(this.startPoint)
                    }
                    this.startPoint = new ymaps.Placemark(newVal, {
                    }, {
                        // Опции.
                        // Необходимо указать данный тип макета.
                        iconLayout: 'default#imageWithContent',
                        // Своё изображение иконки метки.
                        iconImageHref: '/assets/images/icons/marker_blue.svg',
                        // Размеры метки.
                        iconImageSize: [20, 20],
                        // Смещение левого верхнего угла иконки относительно
                        // её "ножки" (точки привязки).
                        iconImageOffset: [-10, -10],
                        // Смещение слоя с содержимым относительно слоя с картинкой.

                    });

                    this.map.geoObjects.add(this.startPoint)
                }
            },
            to(newVal, oldVal) {
                if (newVal !== oldVal) {
                    if (this.endPoint) {
                        this.map.geoObjects.remove(this.endPoint)
                    }
                    this.endPoint = new ymaps.Placemark(newVal, {
                    }, {
                        // Опции.
                        // Необходимо указать данный тип макета.
                        iconLayout: 'default#imageWithContent',
                        // Своё изображение иконки метки.
                        iconImageHref: '/assets/images/icons/flag_blue.svg',
                        // Размеры метки.
                        iconImageSize: [45, 45],
                        // Смещение левого верхнего угла иконки относительно
                        // её "ножки" (точки привязки).
                        iconImageOffset: [-7, -37],
                        // Смещение слоя с содержимым относительно слоя с картинкой.

                    });

                    this.map.geoObjects.add(this.endPoint)
                }
            },
            points() {
                console.log('изменились точки');
                console.log(this.points);
                if (this.currentPoints.length > 0) { // если точки отрисованы, их надо удалить
                    this.currentPoints.forEach(point => {
                        this.map.geoObjects.remove(point)
                    })
                    this.currentPoints = [];
                }
                const points = this.points;
                points.forEach((point, index) => {
                    this.currentPoints[index] = new ymaps.Placemark(point.position, {
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
                    });

                    this.currentPoints[index].events.add('click', function () {
                        points.splice(index, 1);
                    });

                    this.map.geoObjects.add(this.currentPoints[index])
                })

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