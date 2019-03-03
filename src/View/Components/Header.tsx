import React from 'react';
import {Link, withRouter} from 'react-router-dom'
import {Util} from "../../Utilities/Util";
import {HttpUtil} from "../../Utilities/HttpUtil";

export type HeaderProps = {
    user: any,
    allowedInstances : number,
    totalClientCount : number
}

export class Header extends React.Component<HeaderProps | any, any> {

    constructor(props: HeaderProps | any) {
        super(props);
    }

    async componentDidMount() {
        const isPaypalRedirect = HttpUtil.getParameterByName("paymentId") != null;
        if(isPaypalRedirect) {
            return this.props.history.push('/store/process')
        }
    }

    async componentDidUpdate() {
    }

    private logout = () => {
        localStorage.removeItem("rspeer_session");
        sessionStorage.removeItem("rspeer_session");
        this.setState({user: null});
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
                    <a href="index.html">RSPeer.org</a>
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
                                <a className="nav-link" href="#">Clients Online: <strong>{Util.formatNumber(this.props.totalClientCount)}</strong></a>
                            </li>
                            {/* .nav-item */}
                            {this.props.user && <li className="nav-item dropdown header-nav-dropdown">
                                <a className="nav-link" href="#">Tokens: <strong>{Util.formatNumber(this.props.user.balance)}</strong></a>
                            </li>}
                            {this.props.user && <li className="nav-item dropdown header-nav-dropdown">
                                <a className="nav-link" href="#">Instances Allowed: <strong>{this.formatInstances()}</strong></a>
                            </li>}
                            {/* /.nav-item */}
                            {/* .nav-item */}
                            <li className="nav-item dropdown header-nav-dropdown has-notified">
                                <a className="nav-link" href="#" data-toggle="dropdown" aria-haspopup="true"
                                   aria-expanded="false"><span className="oi oi-envelope-open"/></a>
                                <div className="dropdown-arrow"/>
                                {/* .dropdown-menu */}
                                <div className="dropdown-menu dropdown-menu-rich dropdown-menu-right">
                                    <h6 className="dropdown-header stop-propagation">
                                        <span>Messages</span> <a href="#">Mark all as read</a>
                                    </h6>{/* .dropdown-scroll */}
                                    <div className="dropdown-scroll perfect-scrollbar">
                                        {/* .dropdown-item */}
                                        <a href="#" className="dropdown-item unread">
                                            <div className="user-avatar">
                                                <img src="../../assets/images/avatars/team1.jpg"/>
                                            </div>
                                            <div className="dropdown-item-body">
                                                <p className="subject"> Stilearning </p>
                                                <p className="text text-truncate"> Invitation: Joe's Dinner @ Fri Aug
                                                    22 </p><span className="date">2 hours ago</span>
                                            </div>
                                        </a> {/* /.dropdown-item */}
                                        {/* .dropdown-item */}
                                        <a href="#" className="dropdown-item">
                                            <div className="user-avatar">
                                                <img src="../../assets/images/avatars/team3.png"/>
                                            </div>
                                            <div className="dropdown-item-body">
                                                <p className="subject"> Openlane </p>
                                                <p className="text text-truncate"> Final reminder: Upgrade to Pro </p>
                                                <span className="date">23 hours ago</span>
                                            </div>
                                        </a> {/* /.dropdown-item */}
                                        {/* .dropdown-item */}
                                        <a href="#" className="dropdown-item">
                                            <div className="tile tile-circle bg-green"> GZ</div>
                                            <div className="dropdown-item-body">
                                                <p className="subject"> Gogo Zoom </p>
                                                <p className="text text-truncate"> Live healthy with this wireless
                                                    sensor. </p><span className="date">1 day ago</span>
                                            </div>
                                        </a> {/* /.dropdown-item */}
                                        {/* .dropdown-item */}
                                        <a href="#" className="dropdown-item">
                                            <div className="tile tile-circle bg-teal"> GD</div>
                                            <div className="dropdown-item-body">
                                                <p className="subject"> Gold Dex </p>
                                                <p className="text text-truncate"> Invitation: Design Review @ Mon Jul
                                                    7 </p><span className="date">1 day ago</span>
                                            </div>
                                        </a> {/* /.dropdown-item */}
                                        {/* .dropdown-item */}
                                        <a href="#" className="dropdown-item">
                                            <div className="user-avatar">
                                                <img src="../../assets/images/avatars/team2.png"/>
                                            </div>
                                            <div className="dropdown-item-body">
                                                <p className="subject"> Creative Division </p>
                                                <p className="text text-truncate"> Need some feedback on this
                                                    please </p><span className="date">2 days ago</span>
                                            </div>
                                        </a> {/* /.dropdown-item */}
                                        {/* .dropdown-item */}
                                        <a href="#" className="dropdown-item">
                                            <div className="tile tile-circle bg-pink"> LD</div>
                                            <div className="dropdown-item-body">
                                                <p className="subject"> Lab Drill </p>
                                                <p className="text text-truncate"> Our UX exercise is ready </p><span
                                                className="date">6 days ago</span>
                                            </div>
                                        </a> {/* /.dropdown-item */}
                                    </div>
                                    {/* /.dropdown-scroll */}
                                    <a href="page-messages.html" className="dropdown-footer">All messages <i
                                        className="fas fa-fw fa-long-arrow-alt-right"/></a>
                                </div>
                                {/* /.dropdown-menu */}
                            </li>
                            {/* /.nav-item */}
                            {/* .nav-item */}
                            <li className="nav-item dropdown header-nav-dropdown">
                                <a className="nav-link" href="#" data-toggle="dropdown" aria-haspopup="true"
                                   aria-expanded="false"><span className="oi oi-grid-three-up"/></a>
                                <div className="dropdown-arrow"/>
                                {/* .dropdown-menu */}
                                <div className="dropdown-menu dropdown-menu-rich dropdown-menu-right">
                                    {/* .dropdown-sheets */}
                                    <div className="dropdown-sheets">
                                        {/* .dropdown-sheet-item */}
                                        <div className="dropdown-sheet-item">
                                            <a href="#" className="tile-wrapper"><span
                                                className="tile tile-lg bg-indigo"><i className="oi oi-people"/></span>
                                                <span className="tile-peek">Teams</span></a>
                                        </div>
                                        {/* /.dropdown-sheet-item */}
                                        {/* .dropdown-sheet-item */}
                                        <div className="dropdown-sheet-item">
                                            <a href="#" className="tile-wrapper"><span className="tile tile-lg bg-teal"><i
                                                className="oi oi-fork"/></span> <span
                                                className="tile-peek">Projects</span></a>
                                        </div>
                                        {/* /.dropdown-sheet-item */}
                                        {/* .dropdown-sheet-item */}
                                        <div className="dropdown-sheet-item">
                                            <a href="#" className="tile-wrapper"><span className="tile tile-lg bg-pink"><i
                                                className="fa fa-tasks"/></span> <span
                                                className="tile-peek">Tasks</span></a>
                                        </div>
                                        {/* /.dropdown-sheet-item */}
                                        {/* .dropdown-sheet-item */}
                                        <div className="dropdown-sheet-item">
                                            <a href="#" className="tile-wrapper"><span
                                                className="tile tile-lg bg-yellow"><i className="oi oi-fire"/></span>
                                                <span className="tile-peek">Feeds</span></a>
                                        </div>
                                        {/* /.dropdown-sheet-item */}
                                        {/* .dropdown-sheet-item */}
                                        <div className="dropdown-sheet-item">
                                            <a href="#" className="tile-wrapper"><span className="tile tile-lg bg-cyan"><i
                                                className="oi oi-document"/></span> <span
                                                className="tile-peek">Files</span></a>
                                        </div>
                                        {/* /.dropdown-sheet-item */}
                                    </div>
                                    {/* .dropdown-sheets */}
                                </div>
                                {/* .dropdown-menu */}
                            </li>
                            {/* /.nav-item */}
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
                                <div className="dropdown-divider"/><a
                                className="dropdown-item" href="#">Tokens: {Util.formatNumber(this.props.user.balance)}</a>
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
        </header>);
    }

}

export const HeaderWithRouter = withRouter((props: any) => (<Header {...props}/>));