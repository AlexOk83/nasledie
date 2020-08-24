<template>
    <div class="icon" :class="'icon--' + icon" />
</template>

<script>
    export default {
        name: "icon",
        props: {
            icon: String,
        }
    }
</script>

<style scoped lang="less">
    @import "../styles/mixins";
    .mask(@image) {
        -webkit-mask-image: url("/src/assets/images/icons/@{image}.svg");
        mask-image: url("/src/assets/images/icons/@{image}.svg");

        -webkit-mask-repeat: no-repeat;
        mask-repeat: no-repeat;

        -webkit-mask-size: contain;
        mask-size: contain;

        -webkit-mask-position: center;
        mask-position: center;

        background: @greyIcon;
    }

    .icon {
        position: absolute;
        top: 8px;
        left: 0;
        width: 20px;
        height: 20px;
        .bg();

        &--car {
            .mask('car');
        }
        &--people {
            .mask('man_def');
        }
        &--time {
            .mask('clock');
        }
        &--way {
            .mask('marker');
        }
        &--object {
            .mask('object');
        }
        &--edit {
            .mask('edit');
        }
        &--check {
            .mask('check');
        }
    }
</style>