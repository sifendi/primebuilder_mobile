import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams,Events } from 'ionic-angular';
import { appCommonMethods } from "../../../providers/appCommonMethods";
import { SqlServices } from "../../../providers/sqlService";
import { SyncServices } from "../../../providers/syncServices";
import * as moment from 'moment';
import async from 'async'; 
declare var sessionUserGlobalData;
@Component({
  selector: 'eap-lead-chat',
  templateUrl: 'eap-lead-chat.html',
})
export class EapLeadChat {
  @ViewChild('chatMesage') chatMesage:any;
  busy:any;
  paramsData:any={};
  leadChatDatas:any=[];
  showChatTextBoxBtn:boolean=false;
  s_leadId:any=0;
  chatbtnShowFlag:any=false;
  chat_mesage:any;
  currentUserId:any=0;
  constructor(private events: Events,public navCtrl: NavController, public navParams: NavParams,private appCom:appCommonMethods,private sqlS:SqlServices,private syncS:SyncServices) {
    this.currentUserId=sessionUserGlobalData['userId']
  }


ionViewDidLoad() {
  console.log('ionViewDidLoad NotificationInquiryPage');
  this.leadChatDatas=[];
  this.busy= this.initDisplayData();
}

initDisplayData(){
  return new Promise((resolve,reject)=>{
     this.paramsData = this.navParams.data;
    if(this.paramsData['leadId'] && this.paramsData['leadId']>0){

      if(this.currentUserId==this.paramsData['leadData']['assigned_sph']){
        this.showChatTextBoxBtn=true;
      }

           this.s_leadId=this.paramsData['leadId'];
       //   let queryProdReq=`SELECT esc.*, el.assigned_sph, el.sphDetail  from eap_support_chat esc join eap_lead el on esc.server_chat_lead_id=el.server_lead_id WHERE esc.server_chat_lead_id=${this.s_leadId} ORDER BY chat_id DESC`;
       let queryProdReq=`SELECT esc.*, el.assigned_sph, el.sphDetail,el.created_by,el.created_by_name  from eap_support_chat esc join eap_lead el on esc.server_chat_lead_id=el.server_lead_id WHERE esc.server_chat_lead_id=${this.s_leadId} ORDER BY CASE WHEN server_chat_id = 0 THEN chat_id END DESC, CASE WHEN server_chat_id > 0 THEN server_chat_id END DESC`;
       console.log('queryProdReq',queryProdReq);
          this.sqlS.queryExecuteSql(queryProdReq,[]).then((resData:any)=>{
            if(resData.rows.length>0){
                    let tempDisDataAll = [];
                    let tempDisDataAllFinal:any = [];

                    

                    for(let i=0;i<resData.rows.length;i++){
                            let tempDisData = resData.rows.item(i);
                            tempDisData['sphDetail'] =  tempDisData['sphDetail']?JSON.parse(tempDisData['sphDetail']):[];
                            tempDisDataAllFinal.push(tempDisData);
                    }
                    this.leadChatDatas = tempDisDataAllFinal;
                    console.log('tempDisDataAllFinal',tempDisDataAllFinal);
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

submitChat(){
    if(this.chatMesage.valid){


      if(this.chat_mesage){
          if(this.chat_mesage.trim()==''){
            this.appCom.showAlert('Please enter valid message','ok',null);
            return false;
          }
      }

     //   this.appCom.showAlert('Submitted...','ok',null);
      this.busy=this.insertChatMessage().then(()=>{
        this.appCom.showAlert('Message Sent Successfully.','ok',null).then(()=>{
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
      this.appCom.showAlert('Please enter valid message','ok',null);
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
