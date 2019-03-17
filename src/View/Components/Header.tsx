import React from 'react';
import {Link, withRouter} from 'react-router-dom'
import {Util} from "../../Utilities/Util";
import {HttpUtil} from "../../Utilities/HttpUtil";
import logo from './../../assets/images/logo.png'
import {ApiService} from "../../Common/ApiService";

export type HeaderProps = {
    user: any,
    allowedInstances: number
}

type State = {
    totalClientCount: number,
    interval: any
}

export class Header extends React.Component<HeaderProps | any, State> {

    private readonly api: ApiService;

    constructor(props: HeaderProps | any) {
        super(props);
        this.api = new ApiService();
        this.state = {
            totalClientCount: 0,
            interval: null
        }
    }

    async componentDidMount() {
        const isPaypalRedirect = HttpUtil.getParameterByName("paymentId") != null;
        if (isPaypalRedirect) {
            return this.props.history.push('/store/process')
        }
        await this.setConnectedCount();
        if (!this.state.interval) {
            const interval = setInterval(this.setConnectedCount, 300000);
            this.setState({interval});
        }
    }

    componentWillUnmount(): void {
        clearInterval(this.state.interval);
    }

    private setConnectedCount = async () => {
        const totalClientCount = await this.api.get("stats/connected");
        this.setState({totalClientCount})
    };

    private logout = () => {
        localStorage.removeItem("rspeer_session");
        sessionStorage.removeItem("rspeer_session");
        this.props.logoutCallback();
        this.props.history.push('/login')
    };

    private formatInstances = () => {
        const count = this.props.allowedInstances;
        return count >= 1000000 ? 'Unlimited' : Util.formatNumber(count);
    };

    render(): any {
        return (<header className="app-header app-header-dark">
                {/* .top-bar */}
                <div className="top-bar">
                    {/* .top-bar-brand */}
                    <div className="top-bar-brand">
                        <a href="/"><span className="tile tile-md tile-img mr-2" style={{width : '3.6em'}}>
                        <img src={logo}
                             alt=""
                             style={{height: '36px', width: 'auto'}}/>
                        </span>
                            <small>RSPeer.org</small>
                        </a>
                    </div>
                    {/* /.top-bar-brand */}
                    {/* .top-bar-list */}
                    <div className="top-bar-list">
                        {/* .top-bar-item */}
                        <div className="top-bar-item px-2 d-md-none d-lg-none d-xl-none">
                            {/* toggle menu */}
                            <button className="hamburger hamburger-squeeze" type="button" data-toggle="aside"
                                    aria-label="toggle menu"><span className="hamburger-box"><span
                                className="hamburger-inner"/></span></button>
                            {/* /toggle menu */}
                        </div>
                        {/* /.top-bar-item */}
                        {/* .top-bar-item */}
                        {/* /.top-bar-item */}
                        {/* .top-bar-item */}
                        <div className="top-bar-item top-bar-item-right px-0 d-none d-sm-flex">
                            {/* .nav */}
                            <ul className="header-nav nav">
                                <li className="nav-item dropdown header-nav-dropdown">
                                    <a className="nav-link" href="#">Clients
                                        Online: <strong>{Util.formatNumber(this.state.totalClientCount.toString())}</strong></a>
                                </li>
                                {/* .nav-item */}
                                {this.props.user && <li className="nav-item dropdown header-nav-dropdown">
                                    <a className="nav-link"
                                       href="#">Tokens: <strong>{Util.formatNumber(this.props.user.balance)}</strong></a>
                                </li>}
                                {this.props.user && <li className="nav-item dropdown header-nav-dropdown">
                                    <a className="nav-link" href="#">Instances
                                        Allowed: <strong>{this.formatInstances()}</strong></a>
                                </li>}
                            </ul>
                            {/* /.nav */}
                            {/* .btn-account */}
                            {this.props.user && <div className="dropdown">
                                <button className="btn-account d-none d-md-flex" type="button" data-toggle="dropdown"
                                        aria-haspopup="true" aria-expanded="false"> <span
                                    className="account-summary pr-lg-4 d-none d-lg-block"><span
                                    className="account-name">{this.props.user.username}</span> <span
                                    className="account-description">Director</span></span></button>
                                <div className="dropdown-arrow dropdown-arrow-left"/>
                                {/* .dropdown-menu */}
                                <div className="dropdown-menu">
                                    {<h6
                                        className="dropdown-header d-none d-md-block d-lg-none"> {this.props.user.username} </h6>}
                                    <Link
                                        className="dropdown-item" to="/scripts"><span
                                        className="dropdown-icon oi oi-person"/> Profile</Link>
                                    <a className="dropdown-item"
                                       href="javascript:void(0)" onClick={this.logout}><span
                                        className="dropdown-icon oi oi-account-logout"/> Logout</a>
                                    <div className="dropdown-divider"/>
                                    <a
                                        className="dropdown-item"
                                        href="#">Tokens: {Util.formatNumber(this.props.user.balance)}</a>
                                </div>
                                {/* /.dropdown-menu */}
                            </div>}
                            {!this.props.user && <div className="dropdown">
                                <button onClick={this.logout} className="btn-account d-none d-md-flex" type="button">
                                    <span className="account-name">Sign In</span>
                                </button>
                            </div>}
                            {/* /.btn-account */}
                        </div>
                        {/* /.top-bar-item */}
                    </div>
                    {/* /.top-bar-list */}
                </div>
                {/* /.top-bar */}
            </header>
        );
    }

}

export const HeaderWithRouter = withRouter((props: any) => (
    <Header {...props}/>
));