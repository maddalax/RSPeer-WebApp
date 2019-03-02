import {Alert} from "../../Utilities/Alert";
import {ApiService} from "../../Common/ApiService";

export class ProxyService {

    private readonly api: ApiService;

    constructor() {
        this.api = new ApiService();
    }

    public async loadProxies() {
        const proxies = await this.api.get("botLauncher/getProxies");
        if (proxies.error) {
            Alert.show(proxies.error);
            return [];
        }
        return proxies;
    };
}