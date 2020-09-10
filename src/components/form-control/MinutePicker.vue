<!-- поле ввода времени - готово! -->
<template>
    <div class="time-picker">
        <div class="up-arrow" @click="up" />
        <input class="field__control" type="text" v-model="getTime" readonly >
        <div class="down-arrow" @click="down" />
    </div>
</template>

<script>
    import { Presenter} from "../../presenter";
    const presenter = new Presenter();

    export default {
        name: "MinutePicker",
        props: {
            value: {
                type: Number,
                default: 0
            },
        },
        data() {
            return {
                localValue: this.value || 0
            }
        },
        computed: {
            getTime() {
                return presenter.getTime(this.localValue)
            },
        },
        methods: {
            up() {
                this.localValue = this.localValue + 15;
                this.$emit('change', this.localValue)
            },
            down() {
                this.localValue = this.localValue = this.localValue - 15;
                if (this.localValue < 0) {
                    this.localValue = 0;
                }
                this.$emit('change', this.localValue);
            },
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