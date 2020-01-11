import React from 'react';
import {Util} from "../../Utilities/Util";
import {ApiService} from "../../Common/ApiService";
import {FileConstants, FileService} from "../../Services/File/FileService";
import {Game} from "../../Models/ScriptDto";

export class Dashboard extends React.Component<any, any> {

    private readonly api: ApiService;
    private readonly fileService: FileService;

    constructor(props: any) {
        super(props);
        this.api = new ApiService();
        this.fileService = new FileService();
        this.state = {
            totalClientCount: 0,
            totalUsers: 0,
            botVersion: 0,
            inuvationVersion : 0,
            recentNews: 'Loading...',
            quickLinks: 'Loading...'
        }
    }

    async componentDidMount() {
        await this.setStates();
        const recentNews = await this.fileService.getFile(FileConstants.DASHBOARD_RECENT_NEWS);
        const quickLinks = await this.fileService.getFile(FileConstants.DASHBOARD_QUICK_LINKS);
        this.setState({recentNews, quickLinks});
    }

    private setStates = async () => {
        const totalClientCount = await this.api.get("stats/connected");
        let totalUsers = await this.api.get("stats/totalUsers");
        let botVersion = await this.api.get("bot/currentVersionRaw");
        let inuvationVersion = await this.api.get("bot/currentVersionRaw?game=" + Game.Rs3);
        if(totalUsers.error || botVersion.error || inuvationVersion.error) {
            totalUsers = 0;
            botVersion = 0.00;
            inuvationVersion = 0.00;
        }
        inuvationVersion = parseFloat(inuvationVersion).toFixed(2);
        this.setState({totalClientCount, totalUsers, botVersion, inuvationVersion})
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
            <div className="page-section">
                <div className="section-block">
                    <div className="metric-row">
                        <div className="col-lg-9">
                            <div className="metric-row metric-flush">
                                <div className="col">
                                    <a href="#"
                                       className="metric metric-bordered align-items-center">
                                        <h2 className="metric-label"> Total Clients Online </h2>
                                        <p className="metric-value h3">
                                            <sub><i className="oi oi-people"/></sub> <span
                                            className="value">{Util.formatNumber(this.state.totalClientCount)}</span>
                                        </p>
                                    </a>
                                </div>
                                <div className="col">
                                    <a href="#"
                                       className="metric metric-bordered align-items-center">
                                        <h2 className="metric-label"> Total Users </h2>
                                        <p className="metric-value h3">
                                            <sub><i className="oi oi-people"/></sub> <span
                                            className="value">{Util.formatNumber(this.state.totalUsers)}</span>
                                        </p>
                                    </a>
                                </div>
                                <div className="col">
                                    <a href="#"
                                       className="metric metric-bordered align-items-center">
                                        <h2 className="metric-label"> RSPeer 07 Version </h2>
                                        <p className="metric-value h3">
                                            <sub><i className="fas fa-robot"/></sub> <span
                                            className="value">v{this.state.botVersion}</span>
                                        </p>
                                    </a>
                                </div>
                                <div className="col">
                                    <a href="#"
                                       className="metric metric-bordered align-items-center">
                                        <h2 className="metric-label"> RSPeer RS3 Version </h2>
                                        <p className="metric-value h3">
                                            <sub><i className="fas fa-robot"/></sub> <span
                                            className="value">v{this.state.inuvationVersion}</span>
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
                        <div className={"card-body"}>
                            <div dangerouslySetInnerHTML={{__html: this.state.recentNews}}/>
                        </div>
                    </div>
                    <div className="card card-fluid">
                        <div className="card-header"> Quick Links</div>
                        <div className="card-body">
                            <div dangerouslySetInnerHTML={{__html: this.state.quickLinks}}/>
                        </div>
                    </div>
                </div>
            </div>
        </div>)
    }
}