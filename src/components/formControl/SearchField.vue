<template>
    <div class="search-field" :class="{'selected': findedPoints.length > 0 }">
        <input type="text" class="field_control" v-model="searchText" :placeholder="placeholder" @input="search" @blur="close" @focus="search">
        <div class="search-button" @click="search"/>
        <div class="clear-button" @click="clear"/>
        <div class="search-list" :class="{'show': findedPoints.length > 0 }">
            <div class="search-list__item" v-for="point in findedPoints" @click="() => select(point)">
                {{ point.name }}, {{point.description }}
            </div>
        </div>
    </div>

</template>

<script>
    export default {
        name: "SearchField",
        props: ['value', 'name', 'placeholder'],
        data() {
            return {
                searchText: '',
                findedPoints: [],
            }
        },
        created() {
            this.searchText = this.value.name;
        },
        methods: {
            clear() {
                this.searchText = '';
                this.value = {
                    coordinates: '',
                    name: '',
                    description: ''
                }
                this.findedPoints = [];
            },
            close() {
                // задержка нужна, чтобы успеть выбрать нужный пункт меню
                setTimeout(() => {
                    this.findedPoints = [];
                }, 200);

            },
            search() {
                if (this.searchText.length > 5) {
                    const geocoder = ymaps.geocode(this.searchText);
                    let pointList = [];

                    // После того, как поиск вернул результат, вызывается callback-функция
                    geocoder.then(
                        function (res) {
                            res.geoObjects.each(function(el) {
                                console.log(el.properties)
                                let point = {
                                    coordinates: el.geometry.getCoordinates(),
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
            },
            select(point) {
                console.log(point);
                this.value = point;
                this.searchText = point.name;
            }
        }
    }
</script>

<style lang="less">
    @import '../../styles/mixins';

    .search-field {
        position: relative;
        width: 100%;
        &.selected {
            z-index: 100;
        }
        &:before {
            content: '';
            display: block;
            position: absolute;
            border-right: 2px solid @base;
            width: 1px;
            height: 20px;
            top: 8px;
            right: 38px;
            z-index: 4;
        }
        .field_control {
            .form-control-style();
            padding-right: 80px;
            z-index: 3;
            position: relative;
        }
    }
    .clear-button {
        position: absolute;
        top: 12px;
        right: 14px;
        width: 12px;
        height: 12px;
        .bg(12px);
        background-image: url('../../assets/images/icons/close.svg');
        z-index: 4;
        cursor: pointer;
    }
    .search-button {
        position: absolute;
        top: 9px;
        right: 50px;
        width: 18px;
        height: 18px;
        .bg(18px);
        background-image: url('../../assets/images/icons/search.svg');
        z-index: 4;
        cursor: pointer;
    }
    .search-list {
        opacity: 0;
        position: absolute;
        background-color: white;
        top: 0;
        left: 0;
        width: 100%;
        border-radius: 18px;
        border: 1px solid @greyBorder;
        transition: all 0.3s ease-out;
        z-index: 2;
        padding: 40px 20px 10px;

        &.show {
            opacity: 1;
        }
        &__item {
            line-height: 30px;
            border-bottom: 1px solid @greyBorder;
            cursor: pointer;
            &:last-child {
                border-bottom: none;
            }
            &:hover {
                color: @base;
                font-weight: bold;
            }
        }
    }

</style>
