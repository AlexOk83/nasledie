<!-- вывод объектов в просмотре - готово! -->
<template>
    <div class="route">
        <div class="route__image" v-if="image">
            <img :src="image" :alt="data.name" >
        </div>
        <div class="route__body" :class="{'full': !image}">
            <vue-custom-scrollbar class="scroll-area" :settings="settings" >
                <div class="title">{{ data.name }}</div>
                <div class="text-description" v-html="data.description" />
            </vue-custom-scrollbar>

        </div>
    </div>

</template>

<script>
    import vueCustomScrollbar from "vue-custom-scrollbar";
    import { isEmpty } from 'lodash';

    export default {
        name: "ObjectRoute",
        components: {
            vueCustomScrollbar
        },
        props: {
            data: {
                name: String,
                image: String,
                description: HTMLBaseElement,
            }
        },
        computed: {
            settings() {
                return {
                    wheelPropagation: false,
                    maxScrollbarLength: 270,
                }
            },
            image() {
                if (isEmpty(this.data.images)) {
                    return null;
                }
                return this.data.images[0]
            }
        }
    }
</script>

<style lang="less">
    @import "../recomended-route/styles";

    .text-description {
        .text();
        margin-top: 30px;

    }


</style>
