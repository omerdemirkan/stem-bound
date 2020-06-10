import { SchoolDataOriginal } from "../config/types.config";
import csvParser from 'csv-parse';

// Note: These helpers will be working with data on the hundreds of thousands.
// Performance is a huge priority, if you are contibuting please keep that in mind.
// Also, I'm trying to make as many things asynchonous and non-blocking as possible.

export async function getFilteredSchoolData(schoolsData: SchoolDataOriginal[]) {
    // Note: I'm avoiding creating a new array on each deletion.
    // If this looks weird thats why.

    // https://web.archive.org/web/20170403221045/https://blogs.oracle.com/greimer/entry/best_way_to_code_a
    let school;
    let filteredSchoolData = [];
    let i = schoolsData.length;

    while (i--) {
        school = schoolsData[i]
        if ( school.END_GRADE === '12' ) {
            filteredSchoolData.push(school);
        }
    }
    // to remove the resulting 'undefined' objects.
    return filteredSchoolData;
}

export async function mapSchoolData(schoolsData: SchoolDataOriginal[]) {
    return schoolsData.map((schoolData: SchoolDataOriginal) => ({
        name: schoolData.NAME,
        ncesid: schoolData.NCESID,
        districtId: schoolData.DISTRICTID,
        startGrade: +schoolData.ST_GRADE,
        endGrade: +schoolData.END_GRADE,
        location: {
            country: schoolData.COUNTRY,
            state: schoolData.STATE,
            city: schoolData.CITY,
            zip: schoolData.ZIP,
            county: schoolData.COUNTY,
            latitude: +schoolData.LATITUDE,
            longitude: +schoolData.LONGITUDE
        },
        demographics: {
            enrollment: +schoolData.ENROLLMENT,
            numTeachers: +schoolData.FT_TEACHER
        }
    }))
}

export async function getFilteredAndMappedSchoolData(schoolsData: SchoolDataOriginal[]) {
    return await mapSchoolData(
        await getFilteredSchoolData(schoolsData)
    );
}

export function parseCsvAsync(csvString: string, options: csvParser.Options) {
    return new Promise<SchoolDataOriginal[]>(function (resolve, reject) {
        csvParser(csvString, options, async (err: any, schoolsData: SchoolDataOriginal[]) => {
            if (err) throw err;
            resolve(schoolsData)
        })
    });
}

export { SchoolDataLocal, SchoolDataOriginal } from '../config/types.config';
export { schoolCsvColumns } from '../config/constants.config'