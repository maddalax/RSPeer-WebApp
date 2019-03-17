import React from 'react';
import {Editor} from '@tinymce/tinymce-react';

export class SiteContentManager extends React.Component<any, any> {
    
    private readonly apiKey = "tez0x23w314jxinxyuwzhlx69bcjtiimpmk8a2tvzknvohoy";

    constructor(props : any) {
        super(props);
        this.state = {
            content : ''
        }
    }
    
    onChange = (content : string) => {
        this.setState({ content });
    };


    render() {
        return <div>
            <Editor apiKey={this.apiKey} value={this.state.content} onEditorChange={this.onChange} />
        </div>
    }
    
}