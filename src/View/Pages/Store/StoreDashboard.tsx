import React from 'react';
import {ApiService} from "../../../Common/ApiService";
import {FileConstants, FileService} from "../../../Services/File/FileService";

type State = {
    tokenQuantities: number[],
    processing: number,
    instancesToPurchase: string,
    instancePrice: number,
    text : string
}

export class StoreDashboard extends React.Component<any, State> {

    private api: ApiService;
    private files : FileService;

    constructor(props: State) {
        super(props);
        this.api = new ApiService();
        this.files = new FileService();
        this.state = {
            tokenQuantities: [],
            processing: 0,
            instancesToPurchase: '5',
            instancePrice: 100,
            text : ''
        }
    }

    async componentDidMount() {
        this.setState({tokenQuantities: [500, 1000, 1500, 2000, 2500, 5000, 7500]})
        const text = await this.files.getFile(FileConstants.STORE);
        this.setState({text})
    }

    private assertCanPurchase = () => {
        if (this.props.user) {
            return true;
        }
        this.props.history.push('/login');
        return false;
    };

    private purchaseInstances = async () => {
        if (this.assertCanPurchase()) {
            this.props.history.push(`/store/checkout?sku=instances&quantity=${this.state.instancesToPurchase}`)
        }
    };

    private purchaseUnlimitedInstances = async () => {
        if (this.assertCanPurchase()) {
            this.props.history.push(`/store/checkout?sku=unlimitedInstances&quantity=1`)
        }
    };

    private setInstancesToPurchase = (e: any) => {
        this.setState({instancesToPurchase: e.target.value})
    };

    private purchaseTokens = async (quantity: number) => {
        if (this.assertCanPurchase()) {
            this.props.history.push(`/store/checkout?sku=tokens&quantity=${quantity}`)
        }
    };

    render() {
        return <div>
            <h3>RSPeer Store</h3>
            <p>Before purchasing, please make sure you have read our <a href={"https://rspeer.org/resources/refund-policy"} target={"_blank"}>refund policy</a> and <a target="_blank" href="https://rspeer.org/resources/tos">terms of service</a>.</p>
            <div dangerouslySetInnerHTML={{__html: this.state.text}}/>
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
                               aria-describedby="basic-addon3" onChange={this.setInstancesToPurchase}
                               value={this.state.instancesToPurchase}/>
                    </div>
                    {isNaN(parseInt(this.state.instancesToPurchase)) &&
                    <button type={"button"} className={"btn btn-primary"}>Type in a quantity of instances to
                        purchase.</button>}
                    {!isNaN(parseInt(this.state.instancesToPurchase)) &&
                    <button onClick={this.purchaseInstances} type={"button"}
                            className={"btn btn-primary"}>Purchase {this.state.instancesToPurchase} Instances Now
                        For {parseInt(this.state.instancesToPurchase) * this.state.instancePrice} Tokens</button>}
                    <br/><br/>
                    <p>Running a large amount of clients? Purchase unlimited instances now
                        for <strong>7500</strong> tokens per month.</p>
                    <p><strong>Note: </strong> Unlimited instances have the same expiration date as regular instances,
                        you just will not be limited to how many you can actually run.</p>
                    <button onClick={this.purchaseUnlimitedInstances} type={"button"}
                            className={"btn btn-success"}>Purchase Unlimited Instances For 7500 Tokens
                    </button>
                    <br/><br/>
                </div>
            </div>
        </div>
    }

}