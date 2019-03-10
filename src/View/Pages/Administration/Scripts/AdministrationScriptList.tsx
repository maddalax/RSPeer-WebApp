import React from 'react';
import {ApiService} from "../../../../Common/ApiService";
import {ScriptDto, ScriptOrderBy, ScriptStatus, ScriptType} from "../../../../Models/ScriptDto";
import {Util} from "../../../../Utilities/Util";
import {Alert} from "../../../../Utilities/Alert";
import {AddModifyScript} from "../../DeveloperCenter/AddModifyScript";
import {Modal} from "../../../Components/Utility/Modal";
import {HttpUtil} from "../../../../Utilities/HttpUtil";

type State = {
    scripts : ScriptDto[],
    status : ScriptStatus
}

export class AdministrationScriptList extends React.Component<any, State> {
    
    private readonly api : ApiService;
    
    constructor(props : any) {
        super(props);
        this.api = new ApiService();
        const status = HttpUtil.getParameterByName("status");
        this.state = {
            scripts : [],
            status : status === 'pending' ? ScriptStatus.Pending : ScriptStatus.Live
        };
    } 
    
    async componentDidMount() {
        const scripts = await this.api.post('script/list', {
            orderBy : ScriptOrderBy.alphabetical,
            status : this.state.status
        });
        if(Array.isArray(scripts)) {
            this.setState({scripts});
        }
    }
    
    setScriptStatus = (status : ScriptStatus) => {
        this.setState({status, scripts : []}, () => {
            this.componentDidMount();
        })
    };
    
    manageScript = (script : ScriptDto) => {
      Alert.modal({
          title : 'Manage ' + script.name + ' by ' + script.author,
          body : <AddModifyScript script={script} isAdminView={true} onConfirm={() => {
              Modal.removeModal();
              Alert.show("Successfully updated " + script.name);
              this.componentDidMount();
          }} onCancel={Modal.removeModal}/>,
          hideButtons : true
      })  
    };
    
    render() {
        return <div>
            <div className="dropdown">
                <button className="btn btn-secondary dropdown-toggle" type="button"
                        id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true"
                        aria-expanded="false">
                    Script Status: {this.state.status === ScriptStatus.Live ? 'Live' : 'Pending'}
                </button>
                <div className="dropdown-menu" aria-labelledby="dropdownMenuButton">
                    <a className="dropdown-item" href="javascript:void(0)" onClick={() => this.setScriptStatus(ScriptStatus.Live)}>Live</a>
                    <a className="dropdown-item" href="javascript:void(0)" onClick={() => this.setScriptStatus(ScriptStatus.Pending)}>Pending</a>
                </div>
            </div>
            {this.state.status === ScriptStatus.Live && 
            <div>
                <br/>
                <p>You are currently viewing live scripts.</p>
                <p>To view pending scripts that require administrator approval, choose Pending from the dropdown.</p>
            </div>}
            {this.state.status === ScriptStatus.Pending &&
            <div>
                <br/>
                <p>You are currently viewing pending scripts. These scripts require administrator approval to be accepted onto the SDN.</p>
                <p>These scripts may be new scripts or updates to previous scripts.</p>
                <p>To approve a script, view their repository, verify the code is non-malicious, then click Manage -> Update Script</p>
            </div>}
            
            <br/>
            <div className="table-responsive">
                <table className="table table-bordered table-striped">
                    <thead>
                    <tr>
                        <th scope="col">Name</th>
                        <th scope="col">Author</th>
                        <th scope="col">Description</th>
                        <th scope="col">Repository</th>
                        <th scope="col">Forum Thread</th>
                        <th scope="col">Version</th>
                        <th scope="col">Type</th>
                        <th scope="col">Price</th>
                        <th scope="col">Instances</th>
                        <th scope="col">Category</th>
                        <th scope="col">Total Users</th>
                        <th scope="col">Actions</th>
                    </tr>
                    </thead>
                    <tbody>
                    {this.state.scripts.map(s => {
                        const color = (script : ScriptDto) => {
                            if(script.type === ScriptType.Premium) return "table-danger";
                        };
                        const style = (script : ScriptDto) => {
                            if(script.type === ScriptType.Premium) return {color : 'black'};
                        };
                        return (<tr>
                            <th scope="row">{s.name}</th>
                            <th scope="row">{s.author}</th>
                            <td>{s.description}</td>
                            <th scope="row"><a href={s.repositoryUrl} target={"_blank"}>View Repository</a></th>
                            <th scope="row"><a href={s.forumThread} target={"_blank"}>View Forum</a></th>
                            <td>{s.version}</td>
                            <td className={color(s)} style={style(s)}>{s.typeFormatted}</td>
                            <td>{s.type === ScriptType.Free ? 'N/A' : Util.formatNumber(s.price.toString())}</td>
                            <td>{s.type === ScriptType.Free ? 'N/A' : (s.instances || 'Unlimited')}</td>
                            <td>{s.categoryFormatted}</td>
                            <td>{s.totalUsers}</td>
                            <th scope="col"><a href={"javascript:void(0)"} onClick={() => this.manageScript(s)}>Manage</a></th>
                        </tr>)
                    })}
                    </tbody>
                </table>
            </div>
        </div>
    }
    
    
}