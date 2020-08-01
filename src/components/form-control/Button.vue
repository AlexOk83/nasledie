<template>
    <div
            class="button"
            @click="handleClick"
            :class="buttonClasses"
    >
        <div class="icon" :class="iconClasses"  v-if="icon" />
        {{ text }}
    </div>
</template>

<script>
    export default {
        name: "Button",
        props: {
            text: String,
            onClick: Function,
            isShadow: Boolean,
            icon: String,
            iconRight: Boolean,
            color: String,
        },
        methods: {
            handleClick() {
                this.onClick();
            }
        },
        computed: {
            buttonClasses() {
                const classes = [];
                if (this.color) {
                    classes.push(`button--color-${this.color}`)
                }
                if (this.isShadow) {
                    classes.push('button--shadow');
                }
                return classes;
            },
            iconClasses() {
                const isRight = this.iconRight ? 'icon--right' : '';
                return `icon--${this.icon} ${isRight}`;
            }
        }
    }
</script>

<style lang="less">
    @import "../../styles/vars";
    @import "../../styles/layout";
    .button {
        text-align: center;
        padding: 20px 30px;
        border-radius: 80px;
        cursor: pointer;
        font-size: 14px;
        color: white;
        text-transform: uppercase;
        position: relative;
        .media_mobile({
            padding: 15px 20px;
            font-size: 12px;
        });
        .media_tablet({
            padding: 15px 25px;
            font-size: 12px;
        });
        &--color-green {
            background: @greenButton;
            color: @colorWhite;
        }
        &--color-grey {
            background: @greyButton;
            color: @colorLink;
        }
        &--color-blue {
            background: @colorLink;
            color: @colorWhite;
        }
        &--shadow {
            .shadow();
        }
    }
</style>
