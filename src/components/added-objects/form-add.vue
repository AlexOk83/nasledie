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
                    :value="currentName"
                    placeholder="Название"
                    @change="changeName"
                    @clear="clearAll"
                    :category="currentCategory"
                    :region="currentRegion"
                    :addedObjects="objects"

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
    import Button from '../form-control/button/button';
    import SearchFromBaseField from "../form-control/search/SearchFromBaseField";
    import Repository from '../../repository';
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
            SearchField,
            SearchFromBaseField,
            Button,
        },
        data() {
            return {
                categories: [],
                regions: [],
                currentRegion: {},
                currentCategory: {},
                currentName: {},
            }
        },
        computed: {
            disabledForm() {
                return isEmpty(this.currentCategory) || isEmpty(this.currentRegion) || isEmpty(this.currentName);
            }
        },
        methods: {
            add() {
                this.$emit('add', this.currentName);
                this.clearAll();
            },
            clearAll() {
                this.currentRegion = {};
                this.currentCategory = {};
                this.currentName =  {};
            },
            changeRegion(event) {
                this.currentRegion = this.regions.find(region => region.value === event);
            },
            changeCategory(event) {
                this.currentCategory = this.categories.find(region => region.value === event);
            },
            changeName(event) {
                this.currentName = event;
                this.currentCategory = this.categories.find(category => category.value === event.type);
                this.currentRegion = this.regions.find(region => region.value === event.region);
            },
            getData() {
                this.regions = this.$store.getters.getRegions;
                this.categories = this.$store.getters.getTypes;
            },
        },
        mounted() {
            this.getData();
        },

    }
</script>

<style lang="less">
    @import "./styles";
</style>
