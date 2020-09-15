<!-- вывод объектов в просмотре - готово! -->
<template>
    <div class="route">
        <div class="route__image">
            <img :src="data.images[0]" :alt="data.name" >
        </div>
        <div class="route__body">
            <vue-custom-scrollbar class="scroll-area" :settings="settings" >
                <div class="title">{{ data.name }}</div>
                <div class="text-description">{{ data.description }}</div>
            </vue-custom-scrollbar>

        </div>
    </div>

</template>

<script>
    import vueCustomScrollbar from "vue-custom-scrollbar";

    export default {
        name: "ObjectRoute",
        components: {
            vueCustomScrollbar
        },
        props: {
            data: {
                name: String,
                image: String,
                description: String,
            }
        },
        computed: {
            settings() {
                return {
                    wheelPropagation: false,
                    maxScrollbarLength: 400,
                }
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
