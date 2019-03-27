import {ApiService} from "../../Common/ApiService";
import {Util} from "../../Utilities/Util";
import {Alert} from "../../Utilities/Alert";

export class FileService {
    
    private readonly api : ApiService;
    
    constructor() {
        this.api = new ApiService();
    }
    
    async saveFile(name : string, content : string) {
        const result = await this.api.post(`files/putString`, {
            name : name,
            contents : Util.toByteArray(content),
        });
        if(!result.error) {
            Alert.success("Successfully saved " + name + ".");
        }
    }
    
    async getFile(name : string) : Promise<string> {
        return await this.api.get(`files/getString?name=${name}`);
    }
    
}

export class FileConstants {
    
    public static readonly DASHBOARD_RECENT_NEWS = "dashboard_recent_news.html";
    public static readonly DASHBOARD_QUICK_LINKS = "dashboard_quick_links.html";
    public static readonly PRIVACY_POLICY = "privacy_policy.html";
    public static readonly GET_STARTED = "get_started.html";

}