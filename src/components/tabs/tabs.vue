<!-- табы - готово! -->
<template>
  <div class="tabs" v-resize="resize">
    <div class="tabs__nav" v-if="isLong">
      <div class="prev" @click="prev"/>
      <div class="next" @click="next"/>
    </div>
    <div class="tabs__header" :style="stylesHeader" ref="header">
      <div class="tabs__list" ref="tabList" :style="styleList">
        <div class="tab" :class="getClasses(index, day)" :style="{ width: widthTab + 'px' }"
             v-for="(day, index) in localData" @click="setActiveDay(index)">
          <span class="text">{{ index + 1 }} День</span>
        </div>
      </div>

    </div>
    <div class="tabs__body" v-if="!refresh">
      <Field name="date"
             type="date"
             title="Дата"
             :value="activeDay.pointStart && activeDay.pointStart.date"
             @change="changeDate"
             :save="config"
      />
      <div class="times">
        <Field name="timeStart"
               type="time"
               title="Время старта"
               :value="activeDay.pointStart && activeDay.pointStart.time"
               @change="changeTimeStart"
               :save="config"
        />
        <Field name="timeEnd"
               type="time"
               title="Время финиша"
               @change="changeTimeEnd"
               :value="timeEnd"
               :save="config"
        />
      </div>
      <objects-in-day
          :list="activeDay && activeDay.objects"
          :start="start"
          :end="end"
          :data-is-change="dataIsChange"
          @change="changeObjectsFromActiveDay"
          @remove="() => { this.$emit('remove') }"
      />
      <Form-add
          :objects="activeDay.objects"
          @add="add"
      />
    </div>
  </div>

</template>

<script>
import ObjectsInDay from "../objects-in-day/objectInDayView";
import Field from "../form-control/Field";
import FormAdd from "../added-objects/form-add"
import resize from 'vue-resize-directive';

export default {
  name: "Tabs",
  directives: {
    resize,
  },
  props: {
    days: Array,
    start: Object,
    end: Object,
    indexActiveDay: Number,
    dataIsChange: Boolean,
  },
  components: {
    Field,
    ObjectsInDay,
    FormAdd,
  },
  data() {
    return {
      refresh: false,
      localData: this.days,
      activeDay: {},
      left: 0,
      widthHeader: null,
    }
  },
  computed: {
    widthTab() {
      if (this.localData.length < 3) {
        return Math.round(this.widthHeader / this.localData.length) + 1;
      }
      return Math.round(this.widthHeader / 3) + 1;
    },
    styleList() {
      if (!this.localData) {
        return {
          width: '300px',
          left: 0,
        }
      }

      return {
        width: this.localData.length * this.widthTab + 'px',
        left: (-this.widthTab * this.left) + 'px',
      };
    },
    stylesHeader() {
      if (this.localData.length < 3) {
        return {
          width: this.localData.length * 120 + 'px',
        }
      }
      return null;
    },
    isLong() {
      return this.localData && this.localData.length > 3;
    },
    config() {
      return {
        editTitle: 'Изменить',
        viewSaveButton: false,
        method: this.saveActiveDay
      }
    },
    timeEnd() {
      return this.activeDay.pointEnd && this.activeDay.pointEnd.time
    }
  },
  watch: {
    days: function () {
      this.refresh = true;
      this.localData = this.days;
      this.activeDay = this.localData[this.indexActiveDay];
      setTimeout(() => {
        this.refresh = false;
      }, 100);

    },
    indexActiveDay() {
      this.activeDay = this.localData[this.indexActiveDay];
    }
  },
  methods: {
    add(object) {
      const penultIndex = this.activeDay.objects.length - 1;
      this.activeDay.objects.splice(penultIndex, 0, object);
      this.saveActiveDay();
      this.$emit('add', object);
    },
    changeObjectsFromActiveDay(objects) {
      this.activeDay.objects = objects;
      this.saveActiveDay();
    },
    changeDate(e) {
      this.activeDay.date = e;
    },
    changeTimeStart(e) {
      this.activeDay.timeStart = e;
    },
    changeTimeEnd(e) {
      this.activeDay.neededTimeEnd = e;
    },
    saveActiveDay() {
      this.localData[this.indexActiveDay] = this.activeDay;
      this.$emit('change', this.localData);
    },
    getClasses(index, day) {
      const base = index === 0 || index % 3 === 0;
      const two = index === 1 || (index - 1) % 3 === 0;
      const three = index === 2 || (index - 2) % 3 === 0;
      const classes = [];
      const activeDay = this.activeDay || this.getData;
      if (base) {
        classes.push('tab--base');
      }
      if (two) {
        classes.push('tab--two');
      }
      if (three) {
        classes.push('tab--three');
      }
      if (day.id === activeDay.id) {
        classes.push('active');
      }
      return classes;
    },
    resize() {
      this.widthHeader = this.$refs.header.clientWidth;
    },
    setActiveDay(index) {
      this.activeDay = this.localData[index];
      this.$emit('setActiveDay', index);
    },
    prev() {
      if (this.left > 0)
        this.left--;
    },
    next() {
      if (this.left < this.localData.length - 3)
        this.left++;
    },
  },
  mounted() {
    this.resize();
  },
  created() {
    this.localData = this.days || [];
    this.activeDay = this.localData[0];
    this.indexActiveDay = 0;
  }
}
</script>

<style lang="less">
@import "styles";
</style>