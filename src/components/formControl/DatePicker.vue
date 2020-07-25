<template>
    <div class="date-picker">
        <vuejs-datepicker
                :language="ru"
                :name="name"
                format="dd.MM.yyyy"
                monday-first="true"
                calendar-class="date-picker__calendar"
                input-class="date-picker__input"
                wrapper-class="date-picker__wrap"
                clear-button="true"
        />
    </div>
</template>

<script>
    import vuejsDatepicker from 'vuejs-datepicker'
    import ru from 'vuejs-datepicker/dist/locale/translations/ru'

    export default {
        name: "DatePicker",
        props: ['name', 'value'],
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
        &__input {
            .form-control-style();
        }
    }

</style>