<!-- вывод объектов в днях - готово! -->
<template>
    <div class="object-list-in-day">
        <Item v-for="(item, index) in localList"
              :key="objectInDayView"
              :data="item"
              :dataNextItem="nextItem(objectInDayView)"
              :is-first="objectInDayView === 0"
              :is-last="objectInDayView + 1 === localList.length"
              :click-up="() => objectUp(objectInDayView)"
              :click-down="() => objectDown(objectInDayView)"
              :click-remove="() => remove(objectInDayView)"
              @change="data => changeItem(objectInDayView, data)"
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
                if (objectInDayView + 1 < this.localList.length) {
                    return this.localList[objectInDayView + 1]
                }
                return null;
            },
            objectUp(index) {
                this.localList = presenter.moveItemUp(this.localList, objectInDayView);
                this.$emit('change', this.localList);

            },
            objectDown(index) {
                this.localList = presenter.moveItemDown(this.localList, objectInDayView);
                this.$emit('change', this.localList);
            },
            remove(index) {
                this.localList.splice(objectInDayView, 1);
                this.$emit('change', this.localList);
            },
            changeItem(index, data) {
                console.log(objectInDayView, data);
                if (data.nextItem) {
                    this.localList[objectInDayView + 1][data.field] = data.value
                } else {
                    this.localList[objectInDayView][data.field] = data.value
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