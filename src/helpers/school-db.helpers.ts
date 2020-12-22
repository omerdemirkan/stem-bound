import { ISchoolDataOriginal } from "../types";
import csvParser from "csv-parse";

// Note: These helpers will be working with data on the hundreds of thousands.
// Performance is a huge priority, if you are contibuting please keep that in mind.
// Also, I'm trying to make as many things asynchonous and non-blocking as possible.

export async function getFilteredSchoolData(
    schoolsData: ISchoolDataOriginal[]
) {
    // Note: I'm avoiding creating a new array on each deletion.
    // If this looks weird thats why.

    // https://web.archive.org/web/20170403221045/https://blogs.oracle.com/greimer/entry/best_way_to_code_a
    let school;
    let filteredSchoolData = [];
    let i = schoolsData.length;

    while (i--) {
        school = schoolsData[i];
        if (school.END_GRADE === "12" && school.STATUS !== "2") {
            filteredSchoolData.push(school);
        }
    }
    // to remove the resulting 'undefined' objects.
    return filteredSchoolData;
}

export async function mapSchoolData(schoolsData: ISchoolDataOriginal[]) {
    return schoolsData.map((schoolData: ISchoolDataOriginal) => ({
        name: schoolData.NAME,
        ncesid: schoolData.NCESID,
        districtId: schoolData.DISTRICTID,
        startGrade: +schoolData.ST_GRADE || -1,
        endGrade: +schoolData.END_GRADE,
        type: +schoolData.TYPE,
        status: +schoolData.STATUS,
        location: {
            country: schoolData.COUNTRY,
            state: schoolData.STATE,
            city: schoolData.CITY,
            zip: schoolData.ZIP,
            county: schoolData.COUNTY,
            latitude: +schoolData.LATITUDE,
            longitude: +schoolData.LONGITUDE,
            geoJSON: {
                type: "Point",
                coordinates: [+schoolData.LONGITUDE, +schoolData.LATITUDE], // In GeoJSON longitude comes first.
            },
        },
        demographics: {
            enrollment: +schoolData.ENROLLMENT,
            numTeachers: +schoolData.FT_TEACHER,
            url: schoolData.SOURCE,
        },
        contact: {
            telephone: schoolData.TELEPHONE,
            website: schoolData.WEBSITE,
        },
    }));
}

export async function getFilteredAndMappedSchoolData(
    schoolsData: ISchoolDataOriginal[]
) {
    return await mapSchoolData(await getFilteredSchoolData(schoolsData));
}

export function parseCsvAsync(
    csvString: string,
    options: csvParser.Options
): Promise<any> {
    return new Promise<any>(function (resolve, reject) {
        csvParser(csvString, options, async (err: any, data) => {
            if (err) throw err;
            resolve(data);
        });
    });
}
