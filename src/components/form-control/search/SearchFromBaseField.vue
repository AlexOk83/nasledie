<template>
    <div class="search-field" :class="{'selected': menuVisible }">
        <input type="text" class="field_control" v-model="searchText" :placeholder="placeholder" @input="search" @blur="close" @focus="search">
        <div class="search-button" @click="search"/>
        <div class="clear-button" @click="clear"/>
        <div class="search-list" :class="{'show': menuVisible && objects.length > 0 }">
            <vue-custom-scrollbar class="scroll-area">
                <div class="search-list__item" v-for="object in objects" @click="select(object)">
                    {{ object.name }}
                </div>
            </vue-custom-scrollbar>
        </div>
    </div>

</template>

<script>
    import vueCustomScrollbar from 'vue-custom-scrollbar'
    import Repository from "../../../repository";

    const repository = new Repository();

    export default {
        name: "SearchField",
        props: {
            name: String,
            placeholder: String,
            value: Object,
            region: Object,
            category: String,
            addedObjects: Array,
        },
        components: {
            vueCustomScrollbar
        },
        data() {
            return {
                searchText: '',
                currentValue: {},
                objects: [],
                menuVisible: false,
            }
        },
        created() {
            this.currentValue = this.value || {};
            this.searchText = this.value.name || "";
        },
        watch: {
            value: function () {
                if (!this.value.name && this.currentValue.name) {
                    this.currentValue = this.value;
                    this.searchText = "";
                }
            }
        },
        methods: {
            clear() {
                this.searchText = '';
                this.currentValue = {};
                this.objects = [];
                this.menuVisible = false;
                this.$emit('change', this.currentValue)
            },
            close() {
                // задержка нужна, чтобы успеть выбрать нужный пункт меню
                setTimeout(() => {
                    this.menuVisible = false;
                }, 200);

            },
            search() {
                repository.getObjects(this.currentCategory.value, this.currentRegion.value, this.searchText)
                    .then(response => {
                        this.objects = JSON.parse(response.data);
                        console.clear();
                        console.log(this.currentRegion, this.currentCategory);
                        console.log(this.objects);
                        this.menuVisible = true;
                    })

            },
            select(object) {
                this.currentValue = object;
                this.searchText = object.name;
                this.$emit('change', this.currentValue)
            }
        }
    }
</script>

<style lang="less">
    @import '../../../styles/mixins';

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
        background-image: url('../../../assets/images/icons/close.svg');
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
        background-image: url('../../../assets/images/icons/search.svg');
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
        z-index: -2;
        padding: 40px 20px 10px;

        &.show {
            opacity: 1;
            z-index: 2;
        }
        &__item {
            line-height: 30px;
            border-bottom: 1px solid @greyBorder;
            .text_overflow();
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
