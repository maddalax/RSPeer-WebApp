import React from "react";
import {Dropdown} from "../Utility/Dropdown";
import {ApiService} from "../../../Common/ApiService";
import {Alert} from "../../../Utilities/Alert";

interface State {
    saving: boolean,
    settings: any
}

export class BotPreferences extends React.Component<any, State> {

    private apiService: ApiService;

    constructor(props: any) {
        super(props);
        this.state = {
            saving: false,
            settings: {}
        };
        this.apiService = new ApiService();
    }

    async componentDidMount() {
        this.loadSettings();
    }

    loadSettings = async () => {
        const preferences = await this.apiService.get("botPreference/get");
        this.setState({settings: preferences});
    };

    save = async () => {
        const confirm = window.confirm('These changes will apply to all currently running clients, as well as new clients. Please confirm.');
        if(!confirm) {
            return;
        }
        if (this.state.saving) {
            return;
        }
        const res = await this.apiService.post("botPreference/overwrite", this.state.settings);
        if(res.error) {
            return Alert.show("Failed to save preferences. " + res.error);
        }
        Alert.success("Successfully updated preferences");
        try {
        } finally {
            this.setState({saving: false});
        }
    };


    render() {
        return <div>
            <h3>Bot Preferences / Configuration</h3>
            <h6>These settings will apply to all currently running and new clients.</h6>
            <hr/>
            <h4>Selected Web Walker</h4>
            <p>Change the WebWalking implementation using the dropdown below.</p>
            <p>This is useful if you are experiencing walking issues with a certain webwalker, you may try switching to
                another one.</p>
            <p><strong>Acuity Walker:</strong> RSPeer's default web walker implementation written by ex RSPeer director
                Zach. <a href={"https://github.com/itsdax/RSPeer-Webwalker"}
                         rel={"nofollow"}>https://github.com/ZachHerridge/Acuity</a></p>
            <p><strong>Dax Walker:</strong> WebWalker implementation created by user Daxmagex. More information here: <a
                href={"https://github.com/itsdax/RSPeer-Webwalker"}
                rel={"nofollow"}>https://github.com/itsdax/RSPeer-Webwalker</a></p>
            <Dropdown
                onSelection={(e, v) => this.setState(prev => {
                    prev.settings.webWalker = v.value;
                    return prev;
                })}
                values={[{value: 0, display: 'Dax Walker'}, {value: 1, display: 'Acuity Walker'}]}
                valueDisplayProperty={'display'}
                value={this.state.settings.webWalker === 0 ? 'Dax Walker' : 'Acuity Walker'}/>
            <hr/>
            <h4>Dax Walker API Key</h4>
            <p>
                If you choose to use dax walker, you may implement your own key here. It will be used instead of the
                default key that RSPeer provides.
            </p>
            <p>Since we provide an API key by default, this is <strong>NOT</strong> required.</p>
            <p>Use this if you are getting rate limited while generating path requests for web walking.</p>
            <p>RSPeer's rate limiting allows up to 250 path requests per user per minute.</p>
            <p>To get an API Key, visit: <a href={"https://admin.dax.cloud/"} rel={"nofollow"}
                                            target={"_blank"}>https://admin.dax.cloud/</a>
            </p>
            <p>You may enter multiple keys if you seperate them with a comma.</p>
            <p>Please enter both the public and the private key seperated by a colon.</p>
            <p><strong>PUBLIC_KEY:PRIVATE_KEY,PUBLIC_KEY_2:PRIVATE_KEY_2</strong></p>
            <input type="text" className="form-control"
                   placeholder={"sub_DPjcfqN4YkIxm8:fake_private_key,sub_DPjXXzL5DeSiPf:fake_private_key_2"}
                   value={this.state.settings.daxWebKey}
                   aria-label="args" aria-describedby="basic-addon2" onChange={(e) => {
                const value = e.target.value;
                this.setState(prev => {
                    prev.settings.daxWebKey = value;
                    return prev;
                })
            }}/>
            <hr/>
            <button onClick={this.save} className="btn btn-success" type="button" id="saveChanges">
                Save Preference Changes
            </button>
        </div>
    }
}