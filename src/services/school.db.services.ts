import { Container, Service, Inject } from 'typedi';
import fs from 'fs'
import axios from 'axios'

import { Model, Document } from 'mongoose';
import {
    getFilteredAndMappedSchoolData,
    parseCsvAsync,
    schoolCsvColumns,
    SchoolDataLocal,
    SchoolDataOriginal
} from '../helpers/school.db.helpers'

@Service()
export default class SchoolDatabaseService {

    private defaultUrl = 'https://opendata.arcgis.com/datasets/87376bdb0cb3490cbda39935626f6604_0.csv?outSR=%7B%22latestWkid%22%3A3857%2C%22wkid%22%3A102100%7D';

    constructor(
        @Inject('models.School') private School: Model<Document>
    ) { }

    async refreshSchoolDatabase(url: string = this.defaultUrl) {
        const { data } = await axios.get(url);
        
        if (!fs.existsSync('data')) {
            fs.mkdirSync('data')
        }
        // const file = fs.createWriteStream('data/schools.csv');
        // file.write(data);

        const schoolsData = await parseCsvAsync(data, {
            trim: true,
            skip_empty_lines: true,
            columns: schoolCsvColumns
        })

        const result = await getFilteredAndMappedSchoolData(schoolsData);
    }
}

// const schoolDatabaseService = Container.get(SchoolDatabaseService);

// schoolDatabaseService.refreshSchoolDatabase();