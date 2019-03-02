import React from 'react';
import {LinkKey} from "../../Components/BotPanel/LinkKey";
import {ConnectedLaunchers} from "../../Components/BotPanel/ConnectedLaunchers";

type State = {
    loading : boolean
}

type Props = {
    user : any
}

export class BotPanelDashboard extends React.Component<Props, State> {
    
    constructor(props : any) {
        super(props);
        this.state = {
            loading : true
        };
    }

    render() {
        if(!this.props.user) {
            return <div>
                <h4>You must be logged in to view this page.</h4>
            </div>
        }
        return (
            <div>
                {this.props.user && <LinkKey user={this.props.user}/>}
                <hr/>
                {this.props.user && <ConnectedLaunchers userId={this.props.user.id} {...this.props}/>}
            </div>
        );
    }
}