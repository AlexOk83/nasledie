<template>
    <div class="photos">
        <div class="photos__label">Загрузить фото к маршруту</div>
        <input class="file" type="file" id="photo" @change="load">
        <label for="photo" class="button button--color-white button--full button--with-icon button--shadow">
            <Icon icon="load" />
            <span>Загрузить с компьютера</span>
        </label>
        <div class="photos-list">
            <!-- загруженные фотографии ранее -->
            <draggable v-model="files" draggable=".photos__item">
                <transition-group class='list'>
                    <div class="photos__item" v-for="(photo, index) in files" :key="photo.file.name">
                        <div class="wrapper">
                            <img :src="photo.base64" alt="">
                        </div>
                    </div>
                    <div class="other-wrapper" v-for="item in addButton" :key="item">
                        <label for="photo" class="add-photo" />
                    </div>
                    <div class="other-wrapper" key="remove" v-if="files.length > 0">
                        <div class="remove" @click="remove"/>
                    </div>

                </transition-group>
            </draggable>
        </div>
    </div>
</template>

<script>
    import Icon from '../icon';
    import draggable from 'vuedraggable'

    export default {
        name: "Fotos",
        props: {},
        components: {
            Icon,
            draggable
        },
        data() {
            return {
                files: [],
                content: '',
                file: null,

            }
        },
        computed: {
            addButton() {
                const l = this.files && this.files.length || 0;
                const o = l % 3;
                console.log(o); // 1, 2 ,0
                if (o === 1) {
                    return 1 + 3;
                }
                if (o === 2) {
                    return 3
                }
                return 2 + 3;
            }
        },
        methods: {
            load(e) {
                e.preventDefault()
                this.file = e.target.files[0];
                let reader = new FileReader();
                reader.onload = this.readImage;
                if ( /\.(jpe?g|png|gif)$/i.test( this.file.name ) ) {
                    reader.readAsDataURL( this.file );
                }



            },
            readImage(e) {
                this.content = e.target.result;
                this.files.push({
                    type: 'images',
                    base64: this.content,
                    file: this.file
                });
            },
            remove() {
                const index = this.files.length - 1;
                this.files.splice(index, 1);
            }
        },
    }
</script>

<style lang="less">
    @import "../../styles/mixins";
    .photos {
        &__label {
            display: block;
            font-weight: 500;
            margin-bottom: 15px;
        }
        .file {
            width: 0;
            height: 0;
            opacity: 0;
            position: absolute;
            z-index: -1;
        }
        .button {
            border: 1px solid @base;
            .icon {
                background: @base;
            }
        }
    }
    .photos-list {
        .list {
            display: flex;
            flex-wrap: wrap;
            margin-right: -10px;
            margin-left: -10px;
            margin-bottom: 20px;
            .photos__item {
                margin-bottom: 15px;
                .column(4,4,4);
                .column_padding(10px);
                .wrapper {
                    border-radius: 10px;
                    .img_wrapper(70%);
                }
            }
            .other-wrapper {
                margin-bottom: 15px;
                align-items: center;
                align-content: center;
                .column(4,4,4);
                .column_padding(10px);
                display: flex;
                .add-photo {
                    display: block;
                    .img_wrapper(70%);
                    background-color: @greyButton;
                    background-image: url("../../assets/images/icons/plus.svg");
                    background-repeat: no-repeat;
                    background-position: center;
                    background-size: 14px;
                    border-radius: 10px;
                    cursor: pointer;
                }
                .remove {
                    margin: auto;
                    width: 60px;
                    height: 60px;
                    border-radius: 50%;
                    background-color: @greyButton;
                    background-image: url("../../assets/images/icons/trash.svg");
                    background-repeat: no-repeat;
                    background-position: center;
                    background-size: 30px;
                    cursor: pointer;
                    &:before {
                        content: '';

                    }
                }
            }
        }
    }
</style>