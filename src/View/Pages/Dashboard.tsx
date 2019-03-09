import React from 'react';
import {Util} from "../../Utilities/Util";

export class Dashboard extends React.Component<any, any> {

    componentDidMount(): void {
        console.log("DASH", this.props);
    }

    componentDidUpdate(): void {
        console.log("DASH", this.props);
    }

    render() {
        return (<div>
            <header className="page-title-bar">
                <div className="d-flex flex-column flex-md-row">
                    <p className="lead">
                        {this.props.user && <span className="font-weight-bold">Hi, {this.props.user.username}.</span>} <span
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
                                            className="value">{Util.formatNumber(this.props.totalClientCount)}</span>
                                        </p>
                                    </a> {/* /.metric */}
                                </div>
                                {/* /metric column */}
                                {/* metric column */}
                                <div className="col">
                                    {/* .metric */}
                                    <a href="user-projects.html"
                                       className="metric metric-bordered align-items-center">
                                        <h2 className="metric-label"> Projects </h2>
                                        <p className="metric-value h3">
                                            <sub><i className="oi oi-fork"/></sub> <span
                                            className="value">12</span>
                                        </p>
                                    </a> {/* /.metric */}
                                </div>
                                {/* /metric column */}
                                {/* metric column */}
                                <div className="col">
                                    {/* .metric */}
                                    <a href="user-tasks.html"
                                       className="metric metric-bordered align-items-center">
                                        <h2 className="metric-label"> Active Tasks </h2>
                                        <p className="metric-value h3">
                                            <sub><i className="fa fa-tasks"/></sub> <span
                                            className="value">64</span>
                                        </p>
                                    </a> {/* /.metric */}
                                </div>
                                {/* /metric column */}
                            </div>
                        </div>
                        {/* metric column */}
                        <div className="col-lg-3">
                            {/* .metric */}
                            <a href="user-tasks.html" className="metric metric-bordered">
                                <div className="metric-badge">
                                                            <span className="badge badge-lg badge-success"><span
                                                                className="oi oi-media-record pulse mr-1"/> ONGOING TASKS</span>
                                </div>
                                <p className="metric-value h3">
                                    <sub><i className="oi oi-timer"/></sub> <span
                                    className="value">8</span>
                                </p>
                            </a> {/* /.metric */}
                        </div>
                        {/* /metric column */}
                    </div>
                    {/* /metric row */}
                </div>
                {/* /.section-block */}
                {/* grid row */}
                <div className="row">
                    {/* grid column */}
                    <div className="col-12 col-lg-12 col-xl-4">
                        {/* .card */}
                        <div className="card card-fluid">
                            {/* .card-body */}
                            <div className="card-body">
                                <h3 className="card-title mb-4"> Completion Tasks </h3>
                                <div className="chartjs" style={{height: '292px'}}>
                                    <canvas id="completion-tasks"/>
                                </div>
                            </div>
                            {/* /.card-body */}
                        </div>
                        {/* /.card */}
                    </div>
                    {/* /grid column */}
                    {/* grid column */}
                    <div className="col-12 col-lg-6 col-xl-4">
                        {/* .card */}
                        <div className="card card-fluid">
                            {/* .card-body */}
                            <div className="card-body">
                                <h3 className="card-title"> Tasks
                                    Performance </h3>{/* easy-pie-chart */}
                                <div className="text-center pt-3">
                                    <div className="chart-inline-group"
                                         style={{height: '214px'}}>
                                        <div className="easypiechart" data-toggle="easypiechart"
                                             data-percent={60} data-size={214}
                                             data-bar-color="#346CB0" data-track-color="false"
                                             data-scale-color="false" data-rotate={225}/>
                                        <div className="easypiechart" data-toggle="easypiechart"
                                             data-percent={50} data-size={174}
                                             data-bar-color="#00A28A" data-track-color="false"
                                             data-scale-color="false" data-rotate={225}/>
                                        <div className="easypiechart" data-toggle="easypiechart"
                                             data-percent={75} data-size={134}
                                             data-bar-color="#5F4B8B" data-track-color="false"
                                             data-scale-color="false" data-rotate={225}/>
                                    </div>
                                </div>
                                {/* /easy-pie-chart */}
                            </div>
                            {/* /.card-body */}
                            {/* .card-footer */}
                            <div className="card-footer">
                                <div className="card-footer-item">
                                    <i className="fa fa-fw fa-circle text-indigo"/> 100% <div
                                    className="text-muted small"> Assigned </div>
                                </div>
                                <div className="card-footer-item">
                                    <i className="fa fa-fw fa-circle text-purple"/> 75% <div
                                    className="text-muted small"> Completed </div>
                                </div>
                                <div className="card-footer-item">
                                    <i className="fa fa-fw fa-circle text-teal"/> 60% <div
                                    className="text-muted small"> Active </div>
                                </div>
                            </div>
                            {/* /.card-footer */}
                        </div>
                        {/* /.card */}
                    </div>
                    {/* /grid column */}
                    {/* grid column */}
                    <div className="col-12 col-lg-6 col-xl-4">
                        {/* .card */}
                        <div className="card card-fluid">
                            {/* .card-body */}
                            <div className="card-body pb-0">
                                <h3 className="card-title"> Leaderboard </h3>{/* legend */}
                                <ul className="list-inline small">
                                    <li className="list-inline-item">
                                        <i className="fa fa-fw fa-circle text-light"/> Tasks
                                    </li>
                                    <li className="list-inline-item">
                                        <i className="fa fa-fw fa-circle text-purple"/> Completed
                                    </li>
                                    <li className="list-inline-item">
                                        <i className="fa fa-fw fa-circle text-teal"/> Active
                                    </li>
                                    <li className="list-inline-item">
                                        <i className="fa fa-fw fa-circle text-red"/> Overdue
                                    </li>
                                </ul>
                                {/* /legend */}
                            </div>
                            {/* /.card-body */}
                            {/* .list-group */}
                            <div className="list-group list-group-flush">
                                {/* .list-group-item */}
                                <div className="list-group-item">
                                    {/* .list-group-item-figure */}
                                    <div className="list-group-item-figure">
                                        <a href="user-profile.html" className="user-avatar"
                                           data-toggle="tooltip" title="Martha Myers"><img
                                            src="assets/images/avatars/uifaces16.jpg"/></a>
                                    </div>
                                    {/* /.list-group-item-figure */}
                                    {/* .list-group-item-body */}
                                    <div className="list-group-item-body">
                                        {/* .progress */}
                                        <div
                                            className="progress progress-animated bg-transparent rounded-0"
                                            data-toggle="tooltip" data-html="true"
                                            title="<div class=&quot;text-left small&quot;><i class=&quot;fa fa-fw fa-circle text-purple&quot;></i> 2065<br><i class=&quot;fa fa-fw fa-circle text-teal&quot;></i> 231<br><i class=&quot;fa fa-fw fa-circle text-red&quot;></i> 54</div>">
                                            <div className="progress-bar bg-purple"
                                                 role="progressbar"
                                                 aria-valuenow={73.46140163642832}
                                                 aria-valuemin={0} aria-valuemax={100}
                                                 style={{width: '73.46140163642832%'}}>
                                                <span className="sr-only">73.46140163642832% Complete</span>
                                            </div>
                                            <div className="progress-bar bg-teal"
                                                 role="progressbar"
                                                 aria-valuenow={8.217716115261473}
                                                 aria-valuemin={0} aria-valuemax={100}
                                                 style={{width: '8.217716115261473%'}}>
                                                <span className="sr-only">8.217716115261473% Complete</span>
                                            </div>
                                            <div className="progress-bar bg-red"
                                                 role="progressbar"
                                                 aria-valuenow={1.92102454642476}
                                                 aria-valuemin={0} aria-valuemax={100}
                                                 style={{width: '1.92102454642476%'}}>
                                                <span className="sr-only">1.92102454642476% Complete</span>
                                            </div>
                                        </div>
                                        {/* /.progress */}
                                    </div>
                                    {/* /.list-group-item-body */}
                                </div>
                                {/* /.list-group-item */}
                                {/* .list-group-item */}
                                <div className="list-group-item">
                                    {/* .list-group-item-figure */}
                                    <div className="list-group-item-figure">
                                        <a href="user-profile.html" className="user-avatar"
                                           data-toggle="tooltip" title="Tammy Beck"><img
                                            src="assets/images/avatars/uifaces15.jpg"/></a>
                                    </div>
                                    {/* /.list-group-item-figure */}
                                    {/* .list-group-item-body */}
                                    <div className="list-group-item-body">
                                        {/* .progress */}
                                        <div
                                            className="progress progress-animated bg-transparent rounded-0"
                                            data-toggle="tooltip" data-html="true"
                                            title="<div class=&quot;text-left small&quot;><i class=&quot;fa fa-fw fa-circle text-purple&quot;></i> 1432<br><i class=&quot;fa fa-fw fa-circle text-teal&quot;></i> 406<br><i class=&quot;fa fa-fw fa-circle text-red&quot;></i> 49</div>">
                                            <div className="progress-bar bg-purple"
                                                 role="progressbar"
                                                 aria-valuenow={54.180855088914115}
                                                 aria-valuemin={0} aria-valuemax={100}
                                                 style={{width: '54.180855088914115%'}}>
                                                <span className="sr-only">54.180855088914115% Complete</span>
                                            </div>
                                            <div className="progress-bar bg-teal"
                                                 role="progressbar"
                                                 aria-valuenow={15.361331819901627}
                                                 aria-valuemin={0} aria-valuemax={100}
                                                 style={{width: '15.361331819901627%'}}>
                                                <span className="sr-only">15.361331819901627% Complete</span>
                                            </div>
                                            <div className="progress-bar bg-red"
                                                 role="progressbar"
                                                 aria-valuenow={1.853953840332955}
                                                 aria-valuemin={0} aria-valuemax={100}
                                                 style={{width: '1.853953840332955%'}}>
                                                <span className="sr-only">1.853953840332955% Complete</span>
                                            </div>
                                        </div>
                                        {/* /.progress */}
                                    </div>
                                    {/* /.list-group-item-body */}
                                </div>
                                {/* /.list-group-item */}
                                {/* .list-group-item */}
                                <div className="list-group-item">
                                    {/* .list-group-item-figure */}
                                    <div className="list-group-item-figure">
                                        <a href="user-profile.html" className="user-avatar"
                                           data-toggle="tooltip" title="Susan Kelley"><img
                                            src="assets/images/avatars/uifaces17.jpg"/></a>
                                    </div>
                                    {/* /.list-group-item-figure */}
                                    {/* .list-group-item-body */}
                                    <div className="list-group-item-body">
                                        {/* .progress */}
                                        <div
                                            className="progress progress-animated bg-transparent rounded-0"
                                            data-toggle="tooltip" data-html="true"
                                            title="<div class=&quot;text-left small&quot;><i class=&quot;fa fa-fw fa-circle text-purple&quot;></i> 1271<br><i class=&quot;fa fa-fw fa-circle text-teal&quot;></i> 87<br><i class=&quot;fa fa-fw fa-circle text-red&quot;></i> 82</div>">
                                            <div className="progress-bar bg-purple"
                                                 role="progressbar"
                                                 aria-valuenow={52.13289581624282}
                                                 aria-valuemin={0} aria-valuemax={100}
                                                 style={{width: '52.13289581624282%'}}>
                                                <span className="sr-only">52.13289581624282% Complete</span>
                                            </div>
                                            <div className="progress-bar bg-teal"
                                                 role="progressbar"
                                                 aria-valuenow={3.568498769483183}
                                                 aria-valuemin={0} aria-valuemax={100}
                                                 style={{width: '3.568498769483183%'}}>
                                                <span className="sr-only">3.568498769483183% Complete</span>
                                            </div>
                                            <div className="progress-bar bg-red"
                                                 role="progressbar"
                                                 aria-valuenow={3.3634126333059884}
                                                 aria-valuemin={0} aria-valuemax={100}
                                                 style={{width: '3.3634126333059884%'}}>
                                                <span className="sr-only">3.3634126333059884% Complete</span>
                                            </div>
                                        </div>
                                        {/* /.progress */}
                                    </div>
                                    {/* /.list-group-item-body */}
                                </div>
                                {/* /.list-group-item */}
                                {/* .list-group-item */}
                                <div className="list-group-item">
                                    {/* .list-group-item-figure */}
                                    <div className="list-group-item-figure">
                                        <a href="user-profile.html" className="user-avatar"
                                           data-toggle="tooltip" title="Albert Newman"><img
                                            src="assets/images/avatars/uifaces18.jpg"/></a>
                                    </div>
                                    {/* /.list-group-item-figure */}
                                    {/* .list-group-item-body */}
                                    <div className="list-group-item-body">
                                        {/* .progress */}
                                        <div
                                            className="progress progress-animated bg-transparent rounded-0"
                                            data-toggle="tooltip" data-html="true"
                                            title="<div class=&quot;text-left small&quot;><i class=&quot;fa fa-fw fa-circle text-purple&quot;></i> 1527<br><i class=&quot;fa fa-fw fa-circle text-teal&quot;></i> 205<br><i class=&quot;fa fa-fw fa-circle text-red&quot;></i> 151</div>">
                                            <div className="progress-bar bg-purple"
                                                 role="progressbar"
                                                 aria-valuenow={75.18463810930577}
                                                 aria-valuemin={0} aria-valuemax={100}
                                                 style={{width: '75.18463810930577%'}}>
                                                <span className="sr-only">75.18463810930577% Complete</span>
                                            </div>
                                            <div className="progress-bar bg-teal"
                                                 role="progressbar"
                                                 aria-valuenow={10.093549975381585}
                                                 aria-valuemin={0} aria-valuemax={100}
                                                 style={{width: '10.093549975381585%'}}>
                                                <span className="sr-only">10.093549975381585% Complete</span>
                                            </div>
                                            <div className="progress-bar bg-red"
                                                 role="progressbar"
                                                 aria-valuenow={7.434761201378631}
                                                 aria-valuemin={0} aria-valuemax={100}
                                                 style={{width: '7.434761201378631%'}}>
                                                <span className="sr-only">7.434761201378631% Complete</span>
                                            </div>
                                        </div>
                                        {/* /.progress */}
                                    </div>
                                    {/* /.list-group-item-body */}
                                </div>
                                {/* /.list-group-item */}
                                {/* .list-group-item */}
                                <div className="list-group-item">
                                    {/* .list-group-item-figure */}
                                    <div className="list-group-item-figure">
                                        <a href="user-profile.html" className="user-avatar"
                                           data-toggle="tooltip" title="Kyle Grant"><img
                                            src="assets/images/avatars/uifaces19.jpg"/></a>
                                    </div>
                                    {/* /.list-group-item-figure */}
                                    {/* .list-group-item-body */}
                                    <div className="list-group-item-body">
                                        {/* .progress */}
                                        <div
                                            className="progress progress-animated bg-transparent rounded-0"
                                            data-toggle="tooltip" data-html="true"
                                            title="<div class=&quot;text-left small&quot;><i class=&quot;fa fa-fw fa-circle text-purple&quot;></i> 643<br><i class=&quot;fa fa-fw fa-circle text-teal&quot;></i> 265<br><i class=&quot;fa fa-fw fa-circle text-red&quot;></i> 127</div>">
                                            <div className="progress-bar bg-purple"
                                                 role="progressbar"
                                                 aria-valuenow={36.89041881812966}
                                                 aria-valuemin={0} aria-valuemax={100}
                                                 style={{width: '36.89041881812966%'}}>
                                                <span className="sr-only">36.89041881812966% Complete</span>
                                            </div>
                                            <div className="progress-bar bg-teal"
                                                 role="progressbar"
                                                 aria-valuenow={15.203671830177854}
                                                 aria-valuemin={0} aria-valuemax={100}
                                                 style={{width: '15.203671830177854%'}}>
                                                <span className="sr-only">15.203671830177854% Complete</span>
                                            </div>
                                            <div className="progress-bar bg-red"
                                                 role="progressbar"
                                                 aria-valuenow={7.286288009179575}
                                                 aria-valuemin={0} aria-valuemax={100}
                                                 style={{width: '7.286288009179575%'}}>
                                                <span className="sr-only">7.286288009179575% Complete</span>
                                            </div>
                                        </div>
                                        {/* /.progress */}
                                    </div>
                                    {/* /.list-group-item-body */}
                                </div>
                                {/* /.list-group-item */}
                            </div>
                            {/* /.list-group */}
                        </div>
                        {/* /.card */}
                    </div>
                    {/* /grid column */}
                </div>
                {/* /grid row */}
                {/* section-deck */}
                <div className="section-deck">
                    {/* .card */}
                    <div className="card card-fluid pb-3">
                        <div className="card-header"> Active Projects</div>
                        {/* .lits-group */}
                        <div className="lits-group list-group-flush">
                            {/* .lits-group-item */}
                            <div className="list-group-item">
                                {/* .lits-group-item-figure */}
                                <div className="list-group-item-figure">
                                    <div className="has-badge">
                                        <a href="page-project.html"
                                           className="tile tile-md bg-purple">LT</a> <a
                                        href="#team" className="user-avatar user-avatar-xs"><img
                                        src="assets/images/avatars/team4.jpg"/></a>
                                    </div>
                                </div>
                                {/* .lits-group-item-figure */}
                                {/* .lits-group-item-body */}
                                <div className="list-group-item-body">
                                    <h5 className="card-title">
                                        <a href="page-project.html">Looper Admin Theme</a>
                                    </h5>
                                    <p className="card-subtitle text-muted mb-1"> Progress in
                                        74% - Last update 1d </p>{/* .progress */}
                                    <div className="progress progress-xs bg-transparent">
                                        <div className="progress-bar bg-purple"
                                             role="progressbar" aria-valuenow={2181}
                                             aria-valuemin={0} aria-valuemax={100}
                                             style={{width: '74%'}}>
                                            <span className="sr-only">74% Complete</span>
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
                                           className="tile tile-md bg-indigo">SP</a> <a
                                        href="#team" className="user-avatar user-avatar-xs"><img
                                        src="assets/images/avatars/team1.jpg"/></a>
                                    </div>
                                </div>
                                {/* .lits-group-item-figure */}
                                {/* .lits-group-item-body */}
                                <div className="list-group-item-body">
                                    <h5 className="card-title">
                                        <a href="page-project.html">Smart Paper</a>
                                    </h5>
                                    <p className="card-subtitle text-muted mb-1"> Progress in
                                        22% - Last update 2h </p>{/* .progress */}
                                    <div className="progress progress-xs bg-transparent">
                                        <div className="progress-bar bg-indigo"
                                             role="progressbar" aria-valuenow={867}
                                             aria-valuemin={0} aria-valuemax={100}
                                             style={{width: '22%'}}>
                                            <span className="sr-only">22% Complete</span>
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
                                           className="tile tile-md bg-yellow">OS</a> <a
                                        href="#team" className="user-avatar user-avatar-xs"><img
                                        src="assets/images/avatars/team2.png"/></a>
                                    </div>
                                </div>
                                {/* .lits-group-item-figure */}
                                {/* .lits-group-item-body */}
                                <div className="list-group-item-body">
                                    <h5 className="card-title">
                                        <a href="page-project.html">Online Store</a>
                                    </h5>
                                    <p className="card-subtitle text-muted mb-1"> Progress in
                                        99% - Last update 2d </p>{/* .progress */}
                                    <div className="progress progress-xs bg-transparent">
                                        <div className="progress-bar bg-yellow"
                                             role="progressbar" aria-valuenow={6683}
                                             aria-valuemin={0} aria-valuemax={100}
                                             style={{width: '99%'}}>
                                            <span className="sr-only">99% Complete</span>
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
                                           className="tile tile-md bg-blue">BA</a> <a
                                        href="#team" className="user-avatar user-avatar-xs"><img
                                        src="assets/images/avatars/bootstrap.svg"/></a>
                                    </div>
                                </div>
                                {/* .lits-group-item-figure */}
                                {/* .lits-group-item-body */}
                                <div className="list-group-item-body">
                                    <h5 className="card-title">
                                        <a href="page-project.html">Booking App</a>
                                    </h5>
                                    <p className="card-subtitle text-muted mb-1"> Progress in
                                        35% - Last update 4h </p>{/* .progress */}
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
                        <div className="card-header"> Active Tasks: To-Dos</div>
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