<template>
    <div class="tabs">
        <div class="tabs__header" :class="{'long': data && data.length > 3}">
            <div class="tab" :class="getClasses(index, day)"  v-for="(day, index) in data" @click="setActiveDay(day)">
                <span class="text">{{ day.title }}</span>
            </div>
        </div>
        <div class="tabs__body">

        </div>
    </div>

</template>

<script>
    import ObjectsInDay from "../objects-in-day";
    import Field from "../form-control/Field";

    export default {
        name: "Tabs",
        props: {
            data: Array,
        },
        components: {
            Field,
            ObjectsInDay,
        },

        data() {
            return {
                activeDay: this.data && this.data[0],
            }
        },
        watch: {
            data: function () {
                this.activeDay = this.data && this.data[0];
            }
        },
        methods: {
            getClasses(index, day) {
                const base = index === 0 || index % 3 === 0;
                const two = index === 1 || (index - 1) % 3 === 0;
                const three = index === 2 || (index - 2) % 3 === 0;
                const classes = [];
                const activeDay = this.activeDay || (this.data && this.data[0]);
                if (base) {
                    classes.push('tab--base');
                }
                if (two) {
                    classes.push('tab--two');
                }
                if (three) {
                    classes.push('tab--three');
                }
                if (day.title === activeDay.title) {
                    classes.push('active');
                }
                return classes;
            },
            setActiveDay(day) {
                this.activeDay = day;
            }
        }
    }
</script>

<style lang="less">
    @import "styles";
</style>