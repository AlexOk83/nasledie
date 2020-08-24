<template>
    <div class="time-picker">
        <div class="up-arrow" @click="up" />
        <MaskedInput type="text" class="field__control" mask="11:11" v-model="value" @input="validate" @blur="validate" />
        <div class="down-arrow" @click="down" />
    </div>
</template>

<script>
    import MaskedInput from 'vue-masked-input'
    export default {
        name: "TimePicker",
        props: ['value'],
        components: {
            MaskedInput
        },
        methods: {
            up() {
                let { hour, minutes } = this.getTime(this.value);
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
                this.value = `${hour}:${minutes}`;
            },
            down() {
                let { hour, minutes } = this.getTime(this.value);
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
                this.value = `${hour}:${minutes}`;
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
            },
            validate(event) {
                console.log(event);
                const { hour, minutes } = this.getTime(event);
                if (hour > 23 || minutes > 59) {
                    this.value = "00:00"
                }

            }
        },
    }
</script>

<style scoped lang="less">
    @import "../../styles/mixins";

    .time-picker {
        position: relative;
        max-width: 220px;
        .no_select();
        .up-arrow {
            .arrow(9px, 15px, 'up');
        }
        .down-arrow {
            .arrow(22px, 15px, 'down');
        }
    }
</style>