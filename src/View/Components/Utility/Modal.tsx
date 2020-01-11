import React from 'react';
import ReactDOM from "react-dom";

type Props = {
    body: any,
    onConfirm: () => any,
    onCancel: () => any
    title : any,
    hideButtons : boolean,
    width : number
}

type State = {
    processing : boolean
}

export class Modal extends React.Component<Props, State> {
    
    constructor(props : Props) {
        super(props);
        this.state = {
            processing : false
        }
    }
    
    private onCancel = async () => {
        if(this.props.onCancel) {
            this.setState({processing : true});
            await this.props.onCancel();
            this.setState({processing : false});
        }
        Modal.removeModal();
    };
    
    private onConfirm = async () => {
        if(this.props.onConfirm) {
            this.setState({processing : true});
            await this.props.onConfirm();
            this.setState({processing : false});
        }
        Modal.removeModal();
    };

    public static removeModal = () => {
        const container = document.getElementById('modal') as any;
        ReactDOM.unmountComponentAtNode(container);
    };
    
    render() {
        return <div>
            <div style={{display : 'block', opacity : 100}} className="modal fade" id="exampleModalCenter" tabIndex={-1} role="dialog">
                <div className="modal-dialog modal-dialog-centered" role="document" style={{maxWidth : '80%', width : `${this.props.width}%`}}>
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title" id="exampleModalCenterTitle">{this.props.title}</h5>
                            <button type="button" className="close" onClick={this.onCancel} data-dismiss="modal" aria-label="Close">
                                <span>×</span>
                            </button>
                        </div>
                        <div className="modal-body">
                            {this.props.body}
                        </div>
                        {!this.props.hideButtons && <React.Fragment>
                            {!this.state.processing && <div className="modal-footer">
                                <button onClick={this.onCancel} type="button" className="btn btn-secondary" data-dismiss="modal">Cancel</button>
                                <button onClick={this.onConfirm} type="button" className="btn btn-primary">OK</button>
                            </div>}
                            {this.state.processing && <div className="modal-footer">
                                <button type="button" className="btn btn-primary">Processing...</button>
                            </div>}
                        </React.Fragment>}
                    </div>
                </div>
            </div>
        </div>
    }
}