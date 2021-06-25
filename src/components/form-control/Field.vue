<!-- общий для всех полей компонент - готово! -->
<template>
    <div class="field">
        <label class="field__label" v-if="title">{{ title }}</label>
        <div class="field__cleared-btn" v-if="clearedTypes.includes(type) && !withoutClear" @click="clear"/>
        <input v-if="inputTypes.includes(type)"
               class="field__control"
               :type="type"
               :name="name"
               :maxlength="maxLength"
               :placeholder="placeholder"
               v-model="localValue"
               @input="changeLocalValue"
               autocomplete="off"
               :disabled="localDisabled"
        />
        <textarea v-if="type === 'longtext'"
                  class="field__control field__control--long-text"
                  :name="name"
                  v-model="localValue"
                  :maxlength="maxLength"
                  :rows="rows || 4"
                  :placeholder="placeholder"
                  @input="changeLocalValue"
                  :disabled="localDisabled"
        >
        </textarea>
        <DatePicker v-if="type === 'date'"
                    :name="name"
                    :value="localValue"
                    :placeholder="placeholder"
                    @change="changeValue"
                    :disabled="localDisabled"
        />
        <TimePicker v-if="type === 'time'"
                    :name="name"
                    :value="localValue"
                    :placeholder="placeholder"
                    @change="changeValue"
                    :disabled="localDisabled"
        />
        <SearchField v-if="type === 'search'"
                     :name="name"
                     :value="localValue"
                     :placeholder="placeholder"
                     @change="changeValue"
        />
        <Radio v-if="type === 'radio'"
               :name="name"
               :variant-list="listValue"
               :value="localValue"
               @change="changeValue"
        />
        <Select v-if="isSelect"
                :name="name"
                :list="listValue"
                :value="localValue"
                :placeholder="placeholder"
                :disabled="localDisabled"
                @change="changeValue"
        />
        <select-long v-if="isSelectLong"
                :name="name"
                :list="listValue"
                :value="localValue"
                :placeholder="placeholder"
                :disabled="localDisabled"
                @change="changeValue"
        />
        <div class="field__footer" v-if="save">
            <div class="btn" @click="offDisabled" v-if="showEditButton">
                <Icon icon="edit" />
                <span>{{ save.editTitle }}</span>
            </div>
            <div class="btn" @click="saveData" v-if="showSaveButton">
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
    import Select from "./select/select";
    import SelectLong from "./select/select-with-search";
    import Icon from "../icon";

    export default {
        name: "Field",
        props: {
            name: String,
            withoutClear: Boolean,
            maxLength: {
                type: Number,
                default: 50,
            },
            type: String,
            title: String,
            value: [String, Number, Object],
            placeholder: String,
            listValue: Array,
            save: {

            },
            rows: Number,
            disabled: Boolean
        },
        components: {
            DatePicker,
            TimePicker,
            SearchField,
            Radio,
            Select,
            SelectLong,
            Icon
        },
        data() {
            return {
                inputTypes: ['text', 'password'],
                clearedTypes: ['text', 'longtext'],
                localValue: this.value,
                localDisabled: this.disabled || Boolean(this.save)
            }
        },
        computed: {
            showEditButton() {
                if (!this.save) {
                    return true;
                }
                return this.save.viewSaveButton || this.localDisabled
            },
            showSaveButton() {
                if (!this.save) {
                    return true;
                }
                return this.save.viewSaveButton || !this.localDisabled
            },
            isSelect() {
                return this.type === 'select' && this.listValue.length <= 5
            },
            isSelectLong() {
                return this.type === 'select' && this.listValue.length > 5
            }
        },
        methods: {
            clear() {
                this.$emit('change', '');
            },
            changeValue(e) {
                this.localValue = e;
                this.$emit('change', e);
            },
            changeLocalValue() {
                this.$emit('change', this.localValue);
            },
            offDisabled() {
                this.localDisabled = false;
            },
            saveData() {
                this.localDisabled = true;
                this.save.method && this.save.method(this.localValue);
            }
        },
        watch: {
            value() {
                this.localValue = this.value;
            },
            disabled() {
                this.localDisabled = this.disabled || Boolean(this.save)
            },
            save() {
                this.localDisabled = this.disabled || Boolean(this.save)
            }
        }
    }
</script>

<style lang="less">
    @import "../../styles/mixins";

    .left-form .field,
    .field {
        width: 100%;
        margin-bottom: 20px;
        position: relative;
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
        &__cleared-btn {
            position: absolute;
            top: 46px;
            right: 14px;
            width: 12px;
            height: 12px;
            background-size: 12px;
            background-position: center;
            background-repeat: no-repeat;
            background-image: url(/assets/images/icons/close.svg);
            z-index: 4;
            cursor: pointer;
        }
    }

</style>