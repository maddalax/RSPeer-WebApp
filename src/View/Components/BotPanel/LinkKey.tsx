import React from 'react';
import {ApiService} from "../../../Common/ApiService";

export class LinkKey extends React.Component<any, any> {

    private readonly api: ApiService;

    constructor(props: any) {
        super(props);
        this.api = new ApiService();
        this.state = {
            key: '',
        };
    }

    async componentDidMount() {
        const key = await this.api.get('botLauncher/getKey');
        this.setState({key});
    }

    generateNewKey = async (e : any) => {
        e.preventDefault();
        const confirm = window.confirm("WARNING: This will stop all current launchers from being visible here until you re-install the launcher on each computer with the new key. Continue?");
        if (!confirm) {
            return;
        }
        const confirm2 = window.confirm("Click OK to change your key.");
        if (!confirm2) {
            return;
        }
        const key = await this.api.post('botLauncher/updateKey', {});
        this.setState({key});
    };

    render() {
        if (!this.props.user) {
            return <div>
                <p>You must login to see this.</p>
            </div>
        }
        return <div>
            <h4>Link Key</h4>
            <p>Use the key below when installing the RSPeer launcher on your computer to link it to the bot management
                panel.</p>
            <p>Do not share this key with other users.</p>
            <p>For instructions on how to use this key, go here: <a
                href="https://forums.rspeer.org/topic/539/bot-management-panel-how-to-use-link-key"
                target={"_blank"}>https://forums.rspeer.org/topic/539/bot-management-panel-how-to-use-link-key</a></p>
            <form className="form-inline">
                <div className="form-group mb-2">
                    <input style={{width: '400px'}} type="text" className="form-control" id="linkKeyInput"
                           readOnly={true}
                           placeholder="Loading..." value={this.state.key}/>
                </div>
                <button className="btn btn-dark mb-2" onClick={this.generateNewKey}>Generate New Key</button>
            </form>
        </div>
    }

}