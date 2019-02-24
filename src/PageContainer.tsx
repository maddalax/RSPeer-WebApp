import React from 'react';
import {UserUtil} from "./Utilities/UserUtil";
import {ApiService} from "./Common/ApiService";

export class PageContainer extends React.Component<any, any> {

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
        const me = await this.api.get("user/me");
        this.setState({user: me});
    }

    componentDidUpdate(): void {
        if(!this.state.user) {
            this.componentDidMount();
        }
    }

    private onLogout = () => {
        this.setState({user : null})
    };

    render() : any {
        const { children } = this.props;

        const childrenWithProps = React.Children.map(children, (child : any, index : number) =>
            React.cloneElement(child, { index, user : this.state.user, logoutCallback : this.onLogout })
        );
        return <React.Fragment>{childrenWithProps}</React.Fragment>
    }

}