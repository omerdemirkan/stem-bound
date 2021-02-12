export function containsDuplicates<T>(
    values: T[],
    mapFunc?: (value: T) => any
) {
    const valueSet = new Set();
    mapFunc = mapFunc || ((a) => a);
    for (let i = 0; i < values.length; i++) {
        const value = mapFunc(values[i]);
        if (valueSet.has(value)) return true;
        valueSet.add(value);
    }
    return false;
}
