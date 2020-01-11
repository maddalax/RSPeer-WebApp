import React from 'react';
import {ApiService} from "../../../../Common/ApiService";
import {ScripterPayoutDto} from "../../../../Models/ScripterPayout";
import {Util} from "../../../../Utilities/Util";
import {Alert} from "../../../../Utilities/Alert";

type State = {
    payouts: ScripterPayoutDto[]
}

export class ScripterPayout extends React.Component<any, State> {

    private readonly api: ApiService;

    constructor(props: any) {
        super(props);
        this.api = new ApiService();
        this.state = {
            payouts: []
        }
    }

    async componentDidMount() {
        if(!this.props.user) {
            return;
        }
        const payouts = await this.api.get('adminScripterPayout/calculate');
        if (Array.isArray(payouts)) {
            this.setState({payouts});
        }
    }
    
    showOrders = (e : any, payout : ScripterPayoutDto) => {
      e.preventDefault();
      Alert.modal({
          title : `Orders For ${payout.scripter.username}`,
          body : <div>
              <table className="table table-bordered">
                  <thead>
                  <tr>
                      <th scope="col">Buyer</th>
                      <th scope="col">Item</th>
                      <th scope="col">Total</th>
                      <th scope="col">Quantity</th>
                      <th scope="col">Refunded</th>
                      <th scope="col">Date</th>
                  </tr>
                  </thead>
                  <tbody>
                  {payout.orders.map((i) => {
                      return <tr>
                          <td>{i.user.username} ({i.user.email})</td>
                          <td>{i.item.name}</td>
                          <td>{Util.formatNumber(i.total.toString())}</td>
                          <td>{i.quantity}</td>
                          <td>{i.isRefunded ? 'Yes' : 'No'}</td>
                          <td>{Util.formatDate(i.timestamp.toString(), true)}</td>
                      </tr>
                  })}
                  </tbody>
              </table>
          </div>
      })  
    };
    
    payout = async (e : any, payout : ScripterPayoutDto) => {
        e.preventDefault();
        const email = window.prompt("Enter the paypal email address you paid out to for " + payout.scripter.username + ".");
        if(!email) {
            return Alert.show("Invalid email address.")
        }
        const confirm = window.confirm(`Please confirm that you paid out $${Util.formatNumber(payout.amountToPayout.toString())}.`);
        if(!confirm) {
            return;
        }
        const result = await this.api.post("adminScripterPayout/complete", payout);
        if(result.error) {
            return Alert.show(result.error);
        }
        Alert.success("Successfully confirmed pay out to " + payout.scripter.username + ".")
        this.componentDidMount();
    };

    render() {
        return <div>
            {this.state.payouts.map(o => {
                return <div>
                    <div id="accordion" className="card-expansion">
                        {/* .card */}
                        <div className="card card-expansion-item">
                            <div className="card-header border-0" id="headingOne">
                                <button className="btn btn-reset" data-toggle="collapse" data-target={'#p' + o.scripter.id.toString() + "-collapse"}
                                        aria-expanded="false" aria-controls="collapseOne">
        <span className="collapse-indicator mr-2">
          <i className="fa fa-fw fa-caret-right"/>
        </span>
                                    <span>{o.scripter.username} Payout Details</span>
                                </button>
                            </div>
                            <div id={'p' + o.scripter.id.toString() + "-collapse"} className="collapse" aria-labelledby="headingOne"
                                 data-parent="#accordion">
                                <div className="card-body pt-0">
                                    <p>Scripter: <strong>{o.scripter.username} ({o.scripter.email})</strong></p>
                                    <p>Current Token
                                        Balance: {Util.formatNumber(o.scripter.balance.toString())} Tokens</p>
                                    <p>Total Sales: ${Util.formatNumber(o.totalSales.toString())} (Not Payout
                                        Amount)</p>
                                    <p>Total Refunded Orders: {o.refundedOrderCount} (${Util.formatNumber(o.refundedOrderTotal.toString())} USD)</p>
                                    <p>Total Staff Purchases: {o.staffPurchases} (${Util.formatNumber(o.staffPurchasesTotal.toString())} USD)</p>
                                    <p>Scripts: {o.scripts.map(s => s.name).join(", ")}</p>
                                    <p>Total Orders Since Last Payout: <strong>{o.orders.length}</strong></p>
                                    <p>Amount To Payout: <strong><span
                                        style={{color: '#e05a4c'}}>${Util.formatNumber(o.amountToPayout.toString())} USD</span></strong>
                                    </p>
                                    <p><a href={"#"} onClick={(e) => this.showOrders(e, o)}>View Orders</a></p>
                                    <p><a href={"#"} onClick={(e) => this.payout(e, o)}>Click To Confirm Pay Out</a></p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            })}
        </div>
    }

}