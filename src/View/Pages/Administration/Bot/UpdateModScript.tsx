import React from "react";
import {ApiService} from "../../../../Common/ApiService";
import {Alert} from "../../../../Utilities/Alert";

export class UpdateModScript extends React.Component<any, any> {

    private readonly api: ApiService;

    constructor(props: any) {
        super(props);
        this.api = new ApiService();
        this.state = {
            uploadedMod: null,
            isUploading: false,
            currentVersion: 'Loading...'
        };
    }

    private formatBytes(a: any) {
        if (0 == a) return "0 Bytes";
        const c = 1024, d = 2, e = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"],
            f = Math.floor(Math.log(a) / Math.log(c));
        return parseFloat((a / Math.pow(c, f)).toFixed(d)) + " " + e[f]
    }

    uploadModScript = (event: any) => {
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
        const confirm = window.confirm("Please click ok to confirm the updating of the modscript with your selected file.");
        if (!confirm)
            return;
        this.setState({...this.state, isUploading: true});
        const formData = new FormData();
        formData.append("file", this.state.uploadedMod.file);
        const res = await this.api.post("adminBot/updateModScript", formData);
        this.setState({...this.state, isUploading: false});
        if (res.error) {
            return Alert.show(res.error);
        }
        Alert.success("Successfully updated modscript.");
        this.clearUpload();
    };

    renderUpload = () => {
        if (this.state.isUploading) {
            return <label htmlFor="update-modscript-hidden" className="ui primary button">
                Uploading... please wait.
            </label>
        }
        if (this.state.uploadedMod == null) {
            return (
                <div>
                    <label htmlFor="update-modscript-hidden" className="btn btn-primary">
                        <i className="cloud icon"/>
                        Click To Upload ModScript
                    </label>
                    <input type="file" onChange={this.uploadModScript} id="update-modscript-hidden" style={{display: "none"}}/>
                </div>
            )
        }
        return (
            <div>
                <label htmlFor="update-modscript-hidden" className="ui large basic label">
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
