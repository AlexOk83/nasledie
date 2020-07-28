<template>
    <div class="field">
        <label class="field__label">{{ title }}</label>
        <input class="field__control" v-if="inputTypes.includes(type)" :type="type" :name="name" :placeholder="placeholder" :value="value" autocomplete="off" />
        <textarea class="field__control field__control--long-text" v-if="type === 'longtext'" v-model="value" :name="name" :placeholder="placeholder" >{{ value }}</textarea>
        <DatePicker v-if="type === 'date'" :name="name" :value="value" :placeholder="placeholder" />
        <TimePicker v-if="type === 'time'" :name="name" :value="value" :placeholder="placeholder" />
        <SearchField v-if="type === 'search'" :name="name" :value="value" :placeholder="placeholder" />
    </div>
</template>

<script>
    import DatePicker from "./DatePicker";
    import TimePicker from "./TimePicker";
    import SearchField from "./SearchField";
    export default {
        name: "Field",
        props: ['name', 'type', 'title', 'value', 'placeholder'],
        data() {
            return {
                inputTypes: ['text', 'password'],
            }
        },
        components: {
            DatePicker,
            TimePicker,
            SearchField
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
            font-weight: bold;
            display: block;
            line-height: 40px;

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