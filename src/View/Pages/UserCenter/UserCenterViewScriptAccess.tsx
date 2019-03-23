import React from 'react';
import {ApiService} from "../../../Common/ApiService";
import {Util} from "../../../Utilities/Util";
import {ScriptAccessDto, ScriptType} from "../../../Models/ScriptDto";
import {OrderService} from "../../../Services/Store/OrderService";

type State = {
    access: ScriptAccessDto[],
    filter : string
}

export class UserCenterViewScriptAccess extends React.Component<any, State> {

    private readonly api: ApiService;
    private readonly orderService : OrderService;

    constructor(props: any) {
        super(props);
        this.api = new ApiService();
        this.orderService = new OrderService(this.api);
        this.state = {
            access: [],
            filter : 'all'
        }
    }

    async componentDidMount() {
        const access = await this.api.post("script/listAccess", {
            includeScript : true,
            nonExpired : this.state.filter === 'nonExpired'
        });
        if (Array.isArray(access)) {
            this.setState({access});
        }
    }

    showOrder = async (e : any, orderId : number) => {
        e.preventDefault();
        await this.orderService.showOrder(orderId);
    };

    toggle = () => {
        this.setState(prev => {
            const copy = {...prev};
            copy.filter = copy.filter === 'nonExpired' ? 'all' : 'nonExpired';
            return copy;
        });
        this.setState({access : []}, this.componentDidMount);
    };
    
    repurchase = (e : any, access : ScriptAccessDto) => {
        e.preventDefault();
        if(access.script.type !== ScriptType.Premium) {
            return;
        }
        const sku = 'premium-script-' + access.script.id; 
        this.props.history.push(`/store/checkout?sku=${sku}&quantity=1`);  
    };
    
    render() {
        return <div>
            <div>
                <h6>Currently viewing <strong>{this.state.filter === 'all' ? 'all' : 'only non expired'} script access.</strong></h6>
                {this.state.filter === 'all' && <button className={"btn btn-primary"} onClick={this.toggle}>View Only Non Expired Access</button>}
                {this.state.filter !== 'all' && <button className={"btn btn-primary"} onClick={this.toggle}>View All Access</button>}
                <br/><br/>
                <div className="table-responsive">
                    <table className="table table-bordered table-striped">
                        <thead>
                        <tr>
                            <th scope="col">Renew</th>
                            <th scope="col">Script</th>
                            <th scope="col">Script Type</th>
                            <th scope="col">Instances</th>
                            <th scope="col">Expired</th>
                            <th scope="col">Order</th>
                            <th scope="col">Expiration Date</th>
                            <th scope="col">Date</th>
                        </tr>
                        </thead>
                        <tbody>
                        {this.state.access.map((o => {
                            return (<tr>
                                {o.script.type === ScriptType.Premium && <td><a href={"javascript:void(0)"} onClick={(e) => this.repurchase(e, o)}>Renew</a></td>}
                                {o.script.type !== ScriptType.Premium && <td/>}
                                <td>{o.script.name}</td>
                                <td>{o.script.typeFormatted}</td>
                                <td>{o.instances != null ? Util.formatNumber(o.instances.toString()) : 'Unlimited'}</td>
                                <td>{o.isExpired ? 'Yes' : 'No'}</td>
                                {o.orderId != 0 && <td><a href={"javascript:void(0)"} onClick={(e) => this.showOrder(e, o.orderId)}>View Order</a></td>}
                                {o.orderId == 0 && <td>N/A</td>}
                                <td>{o.expiration != null ? Util.formatDate(o.expiration.toString(), true) : 'Never'}</td>
                                <td>{Util.formatDate(o.timestamp.toString(), true)}</td>
                            </tr>)
                        }))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    }

}