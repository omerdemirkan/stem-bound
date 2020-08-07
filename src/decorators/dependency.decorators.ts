import * as dependencies from "../config/dependency.config";
import { EDependencies } from "../types";

const dependenciesByKey = {
    [EDependencies.BCRYPT]: dependencies.bcrypt,
    [EDependencies.JWT]: dependencies.jwt,
};

export function dependency(dependencyKey: EDependencies) {
    return function (target: any, key: string | symbol) {
        Object.defineProperty(target, key, {
            value: dependenciesByKey[dependencyKey],
        });
    };
}
