import React from 'react';
import {ApiService} from "../../../Common/ApiService";
import {Alert} from "../../../Utilities/Alert";

type State = {
    proxyId: string,
    name: string,
    ip: string,
    port: string,
    username: string,
    password: string
    [key: string]: any
}

export class AddProxyModal extends React.Component<any, State> {

    private readonly api: ApiService;

    constructor(props: any) {
        super(props);
        this.api = new ApiService();
        this.state = {
            proxyId: '',
            name: '',
            ip: '',
            port: '',
            username: '',
            password: ''
        };
    }

    async componentDidMount() {
        if (this.props.proxy) {
            const proxy = this.props.proxy;
            this.setState({
                name: proxy.name,
                ip: proxy.ip,
                port: proxy.port,
                username: proxy.username,
                password: proxy.password,
                proxyId: proxy.proxyId
            })
        }
    }

    onChange = (e: any, field: string) => {
        this.setState({[field]: e.target.value});
    };

    close = () => {
        this.props.onClose();
    };

    saveProxy = async (e: any) => {
        e.preventDefault();
        const res = await this.api.post("botLauncher/saveProxy", {
            ProxyId: this.state.proxyId,
            Name: this.state.name,
            Ip: this.state.ip,
            Port: this.state.port,
            Username: this.state.username,
            Password: this.state.password
        });
        if (res.error) {
            return Alert.show(res.error);
        }
        this.close();
    };

    render() {
        return (
            <div>
                <div className={"container"}>
                    {this.state.proxyId ? <p>Updating Proxy: <strong>{this.state.name}</strong></p> :
                        <p>Add New Proxy</p>}
                    <form>
                        <div className="form-group">
                            <label htmlFor="proxyNameLabel">Name</label>
                            <input type="text" className="form-control" id="proxyName"
                                   aria-describedby="emailHelp" placeholder="Enter name"
                                   onChange={(e) => this.onChange(e, 'name')} value={this.state.name}/>
                            <small id="proxyNameHelp" className="form-text text-muted">Give it a rememberable name to
                                access it later.
                            </small>
                        </div>
                        <div className="form-group">
                            <label htmlFor="proxyNameLabel">Ip Address</label>
                            <input type="text" className="form-control" id="proxyIp"
                                   aria-describedby="emailHelp" placeholder="Ip Address"
                                   onChange={(e) => this.onChange(e, 'ip')} value={this.state.ip}/>
                        </div>
                        <div className="form-group">
                            <label htmlFor="proxyNameLabel">Port</label>
                            <input type="text" className="form-control" id="proxyPort"
                                   aria-describedby="emailHelp" placeholder="Port"
                                   onChange={(e) => this.onChange(e, 'port')} value={this.state.port}/>
                        </div>
                        <div className="form-group">
                            <label htmlFor="proxyNameLabel">Proxy Username</label>
                            <input type="text" className="form-control" id="proxyUsername"
                                   aria-describedby="emailHelp" placeholder="Proxy Username"
                                   onChange={(e) => this.onChange(e, 'username')} value={this.state.username}/>
                            <small id="proxyNameHelp" className="form-text text-muted">Enter this if your proxy requires
                                authorization.
                            </small>
                        </div>
                        <div className="form-group">
                            <label htmlFor="proxyNameLabel">Password</label>
                            <input type="text" className="form-control" id="proxyPassword"
                                   aria-describedby="emailHelp" placeholder="Password"
                                   onChange={(e) => this.onChange(e, 'password')} value={this.state.password}/>
                            <small id="proxyNameHelp" className="form-text text-muted">Enter this if your proxy requires
                                authorization.
                            </small>
                        </div>
                        <button type="submit" onClick={this.saveProxy} className="btn btn-primary">Save Proxy</button>
                        <button type="submit" onClick={this.close} className="btn btn-danger">Cancel</button>
                        <small id="proxyNameHelp" className="form-text text-muted">Please note: <strong>RuneScape only
                            works with SOCKS5 Proxies. HTTP proxies will NOT work.</strong>
                        </small>
                    </form>
                </div>
            </div>
        );
    }
}