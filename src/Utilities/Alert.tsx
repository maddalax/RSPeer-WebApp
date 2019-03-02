import React from "react";
import ReactDOM from "react-dom";

export class Alert {

    private static removeAlert() {
        const container = document.getElementById('alert-message') as any;
        ReactDOM.unmountComponentAtNode(container);
    }

    public static show(message: string, timeout = 8000) {
        setTimeout(this.removeAlert, timeout);
        const container = document.getElementById('alert-message') as any;
        ReactDOM.render(
            <div className="page-message" role="warning">
                <i className="fas fa-exclamation-triangle"/>
                <span style={{marginLeft : '5px'}}>{message}</span>
                <a href="javascript:void(0)" onClick={this.removeAlert} className="btn btn-sm btn-icon btn-warning ml-1" aria-label="Close"
            ><span aria-hidden="true"><i
                className="fa fa-times"/></span></a>
            </div>,
            container
        );
    }

    public static success(message: string, timeout = 8000) {
        setTimeout(this.removeAlert, timeout);
        const container = document.getElementById('alert-message') as any;
        ReactDOM.render(
            <div className="page-message page-message-success" role="warning">
                <i className="fas fa-check-circle"/>
                <span style={{marginLeft : '5px'}}>{message}</span>
                <a href="javascript:void(0)" onClick={this.removeAlert} className="btn btn-sm btn-icon btn-success ml-1" aria-label="Close"
                ><span aria-hidden="true"><i
                    className="fa fa-times"/></span></a>
            </div>,
            container
        );
    }
}