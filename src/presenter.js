import moment from "moment";
import {getDistanceFromLatLonInMeters, isEqual} from './utils';

const update = (items, typeMovement) => items.map((point, index) => new Promise((resolve, reject) => {
    ymaps.ready(function() {
        const routingMode = typeMovement === 'car' ? 'auto' : 'pedestrian';
        if (index !== 0) {
            const p1 = [items[index - 1].startPointCoordLat, items[index - 1].startPointCoordLong];
            const p2 = [point.startPointCoordLat, point.startPointCoordLong];
            const distance = getDistanceFromLatLonInMeters(p1, p2);
            ymaps.route([p1, p2], { routingMode }).then(
                function(route) { // успешно смогли построить маршрут
                    point.way = Math.round(route.getLength());
                    point.timeInWay = Math.round(route.getTime()/60);
                    if (point.timeInWay > 16*60) {
                        point.routeVeryLong = true;
                    }
                    resolve(point);
                }, function () {
                    point.way_false = 1;
                    point.way = distance;
                    point.timeInWay = Math.round(distance / 800);
                    if (point.timeInWay > 16*60) {
                        point.routeVeryLong = true;
                    }
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
        const { hour, minutes } = this.getHourAndMinutes(timeStart);
        const allMinutes = Number(minutes) + countMinute;
        let hours = Number(hour) + Math.round(allMinutes/60);
        let remainderMinutes = allMinutes % 60;
        if (remainderMinutes < 10) {
           remainderMinutes = `0${remainderMinutes}`
        }
        if (hours > 23) {
            hours = '00';
        }
        return `${hours}:${remainderMinutes}`;
    }

    getTime(time) {
        if (!time) {
            return 'Не указано'
        }
        const t = time / 60;
        if (t < 1) {
            return `${time} минут`
        }
        const dec = this.getDeclinedRemainder(Math.floor(t), ['час', 'часа', 'часов']);
        const min = (time % 60 === 0) ? '' : `${time % 60} минут`;

        return `${dec} ${min}`
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
            case('people'): return "Пеший";
            case('car'): return "Автомобильный";
            case('ship'): return "По воде";
            default: return "";
        }
    }

    getRoutingMode(movement) {
        switch (movement) {
            case('people'): return "pedestrian";
            case('car'): return "auto";
            case('train'): return "masstransit";
            default: return "auto";
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
                pointList,
            } = params;
            let days = [];
            let totalTime = 0;
            let totalWay = 0;
            let objectsInDays;
            if (pointList && pointList.length > 0) {
                let start = pointList[0];
                start.position = [
                        start.startPointCoordLat,
                        start.startPointCoordLong
                    ];
                let points = pointList.map(o => ({
                    ...o,
                    position: [
                        o.startPointCoordLat,
                        o.startPointCoordLong
                    ]
                }));
                points.splice(0,1);
                points.splice(-1,1);
                let end = pointList[pointList.length - 1];
                end.position = [end.startPointCoordLat, end.startPointCoordLong];


                if (isGeoRoute === 'yes') {
                    points.sort(sort(startPoint.position));
                }
                objectsInDays = [
                    start,
                    ...points,
                    end
                ];
            }
            else {
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
                        let position;
                        if (Array.isArray(obj.position)) {
                            position = obj.position
                        } else {
                            position = obj.position.split(', ')
                        }
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
            }

            // дополняем список растоянием между точками и временем прохождения
            Promise.all(update(objectsInDays, typeMovement)).then(() => {
                // здесь мы уже имеем все изменения
                console.log(objectsInDays);
                // теперь нужно разбить этот список объектов на дни
                let minutes = 0;
                let i; // index активного для заполнения (последним созданного дня)
                const timeBorder = 12*60; // 12 часов в день по 60 минут
                objectsInDays.forEach((obj, index) => {
                    totalTime = totalTime + obj.timeInWay + obj.time + obj.stopTime;
                    totalWay += obj.way;
                    // день первый - создаем день
                    if (index === 0) {
                        days.push({
                            id: index + 1,
                            dateStart: moment(dateStart).format('YYYY-MM-DD'),
                            dateEnd: moment(dateStart).format('YYYY-MM-DD'),
                            timeStart: timeStart,
                            timeEnd: "00:00",
                            startPoint: obj.name,
                            startPointCoordLat: obj.startPointCoordLat,
                            startPointCoordLong: obj.startPointCoordLong,
                            endPoint: null,
                            endPointCoordLat: null,
                            endPointCoordLong: null,
                            objects: [obj]
                        })
                        i = days.length - 1;
                    }
                    // слишком длинный отрезок
                    else if (obj.timeInWay > 12*60) {
                        // он второй в списке (будет полюбому 3 и выше)
                        if (days[i].objects.length === 1) {
                            days[i].timeEnd = this.getTimeEnd(timeStart, obj.timeInWay + obj.time);
                            days[i].endPoint = obj.name;
                            days[i].endPointCoordLat = obj.startPointCoordLat;
                            days[i].endPointCoordLong = obj.startPointCoordLong;
                            days[i].objects.push(obj);
                            days.push({
                                id: i + 2,
                                dateStart: moment(dateStart).add(i + 1, 'days').format('YYYY-MM-DD'),
                                dateEnd: moment(dateStart).add(i + 1, 'days').format('YYYY-MM-DD'),
                                timeStart: timeStart,
                                startPoint: obj.name,
                                startPointCoordLat: obj.startPointCoordLat,
                                startPointCoordLong: obj.startPointCoordLong,
                                objects: [obj]
                            });
                            i = days.length - 1;
                        }
                        else {
                            const prevObj = objectsInDays[index - 1];
                            days[i].timeEnd = this.getTimeEnd(days[i].timeStart, minutes);
                            days[i].endPoint = prevObj.name;
                            days[i].endPointCoordLat = prevObj.startPointCoordLat;
                            days[i].endPointCoordLong = prevObj.startPointCoordLong;
                            days.push({
                                id: i + 2,
                                dateStart: moment(dateStart).add(i + 1, 'days').format('YYYY-MM-DD'),
                                dateEnd: moment(dateStart).add(i + 1, 'days').format('YYYY-MM-DD'),
                                timeStart: timeStart,
                                timeEnd: this.getTimeEnd(timeStart, obj.timeInWay + obj.time),
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
                                timeStart: timeStart,
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
                        days[i].timeEnd = this.getTimeEnd(timeStart, minutes + obj.timeInWay + obj.time);
                        days[i].endPoint = obj.name;
                        days[i].endPointCoordLat = obj.startPointCoordLat;
                        days[i].endPointCoordLong = obj.startPointCoordLong;
                        days[i].objects.push(obj);
                        minutes = 0;
                        // и это не последний объект, создает начало сл. дня
                        if (index !== objectsInDays.length - 1) {
                            days.push({
                                id: index + 1,
                                dateStart: moment(dateStart).add(i + 1, 'days').format('YYYY-MM-DD'),
                                dateEnd: moment(dateStart).add(i + 1, 'days').format('YYYY-MM-DD'),
                                timeStart: timeStart,
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
                        if (index === objectsInDays.length - 1) {
                            days[i].timeEnd = this.getTimeEnd(timeStart, minutes);
                            days[i].endPoint = obj.name;
                            days[i].endPointCoordLat = obj.startPointCoordLat;
                            days[i].endPointCoordLong = obj.startPointCoordLong;
                        }
                    }
                });
                console.log(days, totalTime, totalWay);

                resolve({
                    days,
                    totalTime,
                    totalWay,
                    pointsList: objectsInDays,
                });
            })
        });
    }

    updateDaysRoute(days) {
        let totalTime = 0;
        let totalWay = 0;
        let points = [];
        days.forEach(day => {
            day.objects.forEach(object => {
                if (isEmpty(points)) {
                    points.push(object); // первый элемент
                }
            })
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
                color: "#FD9080",
                imagePoint: "/assets/images/icons/marker_yellow.svg",
                imageFlag: "/assets/images/icons/flag_yellow.svg",
            }
        }
    }
}