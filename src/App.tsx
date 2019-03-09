import React, {Component} from 'react';
import {HeaderWithRouter} from "./View/Components/Header";
import {AsideWithRouter} from "./View/Components/Sidebar/Aside";
import {Footer} from "./View/Components/Footer";
import {Routes} from "./Routes";
import {
   HashRouter
} from 'react-router-dom';
import {PageContainer} from "./PageContainer";

class App extends Component {
    render() {
        return (
            <React.Fragment>
                <div className="app">
                    <div id="modal"/>
                    <HashRouter>
                       <PageContainer>
                           <HeaderWithRouter/>
                           <AsideWithRouter/>
                           <Page/>
                       </PageContainer>
                    </HashRouter>
                </div>
            </React.Fragment>
        );
    }
}

class Page extends React.Component {

    render() {
        return (
            <main className="app-main">
                <div className="wrapper">
                    <div className="page">
                        <div id="alert-message"/>
                        <div className="page-inner">
                            {<Routes {...this.props}/>}
                        </div>
                    </div>
                </div>
                <Footer/>
            </main>
        );
    }

}

export default App;
