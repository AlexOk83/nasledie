<template lang="pug">
    ul.bread-crumbs
        li: a(@click="moveTo('/')") Маршруты
        li(v-for="link in listLink")
            a(@click="moveTo(link.url)" v-if="link.url") {{ link.name }}
            span(v-else) {{ link.name }}
</template>

<script>
    export default {
        name: "bread-сrumbs",
        props: {
            listLink: Array
        },
        methods: {
            moveTo(url) {
                this.$router.push(url);
            }
        }

    }
</script>

<style lang="less">
    @import '../styles/mixins';
    .bread-crumbs {
        display: flex;
        li {
            display: block;
            position: relative;
            padding-right: 15px;
            a, span {
                color: @greyIcon;
                font-size: 12px;
            }
            a {
                cursor: pointer;
            }
            a:hover {
                color: @base;
                transition: all 0.2s ease-out;
            }
            &:after {
                content: '';
                width: 5px;
                height: 5px;
                border-right: 1px solid @greyIcon;
                border-bottom: 1px solid @greyIcon;
                position: absolute;
                top: 8px;
                right: 5px;
                transform: rotate(-45deg);

            }
            &:last-child {
                &:after {
                    display: none;
                }
            }
        }
    }
</style>