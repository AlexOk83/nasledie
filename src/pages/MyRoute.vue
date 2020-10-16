<!-- создание и редактирование моего маршрута -->
<template>
    <div>
        <Bread-crumbs
                :list-link="links"
        />
        <h1>{{ headerTitle }}</h1>

        <div class="row" v-if="!reload">
            <div class="left-form">
                <form>
                    <Field name="name"
                           type="text"
                           title="Название маршрута"
                           placeholder="Название маршрута"
                           :value="name"
                           :save="!isNewRoute && configsForSave.name"
                           @change="changeValue('name', $event)"
                    />
                    <Field name="description"
                           type="longtext"
                           title="Описание маршрута"
                           placeholder="Описание маршрута"
                           :value="description"
                           :save="!isNewRoute && configsForSave.description"
                           @change="changeValue('description', $event)"
                    />
                    <div v-if="isNewRoute">
                        <Field name="startPoint"
                               type="search"
                               title="Точка старта"
                               placeholder="Поиск мест и адресов"
                               :value="startPoint"
                               @change="changeValue('startPoint', $event)"
                        />
                        <Field name="endPoint"
                               type="search"
                               title="Точка назначения"
                               placeholder="Поиск мест и адресов"
                               :value="endPoint"
                               @change="changeValue('endPoint', $event)"
                        />
                        <Field name="dateStart"
                               type="date"
                               title="Дата старта"
                               placeholder="Дата"
                               :value="dateStart"
                               @change="changeValue('dateStart', $event)"
                        />
                        <Field name="timeStart"
                               type="time"
                               title="Время старта"
                               :value="timeStart"
                               @change="changeValue('timeStart', $event)"
                        />
                        <Field name="typeMovement"
                               type="select"
                               title="Способ передвижения"
                               placeholder="способ передвижения"
                               :value="typeMovement"
                               :list-value="listTypesMovement"
                               @change="changeValue('typeMovement', $event)"
                        />
                        <Objects
                                :objects="mapPoints"
                                @change="changeValue('objects', $event)"
                        />
                    </div>
                    <div v-if="!isNewRoute">
                        <Photos @change="changeValue('files', $event)" :photos="files" :max-count=1 />
                        <Tabs
                            v-if="days && days.length > 0"
                            :data="days"
                            :start="startPoint"
                            :end="endPoint"
                            @change="changeValue('days', $event)"
                            @setActiveDay="setActiveDay"
                            @addNewObject="addNewObject"
                            @removeNewObject="removeNewObject"
                            :indexActiveDay="indexActiveDay"
                            :data-is-change="needUpdateDayData"
                        />
                    </div>
                    <Field name="isGeoRoute"
                           type="radio"
                           title="Формировать маршрут по географической близости объектов"
                           :value="isGeoRoute"
                           :list-value="listParams"
                           @change="changeValue('isGeoRoute', $event)"
                    />
                    <div class="buttons-container">
                        <Button text="Очистить форму"
                                :on-click="() => onClear()"
                                is-shadow
                                color="red"
                                icon="trash"
                                v-if="isNewRoute"
                        />
                        <Button text="Составить маршрут"
                                :on-click="() => calculatedRoute()"
                                is-shadow
                                v-if="isNewRoute"
                        />
                        <Button text="Пересчитать маршрут"
                                :on-click="() => onCalcRoute()"
                                is-shadow
                                is-full
                                v-if="!isNewRoute"
                                :disabled="disabledUpdateButton"
                        />
                        <Button text="Сохранить в мои маршруты"
                                :on-click="() => updateRoute()"
                                color="white"
                                icon="check"
                                is-shadow
                                is-full
                                v-if="!isNewRoute"
                                :disabled="needUpdateDayData"
                        />
                    </div>

                </form>
            </div>
            <div class="right-container">
                <div class="map-stiky">
                    <Map-routes
                            v-if="viewMap"
                            :from="startPoint.position"
                            :days="days"
                            @addPoint="addPointToActiveDay"
                            @removePoint="removePointToActiveDay"
                            @removeNewObject="removeNewObject"
                            :newObjectsInDay="newObjects"
                            :index-active-day="indexActiveDay"
                            :read-only="false"
                    />
                    <Map-objects
                            v-if="viewMapCreate"
                            :from="startPoint"
                            :to="endPoint"
                            :points="mapPoints"
                            @addPoint="addPoint"
                    />
                    <Map-calc
                            v-if="showCalcMap"
                            :from="startPoint"
                            :to="endPoint"
                            :points="pointList"
                            :timeStart="timeStart"
                            :dateStart="dateStart"
                            :days="days"
                            :is-update="calcMapUpdate"
                            @calc="createRoute"
                            @update="updateData"
                    />
                </div>
            </div>
        </div>
    </div>
</template>

<script src="./myRoute.js" />

<style lang="less">
    @import "../styles/mixins";

    .map-stiky {
        position: sticky;
        top: 0;
    }
</style>
