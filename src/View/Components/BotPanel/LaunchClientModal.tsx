import React from 'react';
import {ApiService} from "../../../Common/ApiService";
import {InstanceService} from "../../../Services/BotPanel/InstanceService";
import {ProxyService} from "../../../Services/BotPanel/ProxyService";
import {Alert} from "../../../Utilities/Alert";
import {LaunchClientSelectModal} from './LaunchClientSelectModal';
import {UserUtil} from "../../../Utilities/UserUtil";
import {Game, GameFormatted} from "../../../Models/ScriptDto";
import {User} from "../../../Models/User";
import {Dropdown} from "../Utility/Dropdown";

const uuid = require('uuidv4');

type State = {
    qs: any[],
    selectedQs: any,
    selectedProxy: any,
    sleep: number,
    count: number,
    proxies: any[],
    loading: boolean,
    jvmArgs: string,
    running: number,
    selected: any,
    game: Game
}

type Props = {
    user: User,
    onClose: () => any,
    socket: string
}

export class LaunchClientModal extends React.Component<Props, State> {

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
            loading: true,
            sleep: 10,
            count: 1,
            proxies: [],
            jvmArgs: '-Xmx768m -Djava.net.preferIPv4Stack=true -Djava.net.preferIPv4Addresses=true -Xss2m',
            running: -1,
            selected: {},
            game: Game.Osrs
        };
    }

    async componentDidMount() {
        const running = await this.instanceService.getRunning();
        const qs = await this.api.get("botLauncher/getQuickLaunch");
        let proxies = await this.proxyService.loadProxies();
        if (Array.isArray(qs)) {
            this.setState({qs});
        }
        if (Array.isArray(proxies)) {
            this.setState({proxies});
        }
        this.setState({running, loading: false});
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

    isSelected = (client: any) => {
        const value = this.state.selected[client.id];
        return value != null && value === true;
    };

    onCheckboxChange = (checked: boolean, client: any) => {
        this.setState(prev => {
            prev.selected[client.id] = checked;
            return prev;
        })
    };

    showQuickLaunchPrompt = async (payload: any) => {
        this.setState({selected: {}});
        this.setState(prev => {
            for (let client of payload.qs.clients) {
                prev.selected[client.id] = true;
            }
            return prev;
        });
        Alert.modal({
            title: "Please select the clients you would like to start.",
            body: <LaunchClientSelectModal payload={payload} onCheckboxChange={this.onCheckboxChange}/>,
            onConfirm: async () => {
                payload.qs.clients = payload.qs.clients.filter((s: any) => this.state.selected[s.id] === true);
                if (payload.qs.clients.length === 0) {
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
                qs.clients = qs.clients.map((c: any) => {
                    const proxyName = c.proxy && c.proxy.name;
                    if (proxyName) {
                        c.proxy = this.state.proxies.find(p => p.name === proxyName);
                    }
                    c.id = uuid();
                    return c;
                });
            }
            if (qs) {
                const invalidProxy = qs.clients.find((c: any) => !c.proxy);
                if (invalidProxy) {
                    Alert.show(`Tried to start client ${invalidProxy.rsUsername} but the selected proxy does not exist in your proxy list. 
                    Please review your proxy list and make sure all quick launch configurations reference a valid proxy on the list.`);
                    return;
                }
            }
            const running = await this.instanceService.getRunning();
            this.setState({running});

            this.setState({selectedQs: qs});

            const payload = {
                type: 'start:client',
                session: localStorage.getItem("rspeer_session"),
                qs,
                jvmArgs: this.state.jvmArgs,
                sleep: this.state.sleep,
                proxy: this.state.selectedProxy,
                game : this.state.game,
                count
            };
            
            if (qs != null && qs.clients != null && qs.clients.length > 1) {
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

    render() {
        return (
            <div>
                <div className={"container"}>
                    <h3>Launch Clients</h3>
                    {this.state.running != -1 && <div><p>Currently running clients: <span
                        style={{color: 'rgb(70, 239, 110)'}}>{this.state.running}.</span></p>
                        <p>Count incorrect? Check <a
                            href={"https://forums.rspeer.org/topic/1313/help-it-says-i-have-more-instances-open-than-i-do"}
                            target={"_blank"}>here.</a></p></div>}
                    {this.state.running == -1 && <p
                        style={{color: 'rgb(70, 239, 110)'}}>Loading currently running clients...</p>}
                    <p>Select a <strong>quick launch</strong> preset OR <strong>open manually</strong> below.</p>
                    {this.state.loading || this.state.qs.length > 0 && <React.Fragment>
                        <Dropdown
                            onSelection={(e, v) => this.selectQs(v)}
                            values={this.state.qs.filter(w => w.name)}
                            valueDisplayProperty={'name'}
                            value={this.state.selectedQs ? this.state.selectedQs.name : (this.state.loading ? 'Loading Quick Launch...' : "Select Quick Launch")}/>
                    </React.Fragment>}
                    {!this.state.loading && this.state.qs.length === 0 &&
                    <p style={{color: '#00a28a'}}>You do not have any quick launch configurations created,
                        click <strong>"Manage Quick Launch"</strong> to create one. This will allow you to launch
                        a list of accounts with custom client options, proxies, and scripts automatically. This is
                        completely optional, you can click Open Client(s) without Quick Launch below as well.</p>}
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

                        <Dropdown
                            onSelection={(e, v) => this.selectProxy(v)}
                            values={this.state.proxies.filter(w => w.name)}
                            valueDisplayProperty={'display'}
                            value={this.state.selectedProxy ? this.state.selectedProxy.name : (this.state.loading ? "Loading Proxies..." : "Optional - Select A Proxy")}/>

                        <p>You can add additional proxies under the <strong>Manage Proxies</strong> page.</p>
                        <p>Number Of Client(s) To Start</p>
                        <input type="number" min={1} className="form-control" value={this.state.count}
                               aria-label="args" aria-describedby="basic-addon2" onChange={(e) => {
                            this.setState({count: parseInt(e.target.value)})
                        }}/>
                        <br/>
                        {UserUtil.hasInuvation(this.props.user) && <div style={{marginBottom : '15px'}}>
                            <Dropdown
                                valueDisplayProperty={"display"}
                                value={GameFormatted(this.state.game)}
                                onSelection={(e, g) => this.setState({game: g.game})}
                                values={[{game: Game.Osrs, display: GameFormatted(Game.Osrs)}, {
                                    game: Game.Rs3,
                                    display: GameFormatted(Game.Rs3)
                                }]}/>
                        </div>}
                        <button onClick={this.openClients} className="btn btn-success" type="button" id="openClients">
                            Open Client(s) Without Quick Launch
                        </button>
                        <button style={{marginLeft: '5px'}} onClick={this.close} className="btn btn-danger"
                                type="button" id="openClientsCancel">
                            Cancel
                        </button>
                    </div>}
                    {this.state.selectedQs &&
                    <React.Fragment>
                        <button onClick={this.openClients} className="btn btn-success" type="button" id="openClients">
                            Open Client(s) Using {this.state.selectedQs.name} Quick Launch
                        </button>
                        <button style={{marginLeft: '5px'}} onClick={this.close} className="btn btn-danger"
                                type="button" id="openClientsCancel">
                            Cancel
                        </button>
                    </React.Fragment>}
                </div>
            </div>
        );
    }
}