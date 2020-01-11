import React from 'react';
import {Link, withRouter} from 'react-router-dom'
import {Util} from "../../Utilities/Util";
import {HttpUtil} from "../../Utilities/HttpUtil";
import logo from '../../assets/images/logo.svg'
import {ApiService} from "../../Common/ApiService";
import {Alert} from "../../Utilities/Alert";

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
        setTimeout(this.setStatus, 1000);
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
        let totalClientCount = await this.api.get("stats/connected");
        if(totalClientCount.error) {
            totalClientCount = 0;
        }
        this.setState({totalClientCount})
    };
    
    private setStatus = async () => {
        const message = await this.api.get("health/message");
        if(message.error) {
            Alert.showStatus(message.error);
            return;
        }
        if(message) {
            Alert.showStatus(message.toString());
        }
    };

    private logout = () => {
        localStorage.removeItem("rspeer_session");
        sessionStorage.removeItem("rspeer_session");
        this.props.logoutCallback();
        this.props.history.push('/')
    };

    private login = () => {
        this.props.history.push('/login')
    };
    
    private formatInstances = () => {
        if(isNaN(parseInt(this.props.allowedInstances))) {
            return 0;
        }
        const count = this.props.allowedInstances;
        return count >= 1000000 ? 'Unlimited' : Util.formatNumber(count);
    };

    render(): any {
        return (<header className="app-header app-header-dark" style={{backgroundColor : '#1b2033'}}>
                <div className="top-bar">
                    <div className="top-bar-brand">
                        <a href="/"><span className="tile tile-md tile-img mr-2">
                        <img src={logo}
                             alt=""
                             style={{height: '36px', width: 'auto'}}/>
                        </span>
                            <small>RSPeer</small>
                        </a>
                    </div>
                    <div className="top-bar-list">
                        <div className="top-bar-item px-2 d-md-none d-lg-none d-xl-none">
                            <button className="hamburger hamburger-squeeze" type="button" data-toggle="aside"
                                    aria-label="toggle menu"><span className="hamburger-box"><span
                                className="hamburger-inner"/></span></button>
                        </div>
                        <div className="top-bar-item top-bar-item-right px-0 d-none d-sm-flex">
                            <ul className="header-nav nav">
                                <li className="nav-item dropdown header-nav-dropdown">
                                    <a className="nav-link" href="#">Clients
                                        Online: <strong>{Util.formatNumber(this.state.totalClientCount.toString())}</strong></a>
                                </li>
                                {this.props.user && <li className="nav-item dropdown header-nav-dropdown">
                                    <a className="nav-link"
                                       href="#">Tokens: <strong>{Util.formatNumber(this.props.user.balance)}</strong></a>
                                </li>}
                                {this.props.user && <li className="nav-item dropdown header-nav-dropdown">
                                    <a className="nav-link" href="#">Instances
                                        Allowed: <strong>{this.formatInstances()}</strong></a>
                                </li>}
                            </ul>
                            {this.props.user && <div className="dropdown">
                                <button className="btn-account d-none d-md-flex" type="button" data-toggle="dropdown"
                                        aria-haspopup="true" aria-expanded="false"> <span
                                    className="account-summary pr-lg-4 d-none d-lg-block"><span
                                    className="account-name">{this.props.user.username}</span> 
                                    {this.props.user.isOwner && <span className="account-description">Director</span>}
                                    {!this.props.user.isOwner && <span className="account-description">Member</span>}
                                </span>
                                </button>
                                <div className="dropdown-arrow dropdown-arrow-left"/>
                                <div className="dropdown-menu">
                                    {<h6
                                        className="dropdown-header d-none d-md-block d-lg-none"> {this.props.user.username} </h6>}
                                    <a className="dropdown-item"
                                       href="javascript:void(0)" onClick={this.logout}><span
                                        className="dropdown-icon oi oi-account-logout"/> Logout</a>
                                    <div className="dropdown-divider"/>
                                    <a
                                        className="dropdown-item"
                                        href="#">Tokens: {Util.formatNumber(this.props.user.balance)}</a>
                                </div>
                            </div>}
                            {!this.props.user && <div className="dropdown">
                                <button onClick={this.login} className="btn-account d-none d-md-flex" type="button">
                                    <span className="account-name">Sign In</span>
                                </button>
                            </div>}
                        </div>
                    </div>
                </div>
            </header>
        );
    }

}

export const HeaderWithRouter = withRouter((props: any) => (
    <Header {...props}/>
));