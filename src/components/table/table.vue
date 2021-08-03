<!-- вывод таблицы дней в маршруте - не совсем готово! -->
<!-- надо проверить после добавления дней в маршрут -->
<template>
    <div class="tableDays__wrapper">
        <table class="tableDays">
            <thead>
            <th v-for="item in columns" :style="{ width: item.length }">{{ item.title }}</th>
            </thead>
            <tbody>
            <template v-for="(day, index) in changedDays">
                <tr class="day" :class="getClasses(index)">
                    <td class="day__desc" :rowspan="day.objects.length - 1">
                        <div class="day__name">{{ day.title }}</div>

                        <div class="title--sub">Точка старта</div>
                        <div class="title">{{ day.pointStart.name }}</div>
                        <div class="title--sub">Дата старта</div>
                        <div class="title">{{ getDateFormat(day.pointStart.date) }}</div>
                        <div class="title--sub">Время старта</div>
                        <div class="title">{{ day.pointStart.time }}</div>

                        <div class="title--sub">Точка назначения</div>
                        <div class="title">{{ day.pointEnd.name }}</div>
                        <div class="title--sub">Дата финиша</div>
                        <div class="title">{{ getDateFormat(day.pointEnd.date) }}</div>
                        <div class="title--sub">Время финиша</div>
                        <div class="title">{{ day.pointEnd.time }}</div>
                    </td>
                    <td class="day__object">
                        <div class="title">Путь до "{{day.objects[1].name}}"</div>
                        <div class="icon__wrap">
                            <Icon icon="time"/>
                            <div class="title">{{getTime(day.objects[1].timeInWay)}}</div>
                        </div>
                        <div class="icon__wrap">
                            <Icon icon="way"/>
                            <div class="title">{{getWay(day.objects[1].way)}}</div>
                        </div>
                    </td>
                    <td class="day__object">
                        <div class="icon__wrap">
                            <Icon :icon="day.objects[1].typeMovement[0]"/>
                            <div class="title">{{getNameMovement(day.objects[1].typeMovement[0])}}</div>
                        </div>

                    </td>
                    <td class="day__object">
                        <div class="icon__wrap">
                            <Icon icon="time"/>
                            <div class="title">{{getTime(day.objects[1].stopTime)}}</div>
                        </div>
                    </td>
                    <td class="day__object">
                        <div class="title">{{day.objects[1].name}}</div>
                        <div class="icon__wrap">
                            <Icon icon="time"/>
                            <div class="title">{{getTime(day.objects[1].time)}}</div>
                        </div>
                    </td>
                    <td class="day__object">
                        <Field name="description"
                               type="longtext"
                               placeholder="Комментарий"
                               :rows="10"
                               withoutClear
                               :max-length="500"
                               :value="day.objects[1].description"
                               :save="{ editTitle: 'Редактировать', viewSaveButton: false, method: (value) => changeComment(day.objects[1], value) }"
                        />
                    </td>
                </tr>
                <tr :class="getClasses(index)" v-for="object in getNextObjects(day.objects)">
                    <td class="day__object">
                        <div class="title">Путь до "{{object.name}}"</div>
                        <div class="icon__wrap">
                            <Icon icon="time"/>
                            <div class="title">{{getTime(object.timeInWay)}}</div>
                        </div>
                        <div class="icon__wrap">
                            <Icon icon="way"/>
                            <div class="title">{{getWay(object.way)}}</div>
                        </div>
                    </td>
                    <td class="day__object">
                        <div class="icon__wrap">
                            <Icon :icon="object.typeMovement[0]"/>
                            <div class="title">{{getNameMovement(object.typeMovement[0])}}</div>
                        </div>
                    </td>
                    <td class="day__object">
                        <div class="icon__wrap">
                            <Icon icon="time"/>
                            <div class="title">{{getTime(object.stopTime)}}</div>
                        </div>
                    </td>
                    <td class="day__object">
                        <div class="title">{{object.name}}</div>
                        <div class="icon__wrap">
                            <Icon icon="time"/>
                            <div class="title">{{getTime(object.time)}}</div>
                        </div>
                    </td>
                    <td class="day__object">
                        <Field name="description"
                               type="longtext"
                               placeholder="Комментарий"
                               :rows="10"
                               :max-length="500"
                               withoutClear
                               :value="object.description"
                               :save="{ editTitle: 'Редактировать', viewSaveButton: false, method: (value) => changeComment(object, value) }"
                        />
                    </td>
                </tr>
            </template>

            </tbody>
        </table>
    </div>
</template>


<script>
    import {Presenter} from "../../presenter";
    import Icon from "../icon";
    import Field from "../form-control/Field";
    import moment from 'moment';
    import Repository from "../../repository";

    const presenter = new Presenter();
    const repository = new Repository();

    export default {
        name: "Table",
        props: {
            columns: Array,
            days: Array,
            routeForSave: Object,
        },
        components: {
            Icon,
            Field,
        },
        data() {
            return {
                userId: this.$store.getters.getUserId,
                routeId: this.routeForSave.id,
               changedDays: [ ...this.days ],
            };
        },
        methods: {
            getNextObjects(objects) {
                return objects.slice(2);
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
            },
            changeComment(changedObject, event) {
                const formData = new FormData();
                const value = {
                    ...this.routeForSave,
                    days: this.days.map((day) => {
                        return {
                            ...day,
                            dateStart: day.pointStart.date,
                            timeStart: day.pointStart.time,
                            startPoint: day.pointStart.name,
                            startPointCoordLat: String(day.pointStart.coordinates[0]),
                            startPointCoordLong: String(day.pointStart.coordinates[1]),

                            dateEnd: day.pointEnd.date,
                            timeEnd: day.pointEnd.time,
                            endPoint: day.pointEnd.name,
                            endPointCoordLat: String(day.pointEnd.coordinates[0]),
                            endPointCoordLong: String(day.pointEnd.coordinates[1]),

                            objects: day.objects.map((obj) => {
                                return {
                                    ...obj,
                                    description: changedObject.id === obj.id ? event : obj.description,
                                }
                            })
                        }
                    })
                }
                formData.append('ZRouter', JSON.stringify(value));
                formData.append('sessionId', 1);
                this.$store.dispatch('showPreloader');
                repository.editMyRoute(this.userId, this.routeId, formData)
                    .then(response => {
                        const data = JSON.parse(response.data);
                        if (data.status) {
                            this.$store.dispatch('showModalSuccess', {text: 'сохранение выполнено успешно!'});
                            setTimeout(() => {
                                this.$store.dispatch('hideModal');
                            }, 600);
                        }
                    }).finally(() => {
                    this.$store.dispatch('hidePreloader');
                });
            }
        }
    }
</script>
<style lang="less">
    @import "./styles";
</style>
