<template>
    <div class="objects">
        <Form
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
    import Form from './form-add';
    import List from './objects-list';

    export default {
        name: "index",
        props: {
            objects: Array,
        },
        data() {
            return {
                currentObjects: [],
            }
        },
        components: {
            Form,
            List
        },
        created() {
            this.currentObjects = this.objects || [];
        },
        methods: {
            add(event) {
                this.currentObjects.push(event)
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
    @import "./styles";
</style>