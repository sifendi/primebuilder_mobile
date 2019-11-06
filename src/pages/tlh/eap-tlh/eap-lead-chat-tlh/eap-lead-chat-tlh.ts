import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams,Events } from 'ionic-angular';
import { appCommonMethods } from "../../../../providers/appCommonMethods";
import { SqlServices } from "../../../../providers/sqlService";
import { SyncServices } from "../../../../providers/syncServices";
import { Eap_support_chatApi }  from '../../../../shared/loopback_sdk';
import 'rxjs/add/operator/toPromise';
import * as moment from 'moment';
import * as _ from 'lodash';
import async from 'async'; 
declare var sessionUserGlobalData;
@Component({
  selector: 'eap-lead-chat-tlh',
  templateUrl: 'eap-lead-chat-tlh.html',
})
export class EapLeadChatTlh {
  @ViewChild('chatMesage') chatMesage:any;
  busy:any;
  paramsData:any={};
  leadChatDatas:any=[];
  leadChatLeadObj:any={};
  showChatTextBoxBtn:boolean=false;
  s_leadId:any=0;
  chatbtnShowFlag:any=false;
  chat_mesage:any;
  currentUserId:any=0;
  constructor(private events: Events,public navCtrl: NavController,private escApi:Eap_support_chatApi, public navParams: NavParams,private appCom:appCommonMethods,private sqlS:SqlServices,private syncS:SyncServices) {
    this.currentUserId=sessionUserGlobalData['userId'];
  }


ionViewDidLoad() {
  console.log('ionViewDidLoad NotificationInquiryPage');
  this.leadChatDatas=[];
  this.busy= this.initDisplayData();

}

async initDisplayData(){
  return new Promise(async(resolve,reject)=>{
     this.paramsData = this.navParams.data;
    if(this.paramsData['leadId'] && this.paramsData['leadId']>0){
          if(this.currentUserId==this.paramsData['leadData']['assigned_sph']){
            this.showChatTextBoxBtn=true;
          }
          this.s_leadId=this.paramsData['leadId'];
          this.leadChatLeadObj = this.paramsData['leadData'];
          let allLeadsChatData:any = [];
          let filterDataH= {};
          filterDataH['chat_lead_id']=this.s_leadId;
          allLeadsChatData = await this.escApi.geteapSupportChat(filterDataH).toPromise().catch((reson)=>{return false;})
          if(allLeadsChatData==false){
            resolve(true);
            return false;
          }
          let responseResults = allLeadsChatData['result'];
          if(responseResults.length>0){
              let tempDisDataAll = [];
              let tempDisDataAllFinal:any = [];
              for(let i=0;i<responseResults.length;i++){
                      let tempDisData = responseResults[i];
                      tempDisDataAllFinal.push(tempDisData);
              }
             this.leadChatDatas= _.orderBy(tempDisDataAllFinal,'chat_id','desc');
          }
          resolve(true);

          

    }else{
      console.log('no data');
      reject(false);
    }

  }); 
}

submitChat(){
    if(this.chatMesage.valid){


      if(this.chat_mesage){
          if(this.chat_mesage.trim()==''){
            this.appCom.showAlert('Plase ente valid message','ok',null);
            return false;
          }
      }

     //   this.appCom.showAlert('Submitted...','ok',null);
      this.busy=this.insertChatMessage().then(()=>{
        this.appCom.showAlert('Message Send Successfully.','ok',null).then(()=>{
          this.leadChatDatas=[];
          this.busy= this.initDisplayData();
          this.chat_mesage=null;
          setTimeout(()=>{
            this.events.publish('globalSync');
          },100);
        });
      },(error)=>{
        this.appCom.showAlert('Something went wrong.','ok',null);
      });
    }else{
        this.appCom.showAlert('Plase ente valid message','ok',null);
    }
}

insertChatMessage(){
  return new Promise((resolve,reject)=>{
    let insertData = {};
    insertData['chat_from_id']=this.currentUserId;
    insertData['chat_mesage']=this.chat_mesage;
    insertData['chat_lead_id']=this.paramsData['leadData']['lead_id'];
    insertData['server_chat_lead_id']=this.paramsData['leadData']['server_lead_id'];
    insertData['status']=1;
    insertData['sync_status']=0;
    let currentTime = this.appCom.getCurrentTimeStamp();
    insertData['local_created_date']=currentTime;
    insertData['local_updated_date']=currentTime;
    this.sqlS.insertData(insertData,'eap_support_chat').then((resD:any)=>{
      resolve(true);
    },(error)=>{
      console.log('insertChatMessage',error);
      reject(false);
    });

  });
}
}
