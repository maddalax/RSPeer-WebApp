import {ApiService} from "../../Common/ApiService";

export class InstanceService {

    private api : ApiService;

    constructor() {
        this.api = new ApiService();
    }
    
    public async getRunning() : Promise<number> {
        return await this.api.get("instance/runningClientsCount");
    }

}