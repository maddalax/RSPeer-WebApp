import React from "react";
import {HttpUtil} from "../../../Utilities/HttpUtil";
import {ApiService} from "../../../Common/ApiService";

type State = {
    paymentId : string | null,
    payerId : string | null,
    processing : boolean,
    error : string
}

export class StoreProcess extends React.Component<any, State> {

    private api : ApiService;

    constructor(props : any) {
        super(props);
        this.api = new ApiService();
        this.state = {
            paymentId : HttpUtil.getParameterByName("paymentId"),
            payerId : HttpUtil.getParameterByName("PayerID"),
            processing : true,
            error : ''
        }
    }

    componentDidMount(): void {
        this.processOrder();
    }

    processOrder = async () => {
        const res = await this.api.post("paypal/execute", {
            paymentId : this.state.paymentId,
            payerId : this.state.payerId
        });
        if(res.error) {
            this.setState({error : res.error});
            return;
        }
        this.setState({processing : false});
        this.props.reloadUser();
        this.props.history.push("/#/store/success")
    };

    render() {
        if(this.state.error) {
            return <div>
                <h3>An error has occurred.</h3>
                <p>{this.state.error}</p>
            </div>
        }
        if(this.state.processing) {
            return <div>
                <h3>Processing Order: {this.state.paymentId}</h3>
                <p>Please Wait...</p>
                <div className="spinner-border" role="status">
                    <span className="sr-only">Loading...</span>
                </div>
            </div>
        }
        return <div>Order successfully processed.</div>
    }

}