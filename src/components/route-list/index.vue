<!-- общий компонент для вывода списков маршрутов и объектов - готово! -->
<template>
    <div class="list">
        <div class="row">
            <div class="list__item" :class="itemClasses" v-for="item in data">
                <RecomendedRoute v-if="isRecomended" :data="item" />
                <ObjectRoute v-else-if="isObject" :data="item" />
                <MyRoute v-else :data="item" :on-refresh="onRefresh" />
            </div>
        </div>
    </div>
</template>

<script>
    import RecomendedRoute from '../recomended-route'
    import MyRoute from '../my-route'
    import ObjectRoute from '../object-route/index'

    export default {
        name: "List",
        components: {
            RecomendedRoute,
            MyRoute,
            ObjectRoute
        },
        props: {
            data: Array,
            onRefresh: Function,
            config: {
                maxCount: Number,
                colDesktop: Number,
                colTablet: Number
            },
            isRecomended: Boolean,
            isObject: Boolean
        },
        computed: {
            itemClasses() {
                const { colDesktop, colTablet } = this.config;
                const desktop = colDesktop ? `col-xl-${12 / colDesktop}` : 'col-xl-12';
                const tablet = colTablet ? `col-l-${12 / colTablet}` : 'col-l-12';
                return [
                    desktop,
                    tablet
                ]
            }
        }
    }
</script>

<style lang="less">
    @import "./styles.less";

</style>