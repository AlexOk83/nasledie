<template>
    <div class="icon" :class="'icon--' + icon" />
</template>

<script>
    export default {
        name: "icon",
        props: {
            icon: String
        }
    }
</script>

<style scoped lang="less">
    @import "../../../styles/mixins";
    .mask(@image) {
        -webkit-mask: url("/src/assets/images/icons/@{image}.svg") no-repeat 100% 100%;
        mask: url("/src/assets/images/icons/car.svg") no-repeat 100% 100%;
        -webkit-mask-size: contain;
        mask-size: cover;
        background: @greyIcon;
    }

    .icon {
        position: absolute;
        top: 7px;
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
    }
</style>