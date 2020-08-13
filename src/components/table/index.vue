<template>

    <table class="tableDays">
        <thead>
        <th>День/старт/финиш</th>
        <th>Путь до объекта</th>
        <th>Способ передвижения</th>
        <th>Остановка</th>
        <th>Посещение объекта</th>
        </thead>
        <tbody>
        <template  v-for="day, index in days" >
            <tr class="day" :class="day.class">
                <td class="day__desc" :rowspan="day.objects.length + 1">
                    <div class="title blue">{{ day.title }}</div>

                    <div class="title--sub">Точка старта</div>
                    <div class="title">{{ day.pointStart.name }}</div>
                    <div class="title--sub">Дата старта</div>
                    <div class="title">{{ day.pointStart.date }}</div>
                    <div class="title--sub">Время старта</div>
                    <div class="title">{{ day.pointStart.time }}</div>

                    <div class="title--sub">Точка назначения</div>
                    <div class="title">{{ day.pointEnd.name }}</div>
                    <div class="title--sub">Дата старта</div>
                    <div class="title">{{ day.pointEnd.date }}</div>
                    <div class="title--sub">Время старта</div>
                    <div class="title">{{ day.pointEnd.time }}</div>
                </td>
            </tr>
            <tr v-for="object in day.objects">

                <td  class="day__object" v-for="param in object.params" >
                    <div class="title" v-if="param.title != ''">{{ param.title }}</div>
                    <div class="day__object--Param" v-for="attribute in param.attributes">
                        <span class="icon " :class="attribute.icon" />
                        <span>{{ attribute.title }}</span>
                    </div>
                </td>
            </tr>
        </template>

        </tbody>
    </table>
</template>


<script>

    export default {
        name: "Table",
        props: {
            days : [],
        },
    }
</script>
<style lang="less">
    @import "../../styles/mixins";

    .detailRouter {

        .tableDays {
            margin: 20px 0px;
            border-collapse: separate;
            width: 100%;
            thead {
                th {
                    padding: 20px;
                    color: @colorWhite;
                }
                th:first-child {
                    border-top-left-radius: 20px;
                }
                th:last-child {
                    border-top-right-radius: 20px;
                }
                background: @base;

            }

            tr:last-child {
                td:last-child {
                    border-bottom-right-radius: 20px;
                }

            }
            tr {
                width: 100%;

            }
            td {
                padding: 30px 20px;
                min-width: 150px;

            }

            .day {
                &__desc {
                    border-bottom: 1px solid @greyBorder;
                    border-right: 1px solid @greyBorder;
                    .title {
                        .tableTitle();
                        font-weight: bold;
                        margin-top: 3px;
                        &.blue {
                            color: @colorLink;
                            font-weight: normal;
                        }
                    }
                    .title--sub {
                        .text();
                        color: @greyBorder;
                    }
                }
                &__object {
                    border-bottom: 1px solid @greyBorder;
                    border-right: 1px solid @greyBorder;
                    .title {
                        .tableTitle();
                    }
                    &--Param {
                        padding-left: 30px;
                        position: relative;
                        margin-bottom: 10px;
                        .icon {
                            left: 0px;
                        }
                        span {
                            .text();
                            line-height: 17px;
                        }
                    }
                }
                &:nth-child(3n + 1) {
                    td {
                        border-left: 10px solid @base;
                    }
                }
                &:nth-child(3n + 2) {
                    td {
                        border-left: 10px solid @greenButton;
                    }
                }
                &:nth-child(3n + 3) {
                    td {
                        border-left: 10px solid @colorYellow;
                    }

                }

                &.last {
                    td {
                        border-bottom-left-radius: 20px;
                    }
                }
            }
        }
    }
</style>
