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
            handleClick(e) {
                e.stopPropagation();
                this.onClick && this.onClick();
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
    @import "./styles";
    @import "../../../styles/layout";

</style>
