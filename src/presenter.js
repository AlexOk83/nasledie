import moment from "moment";
import {getDistanceFromLatLonInMeters, isEqual, calcTime} from './utils';
import {isEmpty} from 'lodash';

const update = (items, typeMovement) => items.map((point, index) => new Promise((resolve, reject) => {
    ymaps.ready(function () {
        const routingMode = typeMovement === 'car' ? 'auto' : 'pedestrian';
        if (index !== 0) {
            const p1 = [items[index - 1].startPointCoordLat, items[index - 1].startPointCoordLong];
            const p2 = [point.startPointCoordLat, point.startPointCoordLong];
            const distance = getDistanceFromLatLonInMeters(p1, p2);
            ymaps.route([p1, p2], {routingMode}).then(
                function (route) { // успешно смогли построить маршрут
                    point.way_false = 0;
                    point.way = Math.round(route.getLength());
                    point.timeInWay = Math.round(route.getTime() / 60);
                    if (point.timeInWay > 16 * 60) {
                        point.routeVeryLong = true;
                    }
                    resolve(point);
                }, function () {
                    point.way_false = 1;
                    point.way = distance;
                    point.timeInWay = Math.round(distance / 800);
                    if (point.timeInWay > 16 * 60) {
                        point.routeVeryLong = true;
                    }
                    resolve(point)
                })
        } else {
            resolve(point)
        }
    })
}));
const update2 = (items) => items.map((point, index) => new Promise((resolve, reject) => {
    ymaps.ready(function () {
        const routingMode = point.typeMovement[0] === 'car' ? 'auto' : 'pedestrian';
        if (index !== 0) {
            const p1 = [items[index - 1].startPointCoordLat, items[index - 1].startPointCoordLong];
            const p2 = [point.startPointCoordLat, point.startPointCoordLong];
            const distance = getDistanceFromLatLonInMeters(p1, p2);
            ymaps.route([p1, p2], {routingMode}).then(
                function (route) { // успешно смогли построить маршрут
                    point.way_false = 0;
                    point.way = Math.round(route.getLength());
                    point.timeInWay = Math.round(route.getTime() / 60);
                    resolve(point);
                }, function () {
                    point.way_false = 1;
                    point.way = distance;
                    point.timeInWay = Math.round(distance / 800);
                    resolve(point)
                })
        } else {
            resolve(point)
        }
    })
}));

const sort = (start) => (a, b) => {
    if (getDistanceFromLatLonInMeters(start, a.position) > getDistanceFromLatLonInMeters(start, b.position)) return 1;
    if (getDistanceFromLatLonInMeters(start, a.position) < getDistanceFromLatLonInMeters(start, b.position)) return -1;
    if (getDistanceFromLatLonInMeters(start, a.position) === getDistanceFromLatLonInMeters(start, b.position)) return 0;
}

export class Presenter {
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

    getTimeEnd(timeStart, countMinute) {
        const {hour, minutes} = this.getHourAndMinutes(timeStart);
        const allMinutes = Number(minutes) + countMinute;
        let hours = Number(hour) + Math.round(allMinutes / 60);
        let remainderMinutes = allMinutes % 60;
        if (remainderMinutes < 10) {
            remainderMinutes = `0${remainderMinutes}`
        }
        if (hours > 23) {
            hours = hours - 24;
        }
        if (hours < 10) {
            hours = `0${hours}`
        }
        return `${hours}:${remainderMinutes}`;
    }

    getTime(time) {
        if (!time) {
            return 'Не указано'
        }
        const t = time / 60;
        if (t < 1) {
            return this.getDeclinedRemainder(time, ['минута', 'минуты', 'минут'])
        }
        const h = this.getDeclinedRemainder(Math.floor(t), ['час', 'часа', 'часов']);
        const m = (time % 60 === 0) ? '' : this.getDeclinedRemainder(time % 60, ['минута', 'минуты', 'минут']);

        return `${h} ${m}`
    }

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

    moveItemUp(mass, index) {
        let localMass = [...mass];
        let temp = localMass[index - 1];
        localMass[index - 1] = localMass[index];
        localMass[index] = temp;
        return localMass
    }

    moveItemDown(mass, index) {
        let localMass = [...mass];
        let temp = localMass[index + 1];
        localMass[index + 1] = localMass[index];
        localMass[index] = temp;
        return localMass
    }

    wellFormatPosition(position) { // приводим к одному формату
        if (Array.isArray(position)) {
            return position
        }
        return position.split(', ')
    }

    calculatedDaysRoute(params) {
        return new Promise(resolve => {
            const {
                startPoint,
                endPoint,
                dateStart,
                timeStart,
                typeMovement,
                mapPoints,
                isGeoRoute,
            } = params;

            let objectsInDays;
            let points = [...mapPoints];
            if (isGeoRoute === 'yes') {
                points.sort(sort(startPoint.position));
            }
            objectsInDays = [
                {
                    object_id: null,
                    name: startPoint.name,
                    startPointCoordLat: startPoint.position[0],
                    startPointCoordLong: startPoint.position[1],
                    timeInWay: 0,
                    way: 0,
                    stopTime: 0,
                    time: 0,
                    typeMovement: [typeMovement]
                },
                ...points.map(obj => {
                    const position = this.wellFormatPosition(obj.position);
                    const [lat, long] = position;
                    return {
                        object_id: obj.id || null,
                        name: obj.name,
                        startPointCoordLat: lat,
                        startPointCoordLong: long,
                        timeInWay: 0,
                        way: 0,
                        stopTime: 0,
                        time: 30,
                        typeMovement: [typeMovement]
                    }
                }),
                {
                    object_id: null,
                    name: endPoint.name,
                    startPointCoordLat: endPoint.position[0],
                    startPointCoordLong: endPoint.position[1],
                    timeInWay: 0,
                    way: 0,
                    stopTime: 0,
                    time: 0,
                    typeMovement: [typeMovement]
                },
            ];

            // дополняем список растоянием между точками и временем прохождения
            Promise.all(update(objectsInDays, typeMovement)).then(() => {
                // здесь мы уже имеем все изменения

                const result = this.createDataDays(objectsInDays, dateStart, timeStart);

                resolve(result);
            })
        });
    }

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

    createDataDays(pointList, dateStart, timeStart, oldDays = []) {
        let minutes = 0, i = 0;
        let days = [];
        let totalTime = 0;
        let totalWay = 0;
        const timeBorder = 12 * 60;


        pointList.forEach((obj, index) => {
            totalTime = totalTime + obj.timeInWay + obj.time + obj.stopTime;
            totalWay += obj.way;
            // день первый - создаем день
            if (index === 0) {
                days.push({
                    id: 1,
                    dateStart: moment(dateStart).format('YYYY-MM-DD'),
                    dateEnd: moment(dateStart).format('YYYY-MM-DD'),
                    timeStart: this.getCurrentTimeStart(oldDays, 0, timeStart),
                    startPoint: obj.name,
                    startPointCoordLat: obj.startPointCoordLat,
                    startPointCoordLong: obj.startPointCoordLong,
                    objects: [obj]
                })
            }
            // слишком длинный отрезок
            else if (obj.timeInWay > 12 * 60) {
                // он второй в списке (будет полюбому 3 и выше) - заканчиваем текущий день
                if (days[i].objects.length === 1) {
                    days[i].timeEnd = this.getTimeEnd(days[i].timeStart, obj.timeInWay + obj.time + obj.stopTime);
                    days[i].endPoint = obj.name;
                    days[i].endPointCoordLat = obj.startPointCoordLat;
                    days[i].endPointCoordLong = obj.startPointCoordLong;
                    days[i].objects.push(obj);
                    days.push({
                        id: i + 2,
                        dateStart: moment(dateStart).add(i + 1, 'days').format('YYYY-MM-DD'),
                        dateEnd: moment(dateStart).add(i + 1, 'days').format('YYYY-MM-DD'),
                        timeStart: this.getCurrentTimeStart(oldDays, i + 1, timeStart),
                        startPoint: obj.name,
                        startPointCoordLat: obj.startPointCoordLat,
                        startPointCoordLong: obj.startPointCoordLong,
                        objects: [obj]
                    });
                    i = days.length - 1;
                }
                    // он не второй, т.е. надо сначала закончить пребыдущий день и создать длинный отрезок как отдельный день
                // + начало сл.дня
                else {
                    const prevObj = pointList[index - 1];
                    days[i].timeEnd = this.getTimeEnd(days[i].timeStart, minutes);
                    days[i].endPoint = prevObj.name;
                    days[i].endPointCoordLat = prevObj.startPointCoordLat;
                    days[i].endPointCoordLong = prevObj.startPointCoordLong;
                    days.push({
                        id: i + 2,
                        dateStart: moment(dateStart).add(i + 1, 'days').format('YYYY-MM-DD'),
                        dateEnd: moment(dateStart).add(i + 1, 'days').format('YYYY-MM-DD'),
                        timeStart: this.getCurrentTimeStart(oldDays, i + 1, timeStart),
                        timeEnd: this.getTimeEnd(days[i].timeStart, obj.timeInWay + obj.time + obj.stopTime),
                        startPoint: prevObj.name,
                        startPointCoordLat: prevObj.startPointCoordLat,
                        startPointCoordLong: prevObj.startPointCoordLong,
                        endPoint: obj.name,
                        endPointCoordLat: obj.startPointCoordLat,
                        endPointCoordLong: obj.startPointCoordLong,
                        objects: [prevObj, obj]
                    }, {
                        id: i + 3,
                        dateStart: moment(dateStart).add(i + 2, 'days').format('YYYY-MM-DD'),
                        dateEnd: moment(dateStart).add(i + 2, 'days').format('YYYY-MM-DD'),
                        timeStart: this.getCurrentTimeStart(oldDays, i + 2, timeStart),
                        startPoint: obj.name,
                        startPointCoordLat: obj.startPointCoordLat,
                        startPointCoordLong: obj.startPointCoordLong,
                        objects: [obj]
                    });
                    i = days.length - 1;
                }
            }
            // если время вышло за пределы 12 часов
            else if (minutes + obj.timeInWay + obj.time >= timeBorder) {
                days[i].timeEnd = this.getTimeEnd(days[i].timeStart, minutes + obj.timeInWay + obj.time + obj.stopTime);
                days[i].endPoint = obj.name;
                days[i].endPointCoordLat = obj.startPointCoordLat;
                days[i].endPointCoordLong = obj.startPointCoordLong;
                days[i].objects.push(obj);
                minutes = 0;
                // и это не последний объект, создает начало сл. дня
                if (index !== pointList.length - 1) {
                    days.push({
                        id: i + 2,
                        dateStart: moment(dateStart).add(i + 1, 'days').format('YYYY-MM-DD'),
                        dateEnd: moment(dateStart).add(i + 1, 'days').format('YYYY-MM-DD'),
                        timeStart: this.getCurrentTimeStart(oldDays, i + 1, timeStart),
                        startPoint: obj.name,
                        startPointCoordLat: obj.startPointCoordLat,
                        startPointCoordLong: obj.startPointCoordLong,
                        objects: [obj]
                    });
                    i = days.length - 1;
                }
            }
            else {
                minutes = minutes + obj.timeInWay + obj.time;
                days[i].objects.push(obj);
                if (index === pointList.length - 1) {
                    days[i].timeEnd = this.getTimeEnd(days[i].timeStart, minutes);
                    days[i].endPoint = obj.name;
                    days[i].endPointCoordLat = obj.startPointCoordLat;
                    days[i].endPointCoordLong = obj.startPointCoordLong;
                }
            }
        });
        return {
            days: [...days],
            totalTime,
            totalWay,
            pointList
        }
    }

    updateDaysRoute(params) {
        return new Promise(resolve => {
            const {
                days,
                pointList,
                isGeoRoute,
            } = params;
            let points = [...pointList].map(p => ({...p, position: [p.startPointCoordLat, p.startPointCoordLong]}));
            const startDay = days[0];
            const dateStart = startDay.dateStart;
            const timeStart = String(startDay.timeStart);
            const startPosition = [startDay.startPointCoordLat, startDay.startPointCoordLong];

            if (isGeoRoute === 'yes') {
                points.sort(sort(startPosition));
            }

            Promise.all(update2(points)).then(() => {
                // здесь мы уже имеем все изменения

                const result = this.createDataDays(points, dateStart, timeStart, days);

                resolve(result);
            })
        })
    }

    calcDistanceAndTimeWithoutYandex(points) {
        return points.map( (point, index) => {
            if (index === 0) {
                return point;
            }
            else {
                const p1 = [points[index - 1].startPointCoordLat, points[index - 1].startPointCoordLong];
                const p2 = [point.startPointCoordLat, point.startPointCoordLong];
                const distance = getDistanceFromLatLonInMeters(p1, p2);
                const timeInWay = calcTime(distance, point.typeMovement[0]);
                let way_false = 0;
                if (distance > 1080000) {
                    way_false = 1;
                }
                return {
                    ...point,
                    timeInWay,
                    way: distance,
                    way_false,
                }
            }
        })
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