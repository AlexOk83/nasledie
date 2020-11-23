<template>
    <div>
        <Preloader
            v-show="viewPreloader"
        />
        <Modals />
        <div class="container">
            <router-view />
        </div>
    </div>
</template>

<script>
    import Preloader from './components/preloader';
    import Modals from './components/modals/modals';
    export default {
        components: {
            Preloader,
            Modals,
        },
        computed: {
            viewPreloader() {
                return this.$store.getters.viewPreloader
            },
            getUserId() {
              return document.getElementById('app').getAttribute('data-user-id');
            }
        },
        created() {
            this.$store.dispatch('getDataRegions');
            this.$store.dispatch('getDataTags');
            this.$store.dispatch('getDataTypes');
            this.$store.dispatch('aUserId', this.getUserId);
            console.log(this.getUserId);
        }
    }
</script>

<style lang="less">
    @import "./styles/layout.less";
</style>