import React from 'react';
import {ApiService} from "../../../Common/ApiService";
import {ScriptDto, ScripterInfo, ScriptStatus, ScriptType} from "../../../Models/ScriptDto";
import {Util} from "../../../Utilities/Util";
import {AddModifyScript} from "./AddModifyScript";

type State = {
    live: ScriptDto[],
    pending: ScriptDto[],
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
            loading : true
        }
    }

    async componentDidMount() {
        if(!this.props.user) {
            return;
        }
        const scripterInfo = await this.api.get("scriptDevelopment/scripterInfo");
        this.setState({scripterInfo});
        const scripts: ScriptDto[] = await this.api.get("scriptDevelopment/listForScripter");
        if (Array.isArray(scripts)) {
            const live = scripts.filter(w => w.status === ScriptStatus.Live);
            const pending = scripts.filter(w => w.status !== ScriptStatus.Live);
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
                    return (<tr>
                        <th scope="row">{s.name}</th>
                        <td>{s.description}</td>
                        <td>{s.version}</td>
                        <td>{s.typeFormatted}</td>
                        <td>{s.type === ScriptType.Free ? 'N/A' : Util.formatNumber(s.price.toString())}</td>
                        <td>{s.type === ScriptType.Free ? 'N/A' : (s.instances || 'Unlimited')}</td>
                        <td>{s.categoryFormatted}</td>
                        <td>{s.totalUsers}</td>
                        <td className={color(s)}><span style={{color : 'black'}}>{s.statusFormatted}</span></td>
                        <td><button onClick={() => this.updateScript(s)} className={"btn btn-info"}>Update</button></td>
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
                }} onCancel={() => {
                    this.setState({selectedScript : null})
                }}/>
            </div>}
        </div>;
    }

}