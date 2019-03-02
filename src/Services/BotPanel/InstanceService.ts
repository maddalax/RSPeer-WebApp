import {ApiService} from "../../Common/ApiService";

export class InstanceService {

    private api : ApiService;

    constructor() {
        this.api = new ApiService();
    }

    public async canRunMore() : Promise<boolean> {
        const limits = await this.getLimits();
        return limits.canRunMore === true;
    }

    public async getLimits() {
        const allowed =  await this.api.get("instance/allowedClients");
        const current =  await this.api.get("instance/runningClientsCount");
        return {
            allowed,
            running : current,
            canRunMore : allowed > current
        }
    }

}