import React from 'react';
import {Util} from "../../../Utilities/Util";
import {ApiService} from "../../../Common/ApiService";
import {ProxyService} from "../../../Services/BotPanel/ProxyService";
import {Alert} from "../../../Utilities/Alert";

type State = {
    proxies: any[],
    rsUsername: string,
    rsPassword: string,
    scriptArgs: string,
    world: number,
    proxy: any,
    scriptName: string,
    disableScene: boolean,
    disableModel: boolean,
    engineTickDelay: number,
    lowCpu: boolean,
    superLowCpu: boolean,
    isRepoScript: boolean,
    isModifying: boolean,
    modifyingEntryName: string
    [key: string]: any
}

export class AddClientModal extends React.Component<any, State> {

    private proxyService: ProxyService;
    private apiService: ApiService;

    constructor(props: any) {
        super(props);
        this.proxyService = new ProxyService();
        this.apiService = new ApiService();
        this.state = {
            proxies: [],
            rsUsername: '',
            rsPassword: '',
            scriptArgs: '',
            world: -1,
            proxy: '',
            scriptName: '',
            disableScene: false,
            disableModel: false,
            engineTickDelay: 0,
            lowCpu: false,
            superLowCpu: false,
            isRepoScript: false,
            isModifying: false,
            modifyingEntryName: ''
        };
    }

    async componentDidMount() {
        if (this.props.client) {
            const c = this.props.client;
            this.setState({
                rsUsername: c.rsUsername,
                rsPassword: c.rsPassword,
                scriptArgs: c.script != null ? c.script.scriptArgs : '',
                world: c.world,
                scriptName: c.script != null ? c.script.name : '',
                isRepoScript: c.script != null ? c.script.isRepoScript : false,
                disableScene: c.config && c.config.disableSceneRendering,
                disableModel: c.config && c.config.disableModelRendering,
                engineTickDelay: c.config != null ? c.config.engineTickDelay : 0,
                superLowCpu: c.config && c.config.superLowCpuMode,
                lowCpu: c.config && c.config.lowCpuMode,
                proxy: c.proxy ? c.proxy.name : '',
                isModifying: true,
                modifyingEntryName: c.rsUsername
            });
        }
        const proxies = await this.proxyService.loadProxies();
        this.setState({proxies});
    }

    onChange = (e: any, field: string) => {
        this.setState({[field]: e.target.value});
    };

    onCheckboxChange = (e: any, field: string) => {
        this.setState({[field]: e.target.checked})
    };

    close = (res: any) => {
        this.props.onClose(res);
    };

    saveAccount = async () => {
        const res = this.props.qs;
        const parsed = {
            RsUsername: this.state.rsUsername,
            RsPassword: this.state.rsPassword,
            World: this.state.world,
            proxy: {
                Name: this.state.proxy
            },
            script: {
                ScriptArgs: this.state.scriptArgs,
                Name: this.state.scriptName,
                IsRepoScript: this.state.isRepoScript
            },
            config: {
                EngineTickDelay: this.state.engineTickDelay,
                LowCpuMode: this.state.lowCpu,
                SuperLowCpuMode: this.state.superLowCpu,
                DisableModelRendering: this.state.disableModel,
                DisableSceneRendering: this.state.disableScene,
            }
        };
        if (this.state.isModifying) {
            const toChange = res.clients.find((w: any) => w.rsUsername === this.state.modifyingEntryName);
            res.clients[res.clients.indexOf(toChange)] = parsed;
        } else {
            res.clients.unshift(parsed);
        }
        const i = await this.apiService.post("botLauncher/saveQuickLaunch", res);
        if (i.error) {
            return Alert.show(i.error);
        }
        const camel = Util.toCamel(res);
        this.close(camel);
    };

    customStyles = {
        content: {
            top: '50%',
            left: '50%',
            right: 'auto',
            bottom: 'auto',
            transform: 'translate(-50%, -50%)',
            padding: '15px'
        },
        backgroundColor: 'black'

    };

    render() {
        return (
            <div>
                <div className={"container"}>
                    <p>Adding New Client To <strong>{this.props.qs.name}</strong></p>
                    <form>
                        <div className="form-group">
                            <label htmlFor="proxyNameLabel">Runescape Username</label>
                            <input type="text" className="form-control" id="rsUsername"
                                   aria-describedby="emailHelp" placeholder="Enter Your Runescape Username"
                                   onChange={(e) => this.onChange(e, 'rsUsername')} value={this.state.rsUsername}/>
                        </div>
                        <div className="form-group">
                            <label htmlFor="proxyNameLabel">Runescape Password</label>
                            <input type="password" className="form-control" id="rsUsername"
                                   aria-describedby="emailHelp" placeholder="Enter Your Runescape Password"
                                   onChange={(e) => this.onChange(e, 'rsPassword')} value={this.state.rsPassword}/>
                        </div>
                        <div className="form-group">
                            <label htmlFor="proxyNameLabel">World</label>
                            <input type="number" className="form-control" id="world"
                                   aria-describedby="emailHelp" placeholder="World"
                                   onChange={(e) => this.onChange(e, 'world')} value={this.state.world}/>
                            <small id="scriptNameLabelHelp" className="form-text text-muted">
                                Set to -1 to use a random world.
                            </small>
                        </div>
                        <div className="form-group">
                            <label htmlFor="proxyNameLabel">Script Name</label>
                            <input type="text" className="form-control" id="scriptName"
                                   aria-describedby="emailHelp" placeholder="Script Name"
                                   onChange={(e) => this.onChange(e, 'scriptName')} value={this.state.scriptName}/>
                        </div>
                        <div className="form-group">
                            <label htmlFor="scriptNameLabel">Script Arguments</label>
                            <input type="text" className="form-control" id="scriptArgs"
                                   aria-describedby="emailHelp" placeholder="Script Arguments"
                                   onChange={(e) => this.onChange(e, 'scriptArgs')} value={this.state.scriptArgs}/>
                            <small id="scriptNameLabelHelp" className="form-text text-muted">Enter any arguments
                                that you want to pass to the script. The script must support script arguments for
                                this to work.
                            </small>
                        </div>
                        <div className="form-group">
                            <div className="form-check">
                                <input type="checkbox" className="form-check-input" id="exampleCheck1"
                                       checked={this.state.isRepoScript}
                                       onChange={(e) => this.onCheckboxChange(e, 'isRepoScript')}/>
                                <label className="form-check-label" htmlFor="exampleCheck1">Is Repository
                                    Script</label>
                            </div>
                        </div>
                        <div className="form-group">
                            <label htmlFor="scriptNameLabel">Engine Tick Delay</label>
                            <input type="text" className="form-control" id="scriptArgs"
                                   aria-describedby="emailHelp" placeholder="Script Arguments"
                                   onChange={(e) => this.onChange(e, 'engineTickDelay')}
                                   value={this.state.engineTickDelay}/>
                            <small id="scriptNameLabelHelp" className="form-text text-muted">The amount in milliseconds
                                to delay the engine tick.
                                Delaying the engine tick may lower CPU usage, but may also break the game. Experiment
                                carefully.
                            </small>
                        </div>
                        <div className="dropdown">
                            <button className="btn btn-secondary dropdown-toggle" type="button"
                                    id="proxyDropdown"
                                    data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                {this.state.proxy ? this.state.proxy : "Optional - Select A Proxy"}
                            </button>
                            <div className="dropdown-menu" aria-labelledby="dropdownMenuButton">
                                {this.state.proxies.filter(w => w.name).map(q => {
                                    return <a className="dropdown-item" href="javascript:void(0)" key={q.name}
                                              onClick={() => this.setState({proxy: q.name})}>{q.name} - {q.ip}:{q.port}</a>
                                })}
                            </div>
                        </div>
                        <br/>
                        <div className="form-group">
                            <div className="form-check">
                                <input type="checkbox" className="form-check-input" id="exampleCheck1"
                                       checked={this.state.disableScene}
                                       onChange={(e) => this.onCheckboxChange(e, 'disableScene')}/>
                                <label className="form-check-label" htmlFor="exampleCheck1">Disable Scene
                                    Rendering</label>
                            </div>
                        </div>
                        <div className="form-group">
                            <div className="form-check">
                                <input type="checkbox" className="form-check-input" id="exampleCheck1"
                                       checked={this.state.disableModel}
                                       onChange={(e) => this.onCheckboxChange(e, 'disableModel')}/>
                                <label className="form-check-label" htmlFor="exampleCheck1">Disable Model
                                    Rendering</label>
                            </div>
                        </div>
                        <div className="form-group">
                            <div className="form-check">
                                <input type="checkbox" className="form-check-input" id="exampleCheck1"
                                       checked={this.state.lowCpu}
                                       onChange={(e) => this.onCheckboxChange(e, 'lowCpu')}/>
                                <label className="form-check-label" htmlFor="exampleCheck1">Enable Low Cpu
                                    Mode</label>
                            </div>
                        </div>
                        <div className="form-group">
                            <div className="form-check">
                                <input type="checkbox" className="form-check-input" id="exampleCheck1"
                                       checked={this.state.superLowCpu}
                                       onChange={(e) => this.onCheckboxChange(e, 'superLowCpu')}/>
                                <label className="form-check-label" htmlFor="exampleCheck1">Enable Super Low Cpu
                                    Mode</label>
                            </div>
                        </div>
                        <button type="submit" onClick={this.saveAccount} className="btn btn-primary">Save Account
                        </button>
                        <button type="submit" onClick={this.close} className="btn btn-danger">Cancel
                        </button>
                    </form>
                </div>
            </div>
        );
    }
}