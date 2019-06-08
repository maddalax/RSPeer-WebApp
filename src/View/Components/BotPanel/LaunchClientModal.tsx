import React from 'react';
import {ApiService} from "../../../Common/ApiService";
import {InstanceService} from "../../../Services/BotPanel/InstanceService";
import {ProxyService} from "../../../Services/BotPanel/ProxyService";
import {Alert} from "../../../Utilities/Alert";
import {LaunchClientSelectModal} from './LaunchClientSelectModal';

const uuid = require('uuidv4');

type State = {
    qs: any[],
    selectedQs: any,
    selectedProxy: any,
    sleep: number,
    count: number,
    proxies: any[],
    jvmArgs: string,
    limits: any,
    selected : any
}

export class LaunchClientModal extends React.Component<any, State> {

    private readonly api: ApiService;
    private readonly instanceService: InstanceService;
    private readonly proxyService: ProxyService;

    constructor(props: any) {
        super(props);
        this.api = new ApiService();
        this.instanceService = new InstanceService();
        this.proxyService = new ProxyService();
        this.state = {
            qs: [],
            selectedQs: null,
            selectedProxy: null,
            sleep: 10,
            count: 1,
            proxies: [],
            jvmArgs: '-Xmx384m -Djava.net.preferIPv4Stack=true -Djava.net.preferIPv4Addresses=true -Xss2m',
            limits: {},
            selected : {}
        };
    }

    async componentDidMount() {
        const limits = await this.instanceService.getLimits();
        const qs = await this.api.get("botLauncher/getQuickLaunch");
        const proxies = await this.proxyService.loadProxies();
        if(Array.isArray(qs)) {
            this.setState({qs});
        }
        if(Array.isArray(proxies)) {
            this.setState({proxies});
        }
        this.setState({limits});
    }

    sendMessage = async (socket: string, payload: any) => {
        await this.api.post("botLauncher/send", {
            payload,
            socket
        })
    };

    selectQs = (qs: any) => {
        this.setState({selectedQs: qs});
    };

    selectProxy = (proxy: any) => {
        this.setState({selectedProxy: proxy})
    };

    close = () => {
        this.props.onClose && this.props.onClose();
    };

    isSelected = (client : any) => {
        const value = this.state.selected[client.id];
        return value != null && value === true;
    };
    
    onCheckboxChange = (checked : boolean, client : any) => {
        this.setState(prev => {
            prev.selected[client.id] = checked;
            return prev;
        })
    };
    
    showQuickLaunchPrompt = async (payload : any) => {
        this.setState({selected : {}});
        this.setState(prev => {
            for (let client of payload.qs.clients) {
                prev.selected[client.id] = true;
            }
            return prev;
        });
        Alert.modal({
            title : "Please select the clients you would like to start.",
            body : <LaunchClientSelectModal payload={payload} onCheckboxChange={this.onCheckboxChange}/>,
            onConfirm : async () => {
                payload.qs.clients = payload.qs.clients.filter((s : any) => this.state.selected[s.id] === true);
                if(payload.qs.clients.length === 0) {
                    this.props.onClose && this.props.onClose();
                    return;
                }
                await this.sendMessage(this.props.socket, payload);
                Alert.success(`Successfully sent message to launch ${payload.qs.clients.length} client(s). They should be starting soon.`, 5000);
                this.props.onClose && this.props.onClose();
            }
        })
    };
    
    openClients = async () => {
        try {
            let count;
            let qs = this.state.selectedQs;
            if (!qs) {
                count = this.state.count;
            } else {
                //set proxies
                qs.clients = qs.clients.map((c : any) => {
                    const proxyName = c.proxy && c.proxy.name;
                    if (proxyName) {
                        c.proxy = this.state.proxies.find(p => p.name === proxyName);
                    }
                    c.id = uuid();
                    return c;
                });
            }
            if (qs) {
                const invalidProxy = qs.clients.find((c : any) => !c.proxy);
                if (invalidProxy) {
                    Alert.show(`Tried to start client ${invalidProxy.rsUsername} but the selected proxy does not exist in your proxy list. 
                    Please review your proxy list and make sure all quick launch configurations reference a valid proxy on the list.`);
                    return;
                }
            }
            const limits = await this.instanceService.getLimits();
            this.setState({limits});
            const left = limits.allowed - limits.running;
            if (count != null && count > left) {
                Alert.show(`You are only allowed to run ${left} more client(s), but you attempted to open ${count} client(s). 
                You may purchase more instances to run more clients by clicking on "Purchase Instances" on the sidebar.`);
                return;
            }
            
            this.setState({selectedQs : qs});
            
            const payload = {
                type: 'start:client',
                session: localStorage.getItem("rspeer_session"),
                qs,
                jvmArgs: this.state.jvmArgs,
                sleep: this.state.sleep,
                proxy: this.state.selectedProxy,
                count
            };
            
            if(qs != null && qs.clients != null && qs.clients.length > 1) {
                return this.showQuickLaunchPrompt(payload);
            }
            
            await this.sendMessage(this.props.socket, payload);
            
            Alert.success("Successfully send message to open client(s), client(s) should be opening soon.");
            setTimeout(() => {
                this.close();
            }, 200);
        } catch (e) {
           Alert.show(e.message);
        }
    };

    customStyles = {
        content: {
            top: '50%',
            left: '50%',
            right: 'auto',
            bottom: 'auto',
            transform: 'translate(-50%, -50%)',
            padding: '10px'
        },
        backgroundColor: 'black'

    };

    buildOutOfInstancesModal = () => {
        return (<div className={"container"}>
            <h3>You have used up all your available client instances.</h3>
            <p>To continue running more clients, please close existing ones or purchase more instances from <a
                target={"_blank"} href={"https://store.rspeer.org"}>here.</a></p>
            <p>You are running <span
                style={{color: 'rgb(70, 239, 110)'}}>{this.state.limits.running} / {this.state.limits.allowed}</span> clients.
            </p>
        </div>)
    };

    render() {
        const out = this.state.limits.allowed <= this.state.limits.running;
        if (out) {
            return (<div>
                {this.buildOutOfInstancesModal()}
            </div>)
        }
        return (
            <div>
                <div className={"container"}>
                    <h3>Launch Clients</h3>
                    <p>You are allowed to run <span
                        style={{color: 'rgb(70, 239, 110)'}}>{(this.state.limits.allowed - this.state.limits.running).toString()}</span> more
                        clients.</p>
                    <p>Select a quick launch preset OR open manually below.</p>
                    <div className="dropdown">
                        <button className="btn btn-secondary dropdown-toggle" type="button" id="dropdownMenuButton"
                                data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                            {this.state.selectedQs ? this.state.selectedQs.name : "Select Quick Launch"}
                        </button>
                        <div className="dropdown-menu" aria-labelledby="dropdownMenuButton">
                            {this.state.qs.filter(w => w.name).map(q => {
                                return <a key={q.name} className="dropdown-item" href="javascript:void(0)"
                                          onClick={() => this.selectQs(q)}>{q.name}</a>
                            })}
                        </div>
                    </div>
                    <br/>
                    <hr/>
                    <h3>Advanced Options</h3>
                    <p><strong>Custom JVM Arguments. </strong>
                        It is recommended not to remove the default custom arguments. Modify at your own risk.
                    </p>
                    <input type="text" className="form-control" value={this.state.jvmArgs}
                           aria-label="args" aria-describedby="basic-addon2" onChange={(e) => {
                        this.setState({jvmArgs: e.target.value})
                    }}/>
                    <br/>
                    <p><strong>Seconds Wait Time Between Multiple Client Opening. </strong>
                        The time to wait before opening the next client, if opening multiple clients. Increase this
                        time if you are seeing errors due to clients opening to quickly together.
                    </p>
                    <input type="number" min={1} className="form-control" value={this.state.sleep}
                           aria-label="args" aria-describedby="basic-addon2" onChange={(e) => {
                        this.setState({sleep: parseInt(e.target.value)})
                    }}/>
                    <hr/>
                    {this.state.selectedQs && <div>
                        <p>Clients To Open: <strong>{this.state.selectedQs.clients.length}</strong></p>
                    </div>}
                    {!this.state.selectedQs && <div>
                        <div className="dropdown">
                            <button className="btn btn-secondary dropdown-toggle" type="button"
                                    id="proxyDropdown"
                                    data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                {this.state.selectedProxy ? this.state.selectedProxy.name : "Optional - Select A Proxy"}
                            </button>
                            <div className="dropdown-menu" aria-labelledby="dropdownMenuButton">
                                {this.state.proxies.filter(w => w.name).map(q => {
                                    return <a className="dropdown-item" href="javascript:void(0)" key={q.name}
                                              onClick={() => this.selectProxy(q)}>{q.name} - {q.ip}:{q.port}</a>
                                })}
                            </div>
                        </div>
                        <p>You can add additional proxies under the <strong>Manage Proxies</strong> page.</p>
                        <p>Number Of Client(s) To Start</p>
                        <input type="number" min={1} className="form-control" value={this.state.count}
                               aria-label="args" aria-describedby="basic-addon2" onChange={(e) => {
                            this.setState({count: parseInt(e.target.value)})
                        }}/>
                        <br/>
                        <button onClick={this.openClients} className="btn btn-dark" type="button" id="openClients">
                            Open Client(s) Without Quick Launch
                        </button>
                    </div>}
                    {this.state.selectedQs &&
                    <button onClick={this.openClients} className="btn btn-dark" type="button" id="openClients">
                        Open Client(s) Using {this.state.selectedQs.name} Quick Launch
                    </button>}
                    <button onClick={this.close} className="btn btn-danger" type="button" id="openClientsCancel">
                        Cancel
                    </button>
                </div>
            </div>
        );
    }
}