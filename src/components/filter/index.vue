<template>
    <div class="filter">
        <div class="filter__item">
            <Field name="type-movement"
                   type="select"
                   title="Расположение"
                   placeholder="Регионы"
                   :value="typeRegion"
                   :list-value="listTypesRegion"
            />
            <div class="filter__item--subtitle">
                Выбранные регионы:
            </div>
            <div class="filter__select">
                <div class="filter__selectItem">
                    <div class="filter__selectItem--title">
                        <span class="icon  icon-circle"></span>
                        Краснадарский край
                        <span class="icon  icon-delete"></span>
                    </div>
                </div>
                <div class="filter__selectItem">
                    <div class="filter__selectItem--title">
                        <span class="icon  icon-circle"></span>
                        Самарский край
                        <span class="icon  icon-delete"></span>
                    </div>
                </div>
            </div>
        </div>
        <div class="filter__item">
            <Field name="type-movement"
                   type="select"
                   title="Способ передвижения"
                   placeholder="способ передвижения"
                   :value="typeMovement"
                   :list-value="listTypesMovement"
            />
            <div class="filter__item--subtitle">
                Выбранные способы:
            </div>
            <div class="filter__select">
                <div class="filter__selectItem">
                    <div class="filter__selectItem--title">
                        <span class="icon icon--people"></span>
                        Пеший
                        <span class="icon  icon-delete"></span>
                    </div>
                </div>
                <div class="filter__selectItem">
                    <div class="filter__selectItem--title">
                        <span class="icon  icon--car"></span>
                        Автомобильный
                        <span class="icon  icon-delete"></span>
                    </div>
                </div>
            </div>
        </div>
        <div class="filter__item">

            <Field name="type-movement"
                   type="select"
                   title="Типы маршрута"
                   placeholder="Типы"
                   :value="type"
                   :list-value="listTypesType"
            />
            <div class="filter__item--subtitle">
                Выбранные типы:
            </div>
            <div class="filter__select">
                <div class="filter__selectItem">
                    <div class="filter__selectItem--title">
                        <span class="icon icon--tag"></span>
                        Кольцевой
                        <span class="icon  icon-delete"></span>
                    </div>
                </div>
                <div class="filter__selectItem">
                    <div class="filter__selectItem--title">
                        <span class="icon  icon--tag"></span>
                        Горный
                        <span class="icon  icon-delete"></span>
                    </div>
                </div>
                <div class="filter__selectItem">
                    <div class="filter__selectItem--title">
                        <span class="icon  icon--tag"></span>
                        Прогулочный
                        <span class="icon  icon-delete"></span>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import Field from "../form-control/Field";

    export default {
        components: {
            Field,
        },
        data() {
            return {
                typeMovement: '',
                typeRegion: '',
                type: '',
                listTypesMovement: [
                    {name: 'Пеший', value: 'people', icon: 'people'},
                    {name: 'Автомобильный', value: 'car', icon: 'car'}
                ],
                listTypesRegion: [
                    {name: 'Московская область', value: 'moscow', icon: false},
                    {name: 'Пензинский район', value: 'penza', icon: false},
                    {name: 'Краснадарский край', value: 'penza', icon: false}
                ],
                listTypesType: [
                    {name: 'Кольцевой', value: '0', icon: false},
                    {name: 'Горный', value: '1', icon: false},
                    {name: 'Прогулочный', value: '2', icon: false}
                ],
            }
        },
    }
</script>

<style lang="less">
    @import "../../styles/layout";
    .filter{
        display: flex;
        flex-wrap: wrap;
        width: 100%;
        background: @greFilter;
        border-radius: 20px;
        .media_desktop({
            margin-bottom: 40px;
        });
        .media_device({
            margin-bottom: 20px;
        });
        .media_mobile({
            margin-bottom: 20px;
        });
        &__item {
            .column(4,4,12,12);
            .media_desktop({
                padding: 38px;
            });
            .media_tablet({
                padding: 25px;
            });
            .media_mobile({
                padding: 15px;
            });
            .field__label {
                color: @colorLink;
            }
            &--subtitle {
                font-size: 10px;
                line-height: 12px;
                color: @greySubtitle;
            }
        }
        &__select {
            .media_desktop({
                margin-top: 30px;
            });
            .media_mobile({
                margin-top: 20px;
            });
            &Item {
                margin-top: 20px;
                position: relative;
                .icon-delete {
                    position: absolute;
                    top: 0px;
                    right: 0px;
                    width: 25px;
                    height: 25px;
                    background-size: contain;
                    background-position: center;
                    background-repeat: no-repeat;
                    background-image: url("/src/assets/images/icons/delete-white.svg");
                    cursor: pointer;
                }
                &--title {
                    padding-left: 30px;
                }
                .icon--people {
                    background-image: url("/src/assets/images/icons/man_base.svg");
                    background-repeat: no-repeat;
                    position: absolute;
                    width: 12px;
                    height: 17px;
                    left: 0px;
                }
                .icon--car {
                    background-image: url("/src/assets/images/icons/car_base.svg");
                    background-repeat: no-repeat;
                    position: absolute;
                    width: 17px;
                    height: 14px;
                    left: 0px;
                }
                .icon-circle {
                    position: absolute;
                    left: 0px;
                    top: 6px;
                    width: 7px;
                    height: 7px;
                    border-radius: 7px;
                    background: @colorLink;
                }
                .icon--tag {
                    position: absolute;
                    left: 0;
                    top: 0;
                    width: 7px;
                    height: 7px;
                    &:before {
                        content: "#";
                        width: 100%;
                        height: 100%;
                        color: @colorLink;
                    }
                }
            }
        }
    }
</style>