import React from 'react';
import {ApiService} from "../../../../Common/ApiService";
import {Alert} from "../../../../Utilities/Alert";
import {Util} from "../../../../Utilities/Util";
import {Game, GameFormatted} from "../../../../Models/ScriptDto";

type Props = {
    game : Game
}

export class UpdateBot extends React.Component<Props, any> {

    private readonly api: ApiService;

    constructor(props: any) {
        super(props);
        this.api = new ApiService();
        this.state = {
            uploadedMod: null,
            isUploading: false,
            currentVersion: 'Loading...',
            newVersion : -1
        };
    }

    componentDidMount(): void {
        this.setCurrentVersion();
    }

    setCustomVersion = (e : any) => {
        this.setState({newVersion : e.target.value});
    };

    setCurrentVersion = async () => {
        const version = await this.api.get("bot/currentVersionRaw?game=" + this.props.game);
        const parsed = parseFloat(version).toFixed(2);
        const newVersion = parseFloat(version + 0.01).toFixed(2);
        this.setState({currentVersion: parsed, newVersion : newVersion});
    };

    uploadBot = (event: any) => {
        let file = event.target.files[0];
        if (!file)
            return;
        
        this.setState({
            ...this.state,
            isUploading: false,
            uploadedMod: {file: file, name: file.name, size: file.size}
        });
    };

    clearUpload = () => {
        this.setState({
            ...this.state,
            uploadedMod: null
        })
    };

    submitUpdate = async () => {
        if(this.state.newVersion === this.state.currentVersion) {
            return Alert.show("You must change the version to not match the current version.");
        }
        let confirm = window.confirm("Please click ok to confirm the updating of the bot with your selected file.");
        if (!confirm)
            return;
        this.setState({...this.state, isUploading: true});
        const formData = new FormData();
        formData.append("file", this.state.uploadedMod.file);
        confirm = window.confirm('The API no longer obfuscates the bot automatically, it is expected that you have uploaded an obfuscated bot, please confirm that your upload is obfuscated.');
        if(!confirm) {
            return;
        }
        
        const getRoute = () => {
          switch(this.props.game) {
              case Game.Osrs:
                  return 'updateBot';
              case Game.Rs3:
                  return 'updateInuvation';
              case Game.Rs3Updater:
                  return "updateInuvationUpdater";
          }  
        };
        
        const route = getRoute();
        const res = await this.api.post(`adminBot/${route}?silent=false&version=${this.state.newVersion}`, formData);
        this.setState({...this.state, isUploading: false});
        if (res.error) {
            return Alert.show(res.error);
        }
        this.setCurrentVersion();
        Alert.success(`Successfully updated ${GameFormatted(this.props.game)}.`);
        this.clearUpload();
    };

    renderUpload = () => {
        if (this.state.isUploading) {
            return <label htmlFor={`hidden-new-file-${this.props.game}`} className="ui primary button">
                Uploading... please wait.
            </label>
        }
        if (this.state.uploadedMod == null) {
            return (
                <div>
                    <label htmlFor={`hidden-new-file-${this.props.game}`} className="btn btn-primary">
                        <i className="cloud icon"/>
                        Click To Upload {GameFormatted(this.props.game)} Jar (Current Version: {this.state.currentVersion})
                    </label>
                    <input type="file" onChange={this.uploadBot} id={`hidden-new-file-${this.props.game}`} style={{display: "none"}}/>

                    {this.state.newVersion !== -1 && <div className="form-group">
                        <label htmlFor="exampleInputEmail1">Next Version Number</label>
                        <input type="number" step={0.01} className="form-control" id={`newVersionInput-${this.props.game}`}
                               aria-describedby="emailHelp" placeholder="Next Version" value={this.state.newVersion} onChange={this.setCustomVersion}/>
                        <small id="emailHelp" className="form-text text-muted">If you'd like to set a custom version number, do it here.
                            Otherwise it will be the current version + 0.01.
                        </small>
                    </div>}
                </div>
            )
        }
        return (
            <div>
                <label htmlFor={`hidden-new-file-${this.props.game}`} className="ui large basic label">
                    <strong>File
                        Name:</strong> {this.state.uploadedMod.name} ({Util.formatBytes(this.state.uploadedMod.size)})
                </label>
                <button className={"btn btn-danger"} onClick={this.clearUpload}>Reset Upload</button>
                <button className={"btn btn-success"} onClick={this.submitUpdate}>Submit Update</button>
            </div>);
    };

    render() {
        return (
            <div>
                {this.renderUpload()}
            </div>)
    }
}

