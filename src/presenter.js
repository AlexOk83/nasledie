import moment from "moment";
const update = (items, typeMovement) => items.map((point, index) => new Promise((resolve, reject) => {
    ymaps.ready(function() {
        const routingMode = typeMovement === 'car' ? 'auto' : 'pedestrian';
        if (index !== 0) {
            const p1 = [items[index - 1].startPointCoordLat, items[index - 1].startPointCoordLong];
            const p2 = [point.startPointCoordLat, point.startPointCoordLong];
            ymaps.route([p1, p2], { routingMode }).then(function(route) {
                point.way = Math.round(route.getLength());
                point.timeInWay = Math.round(route.getTime()/60);
                resolve(point);
            }, function () {
                reject(e => console.log(e))
            })
        } else {
            resolve(point)
        }
    })
}));

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
            } = params;
            let days = [];
            let totalTime = 0;
            let totalWay = 0;
            // формируем список объектов с необходимыми параметрами
            let objectsInDays = [
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
                ...mapPoints.map(obj => {
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
            // дополняем список растоянием между точками и временем прохождения
            Promise.all(update(objectsInDays, typeMovement)).then(() => {
                // здесь мы уже имеем все изменения
                console.log(objectsInDays);
                // теперь нужно разбить этот список объектов на дни
                let time = 0; // сколько пройдено пути по времени
                let minutes = 0;
                const timeBorder = 12*60; // 12 часов в день по 60 минут
                objectsInDays.forEach((obj, index) => {
                    let i = days.length - 1;
                    totalTime = totalTime + obj.timeInWay;
                    totalWay = totalWay + obj.way;
                    if (index === 0) {
                        days.push({
                            id: index + 1,
                            dateStart: moment(dateStart).format('YYYY-MM-DD'),
                            dateEnd: moment(dateStart).format('YYYY-MM-DD'),
                            timeStart: timeStart,
                            timeEnd: "00:00",
                            startPoint: obj.name,
                            startPointCoordLat: obj.startPointCoordLat,
                            startPointCoordLong: obj.startPointCoordLat,
                            endPoint: null,
                            endPointCoordLat: null,
                            endPointCoordLong: null,
                            objects: [obj]
                        })
                        i = days.length - 1;
                    }
                    else {
                        minutes = time + obj.timeInWay + obj.time + obj.stopTime;
                        if (minutes >= timeBorder) {
                            time = 0;
                            days[i].timeEnd = this.getTimeEnd(days[i].timeStart, minutes);
                            days[i].endPoint = obj.name;
                            days[i].endPointCoordLat = obj.startPointCoordLat;
                            days[i].endPointCoordLong = obj.startPointCoordLat;
                            days[i].objects.push(obj);
                            if (index !== objectsInDays.length - 1) {
                                days.push({
                                    id: index + 1,
                                    dateStart: moment(dateStart).add(i + 1, 'days').format('YYYY-MM-DD'),
                                    dateEnd: moment(dateStart).add(i + 1, 'days').format('YYYY-MM-DD'),
                                    timeStart: timeStart,
                                    timeEnd: '00"00',
                                    startPoint: obj.name,
                                    startPointCoordLat: obj.startPointCoordLat,
                                    startPointCoordLong: obj.startPointCoordLat,
                                    endPoint: null,
                                    endPointCoordLat: null,
                                    endPointCoordLong: null,
                                    objects: [obj]
                                });
                                i = days.length - 1;
                            }
                        }
                        else {
                            days[i].objects.push(obj);
                        }
                    }
                    if (index === objectsInDays.length - 1) {
                        days[i].timeEnd = this.getTimeEnd(days[i].timeStart, minutes);
                        days[i].endPoint = obj.name;
                        days[i].endPointCoordLat = obj.startPointCoordLat;
                        days[i].endPointCoordLong = obj.startPointCoordLat;
                    }

                });
                console.log(days, totalTime, totalWay);

                resolve({
                    days,
                    totalTime,
                    totalWay
                });
            })
        });
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
                startPointCoordLat: day.pointStart.position[0],
                startPointCoordLong: day.pointStart.position[1],
                endPoint: day.pointEnd.name,
                endPointCoordLat: day.pointEnd.position[0],
                endPointCoordLong: day.pointEnd.position[1],

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