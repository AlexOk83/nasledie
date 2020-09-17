<!-- элемент фильтра - готово! -->
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
        <div class="filter__list-selected">
            <div class="filter__list-selected__item" v-for="(item, index) in selectedValues" :key="index">
                <Icon :icon="item.icon || icon" />
                {{ item.name }}
                <span class="icon  icon-delete" @click="deleteItem(index)" />
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
                this.selectedValues.splice(index, 1);
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

<style lang="less">
    @import "../../styles/mixins";
    .filter {
        &__item {
            width: 100%;

            &--subtitle {
                font-size: 10px;
                line-height: 12px;
                color: @greySubtitle;
            }
        }
        &__list-selected {
            .media_desktop({
                margin-top: 30px;
            });
            .media_mobile({
                margin-top: 20px;
            });
            &__item {
                margin-top: 20px;
                padding-left: 30px;
                position: relative;
                .icon {
                    top: 0;
                }
                .icon--tag {
                    top: 4px;
                    &:before {
                        content: '#';
                    }
                }
                .icon-delete {
                    position: absolute;
                    top: 0;
                    right: 0;
                    width: 25px;
                    height: 25px;
                    background-size: contain;
                    background-position: center;
                    background-repeat: no-repeat;
                    background-image: url("/src/assets/images/icons/delete-white.svg");
                    cursor: pointer;
                }
                .icon--tag {
                    position: absolute;
                    left: 0;
                    top: 0;
                    width: 7px;
                    height: 7px;
                    &:before {
                        content: "#";
                        width: 100%;
                        height: 100%;
                        color: @colorLink;
                    }
                }
            }
        }
    }

</style>