<template>
    <div class="my-route">
        Мой {{ data.title }}
    </div>
</template>

<script>
    export default {
        name: "my-route",
        props: {
            data: {
                title: String,
                description: String,
            }
        },
    }
</script>

<style lang="less">
    @import 'styles';
</style>