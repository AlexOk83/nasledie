<template>
  <div id="map-create"/>
</template>

<script>
import {Presenter} from '../../presenter';
import { isNil } from 'lodash';
import {getDistanceFromLatLonInMeters, getPosition, getTimeInWay, getTypeMovement, isEqual} from "../../utils";

const presenter = new Presenter();

export default {
  name: "Map-for-create",
  props: {
    from: Object,
    points: Array,
    timeStart: String,
    dateStart: String,
    isUpdate: Boolean, // использование карты, чтобы обновить уже созданный маршрут
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
      return this.points.map((end, i) => {
        if (i !== 0) {
          const start = this.points[i - 1];
          return {
            referencePoints: [getPosition(start), getPosition(end)],
            routingMode: end.typeMovement[0],
            point: end,
            start,
          }
        }
      }).filter(item => item);
    },
  },
  methods: {
    setCurrentPoints(point, start) {
      if (point.timeInWay >= 24 * 60) {
        let result = {
          start: start.name,
          end: point.name,
          time: point.timeInWay

        }
        if (this.isUpdate) {
          this.$emit('update', result);
        } else {
          this.$emit('calc', result);
        }
        return;
      }
      this.setCounts++;

      this.currentPoints = this.currentPoints.map(p => {
        if (isEqual(point, p)) {
          return point
        } else {
          return p
        }
      })
      if (this.needCount) {
        // когда получили назад заполненные точки
        let days = [];
        if (this.isUpdate) {
          days = this.days;
        }
        const result = presenter.createDataDays(this.currentPoints, this.dateStart, this.timeStart, days);
        if (this.isUpdate) {
          this.$emit('update', result);
        } else {
          this.$emit('calc', result);
        }


      }
    },
    init() {
      const {from, routes, multiRoutes, setCurrentPoints} = this;
      this.map = new ymaps.Map('map-create', {
        center: from.position,
        zoom: 15,
        controls: []
      });
      this.setCounts++;

      if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)){
        //... отключаем перетаскивание карты
        this.map.behaviors.disable('scrollZoom');
        this.map.behaviors.disable('drag');
      }
      // у нас есть маршруты от каждой точки до следующей
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
        multiRoutes[index].model.events.add('requestsuccess', function () {
          // Получение информации об активном маршруте.
          var activeRoute = multiRoutes[index].getActiveRoute();
          // Получение коллекции путей маршрута.
          var activeRoutePaths = activeRoute && activeRoute.getPaths();
          // Проход по коллекции путей.

          if (!activeRoutePaths) {  // если не смогли проложить путь
            let point = item.point;
            let distance = getDistanceFromLatLonInMeters(item.referencePoints[0], item.referencePoints[1])
            point.timeInWay = getTimeInWay(distance);
            point.typeMovement = getTypeMovement(distance);
            point.way = distance;
            point.way_false = 1;
            setCurrentPoints(point, item.start)
          } else {
            activeRoutePaths && activeRoutePaths.each(function (path) {
              let point = item.point;
              let duration = 0;
              if (isNil(path.properties.get("durationInTraffic"))) {
                duration = path.properties.get("duration").value;
              } else {
                duration = path.properties.get("durationInTraffic").value;
              }

              let distance = path.properties.get("distance").value;
              point.timeInWay = Math.round(duration / 60);
              point.way = Math.round(distance);
              point.way_false = 0;
              setCurrentPoints(point, item.start)
            });
          }
        });
        // Добавление маршрута на карту.
        this.map.geoObjects.add(multiRoutes[index]);
      })
      if (this.needCount) {
        this.map.setBounds(this.map.geoObjects.getBounds(), {checkZoomRange: true, zoomMargin: 10});
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