import React from 'react';
import {
    Route, Switch
} from 'react-router-dom';
import {Dashboard} from "./View/Pages/Dashboard";
import {ScriptRepositoryDashboard} from "./View/Pages/ScriptRepository/ScriptRepositoryDashboard";
import {SignIn} from "./View/Pages/Authentication/SignIn";

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
            </Switch>
        )
    }
}
