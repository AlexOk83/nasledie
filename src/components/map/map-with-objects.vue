<template>
  <div id="map"/>
</template>

<script>
import { Presenter } from '../../presenter';
import { getAdress } from "../../utils";
import { MOSKOW } from "../../constants";

const presenter = new Presenter();

export default {
  name: "Map-with-objects",
  props: {
    from: Object,
    to: Object,
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
    setBounds() {
      const bounds = this.map.geoObjects.getBounds();
      if (!bounds) {
        this.map.setCenter(MOSKOW);
      } else if (bounds[0][0] === bounds[1][0] && bounds[0][1] === bounds[1][1]) {
        this.map.setCenter(bounds[0]);
      } else {
        this.map.setBounds(bounds, {checkZoomRange: true, zoomMargin: 35});
        const zoom = this.map.getZoom();
        this.map.setZoom(zoom ? zoom - 5 : 13)
      }
    },
    addPoint(point) {
      this.$store.dispatch('showModalAddPoint', {
        text: `Адрес: ${point.description} ${point.name}`,
        onConfirm: (type) => {
          this.$emit('addPoint', {
            type,
            point
          })
        }
      });
    },
    removePoint(point) {
      this.$store.dispatch('showModalConfirm', {
        text: `Удалить выбранную точку: ${getAdress(point)}?`,
        onConfirm: () => {
          this.$emit('removePoint', point);
        }
      })
    },
    init() {
      const {from, to, points, addPoint} = this;
      this.map = new ymaps.Map("map", {
        center: from.position || MOSKOW, // по умолчанию москва
        zoom: 13,
        maxZoom: 15,
        controls: ['fullscreenControl'],
      }, {
        // searchControlProvider: 'yandex#search',
        yandexMapDisablePoiInteractivity: true // отключил интерактивность маркеров
      });

      if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)){
        //... отключаем перетаскивание карты
        this.map.behaviors.disable('scrollZoom');
        this.map.behaviors.disable('drag');
      }
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
                  position: coords,
                  name: el.properties.get('name'),
                  description: el.properties.get('description'),
                }
                pointList.push(point);
              });
              addPoint(pointList[0]);
            }
        );

      });

      if (from && from.position) {
        this.startPoint = new ymaps.Placemark(from.position, {
          hintContent: getAdress(from)
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
          boundsAutoApply: true
        });

        this.map.geoObjects.add(this.startPoint)
        this.setBounds();

      }

      if (to && to.position) {
        if (this.endPoint) {
          this.map.geoObjects.remove(this.endPoint)
        }
        this.endPoint = new ymaps.Placemark(to.position, {
          hintContent: getAdress(to)
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
          boundsAutoApply: true
        });

        this.map.geoObjects.add(this.endPoint);
        this.setBounds();
      }

      points.forEach((point, index) => {
        this.currentPoints[index] = new ymaps.Placemark(point.position, {
          hintContent: getAdress(point)
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
          boundsAutoApply: true
        });

        this.currentPoints[index].events.add('click', function () {
          points.splice(index, 1);
        });

        this.map.geoObjects.add(this.currentPoints[index])
      })

      this.setBounds();
    }

  },
  watch: {
    from(newVal, oldVal) {
      if (!newVal.position) {
        this.map.geoObjects.remove(this.startPoint)
        this.startPoint = null;
        this.map.setCenter(MOSKOW);
        this.map.setZoom(13)
      } else if (newVal.position !== oldVal.position) {
        if (this.startPoint) {
          this.map.geoObjects.remove(this.startPoint)
        }
        this.startPoint = new ymaps.Placemark(newVal.position, {
          hintContent: getAdress(newVal)
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
          boundsAutoApply: true
        });

        this.map.geoObjects.add(this.startPoint);
        this.setBounds();
      }

    },
    to(newVal, oldVal) {
      if (!newVal.position) {
        this.map.geoObjects.remove(this.endPoint)
        this.endPoint = null;
      } else if (newVal.position !== oldVal.position) {
        if (this.endPoint) {
          this.map.geoObjects.remove(this.endPoint)
        }
        this.endPoint = new ymaps.Placemark(newVal.position, {
          hintContent: getAdress(newVal)
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
          boundsAutoApply: true
        });

        this.map.geoObjects.add(this.endPoint);
        this.setBounds();
      }
    },
    points() {
      const { removePoint } = this;
      if (this.currentPoints.length > 0) { // если точки отрисованы, их надо удалить
        this.currentPoints.forEach(point => {
          this.map.geoObjects.remove(point)
        })
        this.currentPoints = [];
      }
      const points = this.points;
      points.forEach((point, index) => {
        this.currentPoints[index] = new ymaps.Placemark(point.position, {
          hintContent: getAdress(point)
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
          boundsAutoApply: true
        });

        this.currentPoints[index].events.add('click', function () {
            removePoint(point);
        });

        this.map.geoObjects.add(this.currentPoints[index])
      })
      this.setBounds();

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