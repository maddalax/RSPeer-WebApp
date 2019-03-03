import React from 'react';
import {OwnerPageWrapper} from "../../Components/OwnerPage/OwnerPageWrapper";
import {AddRemove, User} from "../../../Models/User";
import {ApiService} from "../../../Common/ApiService";
import {Util} from "../../../Utilities/Util";
import {Alert} from "../../../Utilities/Alert";

type State = {
    query: string,
    user: User | null,
    results: User[]
}

export class AdministrationUserDetails extends React.Component<any, State> {

    private readonly api: ApiService;

    constructor(props: any) {
        super(props);
        const user = localStorage.getItem("adminUserSearch") || null;
        this.api = new ApiService();
        this.state = {
            query: '',
            user: user != null ? JSON.parse(user) : null,
            results: []
        }
    }

    onQueryChange = (e: any) => {
        this.setState({query: e.target.value})
    };

    onKeyPress = (e: any) => {
        if (e.key === 'Enter') {
            this.searchUsers();
            return;
        }
    };

    searchUsers = async () => {
        if (!this.state.query) {
            return this.setState({user: null, results: []});
        }
        const results = await this.api.get("adminUser/search?term=" + this.state.query);
        this.setState({results});
        if (results.length === 0) {
            Alert.show("No results found for that query. Searched username, email, and user ids.");
        }
    };

    setUser = async (user: User) => {
        if(!user) {
            return;
        }
        const fullUser: User = await this.api.get(`user/byId?id=${user.id}&groups=true`);
        localStorage.setItem("adminUserSearch", JSON.stringify(fullUser));
        this.setState({user: fullUser, results: []});
    };

    render() {
        return <OwnerPageWrapper {...this.props}>
            <h6>Search Users by Username or Email</h6>
            <div className="input-group mb-3">
                <input type="text" className="form-control" placeholder="Username or Email"
                       aria-label="Username or Email"
                       onChange={this.onQueryChange} onKeyDown={this.onKeyPress} aria-describedby="basic-addon1"
                       value={this.state.query}/>
            </div>
            {this.state.results.length > 0 && <div>
                <div className="table-responsive">
                    <table className="table table-bordered table-striped">
                        <thead>
                        <tr>
                            <th scope="col">Id</th>
                            <th scope="col">Username</th>
                            <th scope="col">Email</th>
                            <th scope="col">Balance</th>
                            <th scope="col">Actions</th>
                        </tr>
                        </thead>
                        <tbody>
                        {this.state.results.map(u => {
                            return (<tr>
                                <td>{u.id}</td>
                                <td>{u.username}</td>
                                <td>{u.email}</td>
                                <td>{u.balance}</td>
                                <td><a href="javascript:void(0)" onClick={() => this.setUser(u)}>View Details</a></td>
                            </tr>)
                        })}
                        </tbody>
                    </table>
                </div>
            </div>}
            {this.state.user && <div>
                <UserDetailsTabs user={this.state.user} reloadUser={() => this.setUser(this.state.user!)}/>
            </div>}
        </OwnerPageWrapper>
    }
}

type Props = {
    user: User,
    reloadUser : () => any
}

class UserDetailsTabs extends React.Component<Props, any> {

    constructor(props: Props) {
        super(props);
        this.state = {
            selected: 0
        }
    }

    setSelected = (index: number) => {
        this.setState({selected: index})
    };

    render() {
        return (
            <React.Fragment>
                <ul className="nav nav-tabs" id="myTab" role="tablist">
                    <li className="nav-item">
                        <a onClick={() => this.setSelected(0)} className="nav-link active" id="home-tab"
                           data-toggle="tab" href="#home" role="tab"
                           aria-controls="home" aria-selected="true">Home</a>
                    </li>
                    <li className="nav-item">
                        <a onClick={() => this.setSelected(1)} className="nav-link" id="orders-tab" data-toggle="tab"
                           href="#orders" role="tab"
                           aria-controls="orders" aria-selected="false">Orders</a>
                    </li>
                    <li className="nav-item">
                        <a onClick={() => this.setSelected(2)} className="nav-link" id="balancechanges-tab" data-toggle="tab"
                           href="#balancechanges" role="tab"
                           aria-controls="orders" aria-selected="false">Balance Changes</a>
                    </li>
                </ul>
                <div className="tab-content" id="myTabContent">
                    <div className="tab-pane fade show active" id="home" role="tabpanel" aria-labelledby="home-tab">
                        <div style={{marginTop: '15px'}}>
                            {this.state.selected === 0 && <div><UserDetails user={this.props.user!} reloadUser={this.props.reloadUser}/></div>}
                        </div>
                    </div>
                    <div className="tab-pane fade" id="orders" role="tabpanel" aria-labelledby="orders-tab">
                        {this.state.selected === 1 && <div><OrdersView user={this.props.user!} reloadUser={this.props.reloadUser}/></div>}
                    </div>
                    <div className="tab-pane fade" id="balancechanges" role="tabpanel" aria-labelledby="balancechanges-tab">
                        {this.state.selected === 2 && <div><BalanceChanges user={this.props.user!} reloadUser={this.props.reloadUser}/></div>}
                    </div>
                </div>
            </React.Fragment>
        );
    }
}

class UserDetails extends React.Component<Props, any> {

    private readonly api: ApiService;

    constructor(props: Props) {
        super(props);
        this.api = new ApiService();
    }

    disableUser = async () => {
        const user = this.props.user;
        const res = await this.api.post("adminUser/disable", {
            userId : user.id,
            disabled : !user.disabled
        });
        if(res.error) {
            Alert.show(res.error);
        }
        this.props.reloadUser();
    };

    updateBalance = async (add : boolean) => {
        const user = this.props.user;
        const prompt : string | null = window.prompt(`How much would you like to ${add ? 'add' : 'remove'}?`);
        if(!prompt) {
            return;
        }
        const amount = parseInt(prompt);
        if(isNaN(amount)) {
            return Alert.show("Invalid amount. Must be a number.")
        }
        const reason = window.prompt(`Please include a reason or any additional metadata related to this balance change.`);
        if(!reason) {
            return Alert.show("A reason is required to update balance.");
        }
        const res = await this.api.post("adminUser/updateBalance", {
            userId : user.id,
            amount,
            type : add ? AddRemove.Add : AddRemove.Remove,
            reason : reason
        });
        if(res.error) {
            return Alert.show(res.error);
        }
        this.props.reloadUser();
    };

    render() {
        const user = this.props.user;
        return <div>
            <p>Id: <strong>{user.id}</strong></p>
            <p>Username: <strong>{user.username}</strong></p>
            <p>Email: <strong>{user.email}</strong></p>
            <p>Balance: <strong>{Util.formatNumber(user.balance.toString())}</strong></p>
            <p>Groups: <strong>{user.groups.map(w => w.name).join(" , ")}</strong></p>
            <button type="button" className="btn btn-success button-spacing" onClick={() => this.updateBalance(true)}>Add Balance</button>
            <button type="button" className="btn btn-danger button-spacing" onClick={() => this.updateBalance(false)}>Remove Balance</button>
            {!user.disabled && <button type="button" className="btn btn-danger button-spacing" onClick={this.disableUser}>Disable User</button>}
            {user.disabled && <button type="button" className="btn btn-success button-spacing" onClick={this.disableUser}>Enable User</button>}
            <div style={{marginTop : '5px'}}>
                <p><strong>Note: </strong>If you are refunding a purchase, please do not add tokens here. Instead, click on Orders and refund it there.</p>
            </div>
        </div>
    }
}

class OrdersView extends React.Component<Props, any> {

    private readonly api: ApiService;

    constructor(props: Props) {
        super(props);
        this.api = new ApiService();
        this.state = {
            orders: [],
            refunding: 0
        }
    }

    async componentDidMount() {
        const orders = await this.api.post("adminOrder/list", {
            userId: this.props.user.id,
            includeItem: true
        });
        console.log(orders);
        this.setState({orders});
    }

    componentDidUpdate(prevProps: Readonly<Props>, prevState: Readonly<any>, snapshot?: any): void {
        if (prevProps.user.id != this.props.user.id) {
            this.componentDidMount();
        }
    }

    refund = async (order: any) => {
        this.setState({refunding: order.id});
        const refund = await this.api.post("adminOrder/refund", {
            orderId: order.id
        });
        if (refund.error) {
            return Alert.show(refund.error);
        }
        this.setState((prev : any) => {
            const index = prev.orders.indexOf(order);
            order.isRefunded = true;
            prev.orders[index] = order;
            return prev;
        });
        this.setState({refunding: 0});
    };

    render() {
        return (
            <div>
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
                            <th scope="col">Actions</th>
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
                                {!o.isRefunded && <th scope="col">
                                    <button className={"btn btn-danger"} onClick={() => this.refund(o)}>
                                        {this.state.refunding === o.id ? 'Processing...' : 'Refund'}
                                    </button>
                                </th>}
                                {o.isRefunded && <th scope="col">
                                    <p>N/A</p>
                                </th>}
                            </tr>)
                        })}
                        </tbody>
                    </table>
                </div>
            </div>
        );
    }

}

class BalanceChanges extends React.Component<Props, any> {

    private readonly api: ApiService;

    constructor(props: Props) {
        super(props);
        this.api = new ApiService();
        this.state = {
            changes: []
        }
    }

    async componentDidMount() {
        const changes = await this.api.post("adminUser/balanceChanges", {
            userId: this.props.user.id,
            includeAdminUser : true
        });
        this.setState({changes});
    }

    componentDidUpdate(prevProps: Readonly<Props>, prevState: Readonly<any>, snapshot?: any): void {
        if (prevProps.user.id != this.props.user.id) {
            this.componentDidMount();
        }
    }

    render() {
        return (
            <div>
                <div className="table-responsive">
                    <table className="table table-bordered table-striped">
                        <thead>
                        <tr>
                            <th scope="col">Date</th>
                            <th scope="col">Type</th>
                            <th scope="col">Old Balance</th>
                            <th scope="col">New Balance</th>
                            <th scope="col">Order Id</th>
                            <th scope="col">By Admin</th>
                            <th scope="col">Reason</th>
                        </tr>
                        </thead>
                        <tbody>
                        {this.state.changes.map((o: any) => {
                            const isRemove = o.newBalance < o.oldBalance;
                            return (<tr>
                                <td>{Util.formatDate(o.timestamp, true)}</td>
                                <td className={isRemove ? 'table-danger' : 'table-success'}>
                                    <span style={{color : 'black'}}>{isRemove ? 'Remove' : 'Add'}</span>
                                </td>
                                <td>{Util.formatNumber(o.oldBalance)}</td>
                                <td>{Util.formatNumber(o.newBalance)}</td>
                                <td>{o.orderId || ''}</td>
                                <td>{o.adminUser != null ? o.adminUser.username : (o.adminUserId || '')}</td>
                                <td>{o.reason}</td>
                            </tr>)
                        })}
                        </tbody>
                    </table>
                </div>
            </div>
        );
    }

}