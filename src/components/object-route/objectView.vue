<!-- вывод объектов в просмотре - готово! -->
<template>
  <a class="object" :href="getUrl(data.id)" target="_blank">
    <div class="object__image" v-if="image">
      <img :src="image">
    </div>
    <div class="object__body">
      <div class="title">{{ data.name }}</div>
    </div>
  </a>
</template>

<script>
import vueCustomScrollbar from "vue-custom-scrollbar";
import {isNil} from 'lodash';
import {API} from '../../repository';
import {urlToSize} from "../../constants";

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
      site: String,
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
  },
  methods: {
    getUrl(id) {
      return `${urlToSize}/object/view/id/${id}`
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
