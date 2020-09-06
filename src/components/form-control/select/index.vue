<template>
    <div class="select" v-if="list.length > 0" @blur="close" tabindex="0" ref="select">
        <select :name="name" :id="name" v-model="currentValue" >
            <option value="" v-if="placeholder">{{ placeholder }}</option>
            <option :value="option.value" v-for="option in list" :disabled="option.disabled">{{ option.name }}</option>
        </select>
        <div class="select__field" @click="open" :class="{'active': active }">
            {{ getValue }}
        </div>
        <div class="options-list" :class="{'active': active }">
            <vue-custom-scrollbar class="scroll-area"  :settings="settings">
                <div class="option"
                     :class="{'option--with-icon': option.icon, 'option--active': option.value === currentValue, 'option--disabled': option.disabled}"
                     v-for="option in list"
                     @click="!option.disabled && select(option)"
                >
                    <Icon :icon="option.icon" v-if="option.icon" />
                    {{ option.name }}
                </div>
            </vue-custom-scrollbar>

        </div>
    </div>
</template>

<script>
    import vueCustomScrollbar from 'vue-custom-scrollbar'
    import Icon from '../../icon';
    import { settingsScroll } from '../../../constants';
    export default {
        name: "Select-control",
        props: {
            value: String,
            list: Array,
            name: String,
            placeholder: String,
            onChange: Function,
            onBlur: Function,
        },
        components: {
            Icon,
            vueCustomScrollbar
        },
        data() {
            return {
                active: false,
                currentValue: ""
            }
        },
        methods: {
            select(option) {
                this.currentValue = option.value;
                this.active = false;
                this.$emit('change', this.currentValue);
            },
            open() {
                this.active = true;
                this.$refs.select.focus();
            },
            close() {
                this.active = false
            }
        },
        computed: {
            getValue() {
                let val = this.placeholder;

                this.list.forEach(option => {
                    if (option.value === this.currentValue) {
                        val = option.name
                    }
                });

                return val;
            },
            settings() {
                return settingsScroll;
            }
        },
        created() {
            this.currentValue = this.value
        },
        watch: {
            value: function () {
                if (this.value !== this.currentValue) {
                    this.currentValue = this.value;
                }
            }
        }

    }
</script>

<style lang="less">
    @import "./styles";
</style>
