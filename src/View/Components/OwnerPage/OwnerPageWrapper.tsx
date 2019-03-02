import React from 'react';
import {User} from "../../../Models/User";

export class OwnerPageWrapper extends React.Component<any, any> {

    constructor(props : any) {
        super(props);
        this.state = {
            authorized : false,
            loading : true
        }
    }

    componentDidMount(): void {
        const user : User = this.props.user;
        this.setState({authorized : user && user.isOwner}, () => {
            this.setState({loading : false});
        });
    }

    render() {
        if(this.state.loading) {
            return <div>Loading...</div>
        }
        if(!this.state.authorized) {
            return <div>Unauthorized.</div>
        }
        return this.props.children;
    }

}