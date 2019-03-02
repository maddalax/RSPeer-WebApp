import React from 'react';
import {OwnerPageWrapper} from "../../Components/OwnerPage/OwnerPageWrapper";

export class AdministrationDashboard extends React.Component {

    render() {
       return <OwnerPageWrapper {...this.props}>
           <div>Dashboard</div>
       </OwnerPageWrapper>
    }
}