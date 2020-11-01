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
        <Icon :icon="item.icon || icon"/>
        {{ item.name }}
        <span class="icon  icon-delete" @click="deleteItem(index)"/>
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
    list: Array,
    icon: String,
  },
  data() {
    return {
      value: '',
      selectedValues: [],
    }
  },
  watch: {
    list() {
      this.selectedValues = this.list
    }
  },
  computed: {},
  methods: {
    deleteItem(index) {
      this.selectedValues.splice(index, 1);
      this.$emit('change', this.selectedValues);
    },
    selectValue(e) {
      this.value = null;
      let selectValue = this.listValue.find(item => item.value === e);
      this.selectedValues.push(selectValue);
      this.$emit('change', this.selectedValues);
    }
  }
}
</script>

<style lang="less">
  @import "./styles";
</style>