import React from 'react';
import {ApiService} from "../../../Common/ApiService";
import {ScriptDto, ScriptType} from "../../../Models/ScriptDto";
import {Alert} from "../../../Utilities/Alert";

type State = {
    scriptId : number,
    categories: string[],
    category: string,
    description: string,
    name: string,
    repoUrl: string,
    forumThread: string,
    price: number,
    instances: number,
    isPremium: boolean
    [key: string]: any,
    recompile : boolean
}

type Props = {
    script : ScriptDto,
    isAdminView : boolean,
    onCancel? : () => any
}

export class AddModifyScript extends React.Component<Props | any, State> {

    private api: ApiService;

    constructor(props: any) {
        super(props);
        const script : ScriptDto = props.script;
        console.log(script);
        this.state = {
            scriptId : script != null ? script.id : -1,
            categories: [],
            category: script != null ? script.categoryFormatted : '',
            description: script != null ? script.description : '',
            name: script != null ? script.name : '',
            repoUrl: script != null ? script.repositoryUrl : '',
            forumThread: script != null ? script.forumThread : '',
            price: script != null ? script.price : 300,
            instances: script != null ? script.instances : 5,
            isPremium: script != null ? script.type === ScriptType.Premium : false,
            recompile : !this.props.isAdminView
        };
        this.api = new ApiService();
    }

     componentDidMount(): void {
         this.setScriptCategories();
     }

    setScriptCategories = async () => {
        const res = await this.api.get('script/categories');
        this.setState({categories: res})
    };

    setCategory = (e: any, category: string) => {
        e.preventDefault();
        this.setState({category})
    };

    onFormSubmit = async (e: any) => {
        e.preventDefault();
        if (!this.state.category) {
            return Alert.show("Please select a script category.");
        }
        if (!this.state.forumThread) {
            return Alert.show("Please enter a valid forum thread for your script. Visit https://rspeer.org/forums/ to create one.");
        }
        const script : any = {
            Id : this.state.scriptId,
            RepositoryUrl : this.state.repoUrl,
            Name: this.state.name,
            Description: this.state.description,
            Category: this.state.category,
            ForumThread: this.state.forumThread,
            Price: this.state.price,
            Instances: this.state.instances,
            Type: this.state.isPremium ? ScriptType.Premium : ScriptType.Free
        };

        const path = this.props.isAdminView ? 'adminScript/update' : 'script/create';
        const res = await this.api.post(path, {
            Script : script,
            Recompile : this.state.recompile
        });
        if (res.error) {
            return Alert.show(res.error);
        }
        this.cancel(e);
    };

    cancel = (e : any) => {
        e.preventDefault();
        if(this.props.isAdminView) {
            this.props.onCancel && this.props.onCancel();
            return;
        }
        this.props.history.push('/developer');

    };

    setValue = (e: any, key: string) => {
        this.setState({[key]: e.target.value})
    };

    render() {
        // @ts-ignore
        return <div>
            <div className="card" style={{maxHeight: '100%'}}>
                <div className="card-body">
                    {!this.props.isAdminView && <div>
                        <h5 className="card-title">Submit Script To Add To Repository</h5>
                        <div className="card-text">
                            <p>Fill in the form below to request to add a script to the repository.</p>
                            <p>Your script will go through a formal verification process by staff to ensure your script is
                                safe.</p>
                            <p>Once that process is completed, your script will be added to the repository for use by all
                                RSPeer users.</p>
                        </div>
                    </div>}
                    <br/>
                    <form onSubmit={this.onFormSubmit}>
                        <div className="form-group">
                            <label htmlFor="scriptName">Name</label>
                            <input type="text" onChange={(e) => this.setValue(e, 'name')} value={this.state.name}
                                   className="form-control" id="scriptName" placeholder="Enter script name"/>
                            <p id="emailHelp" className="form-text text-muted">Enter the name you'd like
                                show in the repository and the script selector.
                            </p>
                        </div>
                        <div className="form-group">
                            <label htmlFor="scriptDesc">Description</label>
                            <input onChange={(e) => this.setValue(e, 'description')} value={this.state.description}
                                   type="text" className="form-control" id="scriptDesc"
                                   placeholder="Enter a description"/>
                            <p id="descHelp" className="form-text text-muted">Please give a nice description
                                on what your script does. Script requests may be denied due to low quality descriptions.
                            </p>
                        </div>
                        <div className="form-group">
                            <label htmlFor="repoUrl">Repository URL</label>
                            <input onChange={(e) => this.setValue(e, 'repoUrl')} value={this.state.repoUrl} type="text"
                                   className="form-control" id="repoUrl"
                                   placeholder="https://gitlab.com/rspeer-public-sdn/RSPeer/RSPeer-Fighter"/>
                            <p id="gitHelp" className="form-text text-muted">Provide a full path to the git
                                repository
                                where your code is contained. This should <strong>not</strong> be the actual .git url to
                                clone the repository.
                            </p>
                        </div>
                        <div className="form-group">
                            <label htmlFor="forumThread">Forum Thread URL</label>
                            <input onChange={(e) => this.setValue(e, 'forumThread')} value={this.state.forumThread}
                                   type="text" className="form-control" id="forumThread"
                                   placeholder="https://rspeer.org/forums/topic/8/example-script-thread"/>
                            <p id="gitHelp" className="form-text text-muted">Provide a full path to the forum
                                thread related to your script.
                                This will be used for you to advertise your script, provide customer support, etc.
                            </p>
                        </div>
                        <div className="form-group">
                            <div className="dropdown">
                                <button className="btn btn-secondary dropdown-toggle" type="button"
                                        id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true"
                                        aria-expanded="false">
                                    {this.state.category || 'Script Category'}
                                </button>
                                <ul className="dropdown-menu" aria-labelledby="dropdownMenuButton" style={{"height" : "auto", "maxHeight" : "200px", "overflow-y" : "scroll"}}>
                                    {this.state.categories.map(c => {
                                        return <li key={c} onClick={(e) => this.setCategory(e, c)}
                                                  className="dropdown-item">{c}</li>
                                    })}
                                </ul>
                            </div>
                        </div>
                        <div className="form-group">
                            <div className="form-check">
                                <input type="checkbox" className="form-check-input" id="premiumScriptCheck"
                                       checked={this.state.isPremium}
                                       onChange={(e) => {
                                           this.setState({isPremium: e.target.checked})
                                       }}/>
                                <label className="form-check-label" htmlFor="premiumScriptCheck">Submit As Premium
                                    Script</label>
                            </div>
                        </div>
                        {this.state.isPremium && <React.Fragment>
                            <div className="form-group">
                                <label htmlFor="forumThread">Token Price Per Month</label>
                                <input onChange={(e) => this.setValue(e, 'price')} value={this.state.price}
                                       type="number" className="form-control" id="price"
                                       placeholder="300"/>
                                <p id="gitHelp" className="form-text text-muted">How much should your script cost
                                    per month? 1 Token = $0.01
                                </p>
                            </div>
                            <div className="form-group">
                                <label htmlFor="forumThread">Total Instances Granted</label>
                                <input onChange={(e) => this.setValue(e, 'instances')} value={this.state.instances}
                                       type="number" className="form-control" id="instances"
                                       placeholder="5"/>
                                <p id="gitHelp" className="form-text text-muted">How many script instances should a
                                    purchase grant? Example: Granting 5 instances
                                    will allow the user to run up to 5 accounts concurrently.
                                </p>
                                <p id="gitHelp" className="form-text text-muted">Enter -1 for unlimited instances.
                                </p>
                            </div>
                        </React.Fragment>}
                        {!this.props.isAdminView && <React.Fragment>
                            {!this.state.scriptId && <button type="submit" className="btn btn-primary">Submit Script For Review</button>}
                            {this.state.scriptId && <button type="submit" className="btn btn-primary">Submit Update For Review</button>}       
                        </React.Fragment>}
                        {this.props.isAdminView && <React.Fragment>
                            <div className="form-group">
                                <div className="form-check">
                                    <input type="checkbox" className="form-check-input" id="recompile-gitlab"
                                           checked={this.state.recompile}
                                           onChange={(e) => {
                                               this.setState({recompile: e.target.checked})
                                           }}/>
                                    <label className="form-check-label" htmlFor="recompile-gitlab">Recompile from GitLab</label>
                                </div>
                            </div>
                            <button type="submit" className="btn btn-primary">Update Script</button>
                        </React.Fragment>}
                        <button style={{marginLeft : '5px'}} className="btn btn-danger" onClick={this.cancel}>Cancel</button>
                    </form>
                </div>
            </div>
        </div>
    }

}