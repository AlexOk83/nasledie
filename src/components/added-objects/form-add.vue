<template>
    <div class="objects__add-form">
        <div class="label">Объекты для посещения:</div>
        <div class="form__field">
            <Select :list="regions" :value="currentRegion"   placeholder="Регион" @change="changeRegion"/>
        </div>
        <div class="form__field">
            <Select :list="categories" :value="currentCategory"  placeholder="Категория" @change="changeCategory" />
        </div>
        <div class="form__field">
            <SearchFromBaseField
                    v-model="currentName"
                    placeholder="Название"
                    @change="changeName"
                    :category="currentCategory"
                    :region="currentRegion"
                    :addedObjects="objects"

            />
        </div>
        <Button
            text="Добавить для посещения"
            is-full
            :on-click="add"
            :disabled="disabledForm"
        />


    </div>
</template>

<script>
    import SearchField from "../form-control/search/SearchField";
    import Select from '../form-control/select';
    import Button from '../form-control/button';
    import SearchFromBaseField from "../form-control/search/SearchFromBaseField";
    import axios from 'axios'
    import VueAxios from 'vue-axios'

    export default {
        name: "form-add",
        props: {
                //objects: Array,
        },
        components: {
            SearchField,
            Select,
            SearchFromBaseField,
            Button,
            axios,
            VueAxios
        },
        data() {
            return {
                categories: [],
                regions: [],
                currentRegion: "",
                currentCategory: "",
                currentName: {},
                objects: []
            }
        },
        computed: {
            disabledForm() {

                if (!this.currentCategory) {
                    return true;
                }
                if (!this.currentName) {
                    return true;
                }
                return false;
            }
        },
        methods: {
            add() {
                this.$emit('add', this.currentName);
                this.clearAll();
            },
            clearAll() {
                this.currentRegion = "";
                this.currentCategory = "";
                this.currentName =  {};
            },
            changeRegion(event) {
                this.currentRegion = event;
            },
            changeCategory(event) {
                this.currentCategory = event;
                axios.get("https://api.zhivoe-nasledie.ga/object?type="+this.currentCategory + '&region='+ this.currentRegion)
                    .then(response => {
                        this.objects = JSON.parse(response.data)


                    })
                    .catch(function(e){

                    });
            },
            changeName(event) {

                this.currentName = event;
                this.currentCategory = this.currentCategory.value || event.category;
                this.currentRegion.name = this.currentRegion.value || event.region;
            },
            getData() {

                    axios.get("https://api.zhivoe-nasledie.ga/region")
                        .then(response => {
                            // this.allArticles = response.data;
                            this.regions = JSON.parse(response.data)

                        })
                        .catch(function(e){

                        });
                    axios.get("https://api.zhivoe-nasledie.ga/type")
                        .then(response => {
                            // this.allArticles = response.data;
                            this.categories = JSON.parse(response.data)

                        })
                        .catch(function(e){

                        });

            },
        },
        created() {
            this.getData();
        },

    }
</script>

<style lang="less">
    @import "./styles";
</style>
