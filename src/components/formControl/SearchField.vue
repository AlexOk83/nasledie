<template>
    <div class="search-field">
        <input type="text" class="field_control" v-model="value" :placeholder="placeholder" @change="search">
        <div class="search-button" @click="search"/>
        <div class="clear-button" @click="clear"/>
        <div class="search-list" :class="{'show': findedPoints.length > 0 }">
            <div class="search-list__item" v-for="point in findedPoints">
                {{ point.title }}
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
                findedPoints: [

                ],
                m: {
                    id: 1,
                    coordinates: [55.753994, 37.622093],
                    title: 'г. Москва, Мтищи'
                }
            }
        },
        methods: {
            clear() {
                this.value = '';
                this.findedPoints = [];

            },
            search() {
                if (this.value.length > 3) {
                    return this.findedPoints.push(this.m)
                }

            }
        }
    }
</script>

<style lang="less">
    @import '../../styles/mixins';

    .search-field {
        position: relative;
        width: 100%;
        &:before {
            content: '';
            display: block;
            position: absolute;
            border-right: 2px solid @base;
            width: 1px;
            height: 20px;
            top: 8px;
            right: 38px;
        }
        .field_control {
            .form-control-style();
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
        z-index: 2;
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
        z-index: 2;
        cursor: pointer;
    }

</style>