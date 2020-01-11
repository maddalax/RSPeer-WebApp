import React from 'react';
import {ApiService} from "../../../Common/ApiService";
import {
    GameFormatted,
    PendingScript,
    ScriptDto,
    ScripterInfo,
    ScriptStatus,
    ScriptType
} from "../../../Models/ScriptDto";
import {Util} from "../../../Utilities/Util";
import {AddModifyScript} from "./AddModifyScript";
import {Alert} from "../../../Utilities/Alert";

type State = {
    live: ScriptDto[],
    pending: ScriptDto[],
    messages : PendingScript[],
    selectedScript : ScriptDto | null,
    scripterInfo : ScripterInfo | null,
    loading : boolean
}

export class DeveloperCenterDashboard extends React.Component<any, State> {

    private api: ApiService;

    constructor(props: any) {
        super(props);
        this.api = new ApiService();
        this.state = {
            live: [],
            pending: [],
            selectedScript : null,
            scripterInfo : null,
            loading : true,
            messages : []
        }
    }
    
    getMetaData(script : ScriptDto) : PendingScript | null {
        return this.state.messages.find(w => w.pendingScriptId === script.id) || null;
    }
    
    async componentDidMount() {
        if(!this.props.user) {
            return;
        }
        const scripterInfo = await this.api.get("scriptDevelopment/scripterInfo");
        this.setState({scripterInfo});
        const scripts: ScriptDto[] = await this.api.get("scriptDevelopment/listForScripter");
        const messages : PendingScript[] = await this.api.get("scriptDevelopment/getMessages");
        this.setState({messages});
        if (Array.isArray(scripts)) {
            const live = scripts.filter(w => w.status === ScriptStatus.Live);
            const pending = scripts.filter(w => w.status === ScriptStatus.Pending || w.status === ScriptStatus.Denied);
            this.setState({live, pending});
        }
        this.setState({loading : false});
        if(!scripterInfo) {
            this.props.history.push('/developer/register');
        }
    }

    private updateScript = (script : ScriptDto) => {
        this.setState({selectedScript : script})
    };
    
    private viewMessage = (script : ScriptDto, record : PendingScript) => {
        const isDenied = record.status === ScriptStatus.Denied;
        Alert.modal({
            title : `Viewing messages for ${script.name}.`,
            body : <div>
                {isDenied && <h6>Your script submission has been denied for the following reason: </h6>}
                <hr/>
                <p style={{color : '#ea6759'}}>{record.message}</p>
                <hr/>
                {isDenied && <h6>Please make appropriate changes and submit a new update.</h6>}
                {isDenied && <h6>Please join our Discord and contact staff if you have any questions: 
                    <a href={"https://discordapp.com/invite/rMTTpsU"} target={"_blank"}> https://discordapp.com/invite/rMTTpsU</a></h6>}
            </div>
        })
    };

    private deletePrivateScript = async (script : ScriptDto) => {
        const confirm = window.confirm(`Are you sure you want to delete ${script.name}?`);
        if(!confirm) {
            return;
        }
        const res = await this.api.post("script/deletePrivate", {
            scriptId : script.id
        });
        if(res.error) {
            return Alert.show(res.error);
        }
        Alert.success(`Successfully removed ${script.name}.`);
        this.setState(prev => {
            const exists = script.status === ScriptStatus.Pending 
                ? prev.pending.find(s => s.id == script.id) 
                : prev.live.find(s => s.id == script.id);
            if(!exists) {
                return prev;
            }
            script.status == ScriptStatus.Pending 
                ? prev.pending.splice(prev.live.indexOf(exists), 1) 
                : prev.live.splice(prev.live.indexOf(exists), 1);
            return prev;
        })
    };
    
    private renderTable = (collection : ScriptDto[]) => {
        const color = (script : ScriptDto) => {
            if(script.status === ScriptStatus.Live) return "table-success";
            if(script.status === ScriptStatus.Pending) return "table-warning";
            if(script.status === ScriptStatus.Denied) return "table-danger";
        };
        return <div className="table-responsive">
            <table className="table table-bordered table-striped">
                <thead>
                <tr>
                    <th scope="col">Game</th>
                    <th scope="col">Name</th>
                    <th scope="col">Description</th>
                    <th scope="col">Version</th>
                    <th scope="col">Type</th>
                    <th scope="col">Price</th>
                    <th scope="col">Instances</th>
                    <th scope="col">Category</th>
                    <th scope="col">Total Users</th>
                    <th scope="col">Status</th>
                    <th scope="col">Actions</th>
                </tr>
                </thead>
                <tbody>
                {collection.map(s => {
                    const meta = this.getMetaData(s);
                    const isDenied = meta != null && meta.status === ScriptStatus.Denied;
                    const hasMessage = meta != null && meta.message != null;
                    if(isDenied) {
                        s.status = ScriptStatus.Denied;
                        s.statusFormatted = "Denied";
                    }
                    return (<tr>
                        <th>{GameFormatted(s.game)}</th>
                        <th scope="row">{s.name}</th>
                        <td>{s.description}</td>
                        <td>{s.version}</td>
                        <td>{s.typeFormatted}</td>
                        <td>{s.price != null ? Util.formatNumber(s.price.toString()) : 'N/A'}</td>
                        <td>{s.type === ScriptType.Premium ? s.instances || 'Unlimited' : 'N/A'}</td>
                        <td>{s.categoryFormatted}</td>
                        <td>{s.totalUsers}</td>
                        <td className={color(s)}><span style={{color : 'black'}}>{s.statusFormatted}</span></td>
                        <td><button onClick={() => this.updateScript(s)} className={"btn btn-info"}>Update</button>
                            {s.type == ScriptType.Private && <button style={{marginTop : '5px'}} onClick={() => this.deletePrivateScript(s)} className={"btn btn-danger"}>Delete</button>}
                            {hasMessage && <button onClick={() => this.viewMessage(s, meta!)} className={"btn btn-success"}>View Messages</button>}
                        </td>
                    </tr>)
                })}
                </tbody>
            </table>
        </div>
    };

    render() {
        if(!this.props.user) {
            return <div>
                <h5>Click sign in on the top right to view this page.</h5>
            </div>
        }
        return <div>
            <h6>Script Management Dashboard</h6>
            <hr/>
            {this.state.scripterInfo && <div>
                <p>Gitlab Username: <strong>{this.state.scripterInfo.gitlabUsername}</strong></p>
                <p>Group Url: <strong><a target={"_blank"} href={this.state.scripterInfo.gitlabGroupPath}>{this.state.scripterInfo.gitlabGroupPath}</a></strong></p>
                <p>Date Added: <strong>{this.state.scripterInfo.dateAdded}</strong></p>

            </div>}
            <hr/>
            {!this.state.selectedScript && <div>
                <h5>Live</h5>
                <p>Your current live scripts on the SDN.</p>
                <p>You may request an update to them by clicking Update and re-submitting the form.</p>
                <p>You may update any values on the form as you wish to re-submit it. If you do not want to update any of the script, but
                    just request a re-compile for updates from git, just submit with the pre-filled values.</p>
                {this.renderTable(this.state.live)}
                <hr/>
                <h5>Pending Update</h5>
                <p>Pending updates for changes to current live scripts, or new scripts to be added to the SDN. Scripts will be manually
                verified by staff and added to the SDN if accepted. This process may take up to 24 hours to be manually reviewed.</p>

                <p>You will be notified here if your script was denied for the SDN. You may click More Info to view the reason for the denial.</p>
                {this.renderTable(this.state.pending)}
            </div>}
            {this.state.selectedScript && <div>
                <AddModifyScript script={this.state.selectedScript} {...this.props} onConfirm={() => {
                    this.setState({selectedScript : null})
                    this.componentDidMount();
                }} onCancel={() => {
                    this.setState({selectedScript : null})
                }}/>
            </div>}
        </div>;
    }

}