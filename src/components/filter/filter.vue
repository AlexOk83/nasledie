<!-- фильтр - готово! -->
<template>
    <div>
        <div class="filter" v-if="showFilter">
            <div class="filter__row">
                <FilterItem
                        title="Расположение"
                        list-title="выбранные регионы:"
                        :list-value="listRegions"
                        placeholder="Регионы"
                        icon="way"
                        @change="changeListRegions"
                />
            </div>
            <div class="filter__row">
                <FilterItem
                        title="Способ передвижения"
                        list-title="выбранные способы:"
                        :list-value="listTypesOfMovement"
                        placeholder="Способы"
                        @change="changeListTypes"
                />
            </div>
            <div class="filter__row">
                <FilterItem
                        title="Тип маршрута"
                        list-title="выбранные типы:"
                        :list-value="listTags"
                        placeholder="Типы #"
                        icon="tag"
                        @change="changeListTags"
                />
            </div>
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
    import {isEmpty} from "lodash";

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
            }
        },
        computed: {
            showFilter() {
                return !isEmpty(this.listRegions) && !isEmpty(this.listTags)
            },
            listTypesOfMovement() {
                return typesOfMovement;
            },
            listRegions() {
                return this.$store.getters.getRegions;
            },
            listTags() {
                return this.$store.getters.getTags;
            }
        },
        methods: {
            handleFilter() {
                this.$emit('filter', {
                    regions: this.regions,
                    typesOfMovement: this.typesMovement,
                    tags: this.tags
                });
            },
            changeListRegions(list) {
                this.regions = list.map(r => (r.value));
            },
            changeListTypes(list) {
                this.typesMovement = list.map(t => (t.value));
            },
            changeListTags(list) {
                this.tags = list.map(t => (t.id));
            },
        },
    }
</script>

<style lang="less">
    @import "../../styles/mixins";
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
        &__row {
            .column(4,4,12,12);
        }
        .filter__item {
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
        }
    }
</style>