import React from "react";
import {Link} from "react-router-dom";

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
                    <Link to={"/scripts?q=all"} className="menu-link"><i className="fas fa-globe-europe"/> All Scripts</Link>
                </li>
                <li className="menu-item">
                    <Link to={"/scripts?q=premium"} className="menu-link"><i className="fab fa-app-store"/> Premium Scripts</Link>
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
                    <a href="user-profile.html" className="menu-link"><i className="fas fa-user"></i> My Scripts</a>
                </li>
                <li className="menu-item">
                    <a href="user-activities.html" className="menu-link"><i className="fas fa-globe-europe"/> All Scripts</a>
                </li>
                <li className="menu-item">
                    <a href="user-activities.html" className="menu-link"><i className="fab fa-paypal"/> Premium Scripts</a>
                </li>
                <li className="menu-item">
                    <a href="user-activities.html" className="menu-link"><i className="fas fa-tree"/> Free Scripts</a>
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
                    <Link to={"/store"} className="menu-link"><i className="fas fa-globe-europe"/> Purchase Instances</Link>
                </li>
            </ul>
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