<template>
    <div class="route">
        <div class="route__image">
            <img :src="data.image" :alt="data.title" >

        </div>
        <div class="route__body">
            <div class="title">{{ data.name }}</div>
            <div class="text-description">{{ data.description }}</div>
        </div>
    </div>

</template>

<script>
    import {Presenter} from "../../presenter";

    const presenter = new Presenter();
    export default {
        name: "ObjectRoute",
        props: {
            data: {
                title: String,
                description: String,

            }
        },
        created() {
            this.getData();
        },
        methods: {
            getData() {

            }
        }
    }
</script>

<style lang="less">
    @import 'styles';

</style>
