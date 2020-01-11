import axios from 'axios';
import {Alert} from "../Utilities/Alert";
import {UserUtil} from "../Utilities/UserUtil";

declare global {
    interface Window { rspeer: {apiUrl : string } }
}

window.rspeer = window.rspeer || {};

export interface ApiConfig {
    supressAlert? : boolean
    throwError? : boolean
}

export class ApiService {

    private apiConfig : ApiConfig;

    constructor(config : ApiConfig = {supressAlert : false, throwError : false}) {
        this.apiConfig = config;
    }

    private buildConfig = (additionalConfig : any = {}) => {
        const session = UserUtil.getSession();
        const accessKey = UserUtil.getAccessKey();
        const headers : any = {};
        if(session) {
            headers.Authorization = "Bearer " + session;
        }
        if(accessKey) {
            headers['X-Dashboard-Key'] = accessKey;
        }
        additionalConfig.headers = additionalConfig.headers || {};
        additionalConfig.headers = {...additionalConfig.headers, ...headers};
        return additionalConfig;
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

    public async postFormData(path : string, body : any) : Promise<any> {
        const formData = new FormData();
        Object.keys(body).forEach(key => {
            formData.append(key, body[key])
        });
        return this.execute(async () => {
            let config = this.buildConfig();
            config.headers['content-type'] = 'multipart/form-data';
            const {data} = await axios.post(this.buildPath(path), formData, config);
            return data;
        });
    }

    public async get(path : string, config : {} = {}) : Promise<any> {
        return this.execute(async () => {
            const res = await axios.get(this.buildPath(path), this.buildConfig(config));
            return res.data;
        })
    }

    private async execute(func : () => Promise<any>) {
        try {
            return await func();
        } catch (e) {
            const error = this.parseError(e);
            if(this.apiConfig.throwError) {
                throw e;
            }
            if(!this.apiConfig.supressAlert && error) {
                Alert.show(error.error);
            }
            return error;
        }
    }
    
    private checkDashboardKey = (ex : any) : boolean => {
        if(ex.response && ex.response.data) {
            const err = ex.response.data.error;
            if(err === "dashboard_key_invalid") {
                window.location.replace("/#/administration/key");
                return true;
            }
        } 
        return false;
    };

    private parseError = (ex : any) => {
        if(this.checkDashboardKey(ex)) {
            return {error : 'Invalid access key.'};
        }
        if(ex.toString() === "Error: Network Error") {
            return {error : 'Failed to contact RSPeer Servers. Please try again.'}
        }
        if(!ex.response) {
            return {error : "Something went wrong."};
        }
        const status = ex.response.status;
        if(status === 429) {
            return {error : 'You have been rate limited, please try again in 1 minute.'}
        }
        if(status === 401) {
            return {error : 'You are not authorized to this resource.'}
        }
        const error = ex.response.data;
        return {error : error.error || 'Something went wrong.'}
    };
}