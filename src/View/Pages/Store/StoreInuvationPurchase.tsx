import * as React from "react";
import {Alert} from "../../../Utilities/Alert";
import {Util} from "../../../Utilities/Util";
import {OrderStatus, StoreItem} from "../../../Models/StoreItem";
import {ApiService} from "../../../Common/ApiService";
import {OrderService} from "../../../Services/Store/OrderService";
import {Order} from "../../../Models/Order";

type State = {
    processing : boolean,
    item : StoreItem | null,
    hasInuvation : boolean,
    orders : Order[],
    end : string
}

enum PurchaseType {
    Recurring,
    New,
    Extend
}

export class StoreInuvationPurchase extends React.Component<any, State> {

    private readonly api : ApiService;
    private readonly order : OrderService;
    private readonly sku = "rs3-inuvation-access";
    
    constructor(props : any) {
        super(props);
        this.api = new ApiService();
        this.order = new OrderService(this.api);
        const hasInuvation = this.props.user && this.props.user.groupNames.find((s : string) => s === 'Inuvation');
        this.state = {
            processing : false,
            item : null,
            hasInuvation : hasInuvation,
            end : '',
            orders : []
        }
    }
    
    async componentDidMount() {
        const item = await this.api.get("store/getItem?sku=" + this.sku) as StoreItem;
        if (item == null) {
            return;
        }
        if(this.state.hasInuvation) {
            this.loadOrders();
        }
        this.setState({item});
    }
    
    private loadOrders = async () => {
        const orders = await this.order.getOrders({
            sku : this.sku,
            status : OrderStatus.Completed,
            notExpired : true
        });
        if(Array.isArray(orders)) {
            const expiration = await this.getSubscriptionEnd(orders);
            this.setState({orders, end : expiration})
        }
    };
    
    private executePurchase = async () => {
        if (this.state.processing || this.state.item == null) {
            return;
        }
        this.setState({processing: true});
        const result = await this.api.post("store/purchase", {
            sku: this.sku,
            quantity: 1
        });
        this.setState({processing: false});
        if(result.error) {
            return Alert.show(result.error);
        }
        if (result.status === OrderStatus.Completed) {
            Alert.success("Successfully purchased RSPeer Inuvation access.");
            this.props.reloadUser();
            this.loadOrders();
        }
    };
    
    purchase = (type : PurchaseType) => {
        const title = 
            type == PurchaseType.Extend ? 'Confirm Extension of Current RS3 Inuvation Access' : 
            `Confirm Purchase For RS3 Inuvation Access ${type === PurchaseType.Recurring ? `(Recurring)` : ''}`;
        Alert
            .modal({
                title,
                onConfirm : async () => {
                   await this.executePurchase();
                },
                body : <div>
                    {type === PurchaseType.Recurring && <div>
                        <p>Purchasing a recurring subscription will automatically deduct from your token balance 1 day before expiration.
                            If you do not have sufficient tokens, your subscription will be <strong>canceled.</strong></p>
                        <p>This is the <strong><span style={{color : '#00fb8b'}}>best way</span></strong> to keep your subscription active and prevent it from being taken by another user.</p>
                    </div>}
                    {type === PurchaseType.Extend && <div>
                        <p>Extending your subscription will add another <span style={{color : '#00fb8b'}}>30 days</span> to your current subscription.</p>
                        <p>Each new purchase will extend to your current subscription.</p>
                    </div>}
                    {type === PurchaseType.New && <div>
                        <p>Your subscription to RSPeer Inuvation will begin immediately after purchase confirmation and last <span style={{color : '#00fb8b'}}>30 days</span> from now.</p>
                    </div>}
                    <hr/>
                    <h6>Click <span style={{color : '#00fb8b'}}>OK</span> below to confirm your purchase.</h6>
                </div>,
            })
    };
    
    formatPrice = () => {
      if(!this.state.item) {
         return 0; 
      }  
      return `${Util.formatNumber(this.state.item.price.toString())} Tokens`
    };
    
    getSubscriptionEnd = async (orders : Order[]) => {
        const res = await this.api.post("order/expiration", orders);
        return Util.formatDate(res.date, true);
    };
    
    render() {
        return <React.Fragment>
            <div className="card">
                <div className="card-body">
                    <h5 className="card-title">Purchase RS3 Inuvation Access</h5>
                    <p>Unsure of what RS3 Inuvation is? Look <a target={"_blank"} href={"https://rspeer.org/runescape-3-rs3-bot/"}>here.</a></p>

                    <p>RSPeer Inuvation is restricted to 50 users only. Your purchase may be denied if your purchase is completed
                        too late and another user has taken your spot.</p>
                </div>
            </div>            
            <div className={"card"}>
                <div className={"card-body"}>
                    <h5 className="card-title">Before Purchasing</h5>
                    <p>Please read our <a target={"_blank"} href={"https://rspeer.org/runescape-3-rs3-bot-faq/"}>frequently asked questions</a> about Inuvation, which includes
                        our refund policy.</p>
                    <p>By purchasing, you agree to our site wide <a target={"_blank"} href={"https://rspeer.org/resources/refund-policy/"}>refund policy</a> and Inuvation refund policy stated in the FAQ.</p>

                </div>
            </div>
            {this.state.orders.length > 0 && <div className={"card"}>
                <div className={"card-body"}>
                    <h5 className="card-title">Your RSPeer Inuvation Orders</h5>
                    <div className="table-responsive">
                        <table className="table table-bordered table-striped">
                            <thead>
                            <tr>
                                <th scope="col">Total</th>
                                <th scope="col">Quantity</th>
                                <th scope="col">Recurring</th>
                                <th scope="col">Refunded</th>
                                <th scope="col">Status</th>
                                <th scope="col">Date</th>
                            </tr>
                            </thead>
                            <tbody>
                            {this.state.orders.map((o: Order) => {
                                return (<tr>
                                    <td>{Util.formatNumber(o.total.toString())}</td>
                                    <td>{Util.formatNumber(o.quantity.toString())}</td>
                                    <td>{o.recurring ? 'Yes' : 'No'}</td>
                                    <td>{o.isRefunded ? 'Yes' : 'No'}</td>
                                    <td>{o.statusFormatted}</td>
                                    <td>{Util.formatDate(o.timestamp.toString(), true)}</td>
                                </tr>)
                            })}
                            </tbody>
                        </table>
                        <h6>Your RSPeer Inuvation subscription will expire on <span style={{color : '#00fb8b'}}>{this.state.end}</span></h6>
                    </div>
                </div>
            </div>} 
            {!this.state.item && <React.Fragment>
                <button type={"button"} className={"btn btn-success"}>Loading...</button>
            </React.Fragment>}
            {this.state.item && !this.state.hasInuvation && <React.Fragment>
                <button onClick={() => this.purchase(PurchaseType.Recurring)} type={"button"} className={"btn btn-success"}>Purchase Monthly ({this.formatPrice()}) (Recurring)</button>
                <br/><br/>
                <button onClick={() => this.purchase(PurchaseType.New)} type={"button"} className={"btn btn-success"}>Purchase For One Month ({this.formatPrice()})</button>
            </React.Fragment>}
            {this.state.item && this.state.hasInuvation && <React.Fragment>
                <button onClick={() => this.purchase(PurchaseType.Extend)} type={"button"} className={"btn btn-success"}>Extend Current Acccess ({this.formatPrice()}) (30 Days)</button>
                <small id="extendHelp" className="form-text text-muted">You already have Inuvation access, but you can
                    extend your subscription. Each purchase will extend the subscription by 30 days.
                </small>
            </React.Fragment>}
        </React.Fragment>
    }
    
}