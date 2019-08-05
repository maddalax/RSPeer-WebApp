import React from 'react';
import {ApiService} from "../../../Common/ApiService";
import {Util} from "../../../Utilities/Util";
import {Alert} from "../../../Utilities/Alert";

export class ImportQsCsv extends React.Component<any, any> {
    private readonly api: ApiService;

    constructor(props: any) {
        super(props);
        this.api = new ApiService();
        this.state = {
            csv: 'MadDev123,rips,382,Manly Chopper,TRUE,-tree yew,FALSE,83,,MadDev,FakePass,TRUE,TRUE,0,FALSE,FALSE\n'
        }
    }

    import = async () => {
        // Assuming the csv is in format of:
        // RsUsername,RsPassword,World,ScriptName,IsRepoScript,ScriptArgs,UseProxy,ProxyPort,ProxyName,ProxyUser,ProxyPass,LowCpuMode,SuperLowCpuMode,EngineTickDelay,DisableModelRendering,DisableSceneRendering
        const csv = this.state.csv;
        const desiredItemsPerRow = 16;
        const rows = csv.split(/\r|\n/);
        const res = this.props.qs;
        const newAccounts = [];
        if (rows.length === 0) {
            Alert.show("Invalid CSV. Could not be read.");
            return;
        }

        if (rows[rows.length-1].length === 0) {
            // If the last row in our input is a new line character, remove it.
            rows.pop();
        }

        for (let i = 0; i < rows.length; i++) {
            const entry = rows[i].split(',');
            if (entry.length !== desiredItemsPerRow) {
                Alert.show(`Invalid CSV entry on line ${i+1}`);
                return;
            }

            const [
                RsUsername, 
                RsPassword,
                World,
                ScriptName,
                IsRepoScript,
                ScriptArgs,
                UseProxy,
                ProxyPort,
                ProxyName,
                ProxyUser,
                ProxyPass,
                LowCpuMode,
                SuperLowCpuMode,
                EngineTickDelay,
                DisableModelRendering,
                DisableSceneRendering,
            ] = entry;

            const account = {
                rsUsername: RsUsername,
                rsPassword: RsPassword,
                world: World,
                UseProxy: UseProxy.toUpperCase() === 'TRUE', 
                proxy: {
                    Name: ProxyName,
                    ProxyUser,
                    ProxyPass,
                    ProxyPort
                },
                script: {
                    ScriptArgs,
                    Name: ScriptName,
                    IsRepoScript
                },
                config: {
                    LowCpuMode: LowCpuMode.toUpperCase() === 'TRUE',
                    SuperLowCpuMode: SuperLowCpuMode.toUpperCase() === 'TRUE',
                    EngineTickDelay: parseInt(EngineTickDelay),
                    DisableModelRendering: DisableModelRendering.toUpperCase() === 'TRUE',
                    DisableSceneRendering: DisableSceneRendering.toUpperCase() === 'TRUE'
                }
            }

            newAccounts.push(account);
        }

        newAccounts.forEach(n => {
            res.clients.unshift(n)
        });

        const i = await this.api.post("botLauncher/saveQuickLaunch", res);
        if (i.error) {
            return Alert.show(i.error);
        }
        Alert.success(`Successfully imported into ${res.name}.`);
        this.close(Util.toCamel(res));
    }

    close = (res : any) => {
        this.props.onClose(res);
    };

    onChange = (e : any) => {
        this.setState({csv: e.target.value})
    };

    render() {
        return (
            <div>
                <div className={"container"}>
                    <h3>Import CSV Into {this.props.qs.name}</h3>
                    <p>You may paste CSV to import the accounts into the quick launch configuration.</p>
                    <p>The CSV must follow the format listed in <a
                        href={"https://forums.rspeer.org/topic/#"}>https://forums.rspeer.org/topic/</a>
                    </p>
                    <div className="form-group">
                            <textarea onChange={this.onChange} className="form-control" id="exampleFormControlTextarea1"
                                      rows={20} value={this.state.csv}>
                            </textarea>
                    </div>
                </div>
                <button className="btn btn-primary" type="button" id="importCsv"
                        onClick={this.import}>
                    Import Now
                </button>
                <button className="btn btn-danger" type="button" id="importCsvCancel"
                        onClick={this.close}>
                    Cancel
                </button>
            </div>
        );
    }
}