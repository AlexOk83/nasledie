<!-- фильтр - готово! -->
<template>
  <div>
    <div class="filter" v-if="showFilter">
      <div class="filter__row">
        <FilterItem
            title="Расположение"
            list-title="выбранные регионы:"
            :list-value="listRegions"
            placeholder="Регионы"
            icon="way"
            @change="changeListRegions"
        />
      </div>
      <div class="filter__row">
        <FilterItem
            title="Способ передвижения"
            list-title="выбранные способы:"
            :list-value="listTypesOfMovement"
            placeholder="Способы"
            @change="changeListTypes"
        />
      </div>
      <div class="filter__row">
        <FilterItem
            title="Тип маршрута"
            list-title="выбранные типы:"
            :list-value="listTags"
            placeholder="Типы #"
            icon="tag"
            @change="changeListTags"
        />
      </div>
      <div class="filter__footer">
        <Button
            text="Выбрать маршруты"
            is-shadow
            :on-click="() => handleFilter()"
        />
      </div>

    </div>


  </div>
</template>

<script>
import FilterItem from "./filter-item";
import Button from '../form-control/button/button';
import {typesOfMovement} from '../../constants';
import Repository from "../../repository";
import {isEmpty} from "lodash";

const repository = new Repository();

export default {
  components: {
    FilterItem,
    Button,
  },
  data() {
    return {
      typesMovement: [],
      regions: [],
      tags: [],
    }
  },
  computed: {
    showFilter() {
      return !isEmpty(this.listRegions) && !isEmpty(this.listTags)
    },
    listTypesOfMovement() {
      return typesOfMovement;
    },
    listRegions() {
      return this.$store.getters.getRegions;
    },
    listTags() {
      return this.$store.getters.getTags;
    }
  },
  methods: {
    handleFilter() {
      this.$emit('filter', {
        regions: this.regions,
        typesOfMovement: this.typesMovement,
        tags: this.tags
      });
    },
    changeListRegions(list) {
      this.regions = list.map(r => (r.value));
    },
    changeListTypes(list) {
      this.typesMovement = list.map(t => (t.value));
    },
    changeListTags(list) {
      this.tags = list.map(t => (t.id));
    },
  },
}
</script>

<style lang="less">
  @import "./styles";
</style>