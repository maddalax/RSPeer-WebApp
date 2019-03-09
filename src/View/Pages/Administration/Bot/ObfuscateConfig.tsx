import React from 'react';
import {ApiService} from "../../../../Common/ApiService";
import {Alert} from "../../../../Utilities/Alert";

type State = {
    botConfig : string,
    scriptConfig : string,
    didBotConfigChange : boolean,
    didScriptConfigChange : boolean,
    saving : boolean
}

export class ObfuscateConfig extends React.Component<any, State> {
    
    private readonly api : ApiService;

    constructor(props : any) {
        super(props);
        this.api = new ApiService();
        this.state = {
            botConfig : '',
            scriptConfig : '',
            didBotConfigChange : false,
            didScriptConfigChange : false,
            saving : false
        }
    }
    
    setBotConfig = (e : any) => {
        this.setState({botConfig : e.target.value, didBotConfigChange : true});
    };

    setScriptConfig = (e : any) => {
        this.setState({scriptConfig : e.target.value, didScriptConfigChange : true});
    };

    saveConfiguration = async () => {
        this.setState({saving : true});
        if(this.state.didBotConfigChange) {
            const res = await this.api.post("adminBot/updateBotObfuscateConfig", {
                text : this.state.botConfig
            });
            if(res.error) {
                this.setState({saving : false});
                return Alert.show("Failed to update bot configuration. " + res.error);
            }
            Alert.success("Successfully updated configuration.");
        }
        if(this.state.didScriptConfigChange) {
            const res = await this.api.post("adminBot/updateScriptObfuscateConfig", {
                text : this.state.scriptConfig
            });
            if(res.error) {
                this.setState({saving : false});
                return Alert.show("Failed to update script configuration. " + res.error);
            }
            Alert.success("Successfully updated configuration.");
        }
        this.setState({saving : false});
    };
    
    async componentDidMount() {
        const botConfig = await this.api.get('adminBot/getBotObfuscateConfig');
        const scriptConfig = await this.api.get('adminBot/getScriptObfuscateConfig');
        this.setState({botConfig, scriptConfig})
    }
    
    render() {
        return <div>
            <div className="form-group">
                <label htmlFor="exampleFormControlTextarea1">Bot Obfuscation Configuration</label>
                <textarea className="form-control" id="exampleFormControlTextarea1" rows={8} value={this.state.botConfig} onChange={this.setBotConfig}/>
            </div>
            <div className="form-group">
                <label htmlFor="exampleFormControlTextarea1">Script Obfuscation Configuration</label>
                <textarea className="form-control" id="exampleFormControlTextarea1" rows={8} value={this.state.scriptConfig} onChange={this.setScriptConfig}/>
            </div>
            {!this.state.saving && <button className={"btn btn-primary"} onClick={this.saveConfiguration}>Save Configuration</button>}
            {this.state.saving && <button className={"btn btn-primary"}>Saving...</button>}
        </div>
    }
    
}