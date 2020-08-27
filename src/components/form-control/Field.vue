<template>
    <div class="field">
        <label class="field__label">{{ title }}</label>

        <input v-if="inputTypes.includes(type)"
               class="field__control"
               :class="{'disabled': localDisabled}"
               :type="type"
               :name="name"
               :placeholder="placeholder"
               v-model="localValue"
               @input="changeValue"
               autocomplete="off"
               :readonly="localDisabled"
        />
        <textarea v-if="type === 'longtext'"
                  class="field__control field__control--long-text"
                  :class="{'disabled': localDisabled}"
                  v-model="localValue"
                  :name="name"
                  :rows="rows || 4"
                  :placeholder="placeholder"
                  @input="changeValue"
                  :readonly="localDisabled"
        >
        </textarea>
        <DatePicker v-if="type === 'date'"
                    :name="name"
                    :value="localValue"
                    :placeholder="placeholder"
                    @change="changeValue"
        />
        <TimePicker v-if="type === 'time'" :name="name" :value="localValue" :placeholder="placeholder" />
        <SearchField v-if="type === 'search'" :name="name" :value="localValue" :placeholder="placeholder" />
        <Radio v-if="type === 'radio'" :name="name" :variant-list="listValue" :value="localValue" />
        <Select v-if="type === 'select'" :name="name" :list="listValue" :value="localValue" :placeholder="placeholder" />
        <div class="field__footer" v-if="save">
            <div class="btn" @click="offDisabled"><Icon icon="edit" />
                <span>Редактировать описание</span>
            </div>
            <div class="btn" @click="saveData">
                <Icon icon="check" />
                <span>
                    Сохранить
                </span>
            </div>
        </div>
    </div>
</template>

<script>
    import DatePicker from "./DatePicker";
    import TimePicker from "./TimePicker";
    import SearchField from "./search/SearchField";
    import Radio from "./radio-buttons";
    import Select from "./select";
    import Icon from "../icon";

    export default {
        name: "Field",
        props: ['name', 'type', 'title', 'value', 'placeholder', 'listValue', 'save', 'rows'],
        data() {
            return {
                inputTypes: ['text', 'password'],
                localValue: this.value,
                localDisabled: this.disabled || Boolean(this.save)
            }
        },
        components: {
            DatePicker,
            TimePicker,
            SearchField,
            Radio,
            Select,
            Icon
        },
        watch: {
            value: function () {
                this.localValue = this.value;
            }
        },
        methods: {
            changeValue(e) {
                this.$emit('change', this.localValue);
            },
            offDisabled() {
                this.localDisabled = false;
            },
            saveData() {
                this.localDisabled = true;
                this.save();
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
        &__footer {
            display: flex;
            justify-content: flex-start;
            flex-wrap: wrap;
            padding-top: 10px;
            .btn {
                position: relative;
                margin-right: 20px;
                line-height: 20px;
                padding-left: 30px;
                color: @base;
                margin-bottom: 10px;
                .no_select();
                cursor: pointer;
                font-size: 12px;
                .icon {
                    top: 0;
                    background-color: @base;
                }
                span {
                    display: inline-block;
                    border-bottom: 1px dashed @base;
                }
            }
        }
    }

</style>