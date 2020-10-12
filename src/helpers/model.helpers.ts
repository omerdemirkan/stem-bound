// Because this function may be used for intensive operations,
// performance is a priority.

import { passwordRegex, urlRegex } from "../constants";

export const schemaValidators = {
    uniqueStringArray(values: string[]): boolean {
        let obj: any = {};

        let i = values.length;
        while (i--) {
            if (obj[values[i]]) return false;
            obj[values[i]] = true;
        }
        return true;
    },

    email(email: string) {
        return passwordRegex.test(email);
    },

    url(url) {
        return urlRegex.test(url);
    },

    arrayLength({ min, max }: { min: number; max: number }) {
        return (array: any[]) => array.length <= max && array.length >= min;
    },

    uniqueKeyMapping(mapFuncion: (any) => string) {
        return function (array: any[]) {
            let valuesHashTable = {};
            let i = array.length;
            while (i--) {
                valuesHashTable[mapFuncion(array[i])] = true;
            }
            return array.length === Object.keys(valuesHashTable).length;
        };
    },
};
