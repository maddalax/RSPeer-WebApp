import React from 'react';
import {ApiService} from "../../../Common/ApiService";
import {Order} from "../../../Models/Order";
import {Util} from "../../../Utilities/Util";
import {Alert} from "../../../Utilities/Alert";
import {Modal} from "../../Components/Utility/Modal";

type State = {
    orders: Order[]
}

export class UserCenterViewOrders extends React.Component<any, State> {

    private readonly api: ApiService;

    constructor(props: any) {
        super(props);
        this.api = new ApiService();
        this.state = {
            orders: []
        }
    }

    async componentDidMount() {
        if(!this.props.user) {
            return;
        }
        const orders = await this.api.get("order/list");
        if (Array.isArray(orders)) {
            this.setState({orders});
        }
    }
    
    private showItem = (e : any, order : Order) => {
        e.preventDefault();
        Alert.modal({
            title : order.item.name,
            width : 30,
            body : <div>
                <p>Description: <strong>{order.item.description}</strong></p>
                <p>Price: <strong>{order.item.price} Tokens</strong></p>
                <button className={"btn btn-primary"} onClick={() => {
                    const isUnlimitedInstances = order.item.sku === "instances" && order.quantity === 1000000;
                    if(isUnlimitedInstances) {
                        this.props.history.push(`/store/checkout?sku=unlimitedInstances&quantity=1`);
                    } else {
                        this.props.history.push(`/store/checkout?sku=${order.item.sku}&quantity=${order.quantity}`);
                    }
                    Modal.removeModal();
                }}>Purchase Again</button>
            </div>
        })
    };

    render() {
        if(!this.props.user) {
            return <div>
                <h5>Click sign in on the top right to view this page.</h5>
            </div>
        }
        return <div>
            <div>
                <p>Total Orders: <strong>{this.state.orders.length}</strong></p>
                <div className="table-responsive">
                    <table className="table table-bordered table-striped">
                        <thead>
                        <tr>
                            <th scope="col">Item</th>
                            <th scope="col">Total</th>
                            <th scope="col">Quantity</th>
                            <th scope="col">Recurring</th>
                            <th scope="col">Refunded</th>
                            <th scope="col">Status</th>
                            <th scope="col">Date</th>
                            <th scope="col">Meta</th>
                        </tr>
                        </thead>
                        <tbody>
                        {this.state.orders.map((o: Order) => {
                            return (<tr>
                                <td><a href={"javascript:void(0)"} onClick={(e) => this.showItem(e, o)}>{o.item && o.item.name}</a></td>
                                <td>{Util.formatNumber(o.total.toString())}</td>
                                <td>{Util.formatNumber(o.quantity.toString())}</td>
                                <td>{o.recurring ? 'Yes' : 'No'}</td>
                                <td>{o.isRefunded ? 'Yes' : 'No'}</td>
                                <td>{o.statusFormatted}</td>
                                <td>{Util.formatDate(o.timestamp.toString(), true)}</td>
                                <td>{o.paypalId}</td>
                            </tr>)
                        })}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    }

}