<!-- поле ввода времени - готово! -->
<template>
    <div class="time-picker">
        <div class="up-arrow" @click="up" />
        <MaskedInput type="text" class="field__control" mask="11:11" v-model="localValue" @input="validate" @blur="validate" :disabled="disabled" />
        <div class="down-arrow" @click="down" />
    </div>
</template>

<script>
    import MaskedInput from 'vue-masked-input'
    import { getHourAndMinutes } from "../../utils";


    export default {
        name: "TimePicker",
        props: {
            value: String,
            disabled:Boolean,
        },
        components: {
            MaskedInput
        },
        data() {
            return {
                localValue: this.value
            }
        },
        methods: {
            up() {
                if (this.disabled) {
                    return;
                }
                let { hour, minutes } = getHourAndMinutes(this.localValue);
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
                this.localValue = `${hour}:${minutes}`;
                this.$emit('change', this.localValue)
            },
            down() {
                if (this.disabled) {
                    return;
                }
                let { hour, minutes } = getHourAndMinutes(this.localValue);
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
                this.localValue = `${hour}:${minutes}`;
                this.$emit('change', this.localValue);
            },

            validate(event) {
                const { hour, minutes } = getHourAndMinutes(event);
                const timeIsFull = !hour.includes('_') && !minutes.includes('_')
                if (timeIsFull) {
                    if (Number(hour) > 23 || Number(minutes) > 59) {
                        this.localValue = "09:00";
                        this.$emit('change', this.localValue)
                        return;
                    }

                        this.localValue = `${hour}:${minutes}`;
                        this.$emit('change', this.localValue)

                }



            }
        },
        watch: {
            value: function() {
                this.localValue = this.value;
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