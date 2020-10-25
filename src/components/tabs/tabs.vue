<!-- табы - готово! -->
<template>
    <div class="tabs" v-resize="resize">
        <div class="tabs__nav" v-if="isLong">
            <div class="prev" @click="prev" />
            <div class="next" @click="next" />
        </div>
        <div class="tabs__header" :style="stylesHeader" ref="header" >
            <div class="tabs__list" ref="tabList" :style="styleList">
                <div class="tab" :class="getClasses(index, day)" :style="{ width: widthTab + 'px' }" v-for="(day, index) in localData" @click="setActiveDay(index)">
                    <span class="text">{{ index + 1 }} День</span>
                </div>
            </div>

        </div>
        <div class="tabs__body">
            <Field name="date"
                   type="date"
                   title="Дата"
                   :value="activeDay.pointStart && activeDay.pointStart.date"
                   @change="changeDate"
                   :save="config"
            />
            <div class="times">
                <Field name="timeStart"
                       type="time"
                       title="Время старта"
                       :value="activeDay.pointStart && activeDay.pointStart.time"
                       @change="changeTimeStart"
                       :save="config"
                />
                <Field name="timeEnd"
                       type="time"
                       title="Время финиша"
                       @change="changeTimeEnd"
                       :value="activeDay.pointEnd && activeDay.pointEnd.time"
                       :save="config"
                />
            </div>
                <objects-in-day
                        :list="activeDay && activeDay.objects"
                        :start="start"
                        :end="end"
                        :data-is-change="dataIsChange"
                        @change="changeObjectsFromActiveDay"
                />
                <Form-add
                        :objects="activeDay.objects"
                        @add="add"
                />
        </div>
    </div>

</template>

<script>
    import ObjectsInDay from "../objects-in-day/objectInDayView";
    import Field from "../form-control/Field";
    import FormAdd from "../added-objects/form-add"
    import resize from 'vue-resize-directive';

    export default {
        name: "Tabs",
        directives: {
            resize,
        },
        props: {
            data: Array,
            start: Object,
            end: Object,
            indexActiveDay: Number,
            dataIsChange: Boolean,
        },
        components: {
            Field,
            ObjectsInDay,
            FormAdd,
        },
        data() {
            return {
                localData: this.data,
                activeDay: {},
                left: 0,
                widthHeader: null,
            }
        },
        methods: {
            add(object) {
                const penultIndex = this.activeDay.objects.length - 2;
                this.activeDay.objects.splice(penultIndex, 0, object);
                this.saveActiveDay();
                this.$emit('add', object);
            },
            changeObjectsFromActiveDay(objects) {
                this.activeDay.objects = objects;
                this.saveActiveDay();
            },
            changeDate(e) {
                this.activeDay.date = e;
            },
            changeTimeStart(e) {
                this.activeDay.timeStart = e;
            },
            changeTimeEnd(e) {
                this.activeDay.timeEnd = e;
            },
            saveActiveDay() {
                this.localData[this.indexActiveDay] = this.activeDay;
                this.$emit('change', this.localData);
            },
            getClasses(index, day) {
                const base = index === 0 || index % 3 === 0;
                const two = index === 1 || (index - 1) % 3 === 0;
                const three = index === 2 || (index - 2) % 3 === 0;
                const classes = [];
                const activeDay = this.activeDay || this.getData;
                if (base) {
                    classes.push('tab--base');
                }
                if (two) {
                    classes.push('tab--two');
                }
                if (three) {
                    classes.push('tab--three');
                }
                if (day.id === activeDay.id) {
                    classes.push('active');
                }
                return classes;
            },
            resize() {
                this.widthHeader = this.$refs.header.clientWidth;
            },
            setActiveDay(index) {
                this.activeDay = this.localData[index];
                this.$emit('setActiveDay', index);
            },
            prev() {
                if (this.left > 0)
                    this.left--;
            },
            next() {
                if (this.left < this.data.length - 3)
                    this.left++;
            },
        },
        watch: {
            data: function () {
                this.localData = this.data;
                this.activeDay = this.localData[this.indexActiveDay];
            },
            indexActiveDay() {

            }
        },
        computed: {
            widthTab() {
                if (this.data.length < 3) {
                    return Math.round(this.widthHeader / this.data.length) + 1;
                }
                return Math.round(this.widthHeader / 3) + 1;
            },
            styleList() {
                if (!this.data) {
                    return {
                        width: '300px',
                        left: 0,
                    }
                }

                return {
                    width: this.data.length*this.widthTab + 'px',
                    left: (-this.widthTab * this.left) + 'px',
                };
            },
            stylesHeader() {
                if (this.data.length < 3) {
                    return {
                        width: this.data.length*120 + 'px',
                    }
                }
                return null;
            },
            isLong() {
                return this.data && this.data.length > 3;
            },
            config() {
                return {
                    editTitle: 'Изменить',
                    viewSaveButton: false,
                    method: this.saveActiveDay
                }
            }
        },
        mounted() {
            this.resize();
        },
        created() {
            this.localData = this.data || [];
            this.activeDay = this.localData[0];
            this.indexActiveDay = 0;
        }
    }
</script>

<style lang="less">
    @import "styles";
</style>