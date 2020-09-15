<!-- вывод таблицы дней в маршруте - не совсем готово! -->
<!-- надо проверить после добавления дней в маршрут -->
<template>

    <table class="tableDays">
        <thead>
            <th v-for="item in columns">{{item}}</th>
        </thead>
        <tbody>
        <template  v-for="(day, index) in days" >
            <tr class="day" :class="getClasses(index)">
                <td class="day__desc" :rowspan="day.objects.length">
                    <div class="day__name">{{ day.title }}</div>

                    <div class="title--sub">Точка старта</div>
                    <div class="title">{{ day.pointStart.name }}</div>
                    <div class="title--sub">Дата старта</div>
                    <div class="title">{{ getDateFormat(day.pointStart.date) }}</div>
                    <div class="title--sub">Время старта</div>
                    <div class="title">{{ day.pointStart.time }}</div>

                    <div class="title--sub">Точка назначения</div>
                    <div class="title">{{ day.pointEnd.name }}</div>
                    <div class="title--sub">Дата старта</div>
                    <div class="title">{{ getDateFormat(day.pointEnd.date) }}</div>
                    <div class="title--sub">Время старта</div>
                    <div class="title">{{ day.pointEnd.time }}</div>
                </td>
                <td  class="day__object">
                    <div class="title">Путь до "{{day.objects[0].name}}"</div>
                    <div class="icon__wrap">
                        <Icon icon="time" />
                        <div class="title">{{getTime(day.objects[0].timeInWay)}}</div>
                    </div>
                    <div class="icon__wrap">
                        <Icon icon="way" />
                        <div class="title">{{getWay(day.objects[0].way)}}</div>
                    </div>
                </td>
                <td  class="day__object">
                    <div class="icon__wrap">
                        <Icon :icon="day.objects[0].typeMovement[0]" />
                        <div class="title">{{getNameMovement(day.objects[0].typeMovement[0])}}</div>
                    </div>

                </td>
                <td  class="day__object">
                    <div class="icon__wrap">
                        <Icon icon="time" />
                        <div class="title">{{getTime(day.objects[0].stopTime)}}</div>
                    </div>
                </td>
                <td  class="day__object">
                    <div class="title">{{day.objects[0].name}}</div>
                    <div class="icon__wrap">
                        <Icon icon="time" />
                        <div class="title">{{getTime(day.objects[0].time)}}</div>
                    </div>
                </td>
            </tr>
            <tr :class="getClasses(index)" v-for="object in getNextObjects(day.objects)">
                <td  class="day__object">
                    <div class="title">Путь до "{{object.name}}"</div>
                    <div class="icon__wrap">
                        <Icon icon="time" />
                        <div class="title">{{getTime(object.timeInWay)}}</div>
                    </div>
                    <div class="icon__wrap">
                        <Icon icon="way" />
                        <div class="title">{{getWay(object.way)}}</div>
                    </div>
                </td>
                <td  class="day__object">
                    <div class="icon__wrap">
                        <Icon :icon="object.typeMovement[0]" />
                        <div class="title">{{getNameMovement(object.typeMovement[0])}}</div>
                    </div>
                </td>
                <td  class="day__object">
                    <div class="icon__wrap">
                        <Icon icon="time" />
                        <div class="title">{{getTime(object.stopTime)}}</div>
                    </div>
                </td>
                <td  class="day__object">
                    <div class="title">{{object.name}}</div>
                    <div class="icon__wrap">
                        <Icon icon="time" />
                        <div class="title">{{getTime(object.time)}}</div>
                    </div>
                </td>
            </tr>
        </template>

        </tbody>
    </table>
</template>


<script>
    import {Presenter} from "../../presenter";
    import Icon from "../icon";
    import moment from 'moment';

    const presenter = new Presenter();

    export default {
        name: "Table",
        props: {
            columns: Array,
            days : Array,
        },
        components: {
            Icon,
        },
        methods: {
            getNextObjects(objects) {
                return objects.slice(1);
            },
            getDateFormat(date) {
                return moment(date).format('DD.MM.YYYY')
            },
            getClasses(index) {
                const base = index === 0 || index % 3 === 0;
                const two = index === 1 || (index - 1) % 3 === 0;
                const three = index === 2 || (index - 2) % 3 === 0;
                const classes = [];
                if (base) {
                    classes.push('day--base');
                }
                if (two) {
                    classes.push('day--two');
                }
                if (three) {
                    classes.push('day--three');
                }
                if (this.days.length === index + 1) {
                    classes.push('last');
                }
                return classes;
            },
            getNameMovement(type) {
                return presenter.getNameMovement(type)
            },
            getTime(time) {
                return presenter.getTime(time);
            },
            getWay(way) {
                return presenter.getWay(way);
            }
        }
    }
</script>
<style lang="less">
    @import "./styles";
</style>
