import {ApiService} from "../../Common/ApiService";

export class LogService {

    private api : ApiService;

    constructor() {
        this.api = new ApiService();
    }

    public async getErrors(launcher : string, top : number, skip : number) {
       return await this.getLogs(launcher, top, skip, 'error')
    }

    public async getMessages(launcher : string, top : number, skip : number) {
        return await this.getLogs(launcher, top, skip, 'message');
    }

    public async getLogs(launcher : string, top : number, skip : number, type : string) {
        return await this.api.get(`botLauncher/logs?id=${launcher}&top=${top}&skip=${skip}&type=${type}`);
    };
}