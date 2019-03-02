import React from 'react';
import {UserUtil} from "./Utilities/UserUtil";
import {ApiService} from "./Common/ApiService";
import {User} from "./Models/User";

type State = {
    user : User | null
}

export class PageContainer extends React.Component<any, State> {

    private api : ApiService;

    constructor(props : any) {
        super(props);
        this.api = new ApiService();
        this.state = {
            user : null
        }
    }

    async componentDidMount() {
        if(!UserUtil.getSession()) {
            if(this.state.user != null) {
                this.setState({user: null});
            }
            return;
        }
        const me = await this.api.post("user/me", {
            includeBalance : true
        });
        this.setState({user: me});
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
            React.cloneElement(child, { index, user : this.state.user, logoutCallback : this.onLogout, reloadUser : this.reloadUser })
        );
        return <React.Fragment>{childrenWithProps}</React.Fragment>
    }

}