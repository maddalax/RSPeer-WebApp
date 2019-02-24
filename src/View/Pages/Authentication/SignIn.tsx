import React from 'react';
import {ApiService} from "../../../Common/ApiService";
import {Util} from "../../../Utilities/Util";

type State = {
    email : string,
    password : string
    rememberMe : boolean
    error : string
    processing : boolean
}

export class SignIn extends React.Component<any, State> {

    private api : ApiService;

    constructor(props : any) {
        super(props);
        this.api = new ApiService({supressAlert : true});
        this.state = {
            email : '',
            password : '',
            rememberMe : false,
            error : '',
            processing : false
        }
    }

    private setEmail = (e : any) => {
        this.setState({email : e.target.value})
    };

    private setPassword = (e : any) => {
        this.setState({password : e.target.value})
    };

    private setKeepSignedIn = (e : any) => {
        this.setState({rememberMe : e.target.checked})
    };

    private signIn = async (e : any) => {
        e.preventDefault();
        if(this.state.processing) {
            return;
        }
        this.setState({processing : true, error : ''});
        await Util.sleep(1500);
        const session = await this.api.post("user/signIn", {
            email : this.state.email,
            password : this.state.password
        });
        this.setState({processing : false});
        if(session.error) {
            return this.setState({error : session.error});
        }

        localStorage.removeItem("session");

        if(this.state.rememberMe) {
            sessionStorage.removeItem("rspeer_session");
            localStorage.setItem("rspeer_session", session.token);
        } else {
            localStorage.removeItem("rspeer_session");
            sessionStorage.setItem("rspeer_session", session.token);
        }

        this.props.history.push('/');
    };

    render(): any {
        return (<div className="auth">
                <header id="auth-header">
                    <h2>
                        Sign Into RSPeer <span
                        className="sr-only">Sign In</span>
                    </h2>
                    <p> Don't have a account? <a href="auth-signup.html">Create One</a>
                    </p>
                </header>
                <form className="auth-form">
                    <div className={"form-group"}>
                       <span style={{color : '#ea6759'}}> {this.state.error}</span>
                    </div>
                    <div className="form-group">
                        <div className="form-label-group">
                            <input onChange={this.setEmail} type="email" id="inputUser" className="form-control" placeholder="Email Address" required
                                   autoFocus/> <label htmlFor="inputUser">Email</label>
                        </div>
                    </div>
                    <div className="form-group">
                        <div className="form-label-group">
                            <input onChange={this.setPassword} type="password" id="inputPassword" className="form-control" placeholder="Password"
                                   required/> <label htmlFor="inputPassword">Password</label>
                        </div>
                    </div>
                    <div className="form-group">
                        <button className="btn btn-lg btn-primary btn-block" type="submit" onClick={this.signIn}>
                            {this.state.processing ? 'Signing in...' : 'Sign in'}
                        </button>
                    </div>
                    <div className="form-group text-center">
                        <div className="custom-control custom-control-inline custom-checkbox">
                            <input onChange={this.setKeepSignedIn} type="checkbox" className="custom-control-input" id="remember-me"/> <label
                            className="custom-control-label" htmlFor="remember-me">Keep me sign in</label>
                        </div>
                    </div>
                    <div className="text-center pt-3">
                        <a href="auth-recovery-username.html" className="link">Forgot Username?</a> <span
                        className="mx-2">·</span> <a href="auth-recovery-password.html" className="link">Forgot
                        Password?</a>
                    </div>
                </form>
                <footer className="auth-footer"> © RSPeer 2019 All Rights Reserved. <a href="#">Privacy</a> and <a
                    href="#">Terms</a>
                </footer>
            </div>
        )
    }
}