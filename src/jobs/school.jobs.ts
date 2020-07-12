import { Model, Document } from "mongoose";
import {
    getFilteredAndMappedSchoolData,
    parseCsvAsync,
    schoolCsvColumns,
    ISchoolDataOriginal,
} from "../helpers/school-db.helpers";

import Schools from "../models/school.model";
import { fetch } from "../config/dependency.config";

const defaultUrl =
    "https://opendata.arcgis.com/datasets/87376bdb0cb3490cbda39935626f6604_0.csv?outSR=%7B%22latestWkid%22%3A3857%2C%22wkid%22%3A102100%7D";

export async function refreshSchoolDatabase({
    url,
}: {
    url?: string;
}): Promise<
    | { results: { deletionData: any; insertionData: any } }
    | { error: { message: string } }
> {
    const { data: csvData } = await fetch.get(url || defaultUrl);

    const fetchedSchoolsData: ISchoolDataOriginal[] = await parseCsvAsync(
        csvData,
        {
            trim: true,
            skip_empty_lines: true,
            columns: schoolCsvColumns,
        }
    );

    const updatedSchoolsData = await getFilteredAndMappedSchoolData(
        fetchedSchoolsData
    );
    const numUpdatedSchools = updatedSchoolsData.length;
    const numExistingSchools = await Schools.countDocuments();

    if (!numUpdatedSchools) {
        return {
            error: {
                message: "The fetched number of schools was found to be 0.",
            },
        };
    } else if (numUpdatedSchools === numExistingSchools) {
        return {
            error: {
                message:
                    "The data fetched data appears to be the same as that currently in the database",
            },
        };
    }

    const deletionData = await Schools.deleteMany({});
    const insertionData = await Schools.insertMany(updatedSchoolsData);

    return {
        results: {
            deletionData,
            insertionData: {
                numInserted: insertionData.length,
            },
        },
    };
}
