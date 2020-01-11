import {Game} from "./ScriptDto";

export interface RunescapeClient {
    lastUpdate: string,
    proxyIp: string,
    machineName: string,
    scriptName: string,
    rsn: string,
    runescapeEmail: string,
    tag: string
    game : Game
}