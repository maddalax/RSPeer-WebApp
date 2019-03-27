import React from 'react';
import {ApiService} from "../../../../Common/ApiService";
import {Alert} from "../../../../Utilities/Alert";

export class UpdateBot extends React.Component<any, any> {

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

    private formatBytes(a: any) {
        if (0 == a) return "0 Bytes";
        const c = 1024, d = 2, e = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"],
            f = Math.floor(Math.log(a) / Math.log(c));
        return parseFloat((a / Math.pow(c, f)).toFixed(d)) + " " + e[f]
    }
    
    setCustomVersion = (e : any) => {
        this.setState({newVersion : e.target.value});
    };

    setCurrentVersion = async () => {
        const version = await this.api.get("bot/currentVersionRaw");
        const parsed = parseFloat(version).toFixed(2);
        const newVersion = parseFloat(version + 0.01).toFixed(2);
        this.setState({currentVersion: parsed, newVersion : newVersion});
    };

    uploadBot = (event: any) => {
        let file = event.target.files[0];
        if (!file)
            return;

        if (file.name.indexOf('.jar') === -1) {
            return Alert.show("File must be a .jar.")
        }

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
        const confirm = window.confirm("Please click ok to confirm the updating of the bot with your selected file.");
        if (!confirm)
            return;
        this.setState({...this.state, isUploading: true});
        const formData = new FormData();
        formData.append("file", this.state.uploadedMod.file);
        const res = await this.api.post(`adminBot/updateBot?silent=false&version=${this.state.newVersion}`, formData);
        this.setState({...this.state, isUploading: false});
        if (res.error) {
            return Alert.show(res.error);
        }
        this.setCurrentVersion();
        Alert.success("Successfully updated bot.");
        this.clearUpload();
    };

    renderUpload = () => {
        if (this.state.isUploading) {
            return <label htmlFor="hidden-new-file" className="ui primary button">
                Uploading... please wait.
            </label>
        }
        if (this.state.uploadedMod == null) {
            return (
                <div>
                    <label htmlFor="hidden-new-file" className="btn btn-primary">
                        <i className="cloud icon"/>
                        Click To Upload Bot Jar (Current Version: {this.state.currentVersion})
                    </label>
                    <input type="file" onChange={this.uploadBot} id="hidden-new-file" style={{display: "none"}}/>

                    {this.state.newVersion !== -1 && <div className="form-group">
                        <label htmlFor="exampleInputEmail1">Next Version Number</label>
                        <input type="number" step={0.01} className="form-control" id="newVersionInput"
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
                <label htmlFor="hidden-new-file" className="ui large basic label">
                    <strong>File
                        Name:</strong> {this.state.uploadedMod.name} ({this.formatBytes(this.state.uploadedMod.size)})
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

