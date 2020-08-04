<template>
    <div class="select" >
        <select :name="name" :id="name" v-model="currentValue">
            <option value="" v-if="placeholder">{{ placeholder }}</option>
            <option :value="option.value" v-for="option in list" :disabled="option.disabled">{{ option.name }}</option>
        </select>
        <div class="select__field" @click="open">{{ getValue }}</div>
        <div class="options-list" :class="{'active': active }">
            <div class="option" v-for="option in list" @click="() => select(option)">{{ option.name }}</div>
        </div>
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
                currentValue: ""
            }
        },
        methods: {
            select(option) {
                console.log(option)
                this.currentValue = option.value
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