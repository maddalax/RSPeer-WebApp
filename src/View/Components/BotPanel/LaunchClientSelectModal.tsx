import React from 'react';
import {ApiService} from "../../../Common/ApiService";
import {RunescapeClient} from "../../../Models/RunescapeClient";

type State = {
    hidingRunning : boolean,
    clients : RunescapeClient[],
}

export class LaunchClientSelectModal extends React.Component<any, State> {

    private readonly api : ApiService;
    
    constructor(props : any) {
        super(props);
        this.api = new ApiService();
        this.state = {
            hidingRunning: false,
            clients: []
        }    
    }
    
    toggleAll = () => {
        for (let client of this.props.payload.qs.clients) {
            const ele = document.getElementById(`toLaunchCheck-${client.id}`);
            ele && ele.click();
        }
    };

    onCheckboxChange = (e : any, client : any) => {
        const checked = e.target.checked;
        this.props.onCheckboxChange(checked, client);
    };
    
    async componentDidMount() {
       this.loadClients();
    }
    
    loadClients = async () => {
        const clients = await this.api.get("botLauncher/connectedClients");
        console.log(clients);
        this.setState({clients});
    };
    
    filterClients = () => {
      let clients = this.props.payload.qs.clients;
      const runningEmails = this.state.clients.filter(s => s.runescapeEmail != null).map(s => s.runescapeEmail.trim().toLowerCase());
      clients = clients.map((c : any) => {
          c.running = c.rsUsername != null && runningEmails.includes(c.rsUsername.trim().toLowerCase());
          return c;
      });
      if(this.state.hidingRunning) {
          return clients.filter((c : any) => !c.running);
      }  
      return clients;
    };
    
    toggleRunning = () => {
      this.setState({hidingRunning : !this.state.hidingRunning});
    };
    
    render() {
        return <div>
            <button className={"btn btn-primary"} style={{marginRight : '5px'}} onClick={this.toggleAll}>Toggle All</button>
            {!this.state.hidingRunning && <button className={"btn btn-primary"} onClick={this.toggleRunning}>Hide Currently Running</button>}
            {this.state.hidingRunning && <button className={"btn btn-primary"} onClick={this.toggleRunning}>Show Currently Running</button>}
            <br/><br/>
            <table className="table table-bordered">
                <thead>
                <tr>
                    <th scope="col">Selected</th>
                    <th scope="col">Email</th>
                    <th scope="col">World</th>
                    <th scope="col">Proxy</th>
                    <th scope="col">Script</th>
                    <th scope="col">Script Args</th>
                    <th scope="col">Is Running</th>
                </tr>
                </thead>
                <tbody>
                {this.filterClients().map((i : any, index: number) => {
                    const style = {backgroundColor : i.running ? '#00a28a' : '#ea6759'};
                    return <tr key={i.rsUsername}>
                        <td>
                            <div className="custom-control custom-checkbox">
                                <input type="checkbox" className="custom-control-input" id={`toLaunchCheck-${i.id}`} onChange={(e) => this.onCheckboxChange(e, i)}
                                       defaultChecked={true}/>
                                <label className="custom-control-label" htmlFor={`toLaunchCheck-${i.id}`}/>
                            </div>
                        </td>
                        <td>{i.rsUsername || "No Username"}</td>
                        <td>{`${i.world === -1 ? 'Any' : i.world}` || "No World"}</td>
                        <td>{i.proxy != null && i.proxy.ip != null ? `${i.proxy.name} (${i.proxy.ip})` : "No Proxy"}</td>
                        <td>{i.script != null ? i.script.name : "No Script"}</td>
                        <td>{i.script != null ? i.script.scriptArgs : "No Script Args"}</td>
                        <td style={style}>{i.running ? 'Yes' : 'No'}</td>
                    </tr>
                })}
                </tbody>
            </table>
        </div>
    }
    
}