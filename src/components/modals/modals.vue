<template>
    <div v-show="view" class="modal__container">
        <div class="overlay-modals"  @click="close" />
        <div class="modal" :class="{'active': view, 'small': typeModal === 'map'}">
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
            <div class="modal__buttons" v-if="typeModal === 'map'">
                <Button text="Стартовая точка"
                        :on-click="() => addPoint('startPoint')"
                        is-full
                />
                <Button text="Точка остановки"
                        :on-click="() => addPoint('point')"
                        is-full
                />
                <Button text="Точка назначения"
                        :on-click="() => addPoint('endPoint')"
                        is-full
                />
            </div>
        </div>

    </div>
</template>

<script>
    import Button from "../form-control/button/button";
    import Radio from "../form-control/radio-buttons";

    export default {
        name: "modals",
        components: {
            Button,
            Radio
        },
        computed: {
            isConfirm() {
                return  this.onConfirm;
            },
            isSuccess() {
                return  this.typeModal === 'success';
            },
            title() {
                if (this.isConfirm) {
                    return "Предупреждение"
                }
                if (this.typeModal === 'map') {
                    return "Добавить точку в маршрут"
                }
                if (this.isSuccess) {
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
            onSuccess() {
                return this.$store.getters.onSuccess
            },
        },
        methods: {
            close() {
                this.onSuccess && this.onSuccess();
                setTimeout(() => {
                    this.$store.dispatch('hideModal');
                }, 100)

            },
            confirm() {
                this.onConfirm();
                this.close();

            },
            addPoint(typePoint) {
                this.onConfirm && this.onConfirm(typePoint);
                this.close();

            },
        }
    }
</script>

<style lang="less">
    @import './styles';
</style>