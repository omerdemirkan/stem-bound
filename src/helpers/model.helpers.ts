

// Because this function may be used for intensive operations,
// performance is a priority.

export const schemaValidators = {

    uniqueStringArray (values: string[]): boolean {
        let obj: any = {};

        let i = values.length;
        while (i--) {
            if (obj[values[i]]) return false;
            obj[values[i]] = true;
        }
        return true;
    },

    email (email: string) {
        return /[^@ \t\r\n]+@[^@ \t\r\n]+\.[^@ \t\r\n]+/.test(email);
    },

    arrayLength({ min, max }: { min: number, max: number }) {
        return (array: any[]) => (array.length <= max && array.length >= min)
    }
}