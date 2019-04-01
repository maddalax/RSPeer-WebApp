import React from 'react';
import {ApiService} from "../../../../Common/ApiService";
import {Order} from "../../../../Models/Order";
import {Util} from "../../../../Utilities/Util";
import {Alert} from "../../../../Utilities/Alert";

type State = {
    orders: Order[],
    processing : boolean
}

export class OrderManager extends React.Component<any, State> {

    private readonly api: ApiService;

    constructor(props: any) {
        super(props);
        this.api = new ApiService();
        this.state = {
            orders: [],
            processing : false
        }
    }
    
    private processUnfinishedPaypal = async () => {
        if(this.state.processing) {
            return;
        }
        const confirm = window.confirm("Are you sure you want to process all Paypal orders?");
        if(!confirm) {
            return;
        }
        this.setState({processing : true});
        await this.api.post("adminOrder/processUnfinishedPaypalOrders", {});
        Alert.show("Successfully processed all orders.");
        this.setState({processing : false});
        this.componentDidMount();
    };

    async componentDidMount() {
        const orders = await this.api.get("adminOrder/unfinishedPaypalOrders");
        this.setState({orders});
    }

    render() {
        return (
            <div>
                {this.state.processing && <button className={"btn btn-primary"}>Processing...</button>}
                {!this.state.processing && <button onClick={this.processUnfinishedPaypal} className={"btn btn-primary"}>Finish All Paypal Orders</button>}
                <br/><br/>
                <p>Sometimes paypal does not send webhooks to our servers so orders are not confirmed. This button will
                    allow you to override that and automatically confirm and finish the orders.</p>
                <div className="table-responsive">
                    <table className="table table-bordered table-striped">
                        <thead>
                        <tr>
                            <th scope="col">Id</th>
                            <th scope="col">Paypal Id</th>
                            <th scope="col">Item</th>
                            <th scope="col">Item Sku</th>
                            <th scope="col">Total</th>
                            <th scope="col">Quantity</th>
                            <th scope="col">Recurring</th>
                            <th scope="col">Paid Out</th>
                            <th scope="col">Refunded</th>
                            <th scope="col">Status</th>
                            <th scope="col">Date</th>
                        </tr>
                        </thead>
                        <tbody>
                        {this.state.orders.map((o: any) => {
                            return (<tr>
                                <td>{o.id}</td>
                                <td>{o.paypalId}</td>
                                <td>{o.item && o.item.name}</td>
                                <td>{o.item && o.item.sku}</td>
                                <td>{o.total}</td>
                                <td>{o.quantity}</td>
                                <td>{o.recurring ? 'Yes' : 'No'}</td>
                                <td>{o.isPaidOut ? 'Yes' : 'No'}</td>
                                <td>{o.isRefunded ? 'Yes' : 'No'}</td>
                                <td>{o.statusFormatted}</td>
                                <td>{Util.formatDate(o.timestamp, true)}</td>
                            </tr>)
                        })}
                        </tbody>
                    </table>
                </div>
            </div>
        );
    }

}