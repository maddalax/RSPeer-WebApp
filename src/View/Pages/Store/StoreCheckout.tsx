import React from 'react';
import {HttpUtil} from "../../../Utilities/HttpUtil";
import {ApiService} from "../../../Common/ApiService";
import {OrderStatus, PaymentMethod, StoreItem} from "../../../Models/StoreItem";
import {Alert} from "../../../Utilities/Alert";
import {ScriptDto} from "../../../Models/ScriptDto";

type State = {
    sku : string,
    quantity : number,
    item : StoreItem | null,
    script : ScriptDto | null,
    processing : boolean,
    success : boolean
}

export class StoreCheckout extends React.Component<any, State> {

    private api : ApiService;

    constructor(props : any) {
        super(props);
        this.api = new ApiService();
        this.state = {
            sku : HttpUtil.getParameterByName("sku") as string,
            quantity : parseInt(HttpUtil.getParameterByName("quantity") as string),
            script : null,
            item : null,
            processing : false,
            success : false
        }
    }

    async componentDidMount() {
        if(this.state.sku) {
            const item = await this.api.get("store/getItem?sku=" + this.state.sku) as StoreItem;
            if(item == null) {
                return;
            }
            if(item.sku.startsWith("premium-script")) {
                const scriptId = item.sku.replace("premium-script-", "");
                const script = await this.api.get("script/getScriptById?id=" + scriptId);
                this.setState({script});
            }
            this.setState({item})
        }
    }

    private formatPrice = () => {
        const item = this.state.item;
        if(item == null) {
            return null;
        }
        const quantity = this.state.quantity;
        if(item.paymentMethod === PaymentMethod.Tokens) {
            return `${item.price * quantity} Tokens`;
        }
        if(item.paymentMethod === PaymentMethod.Paypal) {
            return `$${(item.price * quantity).toFixed(2)} USD`
        }
    };

    private purchaseNow = async () => {
        if(this.state.processing || this.state.item == null) {
            return;
        }
        this.setState({processing : true});
        const result = await this.api.post("store/purchase", {
            sku : this.state.item.sku,
            quantity : this.state.quantity
        });
        this.setState({processing : false});
        if(this.state.item.paymentMethod === PaymentMethod.Paypal) {
            if(!result.meta) {
                return Alert.show("Something went wrong, failed to build paypal order.");
            }
            return window.location.replace(result.meta);
        }
        if(result.status === OrderStatus.Completed) {
            this.props.reloadUser();
            this.props.history.push("/#/store/success")
        }
    };

    render() {
        if(!this.state.sku || isNaN(this.state.quantity)) {
            return <div>
                <p>Invalid Sku or Quantity, please go back to your previous page and retry.</p>
            </div>
        }
        if(!this.state.item) {
            return <div>
                <div className="spinner-border" role="status">
                    <span className="sr-only">Loading...</span>
                </div>
            </div>
        }
        return <div>
            <div className="container">
                <div className="py-5 text-center">
                    <h3>Checkout Now</h3>
                    <p className="lead">Review your order and checkout below.</p>
                </div>
                <div className="row">
                    <div className="col-md-12">
                        <h5>Item: <strong>{this.state.item.name}</strong></h5>
                        <p>{this.state.item.description}</p>
                        <p>Price: <strong>{this.formatPrice()}</strong></p>
                        <p>Quantity: <strong>{this.state.quantity}</strong></p>
                        {this.state.script && <div>
                            <hr className="mb-4" />
                            <h5 className="mb-3">Additional Information</h5>
                            <p>Instances Given Per 30 Days: <strong>{this.state.script.instances}</strong></p>
                            <p>Access Length: <strong>30 Days</strong></p>
                            <p>Script Developer: <strong>{this.state.script.author}</strong></p>
                            <p>Script Type: <strong>{this.state.script.typeFormatted}</strong></p>
                        </div>}
                        <hr className="mb-4" />
                        {!this.state.processing && <button onClick={this.purchaseNow} className="btn btn-primary btn-lg btn-block" type="submit">Purchase Now For {this.formatPrice()}</button>}
                        {this.state.processing && <button className="btn btn-primary btn-lg btn-block" type="submit">Processing... Please Wait.</button>}

                    </div>
                </div>
                <footer className="my-5 pt-5 text-muted text-center text-small">
                    <p className="mb-1">© 2019 RSPeer</p>
                    <ul className="list-inline">
                        <li className="list-inline-item"><a href="#">Privacy</a></li>
                        <li className="list-inline-item"><a href="#">Terms</a></li>
                        <li className="list-inline-item"><a href="#">Support</a></li>
                    </ul>
                </footer>
            </div>

        </div>
    }

}