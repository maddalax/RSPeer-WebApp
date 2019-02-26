import React from 'react';
import {ApiService} from "../../../Common/ApiService";
import {ScriptDto, ScriptStatus, ScriptType} from "../../../Models/ScriptDto";
import {Util} from "../../../Utilities/Util";

type State = {
    live: ScriptDto[],
    pending: ScriptDto[]
}

export class DeveloperCenterDashboard extends React.Component<any, State> {

    private api: ApiService;

    constructor(props: any) {
        super(props);
        this.api = new ApiService();
        this.state = {
            live: [],
            pending: []
        }
    }

    async componentDidMount() {
        const scripts: ScriptDto[] = await this.api.get("script/listForScripter");
        if (Array.isArray(scripts)) {
            const live = scripts.filter(w => w.status === ScriptStatus.Live);
            const pending = scripts.filter(w => w.status !== ScriptStatus.Live);
            this.setState({live, pending});
        }
    }

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
                    </tr>)
                })}
                </tbody>
            </table>
        </div>
    };

    render() {
        return <div>
            <h6>Script Management Dashboard</h6>
            <hr/>
            <h5>Live</h5>
            {this.renderTable(this.state.live)}
            <hr/>
            <h5>Pending Update</h5>
            {this.renderTable(this.state.pending)}
        </div>;
    }

}