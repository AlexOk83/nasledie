<!-- вывод объектов в просмотре - готово! -->
<template>
  <div class="route">
    <div class="route__image" v-if="image">
      <img :src="image">
    </div>
    <div class="route__body" :class="{'full': !image}">
      <vue-custom-scrollbar class="scroll-area" :settings="settings">
        <div class="title">{{ data.name }}</div>
        <div class="text-description" v-html="data.short_description"/>
      </vue-custom-scrollbar>

    </div>
  </div>

</template>

<script>
import vueCustomScrollbar from "vue-custom-scrollbar";
import {isNil} from 'lodash';
import {API} from '../../repository';

export default {
  name: "ObjectRoute",
  components: {
    vueCustomScrollbar
  },
  props: {
    data: {
      name: String,
      image: String,
      short_description: HTMLBaseElement,
    }
  },
  computed: {
    settings() {
      return {
        wheelPropagation: false,
        maxScrollbarLength: 270,
      }
    },
    image() {

      if (isNil(this.data.image)) {
        return null;
      }

      return `${API.BASE_IMG()}${this.data.image}`
    }
  }
}
</script>

<style lang="less">
@import "../recomended-route/styles";

.text-description {
  .text();
  margin-top: 30px;
}
</style>
