import moment from "moment";
import {getAdress, getHourAndMinutes, getLastElement, getTimeBorderDefault, setCoordsToNumeric, sortGeo} from './utils';
import {isEmpty} from 'lodash';

export class Presenter {
    getCurrentTimeStart(oldDays, i, timeStart) {
        if (isEmpty(oldDays)) {
            return timeStart;
        }
        if (oldDays && oldDays[i] && oldDays[i].timeStart) {
            return oldDays[i].timeStart;
        }
        if (oldDays && oldDays[i - 1] && oldDays[i - 1].timeStart) {
            return oldDays[i - 1].timeStart;
        }

        return timeStart;
    }
    getCurrentNeededTimeEnd(oldDays, i) {
        if (isEmpty(oldDays)) {
            return "21:00";
        }
        if (oldDays && oldDays[i] && oldDays[i].neededTimeEnd) {
            return oldDays[i].neededTimeEnd;
        }

        return "21:00";
    }

    // тут просто подготовка списка точек для расчета на карте
    updateAllPoints(params) {
        const {
            startPoint,
            pointList,
            isGeoRoute,
        } = params;
        let points = [...pointList].map(p => ({...p, position: [p.startPointCoordLat, p.startPointCoordLong]}));
        const startPosition = startPoint.position;

        if (isGeoRoute === 'yes') {
            points = sortGeo(startPosition, points);
        }

        return points;
    }
    // метод формирования точек маршрута - готово!
    getAllPoints(params) {
        const {
            startPoint,
            endPoint,
            mapPoints,
            isGeoRoute,
            typeMovement,
        } = params;

        let objectsInDays;
        let points = [...mapPoints];
        if (isGeoRoute === 'yes') {
            points = sortGeo(startPoint.position, points);
        }

        objectsInDays = [
            {
                object_id: null,
                name: getAdress(startPoint),
                startPointCoordLat: startPoint.position[0],
                startPointCoordLong: startPoint.position[1],
                way: 0,
                stopTime: 0,
                time: 0,
                timeInWay: 0,
                typeMovement: [typeMovement]
            },
            ...points.map(obj => {
                const position = setCoordsToNumeric(obj.position);
                const [lat, long] = position;
                return {
                    object_id: obj.id || null,
                    name: getAdress(obj),
                    startPointCoordLat: lat,
                    startPointCoordLong: long,
                    way: 0,
                    time: 60,
                    timeInWay: 0,
                    stopTime: 0,
                    typeMovement: [typeMovement]
                }
            }),
            {
                object_id: null,
                name: getAdress(endPoint),
                startPointCoordLat: endPoint.position[0],
                startPointCoordLong: endPoint.position[1],
                way: 0,
                time: 60,
                timeInWay: 0,
                stopTime: 0,
                typeMovement: [typeMovement]
            },
        ];

        return objectsInDays;
    }
    // вроде готово
    createDataDaysOld(pointList, dateStart, timeStart, oldDays = []) {
        let i = 0, // index создаваемого дня
            currentMinutes = 0, // всего минут
            currentDayListPoints = [];  // всего точек в текущем дне
        let days = [];
        let totalTime = 0;
        let totalWay = 0;
        let timeBorder = getTimeBorderDefault(timeStart);

        pointList.forEach((obj, index) => {
            totalTime = totalTime + obj.timeInWay + obj.time + obj.stopTime;
            totalWay += obj.way;
            // день первый - создаем день
            if (index === 0) {
                currentDayListPoints = [obj];
                days.push({
                    id: 1,
                    dateStart: moment(dateStart).format('YYYY-MM-DD'),
                    dateEnd: moment(dateStart).format('YYYY-MM-DD'),
                    timeStart: this.getCurrentTimeStart(oldDays, 0, timeStart),
                    neededTimeEnd: this.getCurrentNeededTimeEnd(oldDays, i),
                    startPoint: obj.name,
                    startPointCoordLat: obj.startPointCoordLat,
                    startPointCoordLong: obj.startPointCoordLong,
                    objects: currentDayListPoints
                })
            }
            else {
                let currentTimeStart = this.getCurrentTimeStart(oldDays, i, timeStart);
                let currentNeededTimeEnd = this.getCurrentNeededTimeEnd(oldDays, i);
                timeBorder = getTimeBorderDefault(currentTimeStart, currentNeededTimeEnd);
                currentDayListPoints.push(obj);
                currentMinutes = currentMinutes + obj.timeInWay + obj.time + obj.stopTime;
                // превысили лимит по времени или конец маршрута
                if (currentMinutes > timeBorder || index === pointList.length - 1) {
                        days[i].timeEnd = this.getTimeEnd(days[i].timeStart, currentMinutes);
                        days[i].endPoint = obj.name;
                        days[i].endPointCoordLat = obj.startPointCoordLat;
                        days[i].endPointCoordLong = obj.startPointCoordLong;
                        days[i].objects = currentDayListPoints;
                        currentMinutes = 0;
                        currentDayListPoints = [obj]
                        // если это не последний объект, то надо создать новый день
                        if (index !== pointList.length - 1) {
                            days.push({
                                id: i + 2,
                                dateStart: moment(dateStart).add(i + 1, 'days').format('YYYY-MM-DD'),
                                dateEnd: moment(dateStart).add(i + 1, 'days').format('YYYY-MM-DD'),
                                timeStart: this.getCurrentTimeStart(oldDays, i + 1, timeStart),
                                neededTimeEnd: currentNeededTimeEnd,
                                startPoint: obj.name,
                                startPointCoordLat: obj.startPointCoordLat,
                                startPointCoordLong: obj.startPointCoordLong,
                                objects: currentDayListPoints
                            });
                            i = days.length - 1;
                        }
                    }
            }
        });
        return {
            days,
            totalTime,
            totalWay,
            pointList
        }
    } // старый метод, считает что точка вышла за пределы - попадает в текущий день

    createDataDays(pointList, dateStart, timeStart, oldDays = []) {
        let i = 0, // index создаваемого дня
            currentMinutes = 0, // всего минут
            currentDayListPoints = [];  // всего точек в текущем дне
        let days = [];
        let totalTime = 0;
        let totalWay = 0;
        let timeBorder = getTimeBorderDefault(timeStart);

        pointList.forEach((obj, index) => {
            totalTime = totalTime + obj.timeInWay + obj.time + obj.stopTime;
            totalWay += obj.way;
            // день первый - создаем день
            if (index === 0) {
                currentDayListPoints = [obj];
                days.push({
                    id: 1,
                    dateStart: moment(dateStart).format('YYYY-MM-DD'),
                    dateEnd: moment(dateStart).format('YYYY-MM-DD'),
                    timeStart: this.getCurrentTimeStart(oldDays, 0, timeStart),
                    neededTimeEnd: this.getCurrentNeededTimeEnd(oldDays, i),
                    startPoint: obj.name,
                    startPointCoordLat: obj.startPointCoordLat,
                    startPointCoordLong: obj.startPointCoordLong,
                    objects: currentDayListPoints
                })
            }
            else {
                let currentTimeStart = this.getCurrentTimeStart(oldDays, i, timeStart);
                let currentNeededTimeEnd = this.getCurrentNeededTimeEnd(oldDays, i);
                timeBorder = getTimeBorderDefault(currentTimeStart, currentNeededTimeEnd);

                const allMinutes = currentMinutes + obj.timeInWay + obj.time + obj.stopTime;
                // превысили лимит по времени или конец маршрута
                if (allMinutes > timeBorder) {
                    const lastObj = getLastElement(currentDayListPoints);
                    days[i].timeEnd = this.getTimeEnd(days[i].timeStart, currentMinutes);
                    days[i].endPoint = lastObj.name;
                    days[i].endPointCoordLat = lastObj.startPointCoordLat;
                    days[i].endPointCoordLong = lastObj.startPointCoordLong;
                    days[i].objects = currentDayListPoints;
                    currentMinutes = 0 + obj.timeInWay + obj.time + obj.stopTime;
                    currentDayListPoints = [lastObj, obj];
                    days.push({
                        id: i + 2,
                        dateStart: moment(dateStart).add(i + 1, 'days').format('YYYY-MM-DD'),
                        dateEnd: moment(dateStart).add(i + 1, 'days').format('YYYY-MM-DD'),
                        timeStart: this.getCurrentTimeStart(oldDays, i + 1, timeStart),
                        neededTimeEnd: this.getCurrentNeededTimeEnd(oldDays, i + 1),
                        startPoint: lastObj.name,
                        startPointCoordLat: lastObj.startPointCoordLat,
                        startPointCoordLong: lastObj.startPointCoordLong,
                        objects: currentDayListPoints
                    });
                    i = days.length - 1;
                    // если это не последний объект, то надо создать новый день
                }
                else {
                    currentDayListPoints.push(obj);
                    currentMinutes = allMinutes;
                }
                if (index === pointList.length - 1) {
                    days[i].timeEnd = this.getTimeEnd(days[i].timeStart, currentMinutes);
                    days[i].endPoint = obj.name;
                    days[i].endPointCoordLat = obj.startPointCoordLat;
                    days[i].endPointCoordLong = obj.startPointCoordLong;
                    days[i].objects = currentDayListPoints;
                }
            }
        });
        return {
            days,
            totalTime,
            totalWay,
            pointList
        }
    }
    // готово!
    getWay(way) {
        if (!way) {
            return 'Не указано'
        }
        const w = way / 1000;
        if (w < 1) {
            return `${way} м`
        }

        return `${w} км`
    }
    // готово!
    getTimeEnd(timeStart, countMinute) {
        const {hour, minutes} = getHourAndMinutes(timeStart);
        const allMinutes = Number(minutes) + countMinute;
        let hours = Number(hour);
        let remainderMinutes = allMinutes;
        if (allMinutes > 60) {
            remainderMinutes = allMinutes % 60;
            hours = Number(hour) + (allMinutes - remainderMinutes) / 60 ;
        }
        if (remainderMinutes < 10) {
            remainderMinutes = `0${remainderMinutes}`
        }
        if (hours > 23) {
            hours = hours - 24;
            if (hours > 23) {
                hours = hours - 24;
            }
        }
        if (hours < 10) {
            hours = `0${hours}`
        }
        return `${hours}:${remainderMinutes}`;
    }
    // готово!
    getTime(time) {
        if (!time) {
            return 'Не указано'
        }
        let minutes = time % 60;
        const t = (time - minutes) / 60;
        if (t < 1) {
            return this.getDeclinedRemainder(time, ['минута', 'минуты', 'минут'])
        }
        const h = this.getDeclinedRemainder(t, ['час', 'часа', 'часов']);
        const m = (minutes === 0) ? '' : this.getDeclinedRemainder(minutes, ['минута', 'минуты', 'минут']);

        return `${h} ${m}`
    }
    // готово!
    getDeclinedRemainder(number, declensions) {
        const stringNumber = String(number);
        const [one, two, other] = declensions;
        let balance = number;
        if (balance > 20) {
            let lastSimbol = stringNumber[stringNumber.length - 1];
            balance = Number(lastSimbol);
        }

        if (balance === 1) {
            return `${number} ${one}`
        }
        if (balance < 5 && balance !== 0) {
            return `${number} ${two}`
        }
        return `${number} ${other}`
    }
    // готово!
    getNameMovement(movement) {
        switch (movement) {
            case('people'):
                return "Пеший";
            case('car'):
                return "Автомобильный";
            case('ship'):
                return "По воде";
            default:
                return "";
        }
    }
    // готово!
    getRoutingMode(movement) {
        switch (movement) {
            case('people'):
                return "pedestrian";
            case('car'):
                return "auto";
            case('train'):
                return "masstransit";
            default:
                return "auto";
        }
    }
    // готово!
    moveItemUp(mass, index) {
        let localMass = [...mass];
        let temp = localMass[index - 1];
        localMass[index - 1] = localMass[index];
        localMass[index] = temp;
        return localMass
    }
    // готово!
    moveItemDown(mass, index) {
        let localMass = [...mass];
        let temp = localMass[index + 1];
        localMass[index + 1] = localMass[index];
        localMass[index] = temp;
        return localMass
    }
    changeFormat(days) {
        return days.map(day => {
            return {
                ...day,
                dateStart: moment(day.pointStart.date).format('YYYY-MM-DD'),
                dateEnd: moment(day.pointEnd.date).format('YYYY-MM-DD'),
                timeStart: day.pointStart.time,
                timeEnd: day.pointEnd.time,
                startPoint: day.pointStart.name,
                startPointCoordLat: day.pointStart.coordinates[0],
                startPointCoordLong: day.pointStart.coordinates[1],
                endPoint: day.pointEnd.name,
                endPointCoordLat: day.pointEnd.coordinates[0],
                endPointCoordLong: day.pointEnd.coordinates[1],

            }
        })
    }

    getStylesPoints(index) {
        const base = index === 0 || index % 3 === 0;
        const two = index === 1 || (index - 1) % 3 === 0;
        const three = index === 2 || (index - 2) % 3 === 0;
        if (base) {
            return {
                color: "#51619E",
                imagePoint: "/assets/images/icons/marker_blue.svg",
                imageFlag: "/assets/images/icons/flag_blue.svg",
            }
        }
        if (two) {
            return {
                color: "#019788",
                imagePoint: "/assets/images/icons/marker_green.svg",
                imageFlag: "/assets/images/icons/flag_green.svg",
            }
        }
        if (three) {
            return {
                color: "#F3742E",
                imagePoint: "/assets/images/icons/marker_yellow.svg",
                imageFlag: "/assets/images/icons/flag_yellow.svg",
            }
        }
    }
}