import { Container, Service, Inject } from 'typedi';
import fs from 'fs'
import axios from 'axios'
import csvParser from 'csv-parse';

import { Model, Document } from 'mongoose';
import { schoolCsvColumns } from '../config/constants.config';
import { SchoolDataOriginal } from '../config/types.config';

// Note: This service will be working with data on the hundreds of thousands.
// Performance is a huge priority, if you are contibuting please keep that in mind.

@Service()
export default class SchoolDatabaseService {

    private defaultUrl = 'https://opendata.arcgis.com/datasets/87376bdb0cb3490cbda39935626f6604_0.csv?outSR=%7B%22latestWkid%22%3A3857%2C%22wkid%22%3A102100%7D';
    constructor(
        @Inject('models.School') private School: Model<Document>
    ) { }

    private getFilteredSchoolData(schoolsData: SchoolDataOriginal[]) {
        // Note: I'm avoiding creating a new array on each deletion.
        // If this looks weird thats why.
        const length = schoolsData.length;
        let i = 0;
        let school;
        let filteredSchoolData = [];

        while (i < length) {
            school = schoolsData[i]
            if ( school.END_GRADE !== '12' ) {
                filteredSchoolData.push(school);
            }
            i++;
        }
        // to remove the resulting 'undefined' objects.
        return filteredSchoolData;
    }

    private mapSchoolData(schoolsData: SchoolDataOriginal[]) {
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

    private getFilteredAndMappedSchoolData(schoolsData: SchoolDataOriginal[]) {
        return this.mapSchoolData(
            this.getFilteredSchoolData(schoolsData)
        );
    }

    async refreshSchoolData(url: string = this.defaultUrl) {
        const { data } = await axios.get(url);
        
        if (!fs.existsSync('data')) {
            fs.mkdirSync('data')
        }
        // const file = fs.createWriteStream('data/schools.csv');
        // file.write(data);

        csvParser(data, {
            trim: true,
            skip_empty_lines: true,
            columns: schoolCsvColumns
        }, (err: any, schoolsData: SchoolDataOriginal[]) => {
            console.log(err);

            try {
                const result = this.getFilteredAndMappedSchoolData(schoolsData)

                console.log(result);
            } catch (e) {
                console.log(e);
            }
        })
    }
}

// const schoolDatabaseService = Container.get(SchoolDatabaseService);

// schoolDatabaseService.refreshSchoolData();