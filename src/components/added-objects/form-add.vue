<!-- форма добавления объекта - готово! -->
<template>
  <div class="objects__add-form">
    <div class="label">Объекты для посещения:</div>
    <div class="form__field">
      <SelectControl
          :list="regions"
          :value="currentRegion && currentRegion.value"
          placeholder="Регион"
          @change="changeRegion"
      />
    </div>
    <div class="form__field">
      <SelectControl
          :list="categories"
          :value="currentCategory && currentCategory.value"
          placeholder="Категория"
          @change="changeCategory"
      />
    </div>
    <div class="form__field">
      <SelectControl
          :list="brands"
          :value="currentBrand && currentBrand.value"
          placeholder="Бренд"
          @change="changeBrand"
      />
    </div>
    <div class="form__field">
      <SelectControl
          :list="objectList"
          :value="currentObject.value"
          placeholder="Наименование"
          @change="changeObject"
      />
    </div>
    <div class="form__field">
      <SelectRecommendObjects
          @change="selectRecommendObjects"
      />
    </div>
    <Button
        text="Добавить для посещения"
        is-full
        :on-click="() => add()"
        :disabled="disabledForm"
    />
  </div>
</template>

<script>
  import {isEmpty, isNil} from 'lodash';
import SearchField from "../form-control/search/SearchField";
import SelectControl from '../form-control/select/select-with-search';
import SelectRecommendObjects from './select-recommend-objects';
import Button from '../form-control/button/button';
import SearchFromBaseField from "../form-control/search/SearchFromBaseField";
import Repository from '../../repository';
import {setCoordsToString} from "../../utils";

const repository = new Repository();

export default {
  name: "FormAdd",
  props: {
    objects: {
      type: Array,
      default: [],
    },
  },
  components: {
    SelectControl,
    SelectRecommendObjects,
    SearchField,
    SearchFromBaseField,
    Button,
  },
  data() {
    return {
      currentRegion: {},
      currentCategory: {},
      currentBrand: {},
      objectList: [],
      brands: [],
      currentObject: {}
    }
  },
  computed: {
    disabledForm() {
      return isEmpty(this.currentObject);
    },
    regions() {
      return this.$store.getters.getRegions;
    },
    categories() {
      return this.$store.getters.getTypes;
    },

  },
  methods: {
    selectRecommendObjects(event) {
      const position = setCoordsToString(event.position);
      this.currentObject = {
        ...event,
        coordinates: position,
        startPointCoordLat: position[0],
        startPointCoordLong: position[1],
        position,
        time: 0,
        object_id: event.id,
        timeInWay: 0,
        stopTime: 0,
        way: 0,
        typeMovement: ['car']
      };
      this.objectList = [event];
      this.currentCategory = this.categories.find(category => category.value === event.type);
      this.currentRegion = this.regions.find(region => Number(region.value) === Number(event.region));
      this.currentBrand = {
        id: event.brandid,
        name: event.brandname,
      }
    },
    add() {
      this.$emit('add', this.currentObject);
      this.clearAll();
    },
    clearAll() {
      this.currentRegion = {};
      this.currentCategory = {};
      this.currentBrand = {};
      this.currentObject = {};
      this.objectList = [];
    },
    autoComplete() {
      this.currentCategory = this.categories.find(category => category.value === this.currentBrand.type);
      this.currentRegion = this.regions.find(region => Number(region.value) === Number(this.currentBrand.region));
    },
    getFullObjects() {
      const reducerBrand = (accumulator, currentValue) => {
        return [...accumulator, ...currentValue.objects.map(obj => ({ ...obj, brandId: currentValue.id })) ];
      }
      const objects = this.brands.reduce(reducerBrand, [])
      this.objectList = objects.map(obj => {
        const position = setCoordsToString(obj.position);
        return { ...obj, value: obj.id, position }
      });
    },
    changeRegion(event) {
      this.currentRegion = this.regions.find(region => region.value === event);
      this.getBrands();
    },
    changeCategory(event) {
      this.currentCategory = this.categories.find(region => region.value === event);
      this.getBrands();
    },
    changeObject(event) {
      if (!event) {
        this.currentObject = {};
        return;
      }
      const currentObject = this.objectList.find(object => object.value === event);
      const position = setCoordsToString(currentObject.position);
      this.currentObject = {
        ...currentObject,
        coordinates: position,
        position,
        startPointCoordLat: position[0],
        startPointCoordLong: position[1],
        time: 0,
        object_id: null,
        timeInWay: 0,
        stopTime: 0,
        way: 0,
        typeMovement: ['car']
      }
      if (isEmpty(this.currentBrand)) {
        this.currentBrand = this.brands.find(brand => brand.id === currentObject.brandId);
      }
      setTimeout(this.autoComplete, 0);
    },
    changeBrand(event) {
      if (!event) {
        this.currentBrand = {};
        this.currentObject = {};
        this.getFullObjects();
        return;
      }
      this.currentBrand = this.brands.find(brand => brand.value === event);
      this.autoComplete();
      this.objectList = this.currentBrand.objects.map(obj => {
        const position = setCoordsToString(obj.position);
        return { ...obj, value: obj.id, position, brandId: this.currentBrand.id }
      });
    },
    getBrands() {
      const category = this.currentCategory && this.currentCategory.value;
      const region = this.currentRegion && this.currentRegion.value;
      if (isNil(category) && isNil(region)) {
         this.brands = [];
         this.objectList = [];
         return;
      }

      repository.getBrands(category, region)
              .then(response => {
                this.brands = JSON.parse(response.data).map(brand => ({ ...brand, value: brand.id }));
                setTimeout(this.getFullObjects, 0);
                if (!this.brands.map(brand => brand.id).includes(this.currentBrand.id)) {
                  this.changeBrand('')
                }
              })
    }
  },
}
</script>

<style lang="less">
@import "./styles";
</style>
