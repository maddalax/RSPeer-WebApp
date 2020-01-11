import React from 'react';

export class StoreSuccess extends React.Component<any, any> {


    render() {
        return <div>
            <h3>Your order has been successfully completed. You may now close this window.</h3>
            <p>Thank you for choosing RSPeer.</p>
            <h6>If you are purchasing tokens with Paypal, please allow up to 5-10 minutes for Paypal to send us a confirmation
            of the transaction to recieve your tokens.</h6>
        </div>
    }

}