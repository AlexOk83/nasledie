<template>
    <div class="swiper" v-if="files && files.length > 0">
        <Swiper ref="mySwiper" :options="swiperOptions">
            <swiper-slide v-for="imageFile in files" :key="imageFile.id">
                <File :fileData="imageFile" />
            </swiper-slide>
            <div class="swiper-pagination" slot="pagination" />
        </Swiper>
    </div>
</template>
<script>
    import { Swiper, SwiperSlide } from 'vue-awesome-swiper'
    import File from './file'
    export default {
        name: "slider",
        props: {
            files: Array,
        },
        components: {
            Swiper,
            SwiperSlide,
            File
        },
        data() {
            return {
                swiperOptions: {
                    spaceBetween: 30,
                    pagination: {
                        el: '.swiper-pagination',
                        clickable: true
                    }
                }
            }
        },
    }
</script>

<style lang="less">
    @import './styles';
</style>