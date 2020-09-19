<template>
    <ul class="bread-crumbs">
        <li>
            <a href="#" @click="moveTo('/')">Маршруты</a>
        </li>
        <li v-for="link in listLink">
            <a href="#" @click="moveTo(link.url)" v-if="link.url">{{ link.name }}</a>
            <span v-else >{{ link.name }}</span>
        </li>
    </ul>
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
        margin-bottom: 30px;
        li {
            display: block;
            position: relative;
            padding-right: 20px;
            a, span {
                color: @greyIcon;
                font-size: 12px;
            }
            a {
                cursor: pointer;
                text-decoration: none;
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
                right: 10px;
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