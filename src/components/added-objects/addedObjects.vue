<!-- Добавление объекта - готово! -->
<template>
  <div class="objects">
    <Form-add
        :objects="currentObjects"
        @add="add"
    />
    <List
        :list="currentPoints"
        @remove="remove"
    />
  </div>
</template>

<script>
import FormAdd from './form-add';
import List from './objects-list';

export default {
  name: "added-objects",
  props: {
    points: Array,
    objects: Array,
  },
  data() {
    return {
      currentPoints: [],
      currentObjects: [],
    }
  },
  components: {
    FormAdd,
    List
  },
  watch: {
    objects() {
      this.currentObjects = this.objects;
    },
    points() {
      this.currentPoints = this.points;
    }
  },
  methods: {
    add(event) {
      this.currentObjects.push(event);
      this.currentPoints.push(event);
      this.$emit('change', {objects: this.currentObjects, points: this.currentPoints}); // при добавлении и удалении мы эмитим родителю актуальный список объектов
    },
    remove(event) {
      this.currentObjects.splice(event, 1);
      this.currentPoints.splice(event, 1);
      this.$emit('change', {objects: this.currentObjects, points: this.currentPoints});
    }

  }
}
</script>

<style lang="less">
@import "../../styles/vars";


</style>
