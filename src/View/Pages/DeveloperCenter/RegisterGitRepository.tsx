import React from 'react';
import {ApiService} from "../../../Common/ApiService";
import {Alert} from "../../../Utilities/Alert";

type GitlabUser = {
    id : number,
    name : string,
    username : string,
    web_url : string
}

type State = {
    username: string,
    results : GitlabUser[],
    creating : boolean
}

export class RegisterGitRepository extends React.Component<any, State> {

    private api : ApiService;

    constructor(props: any) {
        super(props);
        this.api = new ApiService();
        this.state = {
            username: '',
            results : [],
            creating : false
        }
    }

    query = async () => {
        if(!this.state.username) {
            return Alert.show("Please enter your GitLab username.");
        }
        const query = await this.api.post("scriptDevelopment/queryGitLab", {
            gitlabUsername : this.state.username
        });
        if(!Array.isArray(query)) {
            return Alert.show("Something went wrong, unable to query GitLab.")
        }
        if(query.length === 0) {
            return Alert.show("No users found with that username.");
        }
        if(query.length > 0) {
            this.setState({results : query});
            return;
        }
    };

    register = async (user : GitlabUser) => {
        const confirm = window.confirm(`Please confirm ${user.username} is your account. You can not change this later.`);
        if(!confirm) {
            return;
        }
        if(!user.id) {
            return Alert.show("Please select your GitLab user.");
        }
        this.setState({creating : true});
        const res = await this.api.post("scriptDevelopment/addScripterInfo", {
            gitlabId : user.id
        });
        this.setState({creating : false});
        if(res.error) {
            return;
        }
        this.props.history.push('/developer');
    };

    render(): any {
        if(this.state.creating) {
            return <div>
                <p>Creating GitLab script repository projects... please wait.</p>
                <div className="spinner-border" role="status">
                    <span className="sr-only">Loading...</span>
                </div>
            </div>
        }
        return <div>
            <h4>Register A Git Repository</h4>
            <p>To gain access to the SDN and publish scripts, you must first register a git repository through
                Gitlab.</p>
            <p>All scripts must be pushed to Gitlab to be able to request a script to be added to the SDN. When adding a
                script to the SDN
                it will ask you your Gitlab repository path.</p>

            <p>To get started, please visit: <a href={"https://gitlab.com"} target={"_blank"}>https://gitlab.com.</a></p>
            <p>Register an account there, and enter your Gitlab username below that you registered.</p>
            <p>Once you have done so, a project will be created for you. This project is where you will need to create
                repositories for each of your scripts
                that will go on the SDN.</p>

            <p>Please place each new script in its own repository. It will look like the following, once you receive
                your project.</p>
            <img height="75%" width="75%" src={"https://i.imgur.com/0Jf9Ae6.png"}/>
            <br/><br/>
            {this.state.results.length > 1 && <div>
                <p>Please select your account from the table below.</p>
                <table className="table">
                <thead>
                <tr>
                    <th scope="col">Gitlab User Id</th>
                    <th scope="col">Name</th>
                    <th scope="col">Username</th>
                    <th scope="col">Web Url</th>
                    <th scope="col">Choose</th>
                </tr>
                </thead>
                <tbody>
                {this.state.results.map(r => {
                    return ( <tr>
                        <th scope="row">{r.id}</th>
                        <td>{r.name}</td>
                        <td>{r.username}</td>
                        <td>{r.web_url}</td>
                        <td><button onClick={() => this.register(r)} className={"btn btn-success"}>This is me</button></td>
                    </tr>)
                })}
                </tbody>
            </table> </div>}
            <div>
                <h6>Enter your GitLab username here.</h6>
                <input type="text" className="form-control" placeholder="Gitlab Username" aria-label="Gitlab Username" onChange={(e) => this.setState({username : e.target.value})}/>
                <button onClick={this.query} style={{marginTop : '7px'}} className={"btn btn-success"}>Register For Script Repository</button>
            </div>
        </div>
    }

}