<template>
    <div class="radio-buttons">
        <div class="radio-item" v-for="item in variantList">
            <label :for="item.value">{{ item.name }}</label>
            <input type="radio"  v-model="value" :id="item.value" :value="item.value" :name="name">
        </div>
    </div>
</template>

<script>
    export default {
        name: "radio-buttons",
        props: {
            name: String,
            value: String,
            variantList: Array,
        }
    }
</script>

<style scoped>

</style>