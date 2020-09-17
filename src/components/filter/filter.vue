<!-- фильтр - не готово! -->
<!-- он не работает, нужно оптимизировать код -->
<template>
    <div>
        <div class="filter">
            <FilterItem
                    title="Расположение"
                    list-title="выбранные регионы:"
                    :list-value="listRegions"
                    placeholder="Регионы"
                    icon="way"
                    @change="changeListRegions"
            />
            <FilterItem
                    title="Способ передвижения"
                    list-title="выбранные способы:"
                    :list-value="listTypesOfMovement"
                    placeholder="Способы"
                    @change="changeListTypes"
            />
            <FilterItem
                    title="Тип маршрута"
                    list-title="выбранные типы:"
                    :list-value="listTags"
                    placeholder="Типы #"
                    icon="tag"
                    @change="changeListTags"
            />
        </div>

        <Button
                text="Выбрать маршруты"
                is-shadow
                :on-click="() => handleFilter()"
        />
    </div>
</template>

<script>
    import FilterItem from "./filter-item";
    import Button from '../form-control/button/button';
    import { typesOfMovement } from '../../constants';
    import Repository from "../../repository";
    const repository = new Repository();

    export default {
        components: {
            FilterItem,
            Button,
        },
        data() {
            return {
                typesMovement: [],
                regions: [],
                tags: [],
                listTags: [],
                listRegions: [],
            }
        },
        computed: {
            listTypesOfMovement() {
                return typesOfMovement;
            }
        },
        methods: {
            handleFilter() {

            },
            changeListRegions(list) {

            },
            changeListTypes(list) {

            },
            changeListTags(list) {

            },
            getData() {
                repository.getRegions()
                    .then(response => {
                        let regions = JSON.parse(response.data);
                        this.listRegions = regions.map(region => ({ ...region, value: String(region.value)}))
                    });
                repository.getTags()
                    .then(response => {
                        let tags = JSON.parse(response.data);
                        this.listTags = tags.map(tag => ({ ...tag, value: String(tag.name)}))
                    });
            }
        },
        created() {
            this.getData();
        }

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
                    position: relative;
                    .icon {
                        top: 0;
                    }
                    .icon--tag {
                        top: 4px;
                        &:before {
                            content: '#';
                        }
                    }
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