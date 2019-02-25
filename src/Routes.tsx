import React from 'react';
import {
    Route, Switch
} from 'react-router-dom';
import {Dashboard} from "./View/Pages/Dashboard";
import {ScriptRepositoryDashboard} from "./View/Pages/ScriptRepository/ScriptRepositoryDashboard";
import {SignIn} from "./View/Pages/Authentication/SignIn";
import {StoreDashboard} from "./View/Pages/Store/StoreDashboard";
import {StoreCheckout} from "./View/Pages/Store/StoreCheckout";
import {StoreSuccess} from "./View/Pages/Store/StoreSuccess";
import {StoreProcess} from "./View/Pages/Store/StoreProcess";

export class Routes extends React.Component {

    componentDidMount(): void {
        console.log("ROUTER" , this.props);
    }

    render() : any {
        return (
            <Switch>
                <Route exact path={`/`} component={(props : any) => <Dashboard {...props} {...this.props}/>}/>
                <Route exact path={`/login`} component={(props : any) => <SignIn {...props} {...this.props}/>}/>
                <Route exact path={`/scripts`} component={(props : any) => <ScriptRepositoryDashboard {...props} {...this.props}/>}/>
                <Route exact path={`/store`} component={(props : any) => <StoreDashboard {...props} {...this.props}/>}/>
                <Route exact path={`/store/checkout`} component={(props : any) => <StoreCheckout {...props} {...this.props}/>}/>
                <Route exact path={`/store/success`} component={(props : any) => <StoreSuccess {...props} {...this.props}/>}/>
                <Route exact path={`/store/process`} component={(props : any) => <StoreProcess {...props} {...this.props}/>}/>
            </Switch>
        )
    }
}
