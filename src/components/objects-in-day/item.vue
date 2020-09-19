<!-- рендер одного объекта - готово! -->
<template>
    <div>
        <div class="body-object">
            <div class="title">
                <Icon icon="object" />
                <span>{{ data.name }}</span>
            </div>
            <div class="gray-label">Время на объекте:</div>
            <MinutePicker
                    :value="time"
                    @change="changeTime"
            />
            <div class="btn-up" v-if="!isFirst" @click="up" />
            <div class="btn-down" v-if="!isLast" @click="down" />
            <div class="btn-remove" @click="remove" />
        </div>
        <div v-if="dataNextItem" class="body-object">
            <div class="title">
                <Icon icon="way" />
                <span>Путь до "{{ dataNextItem.name }}"</span>
            </div>
            <div class="gray-label">Время и расстояние:</div>
            <div class="icon-container">
                <Icon icon="time" />
                <span>{{ timeInWay }}</span>
            </div>
            <div class="icon-container">
                <Icon icon="way" />
                <span>{{way}}</span>
            </div>
            <div class="gray-label">Способ передвижения:</div>
            <Field name="typeMovement"
                   type="select"
                   placeholder="Не выбран"
                   :value="dataNextItem.typeMovement && dataNextItem.typeMovement[0]"
                   :list-value="listTypesMovement"
                   :save="config"
            />
            <div class="gray-label">Добавить остановку:</div>
            <MinutePicker
                    :value="dataNextItem.stopTime"
                    @change="changeStopTime"
            />
        </div>
    </div>
</template>

<script>
    import Icon from '../icon';
    import { Presenter} from "../../presenter";
    import MinutePicker from "../form-control/MinutePicker";
    import Field from "../form-control/Field";
    import {typesOfMovement} from "../../constants";
    const presenter = new Presenter();

    export default {
        name: "item",
        props: {
            data: {
                name: String,
                time: Number
            },
            dataNextItem: {
                name: String,
                timeInWay: Number,
                way: Number,
                typeMovement: Array,
                StopTime: String,
            },
            isFirst: Boolean,
            isLast: Boolean,
            clickUp: Function,
            clickDown: Function,
            clickRemove: Function
        },
        components: {
            MinutePicker,
            Icon,
            Field
        },
        data() {
            return {
                time: this.data.time,
                listTypesMovement: typesOfMovement
            }
        },
        computed: {
            timeInWay() {
                return presenter.getTime(this.dataNextItem.timeInWay)
            },
            way() {
                return presenter.getWay(this.dataNextItem.way)
            },
            config() {
                return {
                    editTitle: 'Изменить',
                    viewSaveButton: false,
                    method: this.changeTypeMovement
                }
            }
        },
        methods: {
            changeTypeMovement(e) {
                console.log('all works!!')
                this.$emit('change', {
                    field: 'typeMovement',
                    nextItem: true,
                    value: e
                })
            },
            changeTime(e) {
                this.$emit('change', {
                    field: 'time',
                    nextItem: false,
                    value: e
                })
            },
            changeStopTime(e) {
                this.$emit('change', {
                    field: 'stopTime',
                    nextItem: true,
                    value: e
                })
            },
            up() {
                this.clickUp && this.clickUp();
            },
            down() {
                this.clickDown && this.clickDown();
            },
            remove() {
                this.clickRemove && this.clickRemove();
            },
        }
    }
</script>

<style lang="less" >
    @import "../../styles/mixins";
    .body-object {
        background-color: @greyButton;
        border-radius: 10px;
        margin-bottom: 15px;
        padding: 15px;
        padding-right: 55px;
        min-height: 140px;
        position: relative;
        .title,
        .icon-container {
            position: relative;
            padding-left: 30px;
            margin-bottom: 10px;
            .icon {
                top: 5px;
                background-color: @base;
            }
        }
        .title  {
            margin-bottom: 25px;
            span {
                font-size: 20px;
                line-height: 30px;
                font-weight: 500;
            }
        }
        .icon-container span {
            line-height: 30px;
        }
        .gray-label {
            font-size: 12px;
            color: @greySubtitle;
        }
        .col {
            width: 50%;
            .column_padding();

        }
    }
    .btn-up {
        width: 30px;
        height: 30px;
        border-radius: 50%;
        position: absolute;
        cursor: pointer;
        background-image: url("/src/assets/images/icons/down.svg");
        background-position: center;
        background-size: contain;
        transform: rotate(180deg);
        top: 15px;
        right: 15px;
        &:active {
            transform: rotate(180deg) scale(0.9);
        }
    }
    .btn-down {
        width: 30px;
        height: 30px;
        border-radius: 50%;
        position: absolute;
        cursor: pointer;
        background-image: url("/src/assets/images/icons/down.svg");
        background-position: center;
        background-size: contain;
        bottom: 15px;
        right: 15px;
        &:active {
            transform: scale(0.9);
        }
    }
    .btn-remove {
        width: 30px;
        height: 30px;
        border-radius: 50%;
        position: absolute;
        cursor: pointer;
        background-image: url("/src/assets/images/icons/trash2.svg");
        background-position: center;
        background-size: contain;
        top: 50%;
        margin-top: -15px;
        right: 15px;
        &:active {
            transform: scale(0.9);
        }
    }
</style>