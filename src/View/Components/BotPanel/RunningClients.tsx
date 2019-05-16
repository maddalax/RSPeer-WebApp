import React from 'react'
import {ApiService} from "../../../Common/ApiService";
import {Util} from "../../../Utilities/Util";
import {RunescapeClient} from "../../../Models/RunescapeClient";
import {Alert} from "../../../Utilities/Alert";

type State = {
    clients : RunescapeClient[],
    loading : boolean
}

export class RunningClients extends React.Component<any, State> {
    
    private readonly api : ApiService;
    private interval : any;
    
    constructor(props : any) {
        super(props);
        this.api = new ApiService();
        this.state = {
            clients : [],
            loading : false
        }
    }
    
    async componentDidMount() {
        this.load();
        this.interval = setInterval(this.load, 20000)
    }
    
    componentWillUnmount(): void {
        this.interval && clearInterval(this.interval)
    }

    private load = async () => {
        this.setState({loading : true});
        const clients = await this.api.get("botLauncher/connectedClients");
        this.setState({clients, loading : false});
    };

    send = async (client : any, message : string, reload = false) => {
        if(!client.tag) {
            Alert.show("Client did not have tag? Cannot send message: " + message);
            return;
        }
        await this.api.post(`botLauncher/sendNew?message=${message}&tag=${client.tag}`, {});
        if(reload) {
            setTimeout(this.load, 1500);
        }
    };
    
    render() {
        return <div>
            <h6>Total Running Clients: {this.state.clients.length}</h6>
            <button className={"btn btn-success"} onClick={this.load}>{this.state.loading ? 'Loading...' : 'Refresh'}</button>
            <br/><br/>
            <table className="table table-bordered">
                <thead>
                <tr>
                    <th scope="col">Email</th>
                    <th scope="col">RSN</th>
                    <th scope="col">Script</th>
                    <th scope="col">Proxy</th>
                    <th scope="col">Machine</th>
                    <th scope="col">Last Update</th>
                    <th scope="col">Screenshot</th>
                    <th scope="col">Kill</th>
                </tr>
                </thead>
                <tbody>
                {this.state.clients.map((i: RunescapeClient, index: number) => {
                    return <tr key={i.tag}>
                        <td>{i.runescapeEmail || "Not Logged In"}</td>
                        <td>{i.rsn || "Not Logged In"}</td>
                        <td>{i.scriptName || "No Script"}</td>
                        <td>{i.proxyIp || "No Proxy"}</td>
                        <td>{i.machineName || "No Machine"}</td>
                        <td>{Util.formatDate(i.lastUpdate, true)}</td>
                        <td><a href={"#"}>Get Screenshot</a></td>
                        <td><a href={"javascript:void(0)"} onClick={() => this.send(i, ':kill', true)}>Kill Client</a></td>
                    </tr>
                })}
                </tbody>
            </table>
        </div>
    }
    
}