<!-- вывод объектов в днях - готово! -->
<template>
    <div class="object-list-in-day">
        <Item v-for="(item, index) in localList"
              :key="index"
              :data="item"
              :dataNextItem="nextItem(index)"
              :is-first="isFirst(index)"
              :is-not-point="isStart(item) || isEnd(item)"
              :is-last="index + 1 === localList.length || isLast(index)"
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
            start: Object,
            end: Object,
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
        computed: {
        },
        methods: {
            isEqual(p1, p2) {
                const [lat1, long1] = p1;
                const [lat2, long2] = p2;

                return Boolean(lat1 === lat2 && long1 === long2);
            },
            isLast(index) {
                return this.isEnd(this.localList[index + 1]) || index === this.localList.length - 1;
            },
            isFirst(index) {
                return this.isStart(this.localList[index - 1]) || index === 0;
            },
            isStart(object) {
                if (!object) {
                    return false;
                }
                return this.isEqual(this.start.position, object.coordinates);
            },
            isEnd(object) {
                if (!object) {
                    return false;
                }
                return this.isEqual(this.end.position, object.coordinates);
            },
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
                console.log(this.localList[index])
                console.log(this.localList[index][data.field])
                console.log(this.localList)
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