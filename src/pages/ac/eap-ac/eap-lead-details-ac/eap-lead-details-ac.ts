import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams,Events } from 'ionic-angular';
import { appCommonMethods } from "../../../../providers/appCommonMethods";
import { SqlServices } from "../../../../providers/sqlService";
import { SyncServices } from "../../../../providers/syncServices";
import { Eap_leadApi }  from '../../../../shared/loopback_sdk';
import 'rxjs/add/operator/toPromise';
import * as moment from 'moment';
import async from 'async'; 
import { EapLeadChatAc } from "../eap-lead-chat-ac/eap-lead-chat-ac";

declare var sessionUserGlobalData;

@Component({
  selector: 'eap-lead-details-ac',
  templateUrl: 'eap-lead-details-ac.html',
})
export class EapLeadDetailsAc {

  busy:any;
  busyMessage:any="Please Wait..."; 
  paramsData:any={};
  projDetailData:any={};
  showChatBtn:boolean=true;
  leadId:any=0;
  chatbtnShowFlag:any=false;
  constructor(private events: Events,public navCtrl: NavController, public navParams: NavParams,private appCom:appCommonMethods,private sqlS:SqlServices,private syncS:SyncServices,private elApi:Eap_leadApi) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad NotificationProjectDetailPage');
    this.busy= this.initDisplayData();
  }

  async initDisplayData(){
    return new Promise(async(resolve,reject)=>{
    this.paramsData = this.navParams.data;
      if(this.paramsData['leadId'] && this.paramsData['leadId']>0){
        this.leadId=this.paramsData['leadId'];
        let forName =this.paramsData['forName'];
        if(forName=='server'){
          let respGetLead:any = await this.getDetailsLeadData(this.leadId).catch((reson)=>{console.log('reson',reson)});;
         
          resolve(true);
        }else{
           this.projDetailData=this.paramsData['leadData'];
          if(this.projDetailData['assigned_sph']>0 && this.projDetailData['lead_support_ac']==1 && this.projDetailData['lead_id']>0){
            this.chatbtnShowFlag=true;
          }  
          resolve(true);
        }
       
      }else{
        console.log('no data');
        reject(false);
      }

    }); 
}
async getDetailsLeadData(lead_id){
  return new Promise(async(resolve,reject)=>{
         let allLeadsData:any = [];
         let filterDataH= {};
         filterDataH['lead_id']=lead_id;
         allLeadsData = await this.elApi.getLead(filterDataH).toPromise().catch((reson)=>{return false;})
         if(allLeadsData==false){
           resolve(true);
           return false;
         }
         let responseResults = allLeadsData['result'];
         if(responseResults.length>0){
             let tempDisDataAll = [];
             let tempDisDataAllFinal:any = [];
             for(let i=0;i<responseResults.length;i++){
                     let tempDisData = responseResults[i];
                     tempDisData['lead_photos'] = tempDisData['lead_photos']?JSON.parse(tempDisData['lead_photos']):[];
                     tempDisDataAllFinal.push(tempDisData);
             }
             this.projDetailData=tempDisDataAllFinal[0]?tempDisDataAllFinal[0]:{};
             if(this.projDetailData['assigned_sph']>0 && this.projDetailData['lead_support_ac']==1 && this.projDetailData['lead_id']>0){
              this.chatbtnShowFlag=true;
            } 
         }
         resolve(true);
    });
}
openFile(file){
  this.appCom.onlineFileOpen(file);
}
leadChatShow(leadId,leadData){
    this.navCtrl.push(EapLeadChatAc,{leadId:leadId,leadData:leadData});
  }

}
