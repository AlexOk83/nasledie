<!-- поиск объектов из БД, используется в form-add - готово! -->
<template>
    <div class="search-field" :class="{'selected': menuVisible }">
        <input type="text" class="field_control" v-model="searchText" :placeholder="placeholder" @input="search" @blur="close" @focus="search">
        <div class="search-button" @click="search"/>
        <div class="clear-button" @click="clear"/>
        <div class="search-list" :class="{'show': menuVisible && brands.length > 0 }">
            <vue-custom-scrollbar class="scroll-area" :settings="settings">
                <div class="search-list__item" v-for="brand in brands" @click="select(brand)">
                    {{ brand.name }}
                </div>
            </vue-custom-scrollbar>
        </div>
    </div>

</template>

<script>
    import vueCustomScrollbar from 'vue-custom-scrollbar'
    import Repository from "../../../repository";
    import {settingsScroll} from "../../../constants";

    const repository = new Repository();

    export default {
        name: "SearchFromBaseField",
        props: {
            name: String,
            placeholder: String,
            value: Object,
            region: Object,
            category: Object,
            addedObjects: Array,
        },
        components: {
            vueCustomScrollbar
        },
        data() {
            return {
                searchText: '',
                currentValue: {},
                brands: [],
                menuVisible: false,
            }
        },
        computed: {
            settings() {
                return settingsScroll
            }
        },
        methods: {
            clear() {
                this.searchText = '';
                this.currentValue = {};
                this.objects = [];
                this.menuVisible = false;
                this.$emit('clear', true)
            },
            close() {
                // задержка нужна, чтобы успеть выбрать нужный пункт меню
                setTimeout(() => {
                    this.menuVisible = false;
                }, 200);
            },
            search() {
                const category = this.category && this.category.value;
                const region = this.region && this.region.value;
                repository.getBrands(category, region, this.searchText)
                    .then(response => {
                        let brands = JSON.parse(response.data);
                        this.brands = brands;
                        this.menuVisible = true;
                    })

            },
            select(brand) {
                this.currentValue = brand;
                this.searchText = brand.name;
                this.$emit('change', this.currentValue)
            }
        },
        watch: {
            value: function () {
                if (!this.value.name && this.currentValue.name) {
                    this.currentValue = this.value;
                    this.searchText = '';
                }
                this.currentValue = this.value;
                this.searchText = this.currentValue.name
            }
        },
        created() {
            this.currentValue = this.value || {};
            this.searchText = this.value.name || "";
        }
    }
</script>

<style lang="less">
    @import './styles';

</style>
