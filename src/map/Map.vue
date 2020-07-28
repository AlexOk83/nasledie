<template>
    <div id="map" />
</template>

<script>

    import Field from "../components/formControl/Field";

    export default {
        name: "Map",
        components: {
            Field,
        },
        props: ['from', 'to', 'points'],
        methods: {
            render: function() {
                const { from, to, points } = this;

                ymaps.ready(function () {
                    var myMap = new ymaps.Map('map', {
                        center: [55.753994, 37.622093],
                        zoom: 9,
                        // Добавим панель маршрутизации.
                        controls: ['routePanelControl']
                    });

                    var control = myMap.controls.get('routePanelControl');

                    // Зададим состояние панели для построения машрутов.
                    control.routePanel.state.set({
                        // Тип маршрутизации.
                        type: 'masstransit',
                        // Выключим возможность задавать пункт отправления в поле ввода.
                        fromEnabled: false,
                        // Адрес или координаты пункта отправления.
                        from,

                        toEnabled: false,
                        // Адрес или координаты пункта назначения.
                        to
                    });
                    // Зададим опции панели для построения машрутов.
                    control.routePanel.options.set({
                        // Запрещаем показ кнопки, позволяющей менять местами начальную и конечную точки маршрута.
                        allowSwitch: false,
                        // Включим определение адреса по координатам клика.
                        // Адрес будет автоматически подставляться в поле ввода на панели, а также в подпись метки маршрута.
                        reverseGeocoding: false,
                        // Зададим виды маршрутизации, которые будут доступны пользователям для выбора.
                        types: { masstransit: true, pedestrian: true, taxi: true }
                    });


                    // myMap.controls.add(switchPointsButton);
                });
            }
        },
        created() {
            this.render()
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
        height: 1000px;
    }
</style>
