<template>
    <div class="overlay">
        <div class="sk-chase">
            <div class="sk-chase-dot"></div>
            <div class="sk-chase-dot"></div>
            <div class="sk-chase-dot"></div>
            <div class="sk-chase-dot"></div>
            <div class="sk-chase-dot"></div>
            <div class="sk-chase-dot"></div>
        </div>
    </div>
</template>

<script>
    export default {
        name: "preloader"
    }
</script>

<style lang="less">
    @import "../styles/spinners";
    .overlay {
        position: fixed;
        z-index: 2000;
        width: 100%;
        height: 100%;
        display: flex;
        background-color: rgba(black, 0.2);
        .sk-chase {
            margin: auto;
        }
    }
</style>