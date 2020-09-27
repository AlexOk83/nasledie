<!-- форма добавления объекта - готово! -->
<template>
    <div class="objects__add-form">
        <div class="label">Объекты для посещения:</div>
        <div class="form__field">
            <SelectControl :list="regions" :value="currentRegion && currentRegion.value"   placeholder="Регион" @change="changeRegion"/>
        </div>
        <div class="form__field">
            <SelectControl :list="categories" :value="currentCategory && currentCategory.value"  placeholder="Категория" @change="changeCategory" />
        </div>
        <div class="form__field">
            <SearchFromBaseField
                    :value="currentBrand"
                    placeholder="Бренд"
                    @change="changeBrand"
                    @clear="clearAll"
                    :category="currentCategory"
                    :region="currentRegion"
            />
        </div>
        <div class="form__field">
            <SelectControl :list="objectList" :value="currentObject.value"  placeholder="Наименование" @change="changeObject" />
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
    import { isEmpty } from 'lodash';
    import SearchField from "../form-control/search/SearchField";
    import SelectControl from '../form-control/select/select-with-search';
    import SelectRecommendObjects from './select-recommend-objects';
    import Button from '../form-control/button/button';
    import SearchFromBaseField from "../form-control/search/SearchFromBaseField";
    import Repository from '../../repository';
    import {setCoordsToNumeric} from "../../utils";
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
            }
        },
        methods: {
            selectRecommendObjects(event) {
                this.currentName = event;
                this.currentCategory = this.categories.find(category => category.value === event.type);
                this.currentRegion = this.regions.find(region => Number(region.value) === Number(event.region));
            },
            add() {
                this.$emit('add', this.currentObject);
                this.clearAll();
            },
            clearAll() {
                this.currentRegion = {};
                this.currentCategory = {};
                this.currentBrand =  {};
                this.currentObject = {};
                this.objectList = [];
            },
            changeRegion(event) {
                this.currentRegion = this.regions.find(region => region.value === event);
            },
            changeCategory(event) {
                this.currentCategory = this.categories.find(region => region.value === event);
            },
            changeObject(event) {
                this.currentObject = this.objectList.find(object => object.value === event);
            },
            changeBrand(event) {
                this.currentBrand = event;
                this.currentCategory = this.categories.find(category => category.value === event.type);
                this.currentRegion = this.regions.find(region => Number(region.value) === Number(event.region));
                this.objectList = event.objects.map(obj => {
                    const position = setCoordsToNumeric(obj.position);
                    console.info(position);
                    return {...obj, value: obj.id, position }
                });
            },
        },

    }
</script>

<style lang="less">
    @import "./styles";
</style>
