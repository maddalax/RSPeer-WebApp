import React from "react";
import {ApiService} from "../../../../Common/ApiService";
import {Alert} from "../../../../Utilities/Alert";
import {Util} from "../../../../Utilities/Util";

interface BotAd {
    Image: string;
    Redirect: string;
    Username: string;
    ExpirationDate: string;
    Meta: string;
    Expired: boolean;
    Enabled: boolean
}

interface State {
    ads: BotAd[],
    processing: boolean
}

export class AdministrationBotAds extends React.Component<any, State> {

    private api: ApiService;

    constructor(props: any) {
        super(props);
        this.api = new ApiService();
        this.state = {
            ads: [],
            processing: false
        }
    }

    async componentDidMount() {
        const ads = await this.api.get('botAd/list');
        if (Array.isArray(ads)) {
            this.setState({ads});
        }
    }

    private update = (e: any, ad: BotAd, field: string) => {
        const value = e.target.value;
        this.setState(prev => {
            const index = prev.ads.indexOf(ad);
            // @ts-ignore
            prev.ads[index][field] = value;
            return prev;
        })
    };

    private toggleEnabled = (ad: BotAd) => {
        this.setState(prev => {
            const index = prev.ads.indexOf(ad);
            // @ts-ignore
            prev.ads[index].Enabled = !prev.ads[index].Enabled;
            return prev;
        })
    };

    private save = async () => {
        if (!window.confirm('Are you sure you want to save?')) {
            return;
        }
        if (this.state.processing) {
            return;
        }
        this.setState({processing: true});
        try {
            const res = await this.api.post('botAd/save', this.state.ads);
            if (res.error) {
                Alert.show(res.error);
                return;
            }
            Alert.success("Successfully updated Bot Ads.");
        } finally {
            this.setState({processing: false});
        }
    };

    private newAd = async () => {
        const date = new Date(Date.now());
        date.setDate(date.getDate() + 30);
        this.setState(prev => {
            prev.ads.push({
                Image: '',
                Redirect: '',
                Username: '',
                ExpirationDate: Util.toDateInputValue(date.toString()),
                Meta: '',
                Expired: false,
                Enabled: false
            });
            return prev;
        })
    };

    render() {
        return <div>
            {this.state.ads.map(a => {
                return <div style={{marginTop: '3em'}}>
                    <img src={a.Image} alt={a.Image}/>
                    <br/>
                    <label><strong>Image Url</strong></label>
                    <input type="text" className="form-control"
                           value={a.Image}
                           aria-label="args" aria-describedby="basic-addon2"
                           onChange={(e) => this.update(e, a, 'Image')}/>

                    <label><strong>Redirect Url</strong></label>
                    <input type="text" className="form-control"
                           value={a.Redirect}
                           aria-label="args" aria-describedby="basic-addon2"
                           onChange={(e) => this.update(e, a, 'Redirect')}/>

                    <label><strong>RSPeer Username Of Ad Owner</strong></label>
                    <input type="text" className="form-control"
                           value={a.Username}
                           aria-label="args" aria-describedby="basic-addon2"
                           onChange={(e) => this.update(e, a, 'Username')}/>

                    <label><strong>Expiration Date</strong></label>
                    <input type="date" className="form-control"
                           value={Util.toDateInputValue(a.ExpirationDate)}
                           aria-label="args" aria-describedby="basic-addon2"
                           onChange={(e) => this.update(e, a, 'ExpirationDate')}/>

                    <label><strong>Expired: </strong>{a.Expired ? 'Yes' : 'No'}</label>
                    <br/>
                    {a.Enabled && <button onClick={() => this.toggleEnabled(a)} className="btn btn-danger" type="button" id="enable">
                        Disable Ad
                    </button>}
                    {!a.Enabled && <button onClick={() => this.toggleEnabled(a)} className="btn btn-success" type="button" id="enable">
                        Enable Ad
                    </button>}
                </div>
            })}
            <br/>
            <hr/>
            <button onClick={this.save} className="btn btn-success" type="button" id="saveChanges">
                Save Bot Ads
            </button>
            <button onClick={this.newAd} className="btn btn-primary" type="button" id="saveChanges">
                Add New Ad
            </button>
        </div>
    }
}