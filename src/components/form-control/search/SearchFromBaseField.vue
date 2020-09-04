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
                allObjects: [],
                menuVisible: false,
            }
        },
        created() {
            this.getData();
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
                const allObjects = this.allObjects.filter(o => {
                    let flag = true;
                    this.addedObjects.forEach(o2 => {

                        if (o2.name === o.name) {
                            flag = false;
                        }
                    });

                    return flag;
                });

                if (this.searchText.length > 3) {
                    this.objects = allObjects.filter(object => {
                        const name = object.name.toLowerCase()
                        const text = this.searchText.toLowerCase()
                        return name.match(text);
                    });
                } else {
                    this.objects = allObjects.filter(object => {
                        const region = this.region && this.region.name;
                        return (object.region === region && object.category === this.category)
                    })
                }
                this.menuVisible = true;
            },
            getData() {
               /* this.$resource('objectsFromBase').get()
                    .then(response => response.json())
                    .then(objects => {
                        this.allObjects = objects;
                    })*/
                this.allObjects = this.objects
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
