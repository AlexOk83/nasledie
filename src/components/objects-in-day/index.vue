<!-- вывод объектов в днях - готово! -->
<template>
    <div class="object-list-in-day">
        <Item v-for="(item, index) in localList"
              :key="index"
              :data="item"
              :dataNextItem="nextItem(index)"
              :is-first="index === 0"
              :is-last="index + 1 === localList.length"
              :click-up="() => objectUp(index)"
              :click-down="() => objectDown(index)"
              :click-remove="() => remove(index)"
              @change="data => changeItem(index, data)"
        />
    </div>
</template>

<script>
    import Item from './item';
    import {Presenter} from "../../presenter";
    const presenter = new Presenter();

    export default {
        name: "ObjectsInDay",
        components: {
            Item
        },
        props: {
            list: Array,
        },
        data() {
            return {
                localList: []
            }
        },
        watch: {
            list: function () {
                this.localList = this.list;
            }
        },
        methods: {
            nextItem(index) {
                if (index + 1 < this.localList.length) {
                    return this.localList[index + 1]
                }
                return null;
            },
            objectUp(index) {
                this.localList = presenter.moveItemUp(this.localList, index);
                this.$emit('change', this.localList);

            },
            objectDown(index) {
                this.localList = presenter.moveItemDown(this.localList, index);
                this.$emit('change', this.localList);
            },
            remove(index) {
                this.localList.splice(index, 1);
                this.$emit('change', this.localList);
            },
            changeItem(index, data) {
                console.log(index, data);
                if (data.nextItem) {
                    this.localList[index + 1][data.field] = data.value
                } else {
                    this.localList[index][data.field] = data.value
                }
                this.$emit('change', this.localList);
            }
        },
        created() {
            this.localList = this.list;
        }
    }
</script>

<style lang="less">
    @import "styles";
</style>