<!-- поиск через yandex API - готово! -->
<template>
    <div class="search-field" :class="{'selected': findedPoints.length > 0 }">
        <input type="text" class="field_control" v-model="searchText" :placeholder="placeholder" @input="search" @focus="search" @blur="close">
        <div class="search-button" @click="search" />
        <div class="clear-button" @click="clear" />
        <div class="search-list" :class="{'show': findedPoints.length > 0 }" >
            <vue-custom-scrollbar class="scroll-area" :settings="settings" >
                <div class="search-list__item" v-for="point in findedPoints" @click="() => select(point)" >
                    {{ getSearchText(point) }}
                </div>
            </vue-custom-scrollbar>
        </div>
    </div>

</template>

<script>
    import vueCustomScrollbar from 'vue-custom-scrollbar';
    import { settingsScroll } from "../../../constants";
    import {getAdress} from "../../../utils";

    export default {
        name: "SearchField",
        props: {
            name: String,
            placeholder: String,
            value: {
                position: Array,
                name: String,
                description: String
            }
        },
        components: {
            vueCustomScrollbar
        },
        data() {
            return {
                searchText: "",
                currentValue: {},
                findedPoints: [],
            }
        },
        computed: {
            settings() {
                return settingsScroll
            },

        },
        methods: {
            getSearchText(point) {
                return getAdress(point);
            },
            clear() {
                this.searchText = '';
                this.currentValue = {};
                this.findedPoints = [];
                this.$emit('change', this.currentValue)
            },
            close() {
                // задержка нужна, чтобы успеть выбрать нужный пункт меню
                setTimeout(() => {
                    this.findedPoints = [];
                }, 200);

            },
            search() {
                if (this.searchText.length > 3) {
                    const geocoder = ymaps.geocode(this.searchText + ', ' + this.currentValue.description);
                    let pointList = [];

                    // После того, как поиск вернул результат, вызывается callback-функция
                    geocoder.then(
                        function (res) {
                            res.geoObjects.each(function(el) {
                                let point = {
                                    position: el.geometry.getCoordinates(),
                                    name: el.properties.get('name'),
                                    description: el.properties.get('description'),
                                }
                                pointList.push(point);
                            });
                        }
                    );
                    this.findedPoints = pointList
                }
                else {
                    this.findedPoints = [];
                }
                if (this.currentValue && this.searchText.length < 3) {
                    this.currentValue = {};
                    this.findedPoints = [];
                }
            },
            select(point) {
                this.currentValue = point;
                this.searchText = this.getSearchText(point)
                this.$emit('change', this.currentValue);
            }
        },
        watch: {
            value (newVal, oldVal) {
                if (!this.value.name && this.currentValue.name) {
                    this.currentValue = this.value;
                    this.searchText = "";
                }
                if (this.value.name && !this.searchText || newVal.name !== oldVal.name) {
                    this.currentValue = this.value;
                    this.searchText = this.getSearchText(this.value)
                }
            }
        },
        created() {
            this.currentValue = this.value || {};
            this.searchText = this.getSearchText(this.value)
        }
    }
</script>

<style lang="less">
   @import './styles';

</style>
