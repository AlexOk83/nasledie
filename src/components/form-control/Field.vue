<template>
    <div class="field">
        <label class="field__label">{{ title }}</label>
        <input class="field__control" v-if="inputTypes.includes(type)" :type="type" :name="name" :placeholder="placeholder" :value="value" autocomplete="off" />
        <textarea class="field__control field__control--long-text" v-if="type === 'longtext'" v-model="value" :name="name" :placeholder="placeholder" >{{ value }}</textarea>
        <DatePicker v-if="type === 'date'" :name="name" :value="value" :placeholder="placeholder" />
        <TimePicker v-if="type === 'time'" :name="name" :value="value" :placeholder="placeholder" />
        <SearchField v-if="type === 'search'" :name="name" :value="value" :placeholder="placeholder" />
        <Radio v-if="type === 'radio'" :name="geoRoute" :variant-list="listValue" />
    </div>
</template>

<script>
    import DatePicker from "./DatePicker";
    import TimePicker from "./TimePicker";
    import SearchField from "./SearchField";
    import Radio from "./radio-buttons";
    export default {
        name: "Field",
        props: ['name', 'type', 'title', 'value', 'placeholder', 'listValue'],
        data() {
            return {
                inputTypes: ['text', 'password'],
            }
        },
        components: {
            DatePicker,
            TimePicker,
            SearchField,
            Radio
        }
    }
</script>

<style lang="less">
    @import "../../styles/mixins";

    .field {
        width: 100%;
        padding-top: 10px;
        margin-bottom: 15px;
        &__label {
            display: block;
            margin-bottom: 12px;


        }
        &__control {
            .form-control-style();
            &--long-text {
                resize: none;
                line-height: 20px;
                padding: 10px 15px;
            }
        }
    }
</style>