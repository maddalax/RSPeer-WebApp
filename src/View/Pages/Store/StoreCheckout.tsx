import React from 'react';
import {HttpUtil} from "../../../Utilities/HttpUtil";
import {ApiService} from "../../../Common/ApiService";
import {OrderStatus, PaymentMethod, StoreItem} from "../../../Models/StoreItem";
import {Alert} from "../../../Utilities/Alert";
import {ScriptDto} from "../../../Models/ScriptDto";
import {CustomPrice} from "../../../Models/CustomPrice";
import {Item} from "../../../Models/Order";
import {Util} from "../../../Utilities/Util";

type State = {
    sku: string,
    quantity: number,
    item: StoreItem | null,
    script: ScriptDto | null,
    processing: boolean,
    success: boolean,
    customPrices: CustomPrice[]
}

export class StoreCheckout extends React.Component<any, State> {

    private api: ApiService;

    constructor(props: any) {
        super(props);
        this.api = new ApiService();
        this.state = {
            sku: HttpUtil.getParameterByName("sku") as string,
            quantity: parseInt(HttpUtil.getParameterByName("quantity") as string),
            script: null,
            item: null,
            processing: false,
            success: false,
            customPrices: []
        }
    }

    async componentDidMount() {
        if (this.state.sku) {
            const item = await this.api.get("store/getItem?sku=" + this.state.sku) as StoreItem;
            if (item == null) {
                return;
            }
            const customPrices = await this.api.get(`store/pricesPerQuantity?sku=${item.sku}`);
            if (item.sku.startsWith("premium-script")) {
                const scriptId = item.sku.replace("premium-script-", "");
                const script = await this.api.get("script/getScriptById?id=" + scriptId);
                this.setState({script});
            }
            this.setState({item, customPrices})
        }
    }

    private formatPrice = (price: number) => {
        const item = this.state.item;
        if (item == null) {
            return null;
        }
        if(isNaN(price)) {
            price = item.price;
        }
        if (item.paymentMethod === PaymentMethod.Tokens) {
            return `${Util.formatNumber(price.toString())} Tokens`;
        }
        if (item.paymentMethod === PaymentMethod.Paypal) {
            return `$${Util.formatNumber(price.toFixed(2))} USD`
        }
    };

    private calculatePrice = (): number => {
        let item = this.state.item;
        if (item == null) {
            return 0;
        }
        if (this.state.customPrices.length === 0) {
            return item.price;
        }
        const q = this.state.quantity;
        const prices = this.state.customPrices.filter(s => s.quantity <= q).sort((a, b) => b.quantity - a.quantity);
        return prices.length > 0 ? prices[0].price : item.price;
    };

    private purchaseNow = async () => {
        if (this.state.processing || this.state.item == null) {
            return;
        }
        if(isNaN(parseInt(this.state.quantity.toString()))) {
            Alert.show("Please enter a valid quantity.");
            return;
        }
        
        this.setState({processing: true});
        const result = await this.api.post("store/purchase", {
            sku: this.state.item.sku,
            quantity: this.state.quantity
        });
        this.setState({processing: false});
        if(result.error) {
            return Alert.show(result.error);
        }
        if (this.state.item.paymentMethod === PaymentMethod.Paypal) {
            if (!result.meta) {
                return Alert.show("Something went wrong, failed to build paypal order.");
            }
            return window.location.replace(result.meta);
        }
        if (result.status === OrderStatus.Completed) {
            this.props.reloadUser();
            this.props.history.push("/store/success")
        }
    };

    buildCustomPrices = () => {
        if (this.state.customPrices.length === 0) {
            return null;
        }
        return <div>
            <hr className="mb-4"/>
            <h5 className="mb-3">Bulk Quantity Pricing Discounts</h5>
            <p>If you purchase any of the following quanitites or higher, your price will be reduced to it's
                corresponding price per instance.</p>
            <p><strong>Example:</strong> If it said quantity >= 50, 300 tokens, you would get each instance at that
                corresponding price instead of the regular single
                instance price.</p>
            <div className="table-responsive">
                <table className="table table-bordered table-striped">
                    <thead>
                    <tr>
                        <th scope="col">If Quantity Is Greater Than Or Equal To</th>
                        <th scope="col">Price Per Purchase (Tokens)</th>
                    </tr>
                    </thead>
                    <tbody>
                    {this.state.customPrices.map((p: CustomPrice, i: number) => {
                        return <tr key={p.id}>
                            <td>{p.quantity}</td>
                            <td>{p.price}</td>
                        </tr>
                    })}
                    </tbody>
                </table>
            </div>
        </div>
    };

    onQuantityChange = (e: any) => {
        this.setState({quantity: parseInt(e.target.value)});
    };

    showTotalInstancesGiven = () => {
        if (!this.state.script) {
            return null;
        }
        if (!this.state.script.instances) {
            return <p style={{color: '#00fb8b'}}>Total Instances: <strong>Unlimited</strong></p>
        }
        const total = (this.state.quantity || 1) * this.state.script.instances;
        return <p style={{color: '#00fb8b'}}>Total Instances: <strong>{total} Instance(s)</strong></p>
    };

    render() {
        if (!this.state.sku) {
            return <div>
                <p>Invalid Sku or Quantity, please go back to your previous page and retry.</p>
            </div>
        }
        if (!this.state.item) {
            return <div>
                <div className="spinner-border" role="status">
                    <span className="sr-only">Loading...</span>
                </div>
            </div>
        }
        const price = this.calculatePrice();
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
                        <p>Price: <strong>{this.formatPrice(price * this.state.quantity)}</strong></p>
                        <p>Price Per Item: <strong>{price}</strong></p>
                        <form className="form-inline">
                            <div className="form-group">
                                <label htmlFor="inputPassword6">Quantity</label>
                                <input type="number" min={1} max={1000000} id="quantity-input" className="form-control mx-sm-3"
                                       aria-describedby="quantityHelpInline" value={this.state.quantity}
                                       readOnly={this.state.item == null || this.state.item.sku === 'tokens'}
                                       onChange={this.onQuantityChange}/>
                            </div>
                        </form>
                        {this.state.script && <div>
                            <hr className="mb-4"/>
                            <h5 className="mb-3">Additional Information</h5>
                            {this.showTotalInstancesGiven()}
                            <p>Access Length: <strong>30 Days</strong></p>
                            <p>Script Developer: <strong>{this.state.script.author}</strong></p>
                            <p>Script Type: <strong>{this.state.script.typeFormatted}</strong></p>
                        </div>}
                        {this.buildCustomPrices()}
                        <hr className="mb-4"/>
                        {!this.state.processing &&
                        <button onClick={this.purchaseNow} className="btn btn-primary btn-lg btn-block"
                                type="submit">Purchase Now
                            For {this.formatPrice(price * this.state.quantity)} {this.state.quantity > 1 && <span>({this.formatPrice(price)} Per
                            Item)</span>}</button>}
                        {this.state.processing &&
                        <button className="btn btn-primary btn-lg btn-block" type="submit">Processing... Please
                            Wait.</button>}

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