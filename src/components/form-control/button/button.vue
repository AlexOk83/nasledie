<!-- кнопки - готово! -->
<template>
    <div class="bt" :class="buttonClasses" @click="handleClick">
        <div class="icon" :class="iconClasses"  v-if="icon" />
        <span>{{ text }}</span>
    </div>
</template>

<script>
    export default {
        name: "Button",
        props: {
            text: String,
            onClick: Function,
            isShadow: Boolean,
            isFull: Boolean,
            icon: String,
            iconRight: Boolean,
            color: String,
            disabled: Boolean,
        },
        computed: {
            buttonClasses() {
                const classes = [];
                if (this.color) {
                    classes.push(`bt--color-${this.color}`)
                }
                if (this.isShadow) {
                    classes.push('bt--shadow');
                }
                if (this.isFull) {
                    classes.push('bt--full');
                }
                if (this.icon) {
                    classes.push('bt--with-icon');
                }
                if (this.iconRight) {
                    classes.push('bt--right');
                }
                if (this.disabled) {
                    classes.push('bt--disabled');
                }
                return classes;
            },
            iconClasses() {
                return `icon--${this.icon}`;
            }
        },
        methods: {
            handleClick(e) {
                e.stopPropagation();
                !this.disabled && this.onClick && this.onClick();
            }
        },
    }
</script>

<style lang="less">
    @import "./styles";
</style>
