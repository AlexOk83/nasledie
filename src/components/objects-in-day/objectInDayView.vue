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
          :is-changed="dataIsChange"
          @change="data => changeItem(index, data)"
    />
  </div>
</template>

<script>
import Item from './item';
import {Presenter} from "../../presenter";
import {getPosition, isEqual} from "../../utils";

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
    dataIsChange: Boolean,
  },
  data() {
    return {
      localList: []
    }
  },
  watch: {
    list: function () {
      this.localList = this.list;
      console.log(this.list);
    }
  },
  computed: {},
  methods: {
    isLast(index) {
      return index === this.localList.length - 1;
    },
    isFirst(index) {
      return index === 0;
    },
    isStart(object) {
      if (!object) {
        return false;
      }
      return isEqual(getPosition(this.start), getPosition(object));
    },
    isEnd(object) {
      if (!object) {
        return false;
      }
      return isEqual(getPosition(this.end), getPosition(object));
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
      this.$emit('remove', this.localList[index]);
      this.localList.splice(index, 1);
      this.$emit('change', this.localList);
    },
    changeItem(index, data) {
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
    console.log(this.list)
  }
}
</script>

<style lang="less">
@import "styles";
</style>