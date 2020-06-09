export function getErrorStatusCode(error: Error) {
    console.log(error);
    return 400;
}

export const resConfig = {
    getErrorStatusCode
}