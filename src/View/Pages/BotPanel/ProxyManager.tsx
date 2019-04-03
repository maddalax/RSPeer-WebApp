import React from 'react';
import {ApiService} from "../../../Common/ApiService";
import {AddProxyModal} from "../../Components/BotPanel/AddProxyModal";
import {Util} from "../../../Utilities/Util";
import {ProxyService} from "../../../Services/BotPanel/ProxyService";

export class ProxyManager extends React.Component<any, any> {

    private readonly api : ApiService;
    private readonly proxyService : ProxyService;

    constructor(props : any) {
        super(props);
        this.api = new ApiService();
        this.proxyService = new ProxyService();
        this.state = {
            proxies: [],
            adding: false,
            selectedProxy: null
        }
    }

    async componentDidMount() {
        if(this.props.user) {
            this.loadProxies();
        }
    }

    loadProxies = async () => {
        this.setState({proxies : await this.proxyService.loadProxies()})
    };

    onClose = () => {
        this.setState({adding: false, selectedProxy: null});
        this.loadProxies();
    };

    addProxy = (proxy : any) => {
        this.setState({adding: true, selectedProxy: proxy});
    };

    deleteProxy = async (proxy : any) => {
       await this.api.post("botLauncher/deleteProxy?id=" + (proxy.proxyId || proxy.name).toString(), {});
       this.loadProxies();
    };

    render() {
        if(!this.props.user) {
            return <div>
                <h5>Click sign in on the top right to view this page.</h5>
            </div>
        }
        if(this.state.adding) {
            return <AddProxyModal onClose={this.onClose} proxy={this.state.selectedProxy}/>;
        }
        return <div>
            <h3>Manage Your Proxies</h3>
            <p>Add or manage proxies to use with quick launch setups and/or starting clients with proxies.</p>
            <p>You may have up to <strong>150 proxies</strong> at any given time.</p>
            <button className="btn btn-primary" type="button" id="addProxy"
                    onClick={this.addProxy}>
                Add New Proxy
            </button>
            <br/><br/>
            <table className="table table-bordered">
                <thead>
                <tr>
                    <th scope="col">Date Added</th>
                    <th scope="col">Name</th>
                    <th scope="col">Ip</th>
                    <th scope="col">Port</th>
                    <th scope="col">Username</th>
                    <th scope="col">Password</th>
                    <th scope="col">Options</th>
                </tr>
                </thead>
                <tbody>
                {this.state.proxies.map((i : any, index : number) => {
                    return <tr key={i.name}>
                        <td>{Util.formatDate(i.date)}</td>
                        <td>{i.name}</td>
                        <td>{i.ip}</td>
                        <td>{i.port}</td>
                        <td>{i.username}</td>
                        <td>{i.password}</td>
                        <td>
                            <button className="btn btn-primary" type="button" id="modify"
                                    onClick={() => this.addProxy(i)}>
                                Modify
                            </button>
                            <button className="btn btn-danger" type="button" id="delete"
                                    onClick={() => this.deleteProxy(i)}>
                               Delete
                            </button>
                        </td>
                    </tr>
                })}
                </tbody>
            </table>
        </div>
    }
}