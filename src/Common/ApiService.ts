import axios from 'axios';
import {Alert} from "../Utilities/Alert";
import {UserUtil} from "../Utilities/UserUtil";

declare global {
    interface Window { rspeer: {apiUrl : string } }
}

window.rspeer = window.rspeer || {};

export interface ApiConfig {
    supressAlert : boolean
}

export class ApiService {

    private apiConfig : ApiConfig;

    constructor(config : ApiConfig = {supressAlert : false}) {
        this.apiConfig = config;
    }

    private buildConfig = () => {
        const session = UserUtil.getSession();
        const headers : any = {};
        if(session) {
            headers.Authorization = "Bearer " + session;
        }
        return {
            headers
        };
    };

    private buildPath = (path : string) => {
        return `${window.rspeer.apiUrl}${path}`
    };

    public async post(path : string, body : any, headers? : any) : Promise<any> {
        return this.execute(async () => {
            let config = this.buildConfig();
            config.headers = Object.assign(config.headers, headers);
            const {data} = await axios.post(this.buildPath(path), body, config);
            return data;
        });
    }

    public async get(path : string) : Promise<any> {
        return await this.execute(async () => {
            const {data} = await axios.get(this.buildPath(path), this.buildConfig());
            return data;
        })
    }

    private async execute(func : () => Promise<any>) {
        try {
            return await func();
        } catch (e) {
            const error = this.parseError(e);
            if(!this.apiConfig.supressAlert) {
                Alert.show(error.error);
            }
            return error;
        }
    }

    private parseError = (ex : any) => {
        console.log(ex);
        if(!ex.response) {
            return {error : "Something went wrong."};
        }
        const error = ex.response.data;
        return {error : error.error || 'Something went wrong.'}
    };

}