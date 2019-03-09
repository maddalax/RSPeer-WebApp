import React from 'react';
import {ApiService} from "../../../../Common/ApiService";
import {ScriptDto, ScriptOrderBy, ScriptStatus, ScriptType} from "../../../../Models/ScriptDto";
import {Util} from "../../../../Utilities/Util";
import {Alert} from "../../../../Utilities/Alert";
import {AddModifyScript} from "../../DeveloperCenter/AddModifyScript";
import {Modal} from "../../../Components/Utility/Modal";

type State = {
    scripts : ScriptDto[]
}

export class AdministrationScriptList extends React.Component<any, State> {
    
    private readonly api : ApiService;
    
    constructor(props : any) {
        super(props);
        this.api = new ApiService();
        this.state = {
            scripts : []
        };
    } 
    
    async componentDidMount() {
        const scripts = await this.api.post('script/list', {
            orderBy : ScriptOrderBy.alphabetical
        });
        if(Array.isArray(scripts)) {
            this.setState({scripts});
        }
    }
    
    manageScript = (script : ScriptDto) => {
      Alert.modal({
          title : 'Manage ' + script.name + ' by ' + script.author,
          body : <AddModifyScript script={script} isAdminView={true} onCancel={Modal.removeModal}/>,
          onConfirm : () => {
              
          },
          onCancel : () => {
              
          },
          hideButtons : true
      })  
    };
    
    render() {
        return <div>
            <div className="table-responsive">
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
                            <td>{s.description}</td>
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