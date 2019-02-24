import React from 'react';

export class Footer extends React.Component {

    render(): any {
        return (
            <footer className="app-footer">
                <ul className="list-inline">
                    <li className="list-inline-item">
                        <a className="text-muted" href="#">Support</a>
                    </li>
                    <li className="list-inline-item">
                        <a className="text-muted" href="#">Help Center</a>
                    </li>
                    <li className="list-inline-item">
                        <a className="text-muted" href="#">Privacy</a>
                    </li>
                    <li className="list-inline-item">
                        <a className="text-muted" href="#">Terms of Service</a>
                    </li>
                </ul>
                <div className="copyright"> Copyright © 2018. All right reserved. </div>
            </footer>
        );
    }

}