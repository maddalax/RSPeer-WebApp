import React from 'react';
import {Util} from "../../Utilities/Util";
import {ApiService} from "../../Common/ApiService";

export class Dashboard extends React.Component<any, any> {

    private readonly api: ApiService;

    constructor(props: any) {
        super(props);
        this.api = new ApiService();
        this.state = {
            totalClientCount: 0,
            totalUsers : 0,
            botVersion : 0
        }
    }

    async componentDidMount() {
        await this.setStates();
    }

    private setStates = async () => {
        const totalClientCount = await this.api.get("stats/connected");
        const totalUsers = await this.api.get("stats/totalUsers");
        const botVersion = await this.api.get("bot/currentVersionRaw");
        this.setState({totalClientCount, totalUsers, botVersion})
    };

    render() {
        return (<div>
            <header className="page-title-bar">
                <div className="d-flex flex-column flex-md-row">
                    <p className="lead">
                        {this.props.user && <span className="font-weight-bold">Hi, {this.props.user.username}.</span>}
                        <span
                            className="d-block text-muted">Here’s what’s happening with RSPeer.</span>
                    </p>
                </div>
            </header>
            {/* /.page-title-bar */}
            {/* .page-section */}
            <div className="page-section">
                {/* .section-block */}
                <div className="section-block">
                    {/* metric row */}
                    <div className="metric-row">
                        <div className="col-lg-9">
                            <div className="metric-row metric-flush">
                                {/* metric column */}
                                <div className="col">
                                    {/* .metric */}
                                    <a href="user-teams.html"
                                       className="metric metric-bordered align-items-center">
                                        <h2 className="metric-label"> Total Clients Online </h2>
                                        <p className="metric-value h3">
                                            <sub><i className="oi oi-people"/></sub> <span
                                            className="value">{Util.formatNumber(this.state.totalClientCount)}</span>
                                        </p>
                                    </a> {/* /.metric */}
                                </div>
                                {/* /metric column */}
                                {/* metric column */}
                                <div className="col">
                                    {/* .metric */}
                                    <a href="user-projects.html"
                                       className="metric metric-bordered align-items-center">
                                        <h2 className="metric-label"> Total Users </h2>
                                        <p className="metric-value h3">
                                            <sub><i className="oi oi-people"/></sub> <span
                                            className="value">{this.state.totalUsers}</span>
                                        </p>
                                    </a> {/* /.metric */}
                                </div>
                                {/* /metric column */}
                                {/* metric column */}
                                <div className="col">
                                    {/* .metric */}
                                    <a href="user-tasks.html"
                                       className="metric metric-bordered align-items-center">
                                        <h2 className="metric-label"> Latest Client Version </h2>
                                        <p className="metric-value h3">
                                            <sub><i className="fas fa-robot"/></sub> <span
                                            className="value">v{this.state.botVersion}</span>
                                        </p>
                                    </a> 
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="section-deck">
           
                    <div className="card card-fluid pb-3">
                        <div className="card-header"> Latest News</div>
               
                        <div className="lits-group list-group-flush">
                            <div className="list-group-item">
                                <div className="list-group-item-figure">
                                    <div className="has-badge">
                                        <a href="page-project.html"
                                           className="tile tile-md bg-purple">LT</a> <a
                                        href="#team" className="user-avatar user-avatar-xs"><img
                                        src="assets/images/avatars/team4.jpg"/></a>
                                    </div>
                                </div>
                                <div className="list-group-item-body">
                                    <h5 className="card-title">
                                        <a href="page-project.html">Looper Admin Theme</a>
                                    </h5>
                                    <p className="card-subtitle text-muted mb-1"> Progress in
                                        74% - Last update 1d </p>
                                    <div className="progress progress-xs bg-transparent">
                                        <div className="progress-bar bg-purple"
                                             role="progressbar" aria-valuenow={2181}
                                             aria-valuemin={0} aria-valuemax={100}
                                             style={{width: '74%'}}>
                                            <span className="sr-only">74% Complete</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="list-group-item">
                                <div className="list-group-item-figure">
                                    <div className="has-badge">
                                        <a href="page-project.html"
                                           className="tile tile-md bg-indigo">SP</a> <a
                                        href="#team" className="user-avatar user-avatar-xs"><img
                                        src="assets/images/avatars/team1.jpg"/></a>
                                    </div>
                                </div>
                                <div className="list-group-item-body">
                                    <h5 className="card-title">
                                        <a href="page-project.html">Smart Paper</a>
                                    </h5>
                                    <p className="card-subtitle text-muted mb-1"> Progress in
                                        22% - Last update 2h </p>
                                    <div className="progress progress-xs bg-transparent">
                                        <div className="progress-bar bg-indigo"
                                             role="progressbar" aria-valuenow={867}
                                             aria-valuemin={0} aria-valuemax={100}
                                             style={{width: '22%'}}>
                                            <span className="sr-only">22% Complete</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="list-group-item">
                                <div className="list-group-item-figure">
                                    <div className="has-badge">
                                        <a href="page-project.html"
                                           className="tile tile-md bg-yellow">OS</a> <a
                                        href="#team" className="user-avatar user-avatar-xs"><img
                                        src="assets/images/avatars/team2.png"/></a>
                                    </div>
                                </div>
                                <div className="list-group-item-body">
                                    <h5 className="card-title">
                                        <a href="page-project.html">Online Store</a>
                                    </h5>
                                    <p className="card-subtitle text-muted mb-1"> Progress in
                                        99% - Last update 2d </p>
                                    <div className="progress progress-xs bg-transparent">
                                        <div className="progress-bar bg-yellow"
                                             role="progressbar" aria-valuenow={6683}
                                             aria-valuemin={0} aria-valuemax={100}
                                             style={{width: '99%'}}>
                                            <span className="sr-only">99% Complete</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="list-group-item">
                                <div className="list-group-item-figure">
                                    <div className="has-badge">
                                        <a href="page-project.html"
                                           className="tile tile-md bg-blue">BA</a> <a
                                        href="#team" className="user-avatar user-avatar-xs"><img
                                        src="assets/images/avatars/bootstrap.svg"/></a>
                                    </div>
                                </div>
                                <div className="list-group-item-body">
                                    <h5 className="card-title">
                                        <a href="page-project.html">Booking App</a>
                                    </h5>
                                    <p className="card-subtitle text-muted mb-1"> Progress in
                                        35% - Last update 4h </p>
                                    <div className="progress progress-xs bg-transparent">
                                        <div className="progress-bar bg-blue" role="progressbar"
                                             aria-valuenow={112} aria-valuemin={0}
                                             aria-valuemax={100} style={{width: '35%'}}>
                                            <span className="sr-only">35% Complete</span>
                                        </div>
                                    </div>
                                    {/* /.progress */}
                                </div>
                                {/* .lits-group-item-body */}
                            </div>
                            {/* /.lits-group-item */}
                            {/* .lits-group-item */}
                            <div className="list-group-item">
                                {/* .lits-group-item-figure */}
                                <div className="list-group-item-figure">
                                    <div className="has-badge">
                                        <a href="page-project.html"
                                           className="tile tile-md bg-teal">SB</a> <a
                                        href="#team" className="user-avatar user-avatar-xs"><img
                                        src="assets/images/avatars/sketch.svg"/></a>
                                    </div>
                                </div>
                                {/* .lits-group-item-figure */}
                                {/* .lits-group-item-body */}
                                <div className="list-group-item-body">
                                    <h5 className="card-title">
                                        <a href="page-project.html">SVG Icon Bundle</a>
                                    </h5>
                                    <p className="card-subtitle text-muted mb-1"> Progress in
                                        32% - Last update 1d </p>{/* .progress */}
                                    <div className="progress progress-xs bg-transparent">
                                        <div className="progress-bar bg-teal" role="progressbar"
                                             aria-valuenow={461} aria-valuemin={0}
                                             aria-valuemax={100} style={{width: '32%'}}>
                                            <span className="sr-only">32% Complete</span>
                                        </div>
                                    </div>
                                    {/* /.progress */}
                                </div>
                                {/* .lits-group-item-body */}
                            </div>
                            {/* /.lits-group-item */}
                            {/* .lits-group-item */}
                            <div className="list-group-item">
                                {/* .lits-group-item-figure */}
                                <div className="list-group-item-figure">
                                    <div className="has-badge">
                                        <a href="page-project.html"
                                           className="tile tile-md bg-pink">SP</a> <a
                                        href="#team" className="user-avatar user-avatar-xs"><img
                                        src="assets/images/avatars/team4.jpg"/></a>
                                    </div>
                                </div>
                                {/* .lits-group-item-figure */}
                                {/* .lits-group-item-body */}
                                <div className="list-group-item-body">
                                    <h5 className="card-title">
                                        <a href="page-project.html">Syrena Project</a>
                                    </h5>
                                    <p className="card-subtitle text-muted mb-1"> Progress in
                                        93% - Last update 8h </p>{/* .progress */}
                                    <div className="progress progress-xs bg-transparent">
                                        <div className="progress-bar bg-pink" role="progressbar"
                                             aria-valuenow={3981} aria-valuemin={0}
                                             aria-valuemax={100} style={{width: '93%'}}>
                                            <span className="sr-only">93% Complete</span>
                                        </div>
                                    </div>
                                    {/* /.progress */}
                                </div>
                                {/* .lits-group-item-body */}
                            </div>
                            {/* /.lits-group-item */}
                        </div>
                        {/* /.lits-group */}
                    </div>
                    {/* /.card */}
                    {/* .card */}
                    <div className="card card-fluid">
                        <div className="card-header"> Quick Links</div>
                        {/* .card-body */}
                        <div className="card-body">
                            {/* .todo-list */}
                            <div className="todo-list">
                                {/* .todo-header */}
                                <div className="todo-header"> Looper Admin Theme (1/3)</div>
                                {/* /.todo-header */}
                                {/* .todo */}
                                <div className="todo">
                                    {/* .custom-control */}
                                    <div className="custom-control custom-checkbox">
                                        <input type="checkbox" className="custom-control-input"
                                               id="todo1"/> <label
                                        className="custom-control-label" htmlFor="todo1">Eat
                                        corn on the cob</label>
                                    </div>
                                    {/* /.custom-control */}
                                </div>
                                {/* /.todo */}
                                {/* .todo */}
                                <div className="todo">
                                    {/* .custom-control */}
                                    <div className="custom-control custom-checkbox">
                                        <input type="checkbox" className="custom-control-input"
                                               id="todo2" defaultChecked/> <label
                                        className="custom-control-label" htmlFor="todo2">Mix up
                                        a pitcher of sangria</label>
                                    </div>
                                    {/* /.custom-control */}
                                </div>
                                {/* /.todo */}
                                {/* .todo */}
                                <div className="todo">
                                    {/* .custom-control */}
                                    <div className="custom-control custom-checkbox">
                                        <input type="checkbox" className="custom-control-input"
                                               id="todo3"/> <label
                                        className="custom-control-label" htmlFor="todo3">Have a
                                        barbecue</label>
                                    </div>
                                    {/* /.custom-control */}
                                </div>
                                {/* /.todo */}
                                {/* .todo */}
                                <div className="todo">
                                    {/* .custom-control */}
                                    <div className="custom-control custom-checkbox">
                                        <input type="checkbox" className="custom-control-input"
                                               id="todo4"/> <label
                                        className="custom-control-label" htmlFor="todo4">Ride a
                                        roller coaster — <span
                                            className="text-red small">Overdue in 3 days</span></label>
                                    </div>
                                    {/* /.custom-control */}
                                </div>
                                {/* /.todo */}
                                {/* .todo-header */}
                                <div className="todo-header"> Smart Paper (0/2)</div>
                                {/* /.todo-header */}
                                {/* .todo */}
                                <div className="todo">
                                    {/* .custom-control */}
                                    <div className="custom-control custom-checkbox">
                                        <input type="checkbox" className="custom-control-input"
                                               id="todo5"/> <label
                                        className="custom-control-label" htmlFor="todo5">Bring a
                                        blanket and lie on the grass at an outdoor
                                        concert</label>
                                    </div>
                                    {/* /.custom-control */}
                                </div>
                                {/* /.todo */}
                                {/* .todo */}
                                <div className="todo">
                                    {/* .custom-control */}
                                    <div className="custom-control custom-checkbox">
                                        <input type="checkbox" className="custom-control-input"
                                               id="todo6"/> <label
                                        className="custom-control-label" htmlFor="todo6">Collect
                                        seashells at the beach</label>
                                    </div>
                                    {/* /.custom-control */}
                                </div>
                                {/* /.todo */}
                                {/* .todo */}
                                <div className="todo">
                                    {/* .custom-control */}
                                    <div className="custom-control custom-checkbox">
                                        <input type="checkbox" className="custom-control-input"
                                               id="todo7"/> <label
                                        className="custom-control-label" htmlFor="todo7">Swim in
                                        a lake</label>
                                    </div>
                                    {/* /.custom-control */}
                                </div>
                                {/* /.todo */}
                                {/* .todo */}
                                <div className="todo">
                                    {/* .custom-control */}
                                    <div className="custom-control custom-checkbox">
                                        <input type="checkbox" className="custom-control-input"
                                               id="todo8"/> <label
                                        className="custom-control-label" htmlFor="todo8">Get
                                        enough sleep!</label>
                                    </div>
                                    {/* /.custom-control */}
                                </div>
                                {/* /.todo */}
                            </div>
                            {/* /.todo-list */}
                        </div>
                        {/* /.card-body */}
                        {/* .card-footer */}
                        <div className="card-footer">
                            <a href="#" className="card-footer-item">View all <i
                                className="fa fa-fw fa-angle-right"/></a>
                        </div>
                        {/* /.card-footer */}
                    </div>
                    {/* /.card */}
                </div>
                {/* /section-deck */}
            </div>
            {/* /.page-section */}
        </div>)
    }
}