import React, {Component} from 'react';
import {HeaderWithRouter} from "./View/Components/Header";
import {AsideWithRouter} from "./View/Components/Sidebar/Aside";
import {Footer} from "./View/Components/Footer";
import {Routes} from "./Routes";
import {
   HashRouter
} from 'react-router-dom';

class App extends Component {
    render() {
        return (
            <React.Fragment>
                <div className="app">
                    <HashRouter>
                       <React.Fragment>
                           <HeaderWithRouter username={"MadDev"}/>
                           <AsideWithRouter/>
                           <main className="app-main">
                               <div className="wrapper">
                                   <div className="page">
                                       <div id="alert-message"/>
                                       <div className="page-inner">
                                           <Routes/>
                                       </div>
                                   </div>
                               </div>
                               <Footer/>
                           </main>
                       </React.Fragment>
                    </HashRouter>
                </div>
            </React.Fragment>
        );
    }
}

export default App;
