import React from 'react';
import {ImportQsJson} from "./ImportJson";
import {ApiService} from "../../../Common/ApiService";
import {AddClientModal} from "../../Components/BotPanel/AddClientModal";
import {Alert} from "../../../Utilities/Alert";

export class QuickLaunch extends React.Component<any, any> {

    private readonly api: ApiService;

    constructor(props: any) {
        super(props);
        this.api = new ApiService();
        this.state = {
            qs: [],
            selectedQs: null,
            importingCsv: false,
            loading: false,
            addingClient: false,
            selectedClient: null
        }
    }

    componentDidMount() {
        this.loadQuickLaunches();
    }

    loadQuickLaunches = async () => {
        const qs = await this.api.get("botLauncher/getQuickLaunch");
        this.setState({qs});
    };

    selectQs = (qs: any) => {
        this.setState({selectedQs: qs});
    };

    delete = async (qs: any) => {
        const confirm = window.confirm("Are you sure you want to delete " + qs.name + "?");
        if (!confirm)
            return;
        await this.api.post("botLauncher/deleteQuickLaunch?id=" + (qs.quickLaunchId), {});
        this.setState({selectedQs: null});
        await this.loadQuickLaunches();
    };

    deleteClient = async (client: any, index: number) => {
        const confirm = window.confirm(`Are you sure you want to delete ${client.rsUsername}?`);
        if (!confirm)
            return;
        this.setState((prev: any) => {
            prev.selectedQs.clients.splice(index, 1);
            return prev;
        }, async () => {
            const i = await this.api.post("botLauncher/saveQuickLaunch", this.state.selectedQs);
            if (i.error) {
                return Alert.show(i.error);
            }
        });
    };

    createQuickLaunch = async () => {
        const name = window.prompt("What would you like to name your quick launch settings?");
        if (!name) {
            return;
        }
        const res = {
            name,
            clients: []
        };
        const save = await this.api.post("botLauncher/saveQuickLaunch", res);
        if(save.error) {
            Alert.show(save.error);
            return;
        }
        await this.loadQuickLaunches();
        this.selectQs(this.state.qs[this.state.qs.length - 1])
    };

    importJson = (qs: any) => {
        this.setState({importingJson: true, selectedQs: qs});
    };

    addNewClient = (client: any) => {
        this.setState({addingClient: true, selectedClient: client})
    };

    onClose = (res: any) => {
        this.setState({importingJson: false, addingClient: false}, () => {
            if (!res || !res.clients) {
                return;
            }
            this.setState({loading: true}, () => {
                const qs = this.state.qs.find((w: any) => w.name === res.name);
                if (qs) {
                    this.setState((prev: any) => {
                        prev.qs[prev.qs.indexOf(qs)] = res;
                        return prev;
                    }, () => {
                        this.setState({selectedQs: this.state.qs.find((w : any) => w.name === res.name)}, () => {
                            this.setState({loading: false})
                        })
                    })
                }
            });
        });
    };

    render() {
        if (this.state.addingClient) {
            return <AddClientModal qs={this.state.selectedQs} client={this.state.selectedClient}
                                   onClose={this.onClose}/>;
        }
        if (this.state.importingJson) {
            return <ImportQsJson qs={this.state.selectedQs} onClose={this.onClose}/>
        }
        return <div>
            <div>
                <h3>Quick Launch Manager</h3>
                <br/>
                <p><strong>What is quick launch?</strong></p>
                <p>Quick launch is a way to launch clients automatically with pre-configured values such as with a proxy, a script, with certain
                    script arguments, and a RuneScape account.</p>
                <p>To get started, click "Create New Quick Launch".</p>
            </div>
            <button className="btn btn-success" type="button" id="createQuickLaunch" onClick={this.createQuickLaunch}>
                Create New Quick Launch
            </button>
            <br/><br/>
            {this.state.qs && this.state.qs.length > 0 && <div className="dropdown">
                <button className="btn btn-secondary dropdown-toggle" type="button" id="dropdownMenuButton"
                        data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                    {this.state.selectedQs ? this.state.selectedQs.name : "Modify Existing Quick Launch"}
                </button>
                <div className="dropdown-menu" aria-labelledby="dropdownMenuButton">
                    {this.state.qs.filter((w: any) => w.name).map((q: any) => {
                        return <a id={q.name} key={q.name} className="dropdown-item" href="javascript:void(0)"
                                  onClick={() => this.selectQs(q)}>{q.name}</a>
                    })}
                </div>
            </div>}
            <br/>
            {this.state.selectedQs && <div>
                <p><strong>Config Values</strong></p>
                <p>Y: <strong>Yes</strong></p>
                <p>N: <strong>No</strong></p>
                <p>DMR: <strong>Disable Model Rendering</strong></p>
                <p>DSR: <strong>Disable Scene Rendering</strong></p>
                <p>TD: <strong>Engine Tick Delay</strong></p>
                <p>LCPU: <strong>Low Cpu Mode Enabled</strong></p>
                <p>SLCPU: <strong>Super Low Cpu Mode Enabled</strong></p>
                <button className="btn btn-primary button-spacing" type="button" id="createClient"
                        onClick={() => this.addNewClient(null)}>
                    Add New Client
                </button>
                <button className="btn btn-dark button-spacing" type="button" id="deleteQs"
                        onClick={() => this.importJson(this.state.selectedQs)}>
                    Import JSON
                </button>
                <button className="btn btn-danger button-spacing" type="button" id="deleteQs"
                        onClick={() => this.delete(this.state.selectedQs)}>
                    Delete {this.state.selectedQs.name}
                </button>
                <br/><br/>
                <table className="table table-bordered table-celled">
                    <thead>
                    <tr>
                        <th scope="col">Username</th>
                        <th scope="col">Password</th>
                        <th scope="col">World</th>
                        <th scope="col">Script</th>
                        <th scope="col">Script Args</th>
                        <th scope="col">Proxy</th>
                        <th scope="col">Config</th>
                        <th scope="col">Options</th>
                    </tr>
                    </thead>
                    <tbody>
                    {!this.state.loading && this.state.selectedQs.clients.map((i : any, index : number) => {
                        return <tr key={i.rsUsername + i.rsPassword}>
                            <td>{i.rsUsername}</td>
                            <td>{i.rsPassword}</td>
                            <td>{i.world}</td>
                            <td>{i.script && i.script.name || "No Script"}</td>
                            <td>{i.script && i.script.scriptArgs || "No Script Args"}</td>
                            <td>{i.proxy && i.proxy.name || "No Proxy"}</td>
                            <td>DMR: {i.config && i.config.disableModelRendering ? "Y" : "N"},
                                DSR: {i.config && i.config.disableSceneRendering ? "Y" : "N"},
                                TD: {i.config && i.config.engineTickDelay || 0},
                                LCPU {i.config.lowCpuMode ? "Y" : "N"},
                                SLCPU {i.config && i.config.superLowCpuMode ? "Y" : "N"}</td>
                            <td>
                                <button onClick={() => this.addNewClient(i)} className="btn btn-primary button-spacing" type="button"
                                        id="modify">
                                    Modify
                                </button>
                                <button onClick={() => this.deleteClient(i, index)} className="btn btn-danger button-spacing"
                                        type="button" id="delete">
                                    Delete
                                </button>
                            </td>
                        </tr>
                    })}
                    </tbody>
                </table>
            </div>}
        </div>
    }

}