import React from 'react';
import {ApiService} from "../../../../Common/ApiService";
import {Util} from "../../../../Utilities/Util";
import {Alert} from "../../../../Utilities/Alert";
import {AdministrationUserDetails} from "../AdministrationUserDetails";

export class AdministrationStatsDashboard extends React.Component<any, any> {
    
    private readonly api : ApiService;
    
    constructor(props : any) {
        super(props);
        this.api = new ApiService();
        this.state = {
            top25 : []
        }
    }
    
    async componentDidMount() {
        const top25 = await this.api.get("adminStats/top25");
        this.setState({top25})
    }
    
    private showUser = (e : any, userId : number) => {
        e.preventDefault();
        Alert.modal({
            title : 'User',
            body : <div>
                <AdministrationUserDetails user={this.props.user} userId={userId}/>
            </div>
        })
    };
    
    render() {
        return <div>
            <h4>Top 25 Users By Clients Running</h4>
            <div className="table-responsive">
                <table className="table table-bordered table-striped">
                    <thead>
                    <tr>
                        <th scope="col">Username</th>
                        <th scope="col">Count</th>
                    </tr>
                    </thead>
                    <tbody>
                    {this.state.top25.map((o: any) => {
                        return (<tr>
                            <td><a href={"#"} onClick={(e) => this.showUser(e, o.userId)}>{o.username}</a></td>
                            <td>{o.count}</td>
                        </tr>)
                    })}
                    </tbody>
                </table>
            </div>
        </div>
    }
    
}