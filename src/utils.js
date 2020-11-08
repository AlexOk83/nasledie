import {isEmpty} from "lodash";

export function setFirstLetterToUppercase(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

export function setCoordsToNumeric(coord) {
    if (Array.isArray(coord)) {
        return coord.map(point => (Number(point)))
    }
    let c = coord.split(', ')

    return c.map(point => (Number(point)))
}

export function setCoordsToString(coord) {
    if (Array.isArray(coord)) {
        return coord.map(point => (String(point)))
    }
    return coord.split(', ')
}

export function getAdress(point) {
    if (isEmpty(point)) {
        return '';
    }
    if (isEmpty(point.description)) {
        return point.name;
    }
    let desc = point.description.split(', ');

    let d = '';
    if (desc.length > 1) {
        desc.splice(0, 1);
        desc = desc.join(', ')

    }

    if (desc) {
        d = ', '
    }
    return `${desc}${d}${point.name}`;
}

export function getDistanceFromLatLonInMeters(point1, point2) {
    const [lat1, lon1] = point1;
    const [lat2, lon2] = point2;
    const R = 6371; // Radius of the earth in km
    const dLat = deg2rad(lat2 - lat1);  // deg2rad below
    const dLon = deg2rad(lon2 - lon1);
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2)
    ;
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const d = R * c * 1000; // Distance in meters
    return Math.ceil(d);
}

export function getTimeInWay(distance) {
    const distanceInKm = distance / 1000;
    if (distanceInKm < 100) {
        return Math.round(distanceInKm / 25 * 60);
    } else if (distanceInKm < 400) {
        return Math.round(distanceInKm / 90 * 60);
    }
    return Math.round(distanceInKm / 900 * 60);
}

export function getTypeMovement(distance) {
    const distanceInKm = distance / 1000;
    if (distanceInKm < 100) {
        return ['ship']
    } else if (distanceInKm < 400) {
        return ['train']
    }
    return ['plane']
}

function deg2rad(deg) {
    return deg * (Math.PI / 180)
};

export function isEqual(p1, p2) {
    if (!p1 || !p2) {
        return false;
    }
    const [lat1, long1] = setCoordsToNumeric(p1);
    const [lat2, long2] = setCoordsToNumeric(p2);

    return Boolean(lat1 === lat2 && long1 === long2);
}

export function calcTime(distance, typeMovement) {
    if (typeMovement === 'people') {
        return Math.round(distance / 5);
    }
    if (distance > 1080000) { // d > 1080 км (90 км/ч * 12 часов)
        return Math.round(distance / 800)
    }
    return Math.round(distance / 90)
}

const sort = (start) => (a, b) => {
    if (getDistanceFromLatLonInMeters(start, a.position) > getDistanceFromLatLonInMeters(start, b.position)) return 1;
    if (getDistanceFromLatLonInMeters(start, a.position) < getDistanceFromLatLonInMeters(start, b.position)) return -1;
    if (getDistanceFromLatLonInMeters(start, a.position) === getDistanceFromLatLonInMeters(start, b.position)) return 0;
}

export function sortGeo(start, pointList) {
    let newPointList = [];
    let oldPointList = [...pointList];


    while (oldPointList.length > 0) {
        let startPoint = (newPointList[newPointList.length - 1] && newPointList[newPointList.length - 1].position) || start;
        oldPointList.sort(sort(startPoint));
        let shifter = oldPointList.shift();
        newPointList.push(shifter)
    }

    return newPointList;
}

export function getHourAndMinutes(time, asNumber) {
    if (!time) {
        return {
            hour: '00',
            minutes: '00'
        };
    }
    const hour = time[0] + time[1];
    const minutes = time[3] + time[4];
    if (asNumber) {
        return {
            hour: Number(hour),
            minutes: Number(minutes)
        }
    }
    return {
        hour,
        minutes
    }
}

export function getMinutesToTime(time) {
    const {hour, minutes} = getHourAndMinutes(time, true);
    return minutes + (hour * 60);
}

export function getTimeBorderDefault(startTime, endTime) {
    const startMinutes = getMinutesToTime(startTime);
    console.log(startTime, startMinutes);
    const endMinutes = getMinutesToTime(endTime || '21:00');
    console.log('21:00', endMinutes, endMinutes - startMinutes);
    return endMinutes - startMinutes;
}

export function getLastElement(mas) {
    return mas[mas.length - 1];
}

export function uniq(a){
    let seen = {};
    let result = [];
    a.forEach(item => {
        if (seen[item.id] !== 1) {
            seen[item.id] = 1;
            result.push(item);
        }
    })

    return result;
}

export function getPosition(point) {

    if (point.coordinates && Array.isArray(point.coordinates)) {
        return point.coordinates
    }

    if (point.position && Array.isArray(point.position)) {
        return point.position
    }

    return [point.startPointCoordLat, point.startPointCoordLong]

}
