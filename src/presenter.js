import moment from "moment";
import {getDistanceFromLatLonInMeters, isEqual, calcTime, getAdress} from './utils';
import {isEmpty} from 'lodash';

const sort = (start) => (a, b) => {
    if (getDistanceFromLatLonInMeters(start, a.position) > getDistanceFromLatLonInMeters(start, b.position)) return 1;
    if (getDistanceFromLatLonInMeters(start, a.position) < getDistanceFromLatLonInMeters(start, b.position)) return -1;
    if (getDistanceFromLatLonInMeters(start, a.position) === getDistanceFromLatLonInMeters(start, b.position)) return 0;
}

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
            points.sort(sort(startPosition));
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
            points.sort(sort(startPoint.position));
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
                const position = this.wellFormatPosition(obj.position);
                const [lat, long] = position;
                return {
                    object_id: obj.id || null,
                    name: getAdress(obj),
                    startPointCoordLat: lat,
                    startPointCoordLong: long,
                    way: 0,
                    time: 30,
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
                time: 0,
                timeInWay: 0,
                stopTime: 0,
                typeMovement: [typeMovement]
            },
        ];

        return objectsInDays;
    }
    // вроде готово
    createDataDays(pointList, dateStart, timeStart, oldDays = []) {
        let i = 0, currentMinutes = 0, currentDayListPoints = [];
        let days = [];
        let totalTime = 0;
        let totalWay = 0;
        let timeBorder = 12 * 60;
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
                    startPoint: obj.name,
                    startPointCoordLat: obj.startPointCoordLat,
                    startPointCoordLong: obj.startPointCoordLong,
                    objects: currentDayListPoints
                })
            }
            else {
                let currentTimeStart = this.getCurrentTimeStart(oldDays, i, timeStart);
                const { hour } = this.getHourAndMinutes(currentTimeStart); // сколько часов на старте
                timeBorder = (21 - hour) * 60;
                currentDayListPoints.push(obj);
                currentMinutes = currentMinutes + obj.timeInWay + obj.time + obj.stopTime;
                console.log(currentMinutes);
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
    getHourAndMinutes(time) {
        if (!time) {
            return {
                hour: '00',
                minutes: '00'
            };
        }
        const hour = time[0] + time[1];
        const minutes = time[3] + time[4];
        return {
            hour,
            minutes
        }
    }
    // готово!
    getTimeEnd(timeStart, countMinute) {
        const {hour, minutes} = this.getHourAndMinutes(timeStart);
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
        const lastSimbol = stringNumber[stringNumber.length - 1];
        const balance = Number(lastSimbol);

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
    // готово!
    wellFormatPosition(position) { // приводим к одному формату
        if (Array.isArray(position)) {
            return position
        }
        return position.split(', ')
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