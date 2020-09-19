<template>
    <div class="select" v-if="list.length > 0" tabindex="0" ref="select">
        <select :name="name" :id="name" v-model="currentValue" >
            <option value="" v-if="placeholder">{{ placeholder }}</option>
            <option :value="option.value" v-for="option in list" :disabled="option.disabled">{{ option.name }}</option>
        </select>
        <div class="select__field"
             :class="{'active': active, 'with-icon': iconValue, 'disabled': disabled }"
             @click="open"
        >
            <Icon :icon="iconValue" v-if="iconValue" />
            {{ getValue }}
        </div>
        <div class="options-list" :class="{'active': active }">
            <input type="text" class="search" v-model="searchText" ref="search" @blur="close"  tabindex="0" @input="filterList">
            <vue-custom-scrollbar class="scroll-area"  :settings="settings">
                <div class="option"
                     :class="{'option--with-icon': option.icon, 'option--active': option.value === currentValue, 'option--disabled': option.disabled}"
                     v-for="option in filteredList"
                     @click="!option.disabled && select(option, $event)"
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
            list: {
                type: Array,
                default: []
            },
            name: String,
            placeholder: String,
            onChange: Function,
            onBlur: Function,
            disabled: Boolean,
        },
        components: {
            Icon,
            vueCustomScrollbar
        },
        data() {
            return {
                active: false,
                filteredList: this.list,
                currentValue: "",
                searchText: ""
            }
        },
        methods: {
            select(option, event) {
                event.preventDefault();
                this.currentValue = option.value;
                this.active = false;
                this.searchText = "";
                this.filteredList = this.list;
                this.$emit('change', this.currentValue);
            },
            filterList(event) {
                console.log(event.target.value);
                if (event.target.value.length > 2) {
                    this.filteredList = this.list.filter(item => item.name.toLowerCase().match(event.target.value.toLowerCase()))
                }
                else {
                    this.filteredList = this.list
                }

            },
            open() {
                if (this.disabled) {
                    return;
                }
                this.active = true;
                this.$refs.search.focus();
            },
            close() {
                setTimeout(() => {
                    this.active = false
                }, 200)

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
            },
            iconValue() {
                let val = null;

                this.list.forEach(option => {
                    if (option.value === this.currentValue) {
                        val = option.icon
                    }
                });

                return val;
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
            },
            list() {
                this.filteredList = this.list;
            }
        }

    }
</script>

<style lang="less">
    @import "./styles";
</style>