import React from 'react';
import {ApiService} from "../../../Common/ApiService";
import {Util} from "../../../Utilities/Util";
import {Alert} from "../../../Utilities/Alert";

export class ImportQsJson extends React.Component<any, any> {

    private readonly api: ApiService;

    constructor(props: any) {
        super(props);
        this.api = new ApiService();
        this.state = {
            json: JSON.stringify(this.sample, null, 4)
        };
    }

    async componentDidMount() {
    }

    import = async () => {
        let parsed;
        try {
            parsed = JSON.parse(this.state.json);
        } catch (e) {
            Alert.show("Invalid JSON, unable to parse. Please make sure JSON is valid.");
            return parsed;
        }
        if (!Array.isArray(parsed)) {
            Alert.show("JSON should be an array. Please review the forum thread to see how JSON should be formatted.");
            return;
        }
        const res = this.props.qs;
        const newAccounts = parsed.map(c => {
            c.Config = c.Config || c.config;
            return {
                rsUsername: c.RsUsername,
                rsPassword: c.RsPassword,
                world: c.World,
                proxy: {
                    Name: c.ProxyName
                },
                script: {
                    ScriptArgs: c.ScriptArgs,
                    Name: c.ScriptName,
                    IsRepoScript: c.IsRepoScript
                },
                config: {
                    ...c.Config
                }
            }
        });
        newAccounts.forEach(n => {
            res.clients.unshift(n)
        });
        const i = await this.api.post("botLauncher/saveQuickLaunch", res);
        if (i.error) {
            return Alert.show(i.error);
        }
        Alert.success(`Successfully imported into ${res.name}.`);
        this.close(Util.toCamel(res));
    };

    customStyles = {
        content: {
            top: '50%',
            left: '50%',
            right: 'auto',
            bottom: 'auto',
            marginRight: '-50%',
            transform: 'translate(-50%, -50%)',
            padding: '10px'
        },
        backgroundColor: 'black'

    };

    sample = [
        {
            "RsUsername": "maddev",
            "RsPassword": "fake",
            "World": 382,
            "ScriptName": "ProMiner",
            "IsRepoScript": true,
            "ScriptArgs": "-tree yew",
            "ProxyName": "woodcutter_proxies",
            "Config": {
                "LowCpuMode": true,
                "SuperLowCpuMode": true,
                "EngineTickDelay": 0,
                "DisableModelRendering": false,
                "DisableSceneRendering": false
            }
        }
    ];

    close = (res : any) => {
        this.props.onClose(res);
    };

    onChange = (e : any) => {
        this.setState({json: e.target.value})
    };

    render() {
        return (
            <div>
                <div className={"container"}>
                    <h3>Import JSON Into {this.props.qs.name}</h3>
                    <p>You may paste JSON to import the accounts into the quick launch configuration.</p>
                    <p>The JSON must follow the format listed in <a
                        href={"https://forums.rspeer.org/topic/536/bot-management-panel-json-import-guide"}>https://forums.rspeer.org/topic/536/bot-management-panel-json-import-guide</a>
                    </p>
                    <div className="form-group">
                            <textarea onChange={this.onChange} className="form-control" id="exampleFormControlTextarea1"
                                      rows={20} value={this.state.json}>
                            </textarea>
                    </div>
                </div>
                <button className="btn btn-primary" type="button" id="importJson"
                        onClick={this.import}>
                    Import Now
                </button>
                <button className="btn btn-danger" type="button" id="importJsonCancel"
                        onClick={this.close}>
                    Cancel
                </button>
            </div>
        );
    }
}