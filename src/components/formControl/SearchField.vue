<template>
    <div class="search-field">
        <input type="text" class="field_control" v-model="value" :placeholder="placeholder">
        <div class="clear-button" @click="clear"/>
    </div>

</template>

<script>
    export default {
        name: "SearchField",
        props: ['value', 'name', 'placeholder'],
        data() {
            return {

            }
        },
        methods: {
            clear() {
                this.value = ''
            }
        }
    }
</script>

<style lang="less">
    @import '../../styles/mixins';

    .search-field {
        position: relative;
        width: 100%;
        .field_control {
            .form-control-style();
        }
    }
    .clear-button {
        position: absolute;
        top: 9px;
        right: 20px;
        width: 18px;
        height: 18px;
        .bg(12px);
        background-image: url('../../assets/images/icons/close.svg');
        z-index: 2;
    }

</style>