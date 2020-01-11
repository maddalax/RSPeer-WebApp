import React from 'react';
import {ApiService} from "../../../Common/ApiService";
import {Util} from "../../../Utilities/Util";
import {BalanceChange} from "../../../Models/BalanceChange";
import {OrderService} from "../../../Services/Store/OrderService";

type State = {
    changes: BalanceChange[],
    added : number,
    removed : number
}

export class UserCenterViewBalanceChanges extends React.Component<any, State> {

    private readonly api: ApiService;
    private readonly orderService : OrderService;

    constructor(props: any) {
        super(props);
        this.api = new ApiService();
        this.orderService = new OrderService(this.api);
        this.state = {
            changes: [],
            added : 0,
            removed : 0
        }
    }

    async componentDidMount() {
        if(!this.props.user) {
            return;
        }
        const changes = await this.api.get("user/balanceChanges");
        if (!Array.isArray(changes)) {
           return;
        }
        const casted = changes as BalanceChange[];
        casted.map(c => {
            c.difference = c.newBalance - c.oldBalance;
            c.isAdd = c.difference > 0;
            return c;
        });
        this.setState({changes : casted});
        let added = 0;
        let removed = 0;
        for (let change of casted) {
            const diff = change.newBalance - change.oldBalance;
            diff > 0 ? added += diff : removed += diff
        }
        this.setState({added, removed : removed * -1});
    }
    
    showOrder = async (e : any, orderId : number) => {
        e.preventDefault();
        await this.orderService.showOrder(orderId);
    };
    
    render() {
        if(!this.props.user) {
            return <div>
                <h5>Click sign in on the top right to view this page.</h5>
            </div>
        }
        return <div>
            <p>Total Balance Added: {Util.formatNumber(this.state.added.toString())}</p>
            <p>Total Balance Removed: {Util.formatNumber(this.state.removed.toString())}</p>
            <div>
                <div className="table-responsive">
                    <table className="table table-bordered table-striped">
                        <thead>
                        <tr>
                            <th scope="col">New Balance</th>
                            <th scope="col">Old Balance</th>
                            <th scope="col">Amount</th>
                            <th scope="col">Order</th>
                            <th scope="col">Reason</th>
                            <th scope="col">Date</th>
                        </tr>
                        </thead>
                        <tbody>
                        {this.state.changes.map((o => {
                            return (<tr>
                                <td>{Util.formatNumber(o.newBalance.toString())}</td>
                                <td>{Util.formatNumber(o.oldBalance.toString())}</td>
                                <td>
                                    <span style={{color : o.difference < 0 ? '#ea6759' : '#0de25a'}}>{Util.formatNumber(o.difference.toString())}</span>
                                </td>
                                {o.orderId != 0 && <td><a href={"javascript:void(0)"} onClick={(e) => this.showOrder(e, o.orderId)}>View Order</a></td>}
                                {o.orderId == 0 && <td>N/A</td>}
                                <td>{o.reason}</td>
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