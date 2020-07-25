<template>
    <div class="time-picker">
        <div class="up-arrow" @click="up" />
        <input type="time" class="field__control" step="1800" v-model="timeValue">
        <div class="down-arrow" @click="down" />
    </div>
</template>

<script>
    export default {
        name: "TimePicker",
        props: ['value'],
        data() {
            return {
                timeValue: 0
            }
        },
        methods: {
            up() {
                let { hour, minutes } = this.getTime(this.timeValue);
                const currentHour = Number(hour);
                if (minutes === '00') {
                    minutes = '30';
                } else {
                    minutes = '00';
                    if (currentHour < 9){
                        hour = `0${currentHour + 1}`
                    }
                    else if (currentHour <= 22) {
                        hour = currentHour + 1
                    }
                    else if (currentHour === 23) {
                        hour = '00'
                    }
                }
                this.timeValue = `${hour}:${minutes}`;
            },
            down() {
                let { hour, minutes } = this.getTime(this.timeValue);
                const currentHour = Number(hour);
                if (minutes === '00') {
                    minutes = '30';
                    if (currentHour === 0){
                        hour = `23`
                    }
                    else if (currentHour <= 10) {
                        hour = `0${currentHour - 1}`
                    }
                    else if (currentHour <= 23) {
                        hour = currentHour - 1;
                    }
                } else {
                    minutes = '00';
                }
                this.timeValue = `${hour}:${minutes}`;
            },
            getTime(time) {
                if (!time) {
                    return {
                        hour: '00',
                        minutes: '00'
                    };
                }
                const hour = time[0] + time[1];
                const minutes = time[3] + time[4];
                return {
                    hour,
                    minutes
                }
            }
        },
        created() {
            this.timeValue = this.value;
        }
    }
</script>

<style scoped lang="less">
    @import "../../styles/mixins";

    .time-picker {
        position: relative;
        .no_select();
        .up-arrow {
            position: absolute;
            top: 10px;
            right: 15px;
            width: 0;
            height: 0;
            z-index: 2;
            border-bottom: 10px solid blue;
            border-left: 7px solid transparent;
            border-right:  7px solid transparent;
            cursor: pointer;
        }
        .down-arrow {
            position: absolute;
            bottom: 10px;
            right: 15px;
            width: 0;
            height: 0;
            z-index: 2;
            border-top: 10px solid blue;
            border-left: 7px solid transparent;
            border-right:  7px solid transparent;
            cursor: pointer;
        }
    }
</style>