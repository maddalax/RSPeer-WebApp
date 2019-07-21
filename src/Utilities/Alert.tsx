import React from "react";
import ReactDOM from "react-dom";
import {Modal} from "../View/Components/Utility/Modal";

export class Alert {

    private static removeAlert() {
        const container = document.getElementById('alert-message') as any;
        ReactDOM.unmountComponentAtNode(container);
    }
    
    public static show(message: any, timeout = 8000) {
        setTimeout(this.removeAlert, timeout);
        const container = document.getElementById('alert-message') as any;
        ReactDOM.render(
            <div className="page-message" role="warning">
                <i className="fas fa-exclamation-triangle"/>
                <span style={{marginLeft : '5px'}}>{message.toString()}</span>
                <a href="javascript:void(0)" onClick={this.removeAlert} className="btn btn-sm btn-icon btn-warning ml-1" aria-label="Close"
            ><span aria-hidden="true"><i
                className="fa fa-times"/></span></a>
            </div>,
            container
        );
    }

    public static showStatus(message: any) {
        if(!message) {
            return;
        }
        const container = document.getElementById('alert-message-status') as any;
        ReactDOM.render(
            <div className="alert alert-danger" role="alert" style={{backgroundColor : '#c35448', borderColor : '#c35448', color : '#ffffff'}}>
                {message.toString()}
            </div>,
            container
        );
    }

    public static success(message: any, timeout = 8000) {
        setTimeout(this.removeAlert, timeout);
        const container = document.getElementById('alert-message') as any;
        ReactDOM.render(
            <div className="page-message page-message-success" role="warning">
                <i className="fas fa-check-circle"/>
                <span style={{marginLeft : '5px'}}>{message.toString()}</span>
                <a href="javascript:void(0)" onClick={this.removeAlert} className="btn btn-sm btn-icon btn-success ml-1" aria-label="Close"
                ><span aria-hidden="true"><i
                    className="fa fa-times"/></span></a>
            </div>,
            container
        );
    }

    public static modal({title, body, onConfirm, onCancel, hideButtons, width = 100} : any) {
        const container = document.getElementById('modal') as any;
        ReactDOM.render(
            <Modal title={title} body={body} onConfirm={onConfirm} onCancel={onCancel} hideButtons={hideButtons} width={width}/>, 
            container
        );
    }
}