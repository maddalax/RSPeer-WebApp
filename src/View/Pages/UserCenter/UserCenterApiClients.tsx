import * as React from "react";
import {ApiService} from "../../../Common/ApiService";
import {Alert} from "../../../Utilities/Alert";
import {Util} from "../../../Utilities/Util";

export interface ApiClient {
    key : string;
    timestamp : string
}

export type State = {
    client : ApiClient | null,
    loading: boolean
}

export class UserCenterApiClients extends React.Component<any, State> {
    
    private readonly api : ApiService;
    
    constructor(props : any) {
        super(props);
        this.api = new ApiService();
        this.state = {
            client : null,
            loading : true
        }
    }
    
    async componentDidMount() {
        const client = await this.api.get("apiClient/get");
        this.setState({loading : false});
        if(client.error) {
            Alert.show(client.error);
            return;
        }
        if(client) {
           this.setState({client}); 
        }
    }
    
    generateKey = async () => {
        if(this.state.loading) {
            return;
        }
        this.setState({loading : true});
        const client = await this.api.post('apiClient/create', {});
        this.setState({loading : false});
        if(client) {
            this.setState({client});
        }
    };

    deleteClient = async () => {
        if(this.state.loading) {
            return;
        }
        const confirm = window.confirm('Are you sure you want to delete this client? All applications using this api client key will no longer work.');
        if(!confirm) {
            return;
        }
        this.setState({loading : true});
        await this.api.post('apiClient/delete', {});
        this.setState({client : null});
        this.componentDidMount();
    };
    
    render() {
        return <div>
            <h3>RSPeer API Clients</h3>
            <p>API clients are a way to programmatically manage RSPeer resources via our API.</p>
            <p>This includes things such as programatically downloading the new client, 
                programmatically lauching clients, and various other methods you may need
            to have a fully automated farm.</p>
            <p><a target={"_blank"} href={"https://rspeer.org/docs/fully-automated-bot-farm/"}>View Fully Automated Bot Farm Guide</a></p>
            {this.state.client && <div>
                <div className="form-group">
                    <label htmlFor="forumThread">Api Client Key</label>
                    <input value={this.state.client.key}
                           type="text" className="form-control" readOnly={true} id="apiClientKey"/>
                    <p id="date" className="form-text text-muted">
                        Created On: {Util.formatDate(this.state.client.timestamp, true)}
                    </p>
                    {!this.state.loading && <button className={"btn btn-danger"} onClick={this.deleteClient}>Delete Api Client</button>}
                    {this.state.loading && <button className={"btn btn-danger"}>Processing...</button>}
                </div>
            </div>}

            {!this.state.client && <div>
                {!this.state.loading && <button className={"btn btn-success"} onClick={this.generateKey}>Generate API Client Key</button>}
                {this.state.loading && <button className={"btn btn-success"}>Loading...</button>}
            </div>}
            
        </div>  
    }
    
}