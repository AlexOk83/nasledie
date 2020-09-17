<!-- элемент фильтра - не готово! -->
<template>
    <div class="filter__item">
        <Field type="select"
               :title="title"
               :placeholder="placeholder"
               :value="value"
               :list-value="listValue"
               @change="selectValue"
        />
        <div class="filter__item--subtitle" v-if="selectedValues.length > 0">
            {{ listTitle }}
        </div>
        <div class="filter__select">
            <div class="filter__selectItem" v-for="(item, index) in selectedValues" :key="index">
                <div class="filter__selectItem--title">
                    <Icon :icon="item.icon || icon" />
                    {{ item.name }}
                    <span class="icon  icon-delete" @click="deleteItem(index)" />
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import Field from '../form-control/Field';
    import Icon from '../icon';
    export default {
        name: "filter-item",
        components: {
            Field,
            Icon
        },
        props: {
            title: String,
            listTitle: String,
            listValue: Array,
            placeholder: String,
            icon: String,
        },
        data() {
            return {
                value: '',
                selectedValues: [],
            }
        },
        computed: {},
        methods: {
            deleteItem(index) {
                console.log(index);
            },
            selectValue(e) {
                console.log(e);
                this.value = null;
                let selectValue = this.listValue
                    .map(item => ({
                        name: item.name,
                        value: item.value,
                        icon: item.icon
                    }))
                    .find(item => item.value === e);
                this.selectedValues.push(selectValue);
                this.$emit('change', this.selectedValues);
            }
        }
    }
</script>

<style scoped>

</style>