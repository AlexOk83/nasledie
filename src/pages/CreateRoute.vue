<template>
    <div>
        <h1>Составить маршрут пользователя</h1>
        <div class="row">
            <div class="left-form">
                <form>
                    <Field name="name" type="text" title="Название маршрута" placeholder="Название маршрута" />
                    <Field name="description" type="longtext" title="Описание маршрута" placeholder="Описание маршрута" />
                    <Field name="start-point" type="text" title="Точка старта" placeholder="Поиск мест и адресов" />
                    <Field name="end-point" type="text" title="Точка назначения" placeholder="Поиск мест и адресов" />
                    <Field name="date-start" type="date" title="Дата старта" placeholder="00.00.0000" />
                    <Field name="time-start" type="time" title="Время старта" value="22:30" />
                </form>
            </div>
            <div class="right-container">
                <div id="map" />
            </div>
        </div>
    </div>
</template>

<script>

    import Field from "../components/formControl/Field";

    export default {
        name: "CreateRoute",
        components: {
            Field,
        }
    }
</script>

<style lang="less">
    @import "../styles/mixins";

    .left-form {
        .column(4, 4);
        .column_padding();
    }
    .right-container {
        .column(8, 8);
        .column_padding();
    }
    #map {
        .img_wrapper(100%);
        background-color: grey;
    }
</style>