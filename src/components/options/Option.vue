<template>
    <div class="option">
        <div class="option__label">{{label}}</div>
        <div class="option__value" :class="{'long': isLongText}">{{value}}</div>
    </div>
</template>

<script>
    export default {
        name: "Option",
        props: {
            label: String,
            value: String,
            isLongText: Boolean,
        }
    }
</script>

<style lang="less" scoped>
    @import "../../styles/vars";

    .option {
        width: 100%;
        margin-bottom: 15px;
        padding-right: 15px;
        &__label {
            color: @emptyText;
            margin-bottom: 7px;
        }
        &__value {
            font-size: 24px;
            &.long {
                font-size: 16px;
            }
        }
    }
</style>