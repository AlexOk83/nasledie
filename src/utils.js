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

// export function gep