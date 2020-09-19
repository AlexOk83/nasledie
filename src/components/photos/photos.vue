<!-- добавление изображений - готово! -->
<template>
    <div class="photos">
        <div class="photos__label">Загрузить фото к маршруту</div>
        <input class="file" type="file" id="photo" @change="load" :disabled="maxCount && files && maxCount === files.length">
        <label for="photo" class="button button--color-white button--full button--with-icon button--shadow" :class="{'button--disabled': maxCount && files && maxCount === files.length}">
            <Icon icon="load" />
            <span>Загрузить с компьютера</span>
        </label>
        <div class="photos-list">
            <draggable class='list' v-model="files" draggable=".photos__item" @change="drag">
                <div class="photos__item" v-for="(photo, index) in files" :key="'file-' + index">
                    <div class="wrapper">
                        <img :src="photo.base64 || `https://api.zhivoe-nasledie.ga/${photo.url}`">
                    </div>
                </div>
                <div class="other-wrapper" v-for="item in addButton" :key="'button-' + item">
                    <label for="photo" class="add-photo" />
                </div>
                <div class="other-wrapper" key="remove" v-if="files.length > 0">
                    <div class="remove" @click="remove"/>
                </div>
            </draggable>
        </div>
    </div>
</template>

<script>
    import Icon from '../icon';
    import draggable from 'vuedraggable'

    export default {
        name: "Photos",
        props: {
            photos: Array,
            maxCount: Number
        },
        components: {
            Icon,
            draggable
        },
        data() {
            return {
                files: this.photos,
                content: '',
                file: null,
            }
        },
        computed: {
            createdPhoto() {

            },
            addButton() {
                const l = this.files && this.files.length || 0;
                if (this.maxCount) {
                    return this.maxCount - l
                }
                const o = l % 3;
                if (o === 1) {
                    return 4;
                }
                if (o === 2) {
                    return 3
                }
                return 2;
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
                });
                this.$emit('change', this.files)
            },
            remove() {
                const index = this.files.length - 1;
                this.files.splice(index, 1);
                this.$emit('change', this.files)
            },
            drag() {
                this.$emit('change', this.files)
            }
        },
        watch: {
            photos() {
                this.files = this.photos
            }
        },
        created() {
            this.files = this.photos
        }
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
                    background-image: url("/src/assets/images/icons/plus.svg");
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
                    background-image: url("/src/assets/images/icons/trash.svg");
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