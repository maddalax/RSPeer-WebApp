import React from 'react';
import {ApiService} from "../../../../Common/ApiService";
import {Game, GameFormatted, ScriptDto, ScriptOrderBy, ScriptStatus, ScriptType} from "../../../../Models/ScriptDto";
import {Util} from "../../../../Utilities/Util";
import {Alert} from "../../../../Utilities/Alert";
import {AddModifyScript} from "../../DeveloperCenter/AddModifyScript";
import {Modal} from "../../../Components/Utility/Modal";
import {HttpUtil} from "../../../../Utilities/HttpUtil";

type State = {
    scripts: ScriptDto[],
    status: ScriptStatus,
    game : Game,
    loading : boolean
}

export class AdministrationScriptList extends React.Component<any, State> {

    private readonly api: ApiService;

    constructor(props: any) {
        super(props);
        this.api = new ApiService();
        const status = HttpUtil.getParameterByName("status");
        this.state = {
            scripts: [],
            loading : true,
            game : Game.Both,
            status: status === 'pending' ? ScriptStatus.Pending : ScriptStatus.Live
        };
    }

    async componentDidMount() {
        const scripts = await this.api.post('script/list', {
            orderBy: ScriptOrderBy.alphabetical,
            status: this.state.status,
            game : this.state.game
        });
        if (Array.isArray(scripts)) {
            this.setState({scripts});
        }
        this.setState({loading : false});
    }

    setScriptStatus = (status: ScriptStatus) => {
        this.setState({status, scripts: []}, () => {
            this.componentDidMount();
        })
    };

    setGame = (game: Game) => {
        this.setState({game, scripts: []}, () => {
            this.componentDidMount();
        })
    };

    manageScript = (script: ScriptDto) => {
        Alert.modal({
            title: 'Manage ' + script.name + ' by ' + script.author,
            body: <AddModifyScript script={script} isAdminView={true} onConfirm={() => {
                Modal.removeModal();
                Alert.show("Successfully updated " + script.name);
                this.componentDidMount();
            }} onCancel={Modal.removeModal}/>,
            hideButtons: true
        })
    };

    denyScript = async (script: ScriptDto) => {
        const reason = window.prompt(`Please enter a reason for denying ${script.name} by ${script.author}`);
        if (!reason) {
            return Alert.show("A reason is required.")
        }
        const deny = await this.api.post(`adminScript/deny?reason=${reason}&scriptId=${script.id}`, {});
        if (deny.error) {
            return Alert.show(deny.error);
        }
        Alert.success("Successfully denied script.", 5000);
        this.componentDidMount();
    };

    render() {
        return <div>
            <div className="dropdown">
                <button className="btn btn-secondary dropdown-toggle" type="button"
                        id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true"
                        aria-expanded="false">
                    Game: {GameFormatted(this.state.game)}
                </button>
                <div className="dropdown-menu" aria-labelledby="dropdownMenuButton">
                    <a className="dropdown-item" href="javascript:void(0)"
                       onClick={() => this.setGame(Game.Both)}>All</a>
                    <a className="dropdown-item" href="javascript:void(0)"
                       onClick={() => this.setGame(Game.Osrs)}>{GameFormatted(Game.Osrs)}</a>
                    <a className="dropdown-item" href="javascript:void(0)"
                       onClick={() => this.setGame(Game.Rs3)}>{GameFormatted(Game.Rs3)}</a>
                </div>
            </div>
            <div className="dropdown" style={{marginTop : '5px'}}>
                <button className="btn btn-secondary dropdown-toggle" type="button"
                        id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true"
                        aria-expanded="false">
                    Script Status: {this.state.status === ScriptStatus.Live ? 'Live' : 'Pending'}
                </button>
                <div className="dropdown-menu" aria-labelledby="dropdownMenuButton">
                    <a className="dropdown-item" href="javascript:void(0)"
                       onClick={() => this.setScriptStatus(ScriptStatus.Live)}>Live</a>
                    <a className="dropdown-item" href="javascript:void(0)"
                       onClick={() => this.setScriptStatus(ScriptStatus.Pending)}>Pending</a>
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
                <p>You are currently viewing pending scripts. These scripts require administrator approval to be
                    accepted onto the SDN.</p>
                <p>These scripts may be new scripts or updates to previous scripts.</p>
                <p>To approve a script, view their repository, verify the code is non-malicious, then click Manage ->
                    Update Script</p>
            </div>}

            <br/>
            <div className="table-responsive">
                <table className="table table-bordered table-striped">
                    <thead>
                    <tr>
                        <th scope="col">Game</th>
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
                    {this.state.loading && <tr>
                        <td>Loading scripts.</td>
                    </tr>}
                    {this.state.scripts.length === 0 && !this.state.loading && <tr>
                        <td>No results for your query.</td>
                    </tr>}
                    {this.state.scripts.map(s => {
                        const style = (script: ScriptDto) => {
                            if (script.type === ScriptType.Premium) return {color: 'white', backgroundColor: '#59ea8c'};
                        };
                        return (<tr>
                            <th scope="row">{GameFormatted(s.game)}</th>
                            <th scope="row">{s.name}</th>
                            <th scope="row">{s.author}</th>
                            <td>{s.description}</td>
                            <th scope="row"><a href={s.repositoryUrl} target={"_blank"}>View Repository</a></th>
                            <th scope="row"><a href={s.forumThread} target={"_blank"}>View Forum</a></th>
                            <td>{s.version}</td>
                            <td style={style(s)}>{s.typeFormatted}</td>
                            <td>{s.price != null ? Util.formatNumber(s.price.toString()) : 'N/A'}</td>
                            <td>{s.type === ScriptType.Premium ? s.instances || 'Unlimited' : 'N/A'}</td>
                            <td>{s.categoryFormatted}</td>
                            <td>{s.totalUsers}</td>
                            {this.state.status === ScriptStatus.Pending && <th scope="col">
                                <p><a style={{color: '#59ea8c'}} href={"javascript:void(0)"}
                                      onClick={() => this.manageScript(s)}>Accept</a></p>
                                <p><a style={{color: '#ea6759'}} href={"javascript:void(0)"}
                                      onClick={() => this.denyScript(s)}>Deny</a></p>
                            </th>}
                            {this.state.status === ScriptStatus.Live && <th scope="col">
                                <p><a style={{color: '#59ea8c'}} href={"javascript:void(0)"}
                                      onClick={() => this.manageScript(s)}>Modify</a></p>
                            </th>}
                        </tr>)
                    })}
                    </tbody>
                </table>
            </div>
        </div>
    }


}