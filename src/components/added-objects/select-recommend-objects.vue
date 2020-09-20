<template>
    <div class="select-object" @blur="close" tabindex="0" ref="select">
        <div class="select-object__field"
             :class="{'active': active, 'disabled': disabled }"
             @click="open"
        >
            <Icon icon="star" />
            Рекомендуемые объекты
        </div>
        <div class="options-list" :class="{'active': active }">
            <vue-custom-scrollbar class="scroll-area"  :settings="settings">
                <div class="option"
                     :class="{'last': index === listObjects.length - 1}"
                     v-for="(option, index) in listObjects"
                     @click="select(option)"
                >
                    {{ option.name }}
                </div>
            </vue-custom-scrollbar>

        </div>
    </div>
</template>

<script>
    import vueCustomScrollbar from 'vue-custom-scrollbar'
    import Icon from '../icon';
    import { isEmpty } from 'lodash';
    import { settingsScroll } from '../../constants';

    export default {
        name: "select-recommend-objects",
        components: {
            Icon,
            vueCustomScrollbar
        },
        data() {
            return {
                active: false,
            }
        },
        methods: {
            select(option) {
                this.active = false;
                this.$emit('change', option);
            },
            open() {
                if (this.disabled) {
                    return;
                }
                this.active = true;
                this.$refs.select.focus();
            },
            close() {
                this.active = false
            }
        },
        computed: {
            listObjects() {
                return this.$store.getters.getRecObjects;
            },
            disabled() {
                return isEmpty(this.listObjects)
            },
            settings() {
                return settingsScroll;
            },
        },
    }
</script>

<style lang="less">
    @import "./styles";
</style>
