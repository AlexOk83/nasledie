<template>
    <div class="tabs" v-resize="resize">
        <div class="tabs__nav" v-if="isLong">
            <div class="prev" @click="prev" />
            <div class="next" @click="next" />
        </div>
        <div class="tabs__header" ref="header" >
            <div class="tabs__list" ref="tabList" :style="styleList">
                <div class="tab" :class="getClasses(index, day)" :style="{ width: widthTab + 'px' }"  v-for="(day, index) in localData" @click="setActiveDay(day)">
                    <span class="text">{{ index + 1 }} День</span>
                </div>
            </div>

        </div>
        <div class="tabs__body">
            <Field name="date"
                   type="date"
                   title="Дата"
                   :value="activeDay && activeDay.date"
                   :save="config"
            />
            <div class="times">
                <Field name="timeStart"
                       type="time"
                       title="Время старта"
                       :value="activeDay && activeDay.timeStart"
                       :save="config"
                />
                <Field name="timeEnd"
                       type="time"
                       title="Время финиша"
                       :value="activeDay && activeDay.timeEnd"
                       :save="config"
                />
                <objects-in-day :list="activeDay && activeDay.objects" @change="changeObjects" />
            </div>
        </div>
    </div>

</template>

<script>
    import ObjectsInDay from "../objects-in-day";
    import Field from "../form-control/Field";
    import resize from 'vue-resize-directive';

    export default {
        name: "Tabs",
        directives: {
            resize,
        },
        props: {
            data: Array,
        },
        components: {
            Field,
            ObjectsInDay,
        },
        data() {
            return {
                localData: this.data,
                activeDay: this.getData,
                left: 0,
                widthHeader: null,
            }
        },
        methods: {
            sendLocalData() {
                  this.$emit('change', this.localData)
            },
            updateLocalData() {

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
            setActiveDay(day) {
                this.activeDay = day;
                this.$forceUpdate();
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
                this.activeDay = this.localData[0];
            }
        },
        computed: {
            widthTab() {
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
            isLong() {
                return this.data && this.data.length > 3;
            },
            config() {
                return {
                    editTitle: 'Изменить',
                    viewSaveButton: false,
                    method: this.changeActiveDay
                }
            }
        },
        mounted() {
            this.resize();
        },
        created() {
            this.localData = this.data || [];
            this.activeDay = this.localData[0];
        }
    }
</script>

<style lang="less">
    @import "styles";
</style>