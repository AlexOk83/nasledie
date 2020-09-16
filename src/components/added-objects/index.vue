<!-- Добавление объекта - готово! -->
<template>
    <div class="objects">
        <Form-add
                :objects="currentObjects"
                @add="add"
        />
        <List
            :list="currentObjects"
            @remove="remove"
        />
    </div>
</template>

<script>
    import FormAdd from './form-add';
    import List from './objects-list';

    export default {
        name: "added-objects",
        props: {
            objects: Array,
        },
        data() {
            return {
                currentObjects: [],
            }
        },
        components: {
            FormAdd,
            List
        },
        watch: {
            objects() {
                this.currentObjects = this.objects;
            }
        },
        methods: {
            add(event) {
                this.currentObjects.push(event);
                this.$emit('change', this.currentObjects); // при добавлении и удалении мы эмитим родителю актуальный список объектов
            },
            remove(event) {
                this.currentObjects.splice(event, 1);
                this.$emit('change', this.currentObjects);
            }

        }
    }
</script>

<style lang="less">
    @import "../../styles/vars";



</style>
