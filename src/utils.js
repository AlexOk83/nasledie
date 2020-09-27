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
    const dLat = deg2rad(lat2-lat1);  // deg2rad below
    const dLon = deg2rad(lon2-lon1);
    const a =
        Math.sin(dLat/2) * Math.sin(dLat/2) +
        Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
        Math.sin(dLon/2) * Math.sin(dLon/2)
    ;
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    const d = R * c * 1000; // Distance in meters
    return Math.ceil(d);
}

function deg2rad(deg) {
    return deg * (Math.PI/180)
};

export function isEqual(p1, p2) {
    if (!p1 || !p2) {
        return false;
    }
    const [lat1, long1] = p1;
    const [lat2, long2] = p2;

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