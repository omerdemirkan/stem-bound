export function containsDuplicates<T>(
    values: T[],
    mapFunc?: (value: T) => any
) {
    const valueSet = new Set();
    mapFunc = mapFunc || ((a) => a);
    for (let i = 0; i < values.length; i++) {
        const key = mapFunc(values[i]);
        if (valueSet.has(key)) return true;
        valueSet.add(key);
    }
    return false;
}

export function filterDuplicates<T>(values: T[], mapFunc?: (value: T) => any) {
    const valueSet = new Set();
    mapFunc = mapFunc || ((a) => a);
    const newValues = [];
    for (let i = 0; i < values.length; i++)
        if (!valueSet.has(mapFunc(values[i]))) newValues.push(values[i]);

    return newValues;
}
