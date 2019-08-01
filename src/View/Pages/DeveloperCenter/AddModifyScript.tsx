import React from 'react';
import {ApiService} from "../../../Common/ApiService";
import {Game, GameFormatted, ScriptDto, ScriptStatus, ScriptType, ScriptTypeFormatted} from "../../../Models/ScriptDto";
import {Alert} from "../../../Utilities/Alert";
import {Util} from "../../../Utilities/Util";

type State = {
    scriptId: number,
    categories: string[],
    category: string,
    description: string,
    name: string,
    repoUrl: string,
    forumThread: string,
    price: number,
    instances: number,
    [key: string]: any,
    recompile: boolean,
    processing: boolean,
    type: ScriptType,
    obfuscate: boolean,
    scriptJar: any,
    game : Game,
    status: ScriptStatus
}

type Props = {
    script: ScriptDto,
    isAdminView: boolean,
    onCancel?: () => any,
    onConfirm?: () => any
}

export class AddModifyScript extends React.Component<Props | any, State> {

    private api: ApiService;

    constructor(props: any) {
        super(props);
        const script: ScriptDto = props.script;
        this.state = {
            scriptId: script != null ? script.id : -1,
            categories: [],
            category: script != null ? script.categoryFormatted : '',
            description: script != null ? script.description : '',
            name: script != null ? script.name : '',
            repoUrl: script != null ? script.repositoryUrl : '',
            forumThread: script != null ? script.forumThread : '',
            price: script != null ? script.price : 300,
            instances: script != null ? script.instances : 5,
            recompile: !this.props.isAdminView,
            processing: false,
            type: script != null ? script.type : ScriptType.Free,
            obfuscate: true,
            scriptJar: null,
            game : script != null ? script.game : Game.Osrs,
            status: script != null ? script.status : ScriptStatus.Pending
        };
        this.api = new ApiService({throwError: true, supressAlert: true});
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

    setScriptType = (e: any, type: ScriptType) => {
        e.preventDefault();
        this.setState({type});
    };

    setGame = (e: any, game: Game) => {
        e.preventDefault();
        console.log('set game', game);
        this.setState({game});
    };

    deleteScript = async (e: any) => {
        e.preventDefault();
        const confirm = await window.confirm(`Are you sure you want to delete ${this.state.name}? This will remove the script from the SDN and all users access.`);
        if (!confirm) {
            return;
        }
        if (this.state.status === ScriptStatus.Pending) {
            const confirm2 = await window.confirm("Are you sure you didn't mean to deny instead of delete a pending submission? " +
                "If so please click cancel and use the Deny button.")
            if (!confirm2) {
                return;
            }
        }
        if (this.state.processing) {
            return;
        }
        this.setState({processing: true});
        const res = await this.api.post("adminScript/delete?id=" + this.state.scriptId, {});
        if (res.error) {
            this.setState({processing: false});
            return Alert.show(res.error);
        }
        this.setState({processing: false});
        this.props.onConfirm && this.props.onConfirm();
    };

    uploadPrivateScript = async (e: any) => {
        let file = e.target.files[0];
        if (!file)
            return;

        if (file.name.indexOf('.jar') === -1) {
            return Alert.show("File must be a .jar.")
        }

        this.setState({scriptJar: file});
    };

    clearPrivateScript = (e: any) => {
        e.preventDefault();
        this.setState({scriptJar: null})
    };

    onFormSubmit = async (e: any) => {
        e && e.preventDefault();
        if (this.state.processing) {
            return;
        }

        if (!this.state.category) {
            return Alert.show("Please select a script category.");
        }

        if (!this.allowsJar() && !this.state.forumThread) {
            return Alert.show("Please enter a valid forum thread for your script. Visit https://rspeer.org/forums/ to create one.");
        }

        if (this.state.type !== ScriptType.Premium) {
            this.setState({
                price: 0,
                instances: 0
            }, this.submit);
            return;
        }
        this.submit();
    };

    private submit = async () => {

        this.setState({processing: true});

        if (this.allowsJar()) {
            return await this.submitJar();
        }

        const script: any = {
            Id: this.state.scriptId,
            RepositoryUrl: this.state.repoUrl,
            Name: this.state.name,
            Description: this.state.description,
            Category: this.state.category,
            ForumThread: this.state.forumThread,
            Price: this.state.price,
            Instances: this.state.instances,
            Type: this.state.type,
            Game : this.state.game
        };

        const path = this.props.isAdminView ? 'adminScript/update' : 'script/create';
        try {
            await this.api.post(path, {
                Script: script,
                Recompile: this.state.recompile
            });
            this.setState({processing: false});
            this.props.onConfirm && this.props.onConfirm();
            if (!this.props.isAdminView) {
                Alert.success("Successfully submitted script update.");
                this.exit();
            }
        } catch (e) {
            this.setState({processing: false});
            console.error(e.response.data);
            const data = e.response.data;
            if (data.error) {
                Alert.show(data.error);
                return;
            }
            if (!data.Logs && !data.Errors) {
                Alert.show("Failed to compile script. " + JSON.stringify(data));
                return;
            }
            Alert.modal({
                title: 'Failed to compile script.',
                body: <div>
                    <h3>Logs</h3>
                    {<p>{data.Logs}</p>}
                    <br/>
                    {<p>{data.Errors}</p>}
                </div>
            })
        }
    };

    private submitJar = async () => {
        if (!this.state.scriptJar || this.state.scriptJar.size === 0) {
            Alert.show("You must upload a script jar file!");
            return;
        }
        const path = this.state.type === ScriptType.Private ? "script/createPrivate" : "script/createPublicHidden";
        const res = await this.api.postFormData(path, {
            command: JSON.stringify({
                Script: {
                    Id: this.state.scriptId,
                    Name: this.state.name,
                    Description: this.state.description,
                    Category: this.state.category,
                    Type: this.state.type,
                    Game : this.state.game
                }
            }),
            file: this.state.scriptJar
        });
        this.setState({processing: false});

        if (res.error) {
            return;
        }

        const message = this.state.type === ScriptType.Private
            ? "Successfully submitted / updated private script. Visit Private Script Access on sidebar to give users access."
            : "Successfully added public hidden script.";

        Alert.success(message, 9000);
        this.props.history.push('/developer')
    };

    cancel = (e: any) => {
        e && e.preventDefault();
        this.props.onCancel && this.props.onCancel();
        if (this.props.isAdminView) {
            return;
        }
        this.exit();
    };

    exit = () => {
        this.props.history.push('/developer');
    };

    setValue = (e: any, key: string) => {
        this.setState({[key]: e.target.value})
    };

    allowsJar = () => {
        return this.state.type === ScriptType.Private || this.state.type == ScriptType.HiddenPublic;
    };

    render() {
        if (!this.props.isAdminView && !this.props.user) {
            return <div>
                <h5>Click sign in on the top right to view this page.</h5>
            </div>
        }

        return <div>
            <div className="card" style={{maxHeight: '100%'}}>
                <div className="card-body">
                    {!this.props.isAdminView && <div>
                        <h5 className="card-title">Submit Script To Add To Repository</h5>
                        <div className="card-text">
                            <p>Fill in the form below to request to add a script to the repository.</p>
                        </div>
                    </div>}
                    <br/>
                    <form onSubmit={this.onFormSubmit}>
                        <div className="form-group">
                            <label>Game</label>
                            <div className="dropdown">
                                <button className="btn btn-secondary dropdown-toggle" type="button"
                                        id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true"
                                        aria-expanded="false">
                                    {GameFormatted(this.state.game)}
                                </button>
                                <ul className="dropdown-menu" aria-labelledby="dropdownMenuButton"
                                    style={{"height": "auto", "maxHeight": "200px", "overflow-y": "scroll"}}>
                                    <li key={"osrs"} onClick={(e) => this.setGame(e, Game.Osrs)}
                                        className="dropdown-item">Runescape 2007
                                    </li>
                                    <li key={"rs3"} onClick={(e) => this.setGame(e, Game.Rs3)}
                                        className="dropdown-item">Runescape 3
                                    </li>
                                </ul>
                            </div>
                        </div>
                        <div className="form-group">
                            <label>Script Type</label>
                            <div className="dropdown">
                                <button className="btn btn-secondary dropdown-toggle" type="button"
                                        id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true"
                                        aria-expanded="false">
                                    {ScriptTypeFormatted(this.state.type)}
                                </button>
                                <ul className="dropdown-menu" aria-labelledby="dropdownMenuButton"
                                    style={{"height": "auto", "maxHeight": "200px", "overflow-y": "scroll"}}>
                                    <li key={"free"} onClick={(e) => this.setScriptType(e, ScriptType.Free)}
                                        className="dropdown-item">Free
                                    </li>
                                    <li key={"premium"} onClick={(e) => this.setScriptType(e, ScriptType.Premium)}
                                        className="dropdown-item">Premium
                                    </li>
                                    <li key={"private"} onClick={(e) => this.setScriptType(e, ScriptType.Private)}
                                        className="dropdown-item">Private
                                    </li>
                                    {this.props.user && this.props.user.isOwner && <li key={"hiddenPublic"}
                                                                                       onClick={(e) => this.setScriptType(e, ScriptType.HiddenPublic)}
                                                                                       className="dropdown-item">Hidden
                                        Public
                                    </li>}
                                </ul>
                            </div>
                        </div>
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
                        {!this.allowsJar() && <div className="form-group">
                            <label htmlFor="repoUrl">Repository URL</label>
                            <input onChange={(e) => this.setValue(e, 'repoUrl')} value={this.state.repoUrl} type="text"
                                   className="form-control" id="repoUrl"
                                   placeholder="https://gitlab.com/rspeer-public-sdn/RSPeer/RSPeer-Fighter"/>
                            <p id="gitHelp" className="form-text text-muted">Provide a full path to the git
                                repository
                                where your code is contained. This should <strong>not</strong> be the actual .git url to
                                clone the repository.
                            </p>
                        </div>}
                        {!this.allowsJar() && <div className="form-group">
                            <label htmlFor="forumThread">Forum Thread URL</label>
                            <input onChange={(e) => this.setValue(e, 'forumThread')} value={this.state.forumThread}
                                   type="text" className="form-control" id="forumThread"
                                   placeholder="https://rspeer.org/forums/topic/8/example-script-thread"/>
                            <p id="gitHelp" className="form-text text-muted">Provide a full path to the forum
                                thread related to your script.
                                This will be used for you to advertise your script, provide customer support, etc.
                            </p>
                        </div>}
                        <div className="form-group">
                            <label>Script Category</label>
                            <div className="dropdown">
                                <button className="btn btn-secondary dropdown-toggle" type="button"
                                        id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true"
                                        aria-expanded="false">
                                    {this.state.category || 'Select a category'}
                                </button>
                                <ul className="dropdown-menu" aria-labelledby="dropdownMenuButton"
                                    style={{"height": "auto", "maxHeight": "200px", "overflow-y": "scroll"}}>
                                    {this.state.categories.map(c => {
                                        return <li key={c} onClick={(e) => this.setCategory(e, c)}
                                                   className="dropdown-item">{c}</li>
                                    })}
                                </ul>
                            </div>
                        </div>
                        {this.state.type === ScriptType.Premium && <React.Fragment>
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
                        {!this.allowsJar() && !this.props.isAdminView && <React.Fragment>
                            <p>Your script will go through a formal verification process by staff to ensure your script
                                is
                                safe.</p>
                            <p>Once that process is completed, your script will be added to the repository for use by
                                all
                                RSPeer users.</p>
                            {!this.state.processing && !this.state.scriptId &&
                            <button type="submit" className="btn btn-primary">Submit Script For Review</button>}
                            {!this.state.processing && this.state.scriptId &&
                            <button type="submit" className="btn btn-primary">Submit Update For Review</button>}
                            {this.state.processing &&
                            <button type="submit" className="btn btn-primary">Processing...</button>}
                        </React.Fragment>}
                        {this.allowsJar() && !this.props.isAdminView && <React.Fragment>
                            {!this.state.processing && !this.state.scriptJar &&
                            <React.Fragment>
                                <label style={{marginTop: '8px'}} htmlFor="hidden-new-file" className="btn btn-primary">
                                    Click To Upload Script Jar
                                </label>
                                <input type="file" onChange={this.uploadPrivateScript} id="hidden-new-file"
                                       style={{display: "none"}}/>
                            </React.Fragment>}
                            {!this.state.processing && this.state.scriptJar &&
                            <React.Fragment>
                                <label style={{marginTop: '8px'}} htmlFor="hidden-new-file" className="btn btn-primary">
                                    {this.state.scriptJar.name} ({Util.formatBytes(this.state.scriptJar.size)})
                                </label>
                                <button type={"submit"} onClick={this.clearPrivateScript} className="btn btn-danger">
                                    Clear Upload
                                </button>
                            </React.Fragment>}
                            {this.state.processing &&
                            <button type="submit" className="btn btn-primary">Processing...</button>}
                        </React.Fragment>}
                        {this.allowsJar() && !this.props.isAdminView && <React.Fragment>
                            {this.state.type === ScriptType.Private &&
                            <p>Private scripts are not reviewed by RSPeer staff.</p>}
                            {this.state.type === ScriptType.HiddenPublic &&
                            <p>Hidden Public is only uploaded by RSPeer staff.</p>}
                            {this.state.type === ScriptType.Private &&
                            <p>We do not compile private scripts on our servers, please upload a compiled jar
                                file of the private script.</p>}
                            {!this.state.processing &&
                            <React.Fragment>
                                <button type={"submit"} className="btn btn-success">
                                    Submit Script
                                </button>
                            </React.Fragment>}
                            {this.state.processing &&
                            <button type="submit" className="btn btn-primary">Processing...</button>}
                        </React.Fragment>}
                        {this.props.isAdminView && <React.Fragment>
                            <div className="form-group">
                                <div className="form-check">
                                    <input type="checkbox" className="form-check-input" id="recompile-gitlab"
                                           checked={this.state.recompile}
                                           onChange={(e) => {
                                               this.setState({recompile: e.target.checked})
                                           }}/>
                                    <label className="form-check-label" htmlFor="recompile-gitlab">Recompile from
                                        GitLab</label>
                                    <p id="recompileHelp" className="form-text text-muted">Scripts will be compiled at
                                        the time of submission,
                                        it is not necessary to recompile when approving a pending script.
                                    </p>
                                </div>
                            </div>
                            {!this.state.processing &&
                            <button type="submit" className="btn btn-primary button-spacing">Accept</button>}
                            {this.state.processing &&
                            <button type="submit" className="btn btn-primary button-spacing">Processing...</button>}
                        </React.Fragment>}
                        {this.props.isAdminView && !this.state.processing &&
                        <React.Fragment>
                            {this.state.status === ScriptStatus.Live && <button onClick={this.deleteScript}
                                                                                className="btn btn-danger">Delete
                                Script</button>}
                            <button style={{marginLeft: '5px'}} className="btn btn-danger" onClick={this.cancel}>Cancel
                            </button>
                        </React.Fragment>}
                    </form>
                </div>
            </div>
        </div>
    }

}