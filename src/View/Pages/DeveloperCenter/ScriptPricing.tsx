import React from "react";
import {ApiService} from "../../../Common/ApiService";
import {ScriptDto, ScriptStatus, ScriptType} from "../../../Models/ScriptDto";
import {CustomPrice} from "../../../Models/CustomPrice";
import {Alert} from "../../../Utilities/Alert";


type State = {
    scripts: ScriptDto[],
    loading: boolean,
    prices: {} | any,
    quantity: number,
    price: number
}

export class ScriptPricing extends React.Component<any, State> {

    private api: ApiService;

    constructor(props: any) {
        super(props);
        this.api = new ApiService();
        this.state = {
            scripts: [],
            loading: true,
            prices: {},
            quantity: 1,
            price: 0
        }
    }

    componentDidMount(): void {
        this.load();
    }

    getPrices = (s: ScriptDto): CustomPrice[] => {
        const prices = this.state.prices[s.id] || [] as CustomPrice[];
        prices.unshift({price: s.price || 0, quantity: 1});
        return prices;
    };

    load = async () => {
        let scripts: ScriptDto[] = await this.api.get("scriptDevelopment/listForScripter");
        scripts = scripts.filter(s => s.type === ScriptType.Premium && s.status === ScriptStatus.Live);
        let promises = scripts.map(s => {
            return this.api.get(`store/pricesPerQuantity?sku=premium-script-${s.id}`).then(r => {
                return {id: s.id, data: r}
            });
        });
        const prices = await Promise.all(promises);
        const pricesMap = {} as any;
        for (let price of prices) {
            pricesMap[price.id] = price.data;
        }
        this.setState({scripts, loading: false, prices: pricesMap});
    };

    addPricePerQuantity = async (s: ScriptDto) => {
        let quantity = window.prompt('What quantity would you like to offer a discount at?');
        let price = window.prompt('What should the price be when they buy that quantity or higher?');

        const assertValid = (value: any) => {
            return value != null && !isNaN(parseInt(value));
        };

        if (!assertValid(quantity) || !assertValid(price)) {
            Alert.show("Both quantity and price must be valid integers.");
            return;
        }

        if(!window.confirm(`You are adding the following script discount to ${s.name}: If a customer purchases ${quantity} instances or higher, they will get each instance for ${price}. Please confirm.`)) {
            return;
        }
        
        const res = await this.api.post(`store/addPricePerQuantity`, {
            sku: `premium-script-${s.id}`,
            quantity,
            price
        });
        if (!res || res.error) {
            Alert.show(res.error);
            return;
        }
        Alert.success("Successfully added for " + s.name + ".");
        await this.load();
    };

    removePricePerQuantity = async (s: ScriptDto, p: CustomPrice) => {
        if (!window.confirm('Are you sure you want to remove this?')) {
            return;
        }
        const res = await this.api.post(`store/removePricePerQuantity`, {
            sku: `premium-script-${s.id}`,
            quantity: p.quantity,
            price: p.price
        });
        if (!res || res.error) {
            Alert.show(res.error);
            return;
        }
        Alert.success("Successfully removed for " + s.name + ".");
        await this.load();
    };

    render() {
        return <div>
            <h3>Premium Script Pricing</h3>
            <p>Set custom script pricing based on quantity. Example, if a user wants to buy 50 instances, you can make
                the price cheaper per instance.</p>
            <br/>
            <p><strong>Instructions:</strong> Set a price for a certain quantity. If the user purchases that quantity or higher, they will recieve that price.
            </p>
            <p>
                Example, I create a discount that said if you buy 50 instances, you get them for 450 tokens instead of 550 tokens each. If the user buys 50 instances or higher,
                then they will automatically get each instance for 550 tokens. The pricing will fall back to the next best discount based on their quantity if it is not an exact match.
            </p>
            {this.state.loading && <p>Loading scripts...</p>}
            {this.state.scripts.length === 0 && !this.state.loading && <div>
                <strong>You currently do not have any premium scripts.</strong>
            </div>}
            {this.state.scripts.map(s => {
                return <div style={{paddingBottom: '25px'}}>
                    <h5>{s.name}</h5>
                    <p>{s.description}</p>
                    <button style={{marginBottom: '5px'}} className={"btn btn-primary"}
                            onClick={() => this.addPricePerQuantity(s)}>Add New
                    </button>
                    <div className="table-responsive">
                        <table className="table table-bordered table-striped">
                            <thead>
                            <tr>
                                <th scope="col">>= Quantity</th>
                                <th scope="col">Price (Tokens)</th>
                                <th scope="col">Action</th>
                            </tr>
                            </thead>
                            <tbody>
                            {this.getPrices(s).map((p: CustomPrice, i: number) => {
                                return <tr key={p.id}>
                                    <td>{p.quantity}</td>
                                    <td>{p.price}</td>
                                    {i === 0 && <td><p>N/A</p></td>}
                                    {i !== 0 && <td>
                                        <button className={"btn btn-danger"}
                                                onClick={() => this.removePricePerQuantity(s, p)}>Remove
                                        </button>
                                    </td>}
                                </tr>
                            })}
                            </tbody>
                        </table>
                    </div>
                </div>
            })}
        </div>
    }

}