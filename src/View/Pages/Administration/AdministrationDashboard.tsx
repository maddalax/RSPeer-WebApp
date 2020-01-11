import React from 'react';
import {OwnerPageWrapper} from "../../Components/OwnerPage/OwnerPageWrapper";
import {UpdateBot} from "./Bot/UpdateBot";
import {UpdateModScript} from "./Bot/UpdateModScript";
import {ObfuscateConfig} from "./Bot/ObfuscateConfig";
import {Game} from "../../../Models/ScriptDto";

export class AdministrationDashboard extends React.Component {

    render() {
       // @ts-ignore
        return <OwnerPageWrapper {...this.props}>
           <div className="card">
               <div className="card-header">
                   Update RSPeer 2007
               </div>
               <div className="card-body">
                   <UpdateBot game={Game.Osrs}/>
               </div>
           </div>
            <div className="card">
                <div className="card-header">
                    Update RSPeer Inuvation
                </div>
                <div className="card-body">
                    <UpdateBot game={Game.Rs3}/>
                </div>
            </div>
            <div className="card">
                <div className="card-header">
                    Update RSPeer Inuvation Updater
                </div>
                <div className="card-body">
                    <UpdateBot game={Game.Rs3Updater}/>
                </div>
            </div>
           <div className="card">
               <div className="card-header">
                   Update ModScript
               </div>
               <div className="card-body">
                   <UpdateModScript/>
               </div>
           </div>
           <div className="card">
               <div className="card-header">
                   Obfuscation Configuration
               </div>
               <div className="card-body">
                   <ObfuscateConfig/>
               </div>
           </div>
       </OwnerPageWrapper>
    }
}