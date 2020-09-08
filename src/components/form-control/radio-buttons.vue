<!-- radio - кнопки - готово! -->
<template>
    <div class="radio-buttons">
        <div class="radio-item" v-for="item in variantList">
            <input type="radio"  v-model="localValue" :id="item.value" :value="item.value" :name="name" @change="changeValue">
            <label :for="item.value">{{ item.name }}</label>
        </div>
    </div>
</template>

<script>
    export default {
        name: "radio-buttons",
        props: {
            name: String,
            value: String,
            variantList: Array,
        },
        data() {
            return {
                localValue: this.value
            }
        },
        methods: {
            changeValue() {
                this.$emit('change', this.localValue)
            }
        }
    }
</script>

<style lang="less">
    @import "../../styles/mixins";
    .radio-buttons {
        display: flex;
        align-items: center;
        .radio-item {
            display: block;
            margin-right: 40px;

            input {
                display: none;
                & ~ label {
                    padding-left: 17px;
                    position: relative;
                    cursor: pointer;
                    &:before {
                        position: absolute;
                        content: '';
                        width: 10px;
                        height: 10px;
                        display: block;
                        border-radius: 50%;
                        border: 1px solid @base;
                        left: 0;
                        top: 5px;
                    }
                    &:after {
                        position: absolute;
                        content: '';
                        width: 6px;
                        height: 6px;
                        display: block;
                        border-radius: 50%;
                        background: @base;
                        left: 3px;
                        top: 8px;
                        transform: scale(0);
                        transition: all 0.3s ease-out;
                    }
                }
                &:checked {
                    & ~ label {
                        &:after {
                            transform: scale(1);
                        }
                    }
                }
            }
        }
    }
</style>