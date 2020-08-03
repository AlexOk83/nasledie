<template>
    <div class="date-picker">
        <vuejs-datepicker
                :language="ru"
                :name="name"
                format="dd.MM.yyyy"
                monday-first
                :placeholder="placeholder"
                :value="value"
                calendar-class="date-picker__calendar"
                input-class="date-picker__input"
                wrapper-class="date-picker__wrap"
        />
    </div>
</template>

<script>
    import vuejsDatepicker from 'vuejs-datepicker'
    import ru from 'vuejs-datepicker/dist/locale/translations/ru'

    export default {
        name: "DatePicker",
        props: ['name', 'value', 'placeholder'],
        data() {
          return {
              ru,
          }
        },
        components: {
            vuejsDatepicker
        }

    }
</script>

<style lang="less">
    @import '../../styles/mixins';

    .date-picker {
        max-width: 220px;
        position: relative;
        &:after {
            content: '';
            display: block;
            .arrow(16px, 15px, 'down');
            z-index: 0;
        }
        .date-picker__input {
            .form-control-style();
            position: relative;
            background: transparent;
        }
        .date-picker__calendar {
            margin-top: 12px;
            border-radius: 20px;
            border: 1px solid @base;
            max-width: 220px;

            &>div {
                padding: 0 15px 13px;
            }
            header {
                display: flex;
                height: 28px;
                background-color: @base;
                border-radius: 20px 20px 0 0;
                padding: 0 15px;
                .prev {
                    &:after {
                        border-right: 7px solid white;
                    }
                    &:hover {
                        background-color: transparent !important;
                        transform: scale(1.2);
                        transform-origin: center;
                        &:after {

                        }
                    }
                }
                .next {
                    &:hover {
                        background-color: transparent !important;
                        transform: scale(1.2);
                        transform-origin: center;
                    }
                    &:after {
                        border-left: 7px solid white;
                    }
                }
                span {
                    color: white;
                    line-height: 14px;
                    padding-top: 7px;

                    &:hover {
                        background-color: @base !important;
                    }
                }
            }
            .cell {
                font-size: 12px;
                line-height: 30px;
                height: 30px;
                &.day-header {
                    &:hover {
                        border: none;
                    }
                }
                &:hover {
                    background: transparent;
                    border: 1px solid @base !important;
                    border-radius: 4px;
                }
                &.selected {
                    border: 1px solid @base;
                    border-radius: 2px;
                    background: transparent;
                    &:hover {
                        background: @base;
                    }
                }
                &.year {
                    &:nth-child(11) {
                        border-radius: 0 0 0 18px;
                    }
                }
                &.month {
                    &:nth-child(11) {
                        border-radius: 0 0 0 18px;
                    }
                    &:nth-child(13) {
                        border-radius: 0 0 18px 0;
                    }
                }
            }
        }
    }

</style>