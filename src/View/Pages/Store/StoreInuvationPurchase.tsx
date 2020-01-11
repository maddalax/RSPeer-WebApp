import * as React from "react";

export class StoreInuvationPurchase extends React.Component<any, any> {

    constructor(props: any) {
        super(props);
    }

    render() {
        return <React.Fragment>
            <div style={{color : '#f7c46c', backgroundColor : '#222230', borderColor : '#f7c46c'}} className="alert alert-primary" role="alert">
                <h5>Inuvation is shutting down on December 16th, 2019 and is no longer purchaseable.</h5>
                <h5><a href={"https://discourse.rspeer.org/t/inuvation-endgame/2877"} target={"_blank"}>More Details</a></h5>
            </div>
        </React.Fragment>
    }

}