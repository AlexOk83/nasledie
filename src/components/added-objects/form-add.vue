<template>
    <div class="objects__add-form">
        <div class="label">Объекты для посещения:</div>
        <div class="form__field">
            <SearchField :value="currentRegion" placeholder="Регион" @change="changeRegion"/>
        </div>
        <div class="form__field">
            <Select :list="categories" :value="currentCategory" placeholder="Категория" @change="changeCategory" />
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
    export default {
        name: "form-add",
        props: {
            objects: Array,
        },
        components: {
            SearchField,
            Select,
            SearchFromBaseField,
            Button
        },
        data() {
            return {
                categories: [
                    {
                        "name": "Поселения",
                        "value": "Location"
                    },
                    {
                        "name": "Сооружения",
                        "value": "Construction"
                    },
                    {
                        "name": "Природа",
                        "value": "Nature"
                    },
                    {
                        "name": "Традиции и промыслы",
                        "value": "Social"
                    },
                    {
                        "name": "Даты и события",
                        "value": "Event"
                    },
                    {
                        "name": "Персоны",
                        "value": "People"
                    },
                    {
                        "name": "Гастрономия",
                        "value": "Gastronomy"
                    },
                    {
                        "name": "Образы",
                        "value": "Images"
                    },
                    {
                        "name": "Арт-кластеры",
                        "value": "Creative"
                    }
                ],
                currentRegion: {},
                currentCategory: "",
                currentName: {}

            }
        },
        computed: {
            disabledForm() {
                if (!this.currentRegion.coordinates) {
                    return true
                }
                if (!this.currentCategory) {
                    return true;
                }
                if (!this.currentName.name) {
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
                this.currentRegion = {};
                this.currentCategory = "";
                this.currentName =  {};
            },
            changeRegion(event) {
                this.currentRegion = event;
            },
            changeCategory(event) {
                this.currentCategory = event;
            },
            changeName(event) {
                this.currentName = event;
                this.currentCategory = this.currentCategory || event.category;
                this.currentRegion.name = this.currentRegion.name || event.region;
            }
        }
    }
</script>

<style lang="less">
    @import "./styles";
</style>