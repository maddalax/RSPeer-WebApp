import * as React from "react";
import {ApiService} from "../../../Common/ApiService";
import {Alert} from "../../../Utilities/Alert";
import {UserUtil} from "../../../Utilities/UserUtil";

export class AdministrationDashboardKey extends React.Component<any, any> {
    
    private api : ApiService;
    
    constructor(props : any) {
        super(props);
        this.api = new ApiService();
        this.state = {
            key : '',
            processing : true
        }
    }
    
    async componentDidMount() {
        try {
            const key = UserUtil.getAccessKey();
            if(key && await this.validateKey(key)) {
                return;
            }
            await this.generateKey();
        } finally {
            this.setState({processing : false});
        }
    }
    
    private setKey = async (e : any) => {
        e.preventDefault();
        localStorage.setItem("dashboard_access_key", this.state.key);  
        const valid = await this.validateKey(this.state.key);
        if(!valid) {
            return Alert.show("The key you entered is invalid.")
        }
    };
    
    private validateKey = async (key : string) => {
        const result = await this.api.get("adminDashboard/validateKey?key=" + key);
        if(!result) {
            return false;
        }
        window.location.replace("/#/administration");
        return true;
    };
    
    private generateKey = async () => {
        const result = await this.api.post("adminDashboard/generateKey", {});
        if(result.error) {
            return Alert.show("Failed to generate key. " + result.error);
        }
    };
    
    render() {
        if(this.state.processing) {
            return <div>Processing... please wait.</div>
        }
        return <div>
            <p>An access key has been emailed to you, please enter it below.</p>
            <p>Your access key will expire in 8 hours.</p>
            <div className="form-group">
                <label htmlFor="forumThread"><strong>Access Key</strong></label>
                <input value={this.state.key} onChange={(e) => this.setState({key : e.target.value})}
                       type="string" className="form-control" id="key"/>
            </div>
            <button type="submit" className="btn btn-primary" onClick={this.setKey}>Submit</button>
        </div>
    }
}