import React from 'react';
import {ApiService} from "../../../Common/ApiService";
import {LogService} from "../../../Services/BotPanel/LogService";

export class ViewLogs extends React.Component<any, any> {

    private readonly  api : ApiService;
    private readonly logService : LogService;

    constructor(props : any) {
        super(props);
        this.api = new ApiService();
        this.logService = new LogService();
        this.state = {
            logs: {},
            launcher: '',
            launchers : {},
            hostName: '',
            top: 100,
            skip: 0,
            viewType : 'message'
        }
    }

    close = () => {
        this.props.onClose();
    };

    async componentDidMount() {
        if(!this.props.user) {
            return;
        }
        const launcher = this.props.match.params.launcherId;
        if (!launcher) {
            const launchers = await this.api.get("botLauncher/connected");
            this.setState({launchers});
            return;
        }
        const hostName = localStorage.getItem(launcher.toString());
        if (hostName) {
            this.setState({hostName});
        }
        this.setState({launcher}, () => {
            this.loadLogs();
        });
    }

    loadLogs = async (isRefresh : boolean = false) => {
        this.setState({logs : {}}, async () => {
            const logs = await this.logService.getLogs(this.state.launcher, this.state.top, this.state.skip, this.state.viewType);
            this.setState({logs});            
        });
    };

    viewNextLogs = () => {
        this.setState((prev : any) => {
            prev.skip = prev.skip + prev.top;
            prev.logs = {};
            return prev;
        }, () => {
            this.loadLogs();
        });
    };

    viewPrevLogs = () => {
        this.setState((prev : any) => {
            if(prev.skip === 0) {
                return prev;
            }
            prev.skip = prev.skip - 100;
            prev.logs = {};
            return prev;
        }, () => {
            this.loadLogs();
        });
    };

    viewLogs = (launcherId : string, hostName : string) => {
        localStorage.setItem(launcherId.toString(), hostName);
        this.props.history.push(`/bot/management/logs/${launcherId}`);
    };
    
    toggleViewType = () => {
        const isErrors = this.state.viewType === "error";
        this.setState({viewType : isErrors ? "message" : "error", logs : {}, top : 100, skip : 0}, () => {
            this.loadLogs();
        });
    };

    clearLogs = async () => {
        const confirm = window.confirm("Are you sure you want to clear all logs? This is not reversible.");
        if(!confirm) {
            return;
        }
        await this.api.post("botLauncher/send", {
            payload : {
                type : 'logs:clear',
                logType : this.state.viewType
            },
            socket : this.state.launcher
        });
        setTimeout(() => {
           this.setState({logs : {}}) 
        }, 1000)
    };
    
    render() {
        if(!this.props.user) {
            return <div>
                <h5>Click sign in on the top right to view this page.</h5>
            </div>
        }
        if(!this.state.launcher) {
            return <div>
                <div className={"container"}>
                    <h4> Select a launcher to view logs.</h4>
                    <p> Logs are important to view if you are experiencing issues with clients not starting or other strange issues. </p>
                    <p> These logs will include messages and errors from the launcher itself, the RSPeer clients.</p>
                    <p> All logs are stored on the your local system, inside the <strong>.rspeer</strong> folder in Home or Documents. </p>
                    {Object.entries(this.state.launchers).map(entry => {
                        const key = entry[0];
                        const launcher : any = entry[1];
                        return <div className="card card-max">
                            <div key={key} className={"card-body"}>
                                <p>Host Name: <strong>{launcher.host}</strong></p>
                                <p>Ip Address: <strong>{launcher.ip}</strong></p>
                                <p>OS: <strong>{launcher.type}</strong></p>
                                <p>OS Username: <strong>{launcher.userInfo.username}</strong></p>
                                <p>Link Key: <strong>{launcher.linkKey}</strong></p>
                                <button type="button" className="btn btn-primary"
                                        onClick={() => this.viewLogs(key, launcher.host)}>View Logs</button>
                        </div>
                        </div>
                    })}
                </div>
            </div>
        }
        return (
            <div>
                <div className={"container"}>
                    <p> Logs for Launcher <strong>{this.state.hostName}</strong></p>
                    <p> Total Logs: <strong>{this.state.logs.count}</strong></p>
                    <p> Viewing: <strong>{this.state.skip + this.state.top} / {this.state.logs.count}.</strong></p>
                    <p> Sort: <strong>Date Descending</strong></p>
                    <button onClick={() => this.loadLogs(true)} className={"btn btn-primary"}>Refresh</button>
                    <button onClick={this.viewPrevLogs} className={"btn btn-primary"}>View Prev 100 Logs</button>
                    <button onClick={this.viewNextLogs} className={"btn btn-success"}>View Next 100 Logs</button>
                    {this.state.viewType === "message" && <button onClick={this.toggleViewType} className={"btn btn-danger"}>View Errors</button>}
                    {this.state.viewType === "error" && <button onClick={this.toggleViewType} className={"btn btn-primary"}>View Messages</button>}
                    <br/><br/>
                    <p>Click below to clear all logs, these are not recoverable.</p>
                    {<button onClick={this.clearLogs} className={"btn btn-danger"}>Clear Logs</button>}
                    <br/><br/>
                    <table className="table table-bordered">
                        <thead>
                        <tr>
                            <th scope="col">Message</th>
                            <th scope="col">Date</th>
                        </tr>
                        </thead>
                        <tbody style={{marginBottom: 0}}>
                        {this.state.logs.rows && this.state.logs.rows.map((row : any) => {
                            return <tr>
                                <td style={{wordWrap: 'break-word', maxWidth: '1024px'}}><p>{row.message}</p></td>
                                <td><p>{row.date}</p></td>
                            </tr>
                        })}
                        </tbody>
                    </table>
                </div>
            </div>
        );
    }
}