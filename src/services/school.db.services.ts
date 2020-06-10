import { Service } from 'typedi';
import fs from 'fs'
import http from 'https';
import axios from 'axios'

@Service()
export default class SchoolDatabaseService {
    async refreshSchoolData() {
        if (!fs.existsSync('data')) {
            fs.mkdirSync('data')
        }
        const file = fs.createWriteStream('data/schools.csv');
        // const res = await http.get('https://opendata.arcgis.com/datasets/87376bdb0cb3490cbda39935626f6604_0.csv?outSR=%7B%22latestWkid%22%3A3857%2C%22wkid%22%3A102100%7D');

        // res.pipe(file)
        const { data } = await axios.get('https://opendata.arcgis.com/datasets/87376bdb0cb3490cbda39935626f6604_0.csv?outSR=%7B%22latestWkid%22%3A3857%2C%22wkid%22%3A102100%7D');

        file.write(data);
    }
}

// const schoolDatabaseService = new SchoolDatabaseService();

// schoolDatabaseService.refreshSchoolData();