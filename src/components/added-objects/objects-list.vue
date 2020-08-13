<template>
    <div class="object-list">
        <div class="label" v-if="list.length > 0">Выбранные объекты:</div>
        <li v-for="item, index in list" @click="removeObject(index)">{{ item.name }}</li>
    </div>
</template>

<script>
    export default {
        name: "object",
        props: {
            list: Array,
        },
        methods: {
            removeObject(id) {
                this.$emit('remove', id)
            }
        }
    }
</script>

<style lang="less">
    @import "./styles";
</style>