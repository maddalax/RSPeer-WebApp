import React from 'react';
import {ApiService} from "../../../Common/ApiService";
import {PrivateScriptAccessDto, ScriptDto} from "../../../Models/ScriptDto";
import {Util} from "../../../Utilities/Util";
import {Alert} from "../../../Utilities/Alert";

type State = {
    scripts : ScriptDto[],
    revoking : boolean,
    adding : boolean
}

export class ManagePrivateScriptAccess extends React.Component<any, State> {
    
    private readonly api : ApiService;
    
    constructor(props : any) {
        super(props);
        
        this.api = new ApiService();
        
        this.state = {
            scripts : [],
            revoking : false, 
            adding : false
        }
    }
    
    async componentDidMount() {
        const scripts = await this.api.get("script/listPrivate");
        this.setState({scripts});
    }
    
    private revokeAccess = async (e : any, access : PrivateScriptAccessDto) => {
        e.preventDefault();
        this.setState({revoking : true});
        const remove = await this.api.post("script/revokePrivateAccess", {
            userId : access.userId,
            scriptId : access.scriptId
        });
        this.setState({revoking : false});

        if(remove.error) {
            return;
        }

        Alert.success("Successfully removed access for " + access.username + ".");
        this.componentDidMount();
    };
    
    private addAccess = async (e : any, script : ScriptDto) => {
        e.preventDefault();
        const username = window.prompt(`Enter the username of the user you would like to give access to ${script.name}.`);
        if(!username) {
            return;
        }
        this.setState({adding : true});
        const add = await this.api.post("script/addPrivateAccess", {
            username,
            scriptId : script.id
        });
        this.setState({adding : false});

        if(add.error) {
            return;
        }
        
        Alert.success("Successfully added access for " + username);
        this.componentDidMount();
        
    };
    
    render() {
        return <div>
            <h3>Manage Private Script Access</h3>
            <br/>
            <div>
                {this.state.scripts.map(s => {
                    return <div style={{paddingBottom : '25px'}}>
                        <h5>{s.name}</h5>
                        <p>{s.description}</p>
                        {!this.state.adding && <button className={"btn btn-success"} style={{marginBottom : '5px'}} onClick={(e) => this.addAccess(e, s)}>Add Access</button>}
                        {this.state.adding && <button className={"btn btn-success"} style={{marginBottom : '5px'}}>Processing...</button>}
                        <div className="table-responsive">
                            <table className="table table-bordered table-striped">
                                <thead>
                                <tr>
                                    <th scope="col">Username</th>
                                    <th scope="col">Date Added</th>
                                    <th scope="col">Actions</th>
                                </tr>
                                </thead>
                                <tbody>
                                {s.privateScriptAccesses.map(a => {
                                    return (<tr>
                                        <td>{a.username}</td>
                                        <td>{Util.formatDate(a.timestamp.toString(), true)}</td>
                                        {!this.state.revoking && <td><button className={"btn btn-danger"} onClick={(e) => this.revokeAccess(e, a)}>Revoke Access</button></td>}
                                        {this.state.revoking && <td><button className={"btn btn-danger"}>Processing...</button></td>}
                                    </tr>)
                                })}
                                </tbody>
                            </table>
                        </div>
                    </div>
                })}
            </div>
        </div>
    }
    
}