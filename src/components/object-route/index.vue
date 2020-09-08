<!-- вывод объектов в просмотре - готово! -->
<template>
    <div class="route">
        <div class="route__image">
            <img :src="data.image" :alt="data.name" >
        </div>
        <div class="route__body">
            <div class="title">{{ data.name }}</div>
            <div class="text-description">{{ data.description }}</div>
        </div>
    </div>

</template>

<script>
    export default {
        name: "ObjectRoute",
        props: {
            data: {
                name: String,
                image: String,
                description: String,
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
