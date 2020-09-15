<template>
    <div class="file">
        <img :src="fileData.base64" alt="" v-if="fileData && fileData.type === 'images'">
    </div>
</template>

<script>
    export default {
        name: "file",
        props: {
            fileData: {
                type: [String, Object],
                base64: String,
            }
        }
    }
</script>

<style scoped>

</style>