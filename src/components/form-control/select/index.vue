<template>
    <div class="select" @blur="close">
        <select :name="name" :id="name" v-model="currentValue">
            <option value="" v-if="placeholder">{{ placeholder }}</option>
            <option :value="option.value" v-for="option in list" :disabled="option.disabled">{{ option.name }}</option>
        </select>
        <div class="select__field" @click="open">
            {{ getValue }}
        </div>
        <div class="options-list" :class="{'active': active }">
            <div class="option" :class="{'option--with-icon': option.icon, 'option--active': option.value === currentValue}" v-for="option in list" @click="() => select(option)">
                <Icon :icon="option.icon" v-if="option.icon"/>
                {{ option.name }}
            </div>
        </div>
    </div>
</template>

<script>
    import Icon from './icon';
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
        components: {
            Icon,
        },
        data() {
            return {
                active: false,
                currentValue: ""
            }
        },
        methods: {
            select(option) {
                console.log(option)
                this.currentValue = option.value
                this.active = false
            },
            open() {
                this.active = true
            },
            close() {
                this.active = false
            }
        },
        computed: {
            getValue() {
                let val = this.placeholder;
                console.log(this.value);
                console.log(this.list);

                this.list.forEach(option => {
                    if (option.value === this.currentValue) {
                        val = option.name
                    }
                });

                return val;
            }
        },
        watch: {
            currentValue() {

            }
        },
        created() {
            this.currentValue = this.value
        }

    }
</script>

<style lang="less">
    @import "./styles";
</style>