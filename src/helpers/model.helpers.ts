// Because this function may be used for intensive operations,
// performance is a priority.

import { Types } from "mongoose";
import { passwordRegex, urlRegex } from "../constants";

export const schemaValidators = {
    uniqueStringArray(values: string[]): boolean {
        const stringSet = new Set();

        let i = values.length;
        while (i--) {
            if (stringSet.has(values[i])) return false;
            stringSet.add(values[i]);
        }
        return true;
    },

    uniqueIdArray(values: Types.ObjectId[]): boolean {
        const stringSet = new Set();

        let i = values.length;
        while (i--) {
            if (stringSet.has(values[i].toHexString())) return false;
            stringSet.add(values[i].toHexString());
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

    combineValidators(...validators: ((el) => boolean)[]) {
        return function (data) {
            for (let i = 0; i < validators.length; i++)
                if (!validators[i](data)) return false;
            return true;
        };
    },
};
