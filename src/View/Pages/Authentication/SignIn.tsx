import React from 'react';
import {ApiService} from "../../../Common/ApiService";
import {ConfigService} from "../../../Services/Config/ConfigService";

export class SignIn extends React.Component<any, any> {

    private api : ApiService;

    constructor(props : any) {
        super(props);
        this.api = new ApiService({supressAlert : true});
    }
    
    async componentDidMount() {
        const ssoRoute = await ConfigService.create(this.api).get("routing:sso");
        const origin = window.location.origin;
        window.location.replace(`${ssoRoute}?redirect=${origin}`);
    }

    render(): any {
        return (<div/>)
    }
}