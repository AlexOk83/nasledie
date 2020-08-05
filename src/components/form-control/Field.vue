<template>
    <div class="field">
        <label class="field__label">{{ title }}</label>

        <input v-if="inputTypes.includes(type)"
               class="field__control"
               :type="type"
               :name="name"
               :placeholder="placeholder"
               v-model="currentValue"
               @input="changeValue"
               autocomplete="off"
        />
        <textarea v-if="type === 'longtext'"
                  class="field__control field__control--long-text"
                  v-model="currentValue"
                  :name="name"
                  :placeholder="placeholder"
                  @input="changeValue"
        >
            {{ currentValue }}
        </textarea>
        <DatePicker v-if="type === 'date'"
                    :name="name"
                    :value="currentValue"
                    :placeholder="placeholder"
                    @change="changeValue"
        />
        <TimePicker v-if="type === 'time'" :name="name" :value="value" :placeholder="placeholder" />
        <SearchField v-if="type === 'search'" :name="name" :value="value" :placeholder="placeholder" />
        <Radio v-if="type === 'radio'" :name="name" :variant-list="listValue" :value="value" />
        <Select v-if="type === 'select'" :name="name" :list="listValue" :value="value" />
    </div>
</template>

<script>
    import DatePicker from "./DatePicker";
    import TimePicker from "./TimePicker";
    import SearchField from "./SearchField";
    import Radio from "./radio-buttons";
    import Select from "./select";
    export default {
        name: "Field",
        props: ['name', 'type', 'title', 'value', 'placeholder', 'listValue'],
        data() {
            return {
                inputTypes: ['text', 'password'],
                currentValue: null,
            }
        },
        components: {
            DatePicker,
            TimePicker,
            SearchField,
            Radio,
            Select
        },
        created() {
            this.currentValue = this.value
        },
        methods: {
            changeValue(e) {
                this.$emit('change', e || this.currentValue);
            }
        }
    }
</script>

<style lang="less">
    @import "../../styles/mixins";

    .field {
        width: 100%;
        margin-bottom: 20px;
        &__label {
            display: block;
            font-weight: 500;
            margin-bottom: 15px;


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