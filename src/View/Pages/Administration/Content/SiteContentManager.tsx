import React from 'react';
import {Editor} from '@tinymce/tinymce-react';
import {FileConstants, FileService} from "../../../../Services/File/FileService";

export class SiteContentManager extends React.Component<any, any> {

    private readonly apiKey = "tez0x23w314jxinxyuwzhlx69bcjtiimpmk8a2tvzknvohoy";
    private readonly fileService: FileService;

    constructor(props: any) {
        super(props);
        this.fileService = new FileService();
        this.state = {
            content: {}
        }
    }

    async componentDidMount() {
        const recentNews = await this.fileService.getFile(FileConstants.DASHBOARD_RECENT_NEWS);
        const quickLinks = await this.fileService.getFile(FileConstants.DASHBOARD_QUICK_LINKS);
        const privacyPolicy = await this.fileService.getFile(FileConstants.PRIVACY_POLICY);
        const getStarted = await this.fileService.getFile(FileConstants.GET_STARTED);
        const store = await this.fileService.getFile(FileConstants.STORE);
        this.setState((prev: any) => {
            prev.content[FileConstants.DASHBOARD_RECENT_NEWS] = recentNews;
            prev.content[FileConstants.DASHBOARD_QUICK_LINKS] = quickLinks;
            prev.content[FileConstants.PRIVACY_POLICY] = privacyPolicy;
            prev.content[FileConstants.GET_STARTED] = getStarted;
            prev.content[FileConstants.STORE] = store;
            return prev;
        })
    }

    onSave = async (e: any, name: string) => {
        e.preventDefault();
        await this.fileService.saveFile(name, this.state.content[name])
    };

    onChange = (name: string, content: string) => {
        this.setState((prev: any) => {
            prev.content[name] = content;
            return prev;
        })
    };


    private buildEditor = (label : string, name : string) => {
        return <div className="card">
            <div className="card-header">
                {label}
            </div>
            <div className="card-body">
                <Editor apiKey={this.apiKey} value={this.state.content[name]}
                        onEditorChange={(content : any) =>
                            this.onChange(name, content)}/>
                <br/>
                <button onClick={(e) => this.onSave(e, name)}
                        className={"btn btn-primary"}>Save {label}
                </button>
            </div>
        </div>
    };
    
    render() {
        return <div>
            {this.buildEditor("Dashboard Recent News", FileConstants.DASHBOARD_RECENT_NEWS)}
            {this.buildEditor("Quick Links", FileConstants.DASHBOARD_QUICK_LINKS)}
            {this.buildEditor("Privacy Policy", FileConstants.PRIVACY_POLICY)}
            {this.buildEditor("Getting Started", FileConstants.GET_STARTED)}
            {this.buildEditor("Store", FileConstants.STORE)}
        </div>
    }

}