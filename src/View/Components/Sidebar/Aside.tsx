import React from 'react';
import profile from '../../../assets/images/avatars/profile.jpg';
import {
    AdminCenter,
    BotPanelMenuItem, Community,
    DeveloperCenter, DeveloperDocs, Downloads,
    ScriptsMenuItem,
    StoreMenuItem, UserCenter
} from "./Children/AsideMenuItems";
import {withRouter} from "react-router-dom";
import {User} from "../../../Models/User";
import {Link} from "react-router-dom";

type Props = {
    user : User
}

export class Aside extends React.Component<Props | any, any> {

    render(): any {
        return (<aside className="app-aside app-aside-expand-md app-aside-light">
                <div className="aside-content">
                    <UserProfileDropdown {...this.props}/>
                    <div className="aside-menu overflow-hidden">
                        <nav id="stacked-menu" className="stacked-menu">
                            <ul className="menu">
                                <li className="menu-item">
                                    <Link to={"/"} className="menu-link"><span className="menu-icon fas fa-home"/>
                                        <span className="menu-text">Dashboard</span></Link>
                                </li>
                                <BotPanelMenuItem {...this.props}/>
                                <ScriptsMenuItem {...this.props}/>
                                <StoreMenuItem {...this.props}/>
                                <UserCenter {...this.props}/>
                                <li className="menu-header">Community</li>
                                <Community {...this.props}/>
                                <li className="menu-header">Downloads</li>
                                <Downloads {...this.props}/>
                                <li className="menu-header">Script Development</li>
                                <DeveloperDocs {...this.props}/>
                                <DeveloperCenter {...this.props}/>
                                {this.props.user && this.props.user.isOwner && <li className="menu-header">Administration</li>}
                                <AdminCenter {...this.props}/>
                            </ul>
                        </nav>
                    </div>
                    <ToggleSkin/>
                </div>
            </aside>
        );
    }
}

export class ToggleSkin extends React.Component {

    private skin = localStorage.getItem('skin') || 'dark';

    render() : any {
        const icon = this.skin === 'dark' ? 'fas fa-sun ml-1' : 'fas fa-moon ml-1';
        return ( <footer className="aside-footer border-top p-3">
            <button className="btn btn-light btn-block text-primary" data-toggle="skin">Switch {this.skin === 'dark' ? 'Light Mode' : 'Dark Mode'} <i
                className={icon}/></button>
        </footer>)
    }
}

export class UserProfileDropdown extends React.Component<any, any> {
    
    private user = () => {
       return this.props.user || {
            username : 'Loading...',
            isOwner : false
        }
    };
    
    render(): any {
        const user = this.user();
        return (<header className="aside-header d-block d-md-none">
            <button className="btn-account" type="button" data-toggle="collapse"
                    data-target="#dropdown-aside"><span className="account-summary"><span
                className="account-name">{user.username}</span>
                {user.isOwner && <span className="account-description">Director</span>}
                {!user.isOwner && <span className="account-description">Member</span>}
                    </span>
            </button>
            <div id="dropdown-aside" className="dropdown-aside collapse">
                <div className="pb-3">
                    <a className="dropdown-item" href="#"><span
                        className="dropdown-icon oi oi-person"/> Profile</a> <a className="dropdown-item"
                                                                                href="#"><span
                    className="dropdown-icon oi oi-account-logout"/> Logout</a>
                </div>
            </div>
        </header>)
    }
}

export const AsideWithRouter = withRouter((props : any) => (<Aside {...props}/>));