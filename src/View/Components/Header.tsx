import React from 'react';
import profile from '../../assets/images/avatars/profile.jpg';
import {Link, withRouter} from 'react-router-dom'

export type HeaderProps = {
    username : string
}

export class Header extends React.Component<HeaderProps | any, any> {

    constructor(props : HeaderProps | any) {
        super(props);
        console.log(props);
    }

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
                    <div className="top-bar-item top-bar-item-full">
                        {/* .top-bar-search */}

                        {/* /.top-bar-search */}
                    </div>
                    {/* /.top-bar-item */}
                    {/* .top-bar-item */}
                    <div className="top-bar-item top-bar-item-right px-0 d-none d-sm-flex">
                        {/* .nav */}
                        <ul className="header-nav nav">
                            {/* .nav-item */}
                            <li className="nav-item dropdown header-nav-dropdown has-notified">
                                <a className="nav-link" href="#" data-toggle="dropdown" aria-haspopup="true"
                                   aria-expanded="false"><span className="oi oi-pulse"/></a>
                                <div className="dropdown-arrow"/>
                                {/* .dropdown-menu */}
                                <div className="dropdown-menu dropdown-menu-rich dropdown-menu-right">
                                    <h6 className="dropdown-header stop-propagation">
                                        <span>Activities <span className="badge">(2)</span></span>
                                    </h6>{/* .dropdown-scroll */}
                                    <div className="dropdown-scroll perfect-scrollbar">
                                        {/* .dropdown-item */}
                                        <a href="#" className="dropdown-item unread">
                                            <div className="user-avatar">
                                                <img src="../../assets/images/avatars/uifaces15.jpg"/>
                                            </div>
                                            <div className="dropdown-item-body">
                                                <p className="text"> Jeffrey Wells created a schedule </p><span
                                                className="date">Just now</span>
                                            </div>
                                        </a> {/* /.dropdown-item */}
                                        {/* .dropdown-item */}
                                        <a href="#" className="dropdown-item unread">
                                            <div className="user-avatar">
                                                <img src="../../assets/images/avatars/uifaces16.jpg"/>
                                            </div>
                                            <div className="dropdown-item-body">
                                                <p className="text"> Anna Vargas logged a chat </p><span
                                                className="date">3 hours ago</span>
                                            </div>
                                        </a> {/* /.dropdown-item */}
                                        {/* .dropdown-item */}
                                        <a href="#" className="dropdown-item">
                                            <div className="user-avatar">
                                                <img src="../../assets/images/avatars/uifaces17.jpg"/>
                                            </div>
                                            <div className="dropdown-item-body">
                                                <p className="text"> Sara Carr invited to Stilearn Admin </p><span
                                                className="date">5 hours ago</span>
                                            </div>
                                        </a> {/* /.dropdown-item */}
                                        {/* .dropdown-item */}
                                        <a href="#" className="dropdown-item">
                                            <div className="user-avatar">
                                                <img src="../../assets/images/avatars/uifaces18.jpg"/>
                                            </div>
                                            <div className="dropdown-item-body">
                                                <p className="text"> Arthur Carroll updated a project </p><span
                                                className="date">1 day ago</span>
                                            </div>
                                        </a> {/* /.dropdown-item */}
                                        {/* .dropdown-item */}
                                        <a href="#" className="dropdown-item">
                                            <div className="user-avatar">
                                                <img src="../../assets/images/avatars/uifaces19.jpg"/>
                                            </div>
                                            <div className="dropdown-item-body">
                                                <p className="text"> Hannah Romero created a task </p><span
                                                className="date">1 day ago</span>
                                            </div>
                                        </a> {/* /.dropdown-item */}
                                        {/* .dropdown-item */}
                                        <a href="#" className="dropdown-item">
                                            <div className="user-avatar">
                                                <img src="../../assets/images/avatars/uifaces20.jpg"/>
                                            </div>
                                            <div className="dropdown-item-body">
                                                <p className="text"> Angela Peterson assign a task to you </p><span
                                                className="date">2 days ago</span>
                                            </div>
                                        </a> {/* /.dropdown-item */}
                                        {/* .dropdown-item */}
                                        <a href="#" className="dropdown-item">
                                            <div className="user-avatar">
                                                <img src="../../assets/images/avatars/uifaces21.jpg"/>
                                            </div>
                                            <div className="dropdown-item-body">
                                                <p className="text"> Shirley Mason and 3 others followed you </p><span
                                                className="date">2 days ago</span>
                                            </div>
                                        </a> {/* /.dropdown-item */}
                                    </div>
                                    {/* /.dropdown-scroll */}
                                    <a href="user-activities.html" className="dropdown-footer">All activities <i
                                        className="fas fa-fw fa-long-arrow-alt-right"/></a>
                                </div>
                                {/* /.dropdown-menu */}
                            </li>
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
                        <div className="dropdown">
                            <button className="btn-account d-none d-md-flex" type="button" data-toggle="dropdown"
                                    aria-haspopup="true" aria-expanded="false"><span
                                className="user-avatar user-avatar-md"><img
                                src={profile}/></span> <span
                                className="account-summary pr-lg-4 d-none d-lg-block"><span
                                className="account-name">{this.props.username}</span> <span
                                className="account-description">Director</span></span></button>
                            <div className="dropdown-arrow dropdown-arrow-left"/>
                            {/* .dropdown-menu */}
                            <div className="dropdown-menu">
                                <h6 className="dropdown-header d-none d-md-block d-lg-none"> Beni Arisandi </h6><Link
                                className="dropdown-item" to="/scripts"><span
                                className="dropdown-icon oi oi-person"/> Profile</Link> <a className="dropdown-item"
                                                                                        href="auth-signin-v1.html"><span
                                className="dropdown-icon oi oi-account-logout"/> Logout</a>
                                <div className="dropdown-divider"/>
                                <a className="dropdown-item" href="#">Help Center</a> <a className="dropdown-item"
                                                                                         href="#">Ask Forum</a> <a
                                className="dropdown-item" href="#">Keyboard Shortcuts</a>
                            </div>
                            {/* /.dropdown-menu */}
                        </div>
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

export const HeaderWithRouter = withRouter((props : any) => (<Header {...props}/>));