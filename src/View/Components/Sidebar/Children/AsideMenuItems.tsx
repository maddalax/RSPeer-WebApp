import React from "react";
import {Link} from "react-router-dom";
import {User} from "../../../../Models/User";

export class ScriptsMenuItem extends React.Component {
    render(): any {
        return (<li className="menu-item has-child">
            <a href="#" className="menu-link"><span className="menu-icon fas fa-cloud"/> <span
                className="menu-text">Get Scripts</span></a> {/* child menu */}
            <ul className="menu">
                <li className="menu-item">
                    <Link to={"/scripts?q=mine"} className="menu-link"><i className="fas fa-user"/> My Scripts</Link>
                </li>
                <li className="menu-item">
                    <Link to={"/scripts?q=all"} className="menu-link"><i className="fas fa-globe-europe"/> All
                        Scripts</Link>
                </li>
                <li className="menu-item">
                    <Link to={"/scripts?q=premium"} className="menu-link"><i className="fab fa-app-store"/> Premium
                        Scripts</Link>
                </li>
                <li className="menu-item">
                    <Link to={"/scripts?q=free"} className="menu-link"><i className="fas fa-tree"/> Free Scripts</Link>
                </li>
            </ul>
        </li>);
    }
}

export class BotPanelMenuItem extends React.Component {
    render(): any {
        return (<li className="menu-item has-child">
            <a href="#" className="menu-link"><span className="menu-icon fas fa-robot"/> <span
                className="menu-text">Bot Management</span></a> {/* child menu */}
            <ul className="menu">
                <li className="menu-item">
                    <Link className="menu-link" to={"/bot/management"}>
                        <i className="fas fa-user"/> Start Clients</Link>
                </li>
                <li className="menu-item">
                    <Link to={"/bot/management/qs"} className="menu-link">
                        <i className="fas fa-globe-europe"/> Manage Quick Launch</Link>
                </li>
                <li className="menu-item">
                    <Link to={"/bot/management/proxy"} className="menu-link"><i className="fab fa-paypal"/> Manage
                        Proxies</Link>
                </li>
                <li className="menu-item">
                    <Link to={"/bot/management/logs"} className="menu-link"><i className="fab fa-paypal"/> View
                        Logs</Link>
                </li>
            </ul>
        </li>);
    }
}

export class StoreMenuItem extends React.Component {
    render(): any {
        return (<li className="menu-item has-child">
            <a href="#" className="menu-link"><span className="menu-icon fab fas fa-store"/> <span
                className="menu-text">Store</span></a> {/* child menu */}
            <ul className="menu">
                <li className="menu-item">
                    <Link to={"/store"} className="menu-link"><i className="fas fa-user"></i> Purchase Tokens</Link>
                </li>
                <li className="menu-item">
                    <Link to={"/store"} className="menu-link"><i className="fas fa-globe-europe"/> Purchase
                        Instances</Link>
                </li>
            </ul>
        </li>);
    }
}

export class UserCenter extends React.Component {
    render(): any {
        return (<li className="menu-item has-child">
            <a href="#" className="menu-link"><span className="menu-icon fas fa-user"/> <span
                className="menu-text">User Center</span></a>
            <ul className="menu">
                <li className="menu-item">
                    <Link to={"/user/orders"} className="menu-link">View Orders</Link>
                </li>
                <li className="menu-item">
                    <Link to={"/user/balanceChanges"} className="menu-link">Balance Changes</Link>
                </li>
                <li className="menu-item">
                    <Link to={"/user/scriptAccess"} className="menu-link">Script Access</Link>
                </li>
            </ul>
        </li>);
    }
}

export class Community extends React.Component {
    render(): any {
        return (<li className="menu-item">
            <a href={"https://forums.rspeer.org"} target={"_blank"} className="menu-link"><span className="menu-icon fas fa-users"/> <span
                className="menu-text">Visit Forums</span></a>
            <a href="https://discordapp.com/invite/rMTTpsU" target={"_blank"} className="menu-link"><span className="menu-icon fab fa-discord"/> <span
                className="menu-text">Join Our Discord</span></a>
        </li>);
    }
}

export class DeveloperCenter extends React.Component {
    render(): any {
        return (<li className="menu-item has-child">
            <a href="#" className="menu-link"><span className="menu-icon far fa-file-code"/> <span
                className="menu-text">Developer Center</span></a>
            <ul className="menu">
                <li className="menu-item">
                    <Link to={"/developer"} className="menu-link">Dashboard</Link>
                </li>
                <li className="menu-item">
                    <Link to={"/developer/addScript"} className="menu-link">Add New Script</Link>
                </li>
            </ul>
        </li>);
    }
}

export class AdminCenter extends React.Component<any, any> {

    render(): any {
        const user: User = this.props.user;
        const display = !user || !user.isOwner ? {"display": 'none'} : {};
        return (<li className="menu-item has-child" style={display}>
            <a href="#" className="menu-link"><span className="menu-icon fas fa-fingerprint"/> <span
                className="menu-text">Administration Center</span></a>
            <ul className="menu">
                <li className="menu-item">
                    <Link to={"/administration"} className="menu-link">Dashboard</Link>
                </li>
                <li className="menu-item">
                    <Link to={"/administration/user/search"} className="menu-link">User Search</Link>
                </li>
                <li className="menu-item">
                    <Link to={"/administration/scripts"} className="menu-link">All Scripts</Link>
                </li>
                <li className="menu-item">
                    <Link to={"/administration/scripts?status=pending"} className="menu-link">Pending Scripts</Link>
                </li>
                <li className="menu-item">
                    <Link to={"/administration/scripter/payout"} className="menu-link">Scripter Payout</Link>
                </li>
                <li className="menu-item">
                    <Link to={"/administration/content"} className="menu-link">Site Content</Link>
                </li>
            </ul>
        </li>);
    }
}