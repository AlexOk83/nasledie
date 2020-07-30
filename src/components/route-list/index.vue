<template>
    <div class="list">
        <div class="list__row">
            <div class="list__item" :class="{}" v-for="item in data">
                <RecomendedRoute v-if="isRecomended" :data="item" />
                <MyRoute v-else :data="item" />
            </div>
        </div>
    </div>
</template>

<script>
    import RecomendedRoute from '../recomended-route'
    import MyRoute from '../my-route'

    export default {
        name: "List",
        components: {
            RecomendedRoute,
            MyRoute
        },
        props: {
            data: Array,
            config: {
                maxCount: Number,
                colDesktop: Number,
                colTablet: Number
            },
            isRecomended: Boolean
        }
    }
</script>

<style lang="less">
    @import "./styles.less";

</style>