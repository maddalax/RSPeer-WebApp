import React from 'react';
import {FileConstants, FileService} from "../../../Services/File/FileService";

export class PrivacyPolicy extends React.Component<any, any> {
    
    private readonly fileService : FileService;
    
    constructor(props : any) {
        super(props);
        this.fileService = new FileService();
        this.state = {
            policy : 'Loading...'
        }
    }
    
    async componentDidMount() {
        const policy = await this.fileService.getFile(FileConstants.PRIVACY_POLICY);
        this.setState({policy});
    }

    render() {
        return <div>
            <div dangerouslySetInnerHTML={{__html: this.state.policy}}/>
        </div>
    }
    
}