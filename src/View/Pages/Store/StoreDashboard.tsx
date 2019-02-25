import React from 'react';
import {ApiService} from "../../../Common/ApiService";

type State = {
    tokenQuantities: number[],
    processing: number,
    instancesToPurchase : string,
    instancePrice : number
}

export class StoreDashboard extends React.Component<any, State> {

    private api: ApiService;

    constructor(props: State) {
        super(props);
        this.api = new ApiService();
        this.state = {
            tokenQuantities: [],
            processing: 0,
            instancesToPurchase : '5',
            instancePrice : 100
        }
    }

    componentDidMount(): void {
        this.setState({tokenQuantities: [500, 1000, 1500, 2000, 2500, 5000, 7500]})
    }

    private purchaseInstances = async () => {
        this.props.history.push(`/store/checkout?sku=instances&quantity=${this.state.instancesToPurchase}`)
    };

    private purchaseUnlimitedInstances = async () => {
        this.props.history.push(`/store/checkout?sku=unlimitedInstances&quantity=1`)
    };

    private setInstancesToPurchase = (e : any) => {
        this.setState({instancesToPurchase : e.target.value})
    };

    private purchaseTokens = async (quantity: number) => {
        this.props.history.push(`/store/checkout?sku=tokens&quantity=${quantity}`)
    };

    render() {
        return <div>
            <div className="card">
                <div className="card-body">
                    <h5 className="card-title">Purchase Tokens</h5>
                    <p className="card-text">Tokens are the main currency used for RSPeer.</p>
                    <p>They are used to purchase client instances, script instances, and ranks.</p>
                    <p>Pricing per 100 tokens is $1.00 USD ($0.01 per token).</p>
                    <p>Click a button <strong>below</strong> to purchase a set amount of tokens.</p>
                    {this.state.tokenQuantities.map(q => {
                        return <button onClick={() => this.purchaseTokens(q)} type="button"
                                       style={{marginRight: '5px', marginTop: '7px'}}
                                       className={"btn btn-info"}>{this.state.processing === q ? 'Processing...' : `${q} Tokens`}</button>
                    })}
                </div>
            </div>
            <div className="card">
                <div className="card-body">
                    <h5 className="card-title">Purchase Client Instances</h5>
                    <p className="card-text">Purchase more client instances to allow more clients to be run at once.</p>
                    <p>We currently give <strong>1 free instance</strong> to each user.</p>
                    <p>You may verify your discord account to receive a total of <strong>3 free instances.</strong></p>
                    <div className="input-group mb-3">
                        <div className="input-group-prepend">
									<span className="input-group-text"
                                          id="basic-addon3">Enter amount of instances to purchase.</span>
                        </div>
                        <input type="number" className="form-control"
                               min={1}
                               aria-describedby="basic-addon3" onChange={this.setInstancesToPurchase} value={this.state.instancesToPurchase}/>
                    </div>
                    {isNaN(parseInt(this.state.instancesToPurchase)) && <button type={"button"} className={"btn btn-primary"}>Type in a quantity of instances to purchase.</button>}
                    {!isNaN(parseInt(this.state.instancesToPurchase)) && <button onClick={this.purchaseInstances} type={"button"} className={"btn btn-primary"}>Purchase {this.state.instancesToPurchase} Instances Now For {parseInt(this.state.instancesToPurchase) * this.state.instancePrice} Tokens</button>}
                    <br/><br/>
                    <p>Running a large amount of clients? Purchase unlimited instances now for <strong>7500</strong> tokens per month.</p>
                    <p><strong>Note: </strong> Unlimited instances have the same expiration date as regular instances, you just will not be limited to how many you can actually run.</p>
                    <button onClick={this.purchaseUnlimitedInstances} type={"button"} className={"btn btn-success"}>Purchase Unlimited Instances For 7500 Tokens</button>
                    <br/><br/>
                </div>
            </div>
        </div>
    }

}