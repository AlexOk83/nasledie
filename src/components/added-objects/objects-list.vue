<!-- список добавленных объектов - готово! -->
<template>
  <div class="object-list">
    <div class="label" v-if="list.length > 0">Выбранные объекты:</div>
    <li v-for="(item, index) in list">
      <a :href="getUrl(item.id)" v-if="item.id !== undefined && item.id !== null" target="_blank">{{ getName(item) }}</a>
      <span v-else>{{ getName(item) }}</span>
      <span class="icon icon-delete" @click="removeObject(index)"/>
    </li>
  </div>
</template>

<script>
import {getAdress} from "../../utils";
import {urlToSize} from "../../constants";

export default {
  name: "object",
  props: {
    list: Array,
  },
  methods: {
    removeObject(id) {
      this.$emit('remove', id)
    },
    getUrl(id) {
      return `${urlToSize}/object/view/id/${id}`
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
