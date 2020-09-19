<template>
    <div class="file">
        <img :src="`https://api.zhivoe-nasledie.ga/${fileData.url}`" alt="" v-if="fileData && fileData.type === 'images'">
    </div>
</template>

<script>
    export default {
        name: "file",
        props: {
            fileData: {
                type: [String, Object],
                base64: String,
                url: String,
            }
        }
    }
</script>

<style scoped>

</style>