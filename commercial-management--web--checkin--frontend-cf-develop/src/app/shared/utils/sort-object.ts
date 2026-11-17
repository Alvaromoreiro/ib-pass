export function sortObject (obj: unknown) {
    if (Array.isArray(obj)) {
        return obj.map(sortObject);
    } else if (isPlainObject(obj)) {
        return Object.keys(obj)
            .sort()
            .reduce((result, key) => {
                result[key] = sortObject(obj[key]);
                return result;
            }, {});
    }

    return obj;
}

function isPlainObject (value: unknown) {
    return (
        typeof value === 'object' &&
        value !== null &&
        !Array.isArray(value) &&
        Object.getPrototypeOf(value) === Object.prototype
    );
}