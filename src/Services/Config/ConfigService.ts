import {ApiService} from "../../Common/ApiService";

export class ConfigService {

    static create(apiService : ApiService = new ApiService()) {
        return new ConfigService(apiService);
    }
    
    private readonly api : ApiService;
    
    constructor(api : ApiService = new ApiService()) {
        this.api = api;
    }
    
    public async get(key : string) : Promise<string> {
        return await this.api.get(`config/get?key=${key}`);   
    }

    public async set(key : string, value : string) {
        return await this.api.post(`adminConfig/set`, {
            key,
            value
        });
    }
}