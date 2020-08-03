<template>
    <div class="select">
        <select :name="name" :id="name" @change="onChange" @blur="onBlur">
            <option :value="option.value" v-for="option in list" :disabled="option.disabled">{{ option.name }}</option>
        </select>
        <div class="select__field"></div>
        <div class="options-list" :class="{'active': active }"></div>
    </div>
</template>

<script>
    export default {
        name: "index",
        props: {
            value: String,
            list: Array,
            name: String,
            placeholder: String,
            onChange: Function,
            onBlur: Function,
        },
        data() {
            return {
                active: false,
            }
        }

    }
</script>

<style lang="less">
    @import "./styles";
</style>