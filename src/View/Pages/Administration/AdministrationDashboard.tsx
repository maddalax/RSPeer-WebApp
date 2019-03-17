import React from 'react';
import {OwnerPageWrapper} from "../../Components/OwnerPage/OwnerPageWrapper";
import {UpdateBot} from "./Bot/UpdateBot";
import {UpdateModScript} from "./Bot/UpdateModScript";
import {ObfuscateConfig} from "./Bot/ObfuscateConfig";
import { Editor } from '@tinymce/tinymce-react';
import {SiteContentManager} from "./SiteContentManager";

export class AdministrationDashboard extends React.Component {

    render() {
       // @ts-ignore
        return <OwnerPageWrapper {...this.props}>
           <div className="card">
               <div className="card-header">
                   Update Bot
               </div>
               <div className="card-body">
                   <UpdateBot/>
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
           <div className="card">
               <div className="card-header">
                   Test
               </div>
               <div className="card-body">
                <SiteContentManager/>
               </div>
           </div>
           
       </OwnerPageWrapper>
    }
}