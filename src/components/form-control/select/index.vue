<template>
    <div class="select">
        <select :name="name" :id="name">
            <option :value="option.value" v-for="option in list" :disabled="option.disabled">{{ option.name }}</option>
        </select>

    </div>
</template>

<script>
    export default {
        name: "index",
        props: {
            value: String,
            list: Array,
            name: String,
            placeholder: String,
        }
    }
</script>

<style scoped>

</style>