<template>
    <div class="overlay-modals" @click="close" v-show="view">
        <div class="modal" :class="{'active': view}">
            <div class="modal__header">
                <div class="modal__header-title">{{ title }}</div>
                <div class="close" @click="close" />
            </div>
            <div class="modal__text" v-if="text">
                {{ text }}
            </div>
            <div class="modal__footer" v-if="typeModal === 'confirm'">
                <Button text="Подтвердить"
                        :on-click="confirm"
                        is-shadow
                />
                <Button text="Отмена"
                        :on-click="close"
                        color="white"
                        is-shadow
                />
            </div>
        </div>
    </div>
</template>

<script>
    import Button from "../form-control/button/button";

    export default {
        name: "modals",
        components: {
            Button,
        },
        computed: {
            isConfirm() {
                return  this.typeModal === 'confirm';
            },
            isSuccess() {
                return  this.typeModal === 'success';
            },
            title() {
                if (this.isConfirm) {
                    return "Предупреждение"
                } else if (this.isSuccess) {
                    return "Готово"
                }
            },
            view() {
                return this.$store.getters.view
            },
            text() {
                return this.$store.getters.text
            },
            onConfirm() {
                return this.$store.getters.onConfirm
            },
            typeModal() {
                return this.$store.getters.typeModal
            },
        },
        methods: {
            close() {
                this.$store.dispatch('hideModal');
            },
            confirm() {
                this.onConfirm();
                setTimeout(() => {
                    this.$store.dispatch('hideModal');
                }, 100)

            }
        }
    }
</script>

<style lang="less">
    @import './styles';
</style>