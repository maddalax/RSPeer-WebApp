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
                    <Link to={"/scripts?q=free"} className="menu-link"><i className="fas fa-tree"/> Free Scripts</Link>
                </li>
                <li className="menu-item">
                    <Link to={"/scripts?q=premium"} className="menu-link"><i className="fab fa-app-store"/> Premium
                        Scripts</Link>
                </li>
                <li className="menu-item">
                    <Link to={"/scripts?q=private"} className="menu-link"><i className="fas fa-user-secret"/> Private
                        Scripts</Link>
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
                <li className="menu-item">
                    <Link to={"/bot/management/clients"} className="menu-link"><i className="fas fa-running"/> Running
                        Clients</Link>
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
                <li className="menu-item">
                    <Link to={"/user/apiClients"} className="menu-link">Api Clients</Link>
                </li>
            </ul>
        </li>);
    }
}

export class Community extends React.Component<any, any> {
    
    constructor(props : any) {
        super(props);
        const session = localStorage.getItem("rspeer_session");
        this.state = {
            session
        }
    }
    
    private getForumLink = () => {
        const url = "https://forums.rspeer.org";
        return this.state.session != null ? `${url}?idToken=${this.state.session}` : url;
    };
    
    render(): any {
        return (<li className="menu-item">
            <a href={this.getForumLink()} target={"_blank"} className="menu-link"><span className="menu-icon fas fa-users"/> <span
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
                <li className="menu-item">
                    <Link to={"/developer/privateScript"} className="menu-link">Private Script Access</Link>
                </li>
                <li className="menu-item">
                    <a href="https://forums.rspeer.org/topic/54/video-guide-how-to-add-a-script-to-the-rspeer-script-repository-a-step-by-step-video-guide" target={"_blank"} className="menu-link">Setup Guide</a>
                </li>
                <li className="menu-item">
                    <a href="https://forums.rspeer.org/topic/632/compile-rspeer-script-as-a-jar-in-intellij-idea" target={"_blank"} className="menu-link">Building Local Script</a>
                </li>
                <li className="menu-item">
                    <a href="https://download.rspeer.org/front-site/javadocs/index.html" target={"_blank"} className="menu-link">JavaDocs</a>
                </li>
                <li className="menu-item">
                    <a href="https://services.rspeer.org/api/bot/currentJar" target={"_blank"} className="menu-link">Rspeer SDK Download</a>
                </li>
            </ul>
        </li>);
    }
}

export class Downloads extends React.Component {
    render(): any {
        return (<li className="menu-item">
            <a href="https://rspeer.org/resources/download/" target={"_blank"} className="menu-link"><span className="menu-icon fas fa-desktop"/> <span
                className="menu-text">Download Client</span></a>
            <a href="https://ninite.com/adoptjdkx11/" target={"_blank"} className="menu-link"><span className="menu-icon fab fa-java"/> <span
                className="menu-text">OpenJDK 11</span></a>
            <a href="https://johann.loefflmann.net/en/software/jarfix/" target={"_blank"} className="menu-link"><span className="menu-icon fas fa-tools"/> <span
                className="menu-text">Java Jar Fix</span></a>
            <a href="https://download.rspeer.org/front-site/javadocs/index.html" target={"_blank"} className="menu-link"><span className="menu-icon fas fa-file-alt"/> <span
                className="menu-text">JavaDocs</span></a>
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
                <li className="menu-item">
                    <Link to={"/administration/orders"} className="menu-link">Orders</Link>
                </li>
                <li className="menu-item">
                    <Link to={"/administration/stats"} className="menu-link">Stats</Link>
                </li>
            </ul>
        </li>);
    }
}