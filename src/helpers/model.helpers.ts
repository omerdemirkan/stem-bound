

// Because this function may be used for intensive operations,
// performance is a priority.

export const schemaValidators = {

    uniqueArray (values: any[]): boolean {
        if (!values.length) return true;
        let i = values.length;
        let j;
        while (i--) {
            j = i - 1;
            while (j--) {
                if (values[i] === values[j]) {
                    return false;
                    break;
                }
            }
        }
        return true;
    },

    email (email: string) {
        return /[^@ \t\r\n]+@[^@ \t\r\n]+\.[^@ \t\r\n]+/.test(email);
    },

    arrayLength({ min, max }: { min: number, max: number }) {
        return (array: any[]) => (array.length <= max && array.length > min)
    }
}