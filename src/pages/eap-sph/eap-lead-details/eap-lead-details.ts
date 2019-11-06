import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams,Events } from 'ionic-angular';
import { appCommonMethods } from "../../../providers/appCommonMethods";
import { SqlServices } from "../../../providers/sqlService";
import { SyncServices } from "../../../providers/syncServices";
import * as moment from 'moment';
import async from 'async'; 
import { EapLeadChat } from "../../../pages/eap-sph/eap-lead-chat/eap-lead-chat";

declare var sessionUserGlobalData;

@Component({
  selector: 'eap-lead-details',
  templateUrl: 'eap-lead-details.html',
})
export class EapLeadDetails {
  busy:any;
  busyMessage:any="Please Wait..."; 
  paramsData:any={};
  projDetailData:any={};
  showChatBtn:boolean=true;
  leadId:any=0;
  chatbtnShowFlag:any=false;
  constructor(private events: Events,public navCtrl: NavController, public navParams: NavParams,private appCom:appCommonMethods,private sqlS:SqlServices,private syncS:SyncServices) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad NotificationProjectDetailPage');
    this.busy= this.initDisplayData();
  }

  initDisplayData(){
    return new Promise((resolve,reject)=>{
    this.paramsData = this.navParams.data;
      if(this.paramsData['leadId'] && this.paramsData['leadId']>0){
             let forName = this.paramsData['forName'];
             this.leadId=this.paramsData['leadId'];
             let queryProdReq=`SELECT * from eap_lead WHERE lead_id=${this.leadId}`;
             if(forName=='server'){
              queryProdReq=`SELECT * from eap_lead WHERE server_lead_id=${this.leadId}`;
             }
            console.log('queryProdReq',queryProdReq);
            this.sqlS.queryExecuteSql(queryProdReq,[]).then((resData:any)=>{
              if(resData.rows.length>0){
                let tempDisData = resData.rows.item(0);
                console.log('tempDisData',tempDisData)
                this.projDetailData=tempDisData;
                this.projDetailData['lead_photos']=JSON.parse(this.projDetailData['lead_photos']);
                this.projDetailData['segmentDetail'] =  JSON.parse(this.projDetailData['segmentDetail']);
                if(sessionUserGlobalData['userId']==this.projDetailData['assigned_sph'] && this.projDetailData['lead_support_ac']==1 && this.projDetailData['server_lead_id']>0){
                  this.chatbtnShowFlag=true;
                }  
               }
              resolve(true);
          },(error)=>{
              console.log('initDisplayData error',error);
              resolve(true);
          });
      }else{
        console.log('no data');
        reject(false);
      }

    }); 
}

openFile(file){
  this.appCom.fileOpen(file);
}
  leadChatShow(leadId,leadData){
    this.navCtrl.push(EapLeadChat,{leadId:leadId,leadData:leadData});
  }

}
