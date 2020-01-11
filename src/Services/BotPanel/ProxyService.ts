import {Alert} from "../../Utilities/Alert";
import {ApiService} from "../../Common/ApiService";

export class ProxyService {

    private readonly api: ApiService;

    constructor() {
        this.api = new ApiService();
    }

    public async loadProxies() {
        let proxies = await this.api.get("botLauncher/getProxies");
        if (proxies.error || !Array.isArray(proxies)) {
            Alert.show(proxies.error);
            return [];
        }
        proxies = proxies.map(p => {
            p.display = `${p.name} - ${p.ip}:${p.port}`;
            return p;
        });
        return proxies;
    };
}