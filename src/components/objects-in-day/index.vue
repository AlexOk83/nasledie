<!-- вывод объектов в днях - не готово! -->
<!-- только предстоит написать этот компонент  -->
<template>
    <div class="object-list-in-day">
        <Item v-for="item in localList" :data="item" />
    </div>
</template>

<script>
    import Item from './item';

    export default {
        name: "ObjectsInDay",
        components: {
            Item
        },
        props: {
            list: Array,
        },
        data() {
            return {
                localList: this.list
            }
        },
        watch: {
            list: function () {
                this.localList = this.list;
            }
        },
        computed: {

        },
        methods: {

        }
    }
</script>

<style lang="less">
    @import "styles";
</style>