import React from 'react';
import {UserUtil} from "./Utilities/UserUtil";
import {ApiService} from "./Common/ApiService";
import {User} from "./Models/User";
import {HttpUtil} from "./Utilities/HttpUtil";
import {UserService} from "./Services/User/UserService";

type State = {
    user : User | null,
    allowedInstances : number,
}

export class PageContainer extends React.Component<any, State> {

    private api : ApiService;

    constructor(props : any) {
        super(props);
        this.api = new ApiService();
        this.state = {
            user : null,
            allowedInstances : 0
        }
    }
    
    async componentDidMount() {
        const token = HttpUtil.getParameterByName("idToken");       
        if(token) {
            UserService.setSession(token);
            window.location.replace(window.location.href.split("?")[0]);
        }
        if(!UserUtil.getSession()) {
            if(this.state.user != null) {
                this.setState({user: null});
            }
            return;
        }
        const me = await this.api.post("user/me", {
            includeBalance : true
        });
        const allowed = await this.api.get("instance/allowedClients");
        this.setState({user: me, allowedInstances : allowed});
    }

    componentDidUpdate(): void {
        if(!this.state.user) {
            this.componentDidMount();
        }
    }

    private reloadUser = () => {
      this.componentDidMount();
    };

    private onLogout = () => {
        this.setState({user : null})
    };

    render() : any {
        const { children } = this.props;

        const childrenWithProps = React.Children.map(children, (child : any, index : number) =>
            React.cloneElement(child, { index,
                user : this.state.user,
                logoutCallback : this.onLogout,
                reloadUser : this.reloadUser,
                allowedInstances : this.state.allowedInstances
            })
        );
        return <React.Fragment>{childrenWithProps}</React.Fragment>
    }

}