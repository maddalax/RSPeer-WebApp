import React from 'react';
import {Alert} from "../../Utilities/Alert";
import {PrivacyPolicy} from "../Pages/Other/PrivacyPolicy";

export class Footer extends React.Component {

    render(): any {
        return (
            <footer className="app-footer">
                <ul className="list-inline">
                    <li className="list-inline-item">
                        <a className="text-muted" href="javascript:void(0)" onClick={() => {
                            Alert.modal({
                                body : <PrivacyPolicy/>
                            })
                        }}>Privacy Policy</a>
                    </li>
                </ul>
                <div className="copyright"> Copyright © RSPeer 2019. All right reserved. </div>
            </footer>
        );
    }

}