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