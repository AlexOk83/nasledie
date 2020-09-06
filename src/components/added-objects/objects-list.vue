<template>
    <div class="object-list">
        <div class="label" v-if="list.length > 0">Выбранные объекты:</div>
        <li v-for="(item, index) in list" >
            {{ item.name }}
            <span class="icon icon-delete" @click="removeObject(index)" />
        </li>

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
    @import "../../styles/vars";
    .object-list {
        margin-bottom: 20px;
        .label {
            font-size: 14px;
            line-height: 16px;
            color: @blackText;
            margin-bottom: 10px;
        }
        li {
            position: relative;
            font-size: 12px;
            line-height: 14px;
            color: @blackText;
            margin-bottom: 20px;
        }
        .icon-delete {
            position: absolute;
            top: -15px;
            right: 0px;
            width: 30px;
            height: 39px;
            background-size: contain;
            background-position: center;
            background-repeat: no-repeat;
            background-image: url("/src/assets/images/icons/delete-gray.svg");
            cursor: pointer;
        }
    }

</style>
