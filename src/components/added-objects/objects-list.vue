<!-- список добавленных объектов - готово! -->
<template>
  <div class="object-list">
    <div class="label" v-if="list.length > 0">Выбранные объекты:</div>
    <li v-for="(item, index) in list">
      {{ getName(item) }}
      <span class="icon icon-delete" @click="removeObject(index)"/>
    </li>
  </div>
</template>

<script>
import {getAdress} from "../../utils";

export default {
  name: "object",
  props: {
    list: Array,
  },
  methods: {
    removeObject(id) {
      this.$emit('remove', id)
    },
    getName(item) {
      return getAdress(item);
    }
  }
}
</script>

<style lang="less">
  @import "./styles";
</style>
