import axios from 'axios';

declare global {
    interface Window { rspeer: {apiUrl : string } }
}

window.rspeer = window.rspeer || {};

export class ApiService {

    private buildConfig = () => {
        const session = localStorage.getItem("session");
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
            return this.parseError(e);
        }
    }

    private parseError = (ex : any) => {
        if(!ex.response) {
            return {error : "Something went wrong."};
        }
        const error = ex.response.data;
        return {error : error.body || 'Something went wrong.'}
    };

}