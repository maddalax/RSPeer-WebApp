import React from 'react';
import {FileConstants, FileService} from "../../Services/File/FileService";

export class GettingStarted extends React.Component<any, any> {
    
    private readonly fileService : FileService;
    
    constructor(props : any) {
        super(props);
        this.fileService = new FileService();
        this.state = {
            content : 'Loading... please wait.'
        }
    }
    
    async componentDidMount() {
        const content = await this.fileService.getFile(FileConstants.GET_STARTED);
        this.setState({content});
    }
    
    render() {
        return <div>
           <div dangerouslySetInnerHTML={{__html: this.state.content}}/>
        </div>
    }
    
}