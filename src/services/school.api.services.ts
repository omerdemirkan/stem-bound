import { Service } from 'typedi';
import axios from 'axios'

@Service()
export default class SchoolApiService {
    private defaultUrl: string = 'https://services1.arcgis.com/Hp6G80Pky0om7QvQ/arcgis/rest/services/Public_Schools/FeatureServer/0/query?where=1%3D1&outFields=*&outSR=4326&f=json';
    
    constructor() { }

    async getSchools() {
        const { data } = await axios.get(this.defaultUrl);
        return data.features;
    }
}