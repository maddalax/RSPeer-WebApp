import React from 'react';
import {OwnerPageWrapper} from "../../Components/OwnerPage/OwnerPageWrapper";
import {User} from "../../../Models/User";
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
                <UserDetailsTabs user={this.state.user}/>
            </div>}
        </OwnerPageWrapper>
    }
}

type Props = {
    user: User
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
                </ul>
                <div className="tab-content" id="myTabContent">
                    <div className="tab-pane fade show active" id="home" role="tabpanel" aria-labelledby="home-tab">
                        <div style={{marginTop: '15px'}}>
                            {this.state.selected === 0 && <div><UserDetails user={this.props.user!}/></div>}
                        </div>
                    </div>
                    <div className="tab-pane fade" id="orders" role="tabpanel" aria-labelledby="orders-tab">
                        {this.state.selected === 1 && <div><OrdersView user={this.props.user!}/></div>}
                    </div>
                </div>
            </React.Fragment>
        );
    }
}

class UserDetails extends React.Component<Props, any> {
    render() {
        const user = this.props.user;
        return <div>
            <p>Id: <strong>{user.id}</strong></p>
            <p>Username: <strong>{user.username}</strong></p>
            <p>Email: <strong>{user.email}</strong></p>
            <p>Balance: <strong>{Util.formatNumber(user.balance.toString())}</strong></p>
            <p>Groups: <strong>{user.groups.map(w => w.name).join(" , ")}</strong></p>
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