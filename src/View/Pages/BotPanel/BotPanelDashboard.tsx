import React from 'react';
import {LinkKey} from "../../Components/BotPanel/LinkKey";
import {ConnectedLaunchers} from "../../Components/BotPanel/ConnectedLaunchers";
import {HttpUtil} from "../../../Utilities/HttpUtil";

type State = {
    loading : boolean
}

type Props = {
    user : any
}

let openedMenu = false;

export class BotPanelDashboard extends React.Component<Props, State> {
    
    constructor(props : any) {
        super(props);
        this.state = {
            loading : true
        };
    }

    componentDidMount(): void {
        if(!openedMenu) {
            const menu = HttpUtil.getParameterByName('menu');
            if (menu && menu === 'bot_panel') {
                openedMenu = true;
                window.setTimeout(() => {
                    // @ts-ignore
                    if(window.$) {
                        // @ts-ignore
                        window.$('#bot-panel-menu').click();
                    }
                }, 1500)
            }
        }
    }
    
    render() {
        if(!this.props.user) {
            return <div>
                <h5>Click sign in on the top right to view this page.</h5>
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