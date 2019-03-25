import React from 'react';
import {LaunchClientModal} from "./LaunchClientModal";
import {ApiService} from "../../../Common/ApiService";
import {Alert} from "../../../Utilities/Alert";

type State = {
    launchers: any,
    clients: any,
    isLaunching: boolean,
    selectedLauncher: any,
    launchingSocket: string | null,
    viewingLogs: boolean
};

export class ConnectedLaunchers extends React.Component<any, State> {

    private readonly api: ApiService;

    constructor(props: any) {
        super(props);
        this.api = new ApiService();
        this.state = {
            launchers: {},
            clients: {},
            isLaunching: false,
            selectedLauncher: null,
            launchingSocket: null,
            viewingLogs : false
        }
    }

    async componentDidMount() {
        this.load();
    }

    getClients = (machineName: string) => {
        return this.state.clients[machineName.toLowerCase().trim()] || [];
    };

    viewLogs = (launcherId: string, hostName: string) => {
        localStorage.setItem(launcherId.toString(), hostName);
        this.props.history.push(`/bot/management/logs/${launcherId}`);
    };

    killClient = async (client: any, index: number, host: string, shouldConfirm = true) => {
        if (shouldConfirm) {
            const confirm = window.confirm("Are you sure you want to close " + (client.rsn || "this client") + " ?");
            if (!confirm)
                return;
        }
        await this.api.post("botLauncher/kill?id=" + client.id, {});
        setTimeout(() => {
            this.setState(prev => {
                if (prev.clients[host]) {
                    prev.clients[host].splice(index);
                }
                return prev;
            })
        }, 1500);
    };

    killAllClients = async (launcher: any) => {
        const clients = this.getClients(launcher.host);
        const confirm = window.confirm(`Are you sure you want to close all clients on ${launcher.host}? This will close ${clients.length} client(s).`);
        if (!confirm)
            return;
        clients.forEach((c: any, index: number) => {
            this.killClient(c, index, launcher.host, false);
        })
    };

    launchClient = async (socket: string, launcher: any) => {
        this.setState({isLaunching: true, launchingSocket: socket})
    };

    killLauncher = async (socket: string) => {
        const confirm = window.confirm("Are you sure you want to kill this launcher? This will close all clients. If running on Linux, launcher may restart automatically.");
        if (!confirm)
            return;
        await this.api.post("botLauncher/send", {
            "payload": {
                type: 'launcher:kill'
            },
            socket
        })
    };

    load = async () => {
        const launchers = await this.api.get("botLauncher/connected");
        if(launchers.error) {
            return Alert.show(launchers.error);
        }
        this.setState({launchers});
        const clients = await this.api.get("botLauncher/connectedClients");
        if(Array.isArray(clients)) {
            const mapped: any = {};
            clients.forEach((c: any) => {
                if(!c.machineName) {
                    return;
                }
                const name = c.machineName.toLowerCase().trim();
                if (!mapped[name]) {
                    mapped[name] = [];
                }
                mapped[name].push(c);
            });
            this.setState({clients: mapped});
        }
    };

    onModalClose = () => {
        this.setState({isLaunching: false, viewingLogs: false, selectedLauncher: null})
    };

    render() {
        if (this.state.isLaunching) {
            return <LaunchClientModal onClose={this.onModalClose} socket={this.state.launchingSocket}/>;
        }
        const launcherCount = Object.keys(this.state.launchers).length;
        return <div>
            <h3>Connected Launchers ({launcherCount})</h3>
            <br/>
            <button type="button" className="btn btn-primary" onClick={this.load}>Refresh</button>
            <small id="refreshHelp" className="form-text text-muted">Auto refresh is disabled, click refresh
                to update connected launchers and connected clients.
            </small>
            <br/>
            {launcherCount > 0 &&
            <div><p>You currently have {launcherCount} launcher(s) open. You may launch clients from any of the launchers
                by clicking the launch client(s) button.</p>
                <p>Doing so will open a RSPeer client on the computer that you chose to launch on.</p>
            </div>}
            {launcherCount === 0 && <div>
                <p>You currently have no running launchers on any computers, please open rspeer-launcher to connect your
                    computer.</p>
                <p>Need help? Click <a href="#">here.</a></p>
            </div>}
            {Object.entries(this.state.launchers).map(entry => {
                const key = entry[0];
                const launcher: any = entry[1];
                const clients = this.getClients(launcher.host);
                return <div className="card card-max" key={launcher.host}>
                    <div className={"card-body"}>
                        <p>Host Name: <strong>{launcher.host}</strong></p>
                        <p>Ip Address: <strong>{launcher.ip}</strong></p>
                        <p>OS: <strong>{launcher.type}</strong></p>
                        <p>OS Username: <strong>{launcher.userInfo.username}</strong></p>
                        <p>Link Key: <strong>{launcher.linkKey}</strong></p>
                        <p>Connected Clients: {clients.length}</p>
                        <button type="button" className="btn btn-primary"
                                onClick={() => this.launchClient(key, launcher)}>Launch Client(s)
                        </button>
                        <button type="button" className="btn btn-danger"
                                onClick={() => this.killLauncher(key)}>Kill Launcher
                        </button>
                        <br/><br/>
                        <p>View logs from the launcher. These include messages from the launcher and the clients
                            themselves.</p>
                        <button type="button" className="btn btn-dark"
                                onClick={() => this.viewLogs(key, launcher.host)}>View Logs
                        </button>
                        {clients.length > 0 && <button type="button" className="btn btn-danger"
                                                       onClick={() => this.killAllClients(launcher)}>Close Client(s)
                            ({clients.length})</button>}
                        <br/><br/>
                        <table className="table table-bordered">
                            <thead>
                            <tr>
                                <th scope="col">Email</th>
                                <th scope="col">RSN</th>
                                <th scope="col">Proxy Ip</th>
                                <th scope="col">Script</th>
                                <th scope="col">Options</th>
                            </tr>
                            </thead>
                            <tbody>
                            {clients.map((i: any, index: number) => {
                                return <tr key={i.id}>
                                    <td>{i.runescapeEmail || "Not Logged In"}</td>
                                    <td>{i.rsn || "Not Logged In"}</td>
                                    <td>{i.proxyIp || "No Proxy"}</td>
                                    <td>{i.scriptName || "No Script"}</td>
                                    <td>
                                        <button type="button" className="btn btn-danger"
                                                onClick={() => this.killClient(i, index, launcher.host)}>Close Client
                                        </button>
                                    </td>
                                </tr>
                            })}
                            {clients.length === 0 && <tr key={launcher.host}>
                                <td>You currently have no clients running on this computer.</td>
                                <td/>
                                <td/>
                                <td/>
                                <td/>
                            </tr>}
                            </tbody>
                        </table>
                    </div>
                </div>
            })}
        </div>
    }
}