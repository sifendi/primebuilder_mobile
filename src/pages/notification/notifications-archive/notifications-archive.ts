import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams,App,Events } from 'ionic-angular';
import { App_notification_centerApi  }  from '../../../shared/loopback_sdk';
import { appCommonMethods } from '../../../providers/appCommonMethods';
import { SqlServices } from '../../../providers/sqlService';
import { ALL_MESSAGE,ALL_CONSTANTS } from '../../../providers/constant';
import { TlhProjectDetailPage } from "../../tlh/tlh-project-detail/tlh-project-detail";
import { ProjectDetailsPage } from "../../project/project-details/project-details";
import { ProjectParentTabsPage } from "../../project/project-parent-tab-page/project-parent-tab-page";
import { ProductReceiptsDetailsPage } from '../../product-receipts/product-receipts-details/product-receipts-details';
import { AcReceiptDetailsPage } from "../../ac/receipt-details/receipt-details";
import { TlhReceiptDetailPage } from "../../tlh/tlh-receipt-detail/tlh-receipt-detail";
/* SPH */
import { EapLeadDetails } from "../../../pages/eap-sph/eap-lead-details/eap-lead-details";
/* TLH  */
import { EapLeadDetailsTlh } from "../../../pages/tlh/eap-tlh/eap-lead-details-tlh/eap-lead-details-tlh";
/* AC */
import { EapLeadDetailsAc } from "../../../pages/ac/eap-ac/eap-lead-details-ac/eap-lead-details-ac";
import { HpbParentTabsPage } from "../../hpb-pages/hpb-parent-tab-page/hpb-parent-tab-page";

import * as moment from 'moment';
import async from 'async'; 
declare var globalSyncInProgressFlag;
declare var sessionUserGlobalData;
declare var cordova;
declare var globalInternetCheckConnection;
@Component({
  selector: 'page-notifications-archive',
  templateUrl: 'notifications-archive.html',
})
export class NotificationsArchivePage {
  busy:any;
  busyMessage:any="Please Wait...";
  role:any;
  currentUserSessionData:any={};
  finalRole:any=null;
  all_notify_type:any=[];
  notificationDatas:any=[];
  all_notify_type_view_not:any=[];
  constructor(public navCtrl: NavController,public events:Events,public app :App, public navParams: NavParams,public appCom:appCommonMethods,private appNotifyCenApi:App_notification_centerApi,private sqlS:SqlServices) {
    this.currentUserSessionData=sessionUserGlobalData;
    this.all_notify_type=ALL_CONSTANTS.ALL_NOTIFICATIONS_TYPES;
    this.all_notify_type_view_not=ALL_CONSTANTS.ALL_NOTIFICATIONS_TYPES_VIEW_NOT;
    this.role = sessionUserGlobalData['user']['roles'][0]['name'];
    if(this.role=='$ac' && ( !this.currentUserSessionData['userIdG'] || this.currentUserSessionData['userId'] == this.currentUserSessionData['userIdG'] ) ){
      this.finalRole='$ac';
    }else if(this.role=='$tlh' && ( !this.currentUserSessionData['userIdG'] || this.currentUserSessionData['userId'] == this.currentUserSessionData['userIdG'] ) ){
      this.finalRole='$tlh';
    }else if(this.role=='$sph' || (this.currentUserSessionData['userId'] != this.currentUserSessionData['userIdG'] && this.currentUserSessionData['userIdG'] )){
      this.finalRole='$sph';
    }
  }

  ionViewDidEnter(){
      setTimeout(()=>{
        this.initData();
      },100)
  }

 initData() {
    console.log('ionViewDidLoad NotificationsNewPage',this.finalRole);
      if(this.finalRole=='$tlh' || this.finalRole=='$ac'){
       this.notificationNewLoadIfTLHAC();
      }else if(this.finalRole=='$sph'){
        this.notificationNewLoadIfSPH();
      }
  }

  notificationNewLoadIfTLHAC(){

      this.busy=this.appNotifyCenApi.getNotifications(null,this.currentUserSessionData['userId'],null,"1").subscribe((respResult:any)=>{
        console.log('respResult',respResult);
        this.notificationDatas=[];
        if(respResult['result']){
          this.notificationDatas=respResult['result'];
        }
      },(error)=>{
          this.notificationDatas=[];
          console.log('error',error);
      });

  }

  notificationNewLoadIfSPH(){
     console.log('notificationNewLoadIfSPH');

      let projectFileds=" pm.project_photo,pm.hpb_digital_sign,pm.hpb_id,pm.server_hpb_id,pm.project_completion_date,pm.project_quantity_estimation,pm.project_address,pm.project_stage,pm.project_stage_mid,pm.project_sub_district,pm.project_pincode,pm.is_srku,pm.srku_owner_name,pm.srku_owner_address,pm.srku_owner_mobile_no,pm.non_micro_credit_type,pm.non_micro_credit_type_mid,pm.bank_name,pm.nmc_document,pm.bank_document,pm.assigned_to,pm.created_by,pm.updated_by,pm.sync_status,pm.status,pm.local_created_date,pm.local_updated_date,pm.project_id,pm.server_project_id,pm.project_name,pm.project_address,pm.is_srku ";
      let query="SELECT DISTINCT nc.server_ntc_id, nc.*,prm.receipt_id, "+projectFileds+" FROM notification_center nc LEFT JOIN product_receipt_master prm on  nc.ntc_type_id=prm.server_receipt_id LEFT JOIN project_master pm on nc.ntc_type_id=pm.server_project_id WHERE nc.ntc_user_read_flag=1 AND nc.status=1 ORDER BY nc.created_date DESC";
   
      this.busy=this.sqlS.queryExecuteSql(query,[]).then((resData:any)=>{
          let tempDisData=[];
          this.notificationDatas=[];
          for(let i=0;i<resData.rows.length;i++){
              tempDisData.push(resData.rows.item(i)); 
          }
          console.log('tempDisData',tempDisData);
          setTimeout(()=>{
            this.notificationDatas=tempDisData;
          },10)
      
      },(error)=>{
          this.notificationDatas=[];
          console.log('error',error);
      });
  }

  notificationDismiss(notificationObj){
    if(this.finalRole=='$tlh' || this.finalRole=='$ac'){
      let ntc_id=notificationObj['ntc_id'];
      let dataArrObj={};
      dataArrObj['ntc_user_read_flag']=1;
      dataArrObj['status']=0;
      this.busy=this.appNotifyCenApi.addEditNotifications(dataArrObj,ntc_id).subscribe((respResult:any)=>{
        this.notificationNewLoadIfTLHAC();
        this.events.publish('notificationCountSet');
      },(error)=>{
        this.notificationNewLoadIfTLHAC();
          console.log('error',error);
      });
    }else if(this.finalRole=='$sph'){
      
      let ntc_id=notificationObj['server_ntc_id'];
      let query="UPDATE notification_center SET ntc_user_read_flag=1,status=0,sync_status=0 WHERE server_ntc_id="+ntc_id;
      this.busy=this.sqlS.queryExecuteSql(query,[]).then((respResult:any)=>{
          this.notificationNewLoadIfSPH();
          this.events.publish('notificationCountSet');
      },(error)=>{
          this.notificationNewLoadIfSPH();
          console.log('error',error);
      });

    }
  
  }

  notificationView(notificationObj){
       console.log('notificationObj',notificationObj);
        let projectPageFlag=notificationObj['ntc_type']=="srku_project_added" || notificationObj['ntc_type']=="srku_project_updated" || notificationObj['ntc_type']=="srku_project_approved" || notificationObj['ntc_type']=="srku_project_reject";      
        let recieptPageFlag=notificationObj['ntc_type']=="project_receipt_added" || notificationObj['ntc_type']=="project_receipt_added_quantity_x" || notificationObj['ntc_type']=="project_receipt_added_completed_date"
        || notificationObj['ntc_type']=="project_receipt_added_quantity_estimation" ||  notificationObj['ntc_type']=="project_receipt_updated" 
        || notificationObj['ntc_type']=="project_receipt_updated"
        || notificationObj['ntc_type']=="project_receipt_updated_quantity_x"
        ||  notificationObj['ntc_type']=="project_receipt_updated_completed_date"
        || notificationObj['ntc_type']=="project_receipt_updated_quantity_estimation"
        || notificationObj['ntc_type']=="project_receipt_approved" 
        || notificationObj['ntc_type']=="project_receipt_reject";
        let eapLeadFlag=notificationObj['ntc_type']=="eap_lead_added" || notificationObj['ntc_type']=="eap_lead_support_assignment_added" || notificationObj['ntc_type']=="eap_lead_chat_added_eap" || notificationObj['ntc_type']=="eap_lead_chat_added_sph";
        let hpbeditflag = notificationObj['ntc_type']=="hpb_mobile_username_approved" || notificationObj['ntc_type']=="hpb_card_number_approved" || notificationObj['ntc_type']=="hpb_mobile_username_reject" || notificationObj['ntc_type']=="hpb_card_number_reject";

        if(this.finalRole=='$tlh' || this.finalRole=='$ac'){
    
          if(projectPageFlag && this.finalRole=='$tlh'){
    
            this.app.getRootNav().push(TlhProjectDetailPage,{
              "projectId":notificationObj['ntc_type_id']
            }).then(()=>{
                let ntc_id=notificationObj['ntc_id'];
                let dataArrObj={};
                dataArrObj['ntc_user_read_flag']=1;
                this.busy=this.appNotifyCenApi.addEditNotifications(dataArrObj,ntc_id).subscribe((respResult:any)=>{
                  this.notificationNewLoadIfTLHAC();
                  this.events.publish('notificationCountSet');
                },(error)=>{
                  this.notificationNewLoadIfTLHAC();
                    console.log('error',error);
                });
            });
    
          }else if(recieptPageFlag && this.finalRole=='$tlh'){
            
              this.app.getRootNav().push(TlhReceiptDetailPage,{
                "receiptId":notificationObj['ntc_type_id']
              }).then(()=>{
                  let ntc_id=notificationObj['ntc_id'];
                  let dataArrObj={};
                  dataArrObj['ntc_user_read_flag']=1;
                  this.busy=this.appNotifyCenApi.addEditNotifications(dataArrObj,ntc_id).subscribe((respResult:any)=>{
                    this.notificationNewLoadIfTLHAC();
                    this.events.publish('notificationCountSet');
                  },(error)=>{
                    this.notificationNewLoadIfTLHAC();
                      console.log('error',error);
                  });
              });
          }else if(recieptPageFlag && this.finalRole=='$ac'){
                this.app.getRootNav().push(AcReceiptDetailsPage,{
                  "receiptId":notificationObj['ntc_type_id']
                }).then(()=>{
                    let ntc_id=notificationObj['ntc_id'];
                    let dataArrObj={};
                    dataArrObj['ntc_user_read_flag']=1;
                    this.busy=this.appNotifyCenApi.addEditNotifications(dataArrObj,ntc_id).subscribe((respResult:any)=>{
                      this.notificationNewLoadIfTLHAC();
                      this.events.publish('notificationCountSet');
                    },(error)=>{
                      this.notificationNewLoadIfTLHAC();
                        console.log('error',error);
                    });
                });
          }else if(eapLeadFlag && (this.finalRole=='$tlh' || this.finalRole=='$ac')){
            // Leads

            let leadId=0;
            leadId=notificationObj['ntc_type_id'];

            if(notificationObj['ntc_type']=="eap_lead_support_assignment_added"){
              let dataN =notificationObj['ntc_type_data']?JSON.parse(notificationObj['ntc_type_data']):{};
              leadId = dataN['lead_id'];
            }else if(notificationObj['ntc_type']=="eap_lead_chat_added_eap" || notificationObj['ntc_type']=="eap_lead_chat_added_sph"){
              let dataN =notificationObj['ntc_type_data']?JSON.parse(notificationObj['ntc_type_data']):{};
              leadId = dataN['chat_lead_id'];
            }
          
            if(this.finalRole=='$tlh'){
              this.app.getRootNav().push(EapLeadDetailsTlh,{
                "forName":'server',
                'leadId':leadId
              }).then(()=>{
    
                let ntc_id=notificationObj['ntc_id'];
                let dataArrObj={};
                dataArrObj['ntc_user_read_flag']=1;
                this.busy=this.appNotifyCenApi.addEditNotifications(dataArrObj,ntc_id).subscribe((respResult:any)=>{
                  this.notificationNewLoadIfTLHAC();
                  this.events.publish('notificationCountSet');
                },(error)=>{
                  this.notificationNewLoadIfTLHAC();
                    console.log('error',error);
                });
    
              });
            }else if(this.finalRole=='$ac'){
              this.app.getRootNav().push(EapLeadDetailsAc,{
                "forName":'server',
                'leadId':leadId
              }).then(()=>{
    
                let ntc_id=notificationObj['ntc_id'];
                let dataArrObj={};
                dataArrObj['ntc_user_read_flag']=1;
                this.busy=this.appNotifyCenApi.addEditNotifications(dataArrObj,ntc_id).subscribe((respResult:any)=>{
                  this.notificationNewLoadIfTLHAC();
                  this.events.publish('notificationCountSet');
                },(error)=>{
                  this.notificationNewLoadIfTLHAC();
                    console.log('error',error);
                });
    
              });
            }

          }
    
         }else if(this.finalRole=='$sph'){
          
          
    
            if(projectPageFlag){
               if(notificationObj['project_id']>0){
                      this.app.getRootNav().push(ProjectParentTabsPage,{
                        "projData":notificationObj,
                        "projId":notificationObj['project_id'],
                        "projName":notificationObj['project_name'],
                        "hpbId":notificationObj['server_hpb_id'],
                        "hpbName":"",
                    }).then(()=>{
    
                        let ntc_id=notificationObj['server_ntc_id'];
                        let query="UPDATE notification_center SET ntc_user_read_flag=1, sync_status=0 WHERE server_ntc_id="+ntc_id;
                        this.busy=this.sqlS.queryExecuteSql(query,[]).then((respResult:any)=>{
                          this.notificationNewLoadIfSPH();
                          this.events.publish('notificationCountSet');
                        },(error)=>{
                          this.notificationNewLoadIfSPH();
                            console.log('error',error);
                        });
    
                    });
                  }
            }else if(recieptPageFlag){
              if(notificationObj['receipt_id']>0){
                this.app.getRootNav().push(ProductReceiptsDetailsPage,{
                  "productReceiptId":notificationObj['receipt_id']
                }).then(()=>{
      
                  let ntc_id=notificationObj['server_ntc_id'];
                  let query="UPDATE notification_center SET ntc_user_read_flag=1, sync_status=0 WHERE server_ntc_id="+ntc_id;
                  this.busy=this.sqlS.queryExecuteSql(query,[]).then((respResult:any)=>{
                    this.notificationNewLoadIfSPH();
                    this.events.publish('notificationCountSet');
                  },(error)=>{
                    this.notificationNewLoadIfSPH();
                      console.log('error',error);
                  });
      
                });
            }
          }else if(eapLeadFlag){
            // Leads

           let leadId=0;
           leadId=notificationObj['ntc_type_id'];

           if(notificationObj['ntc_type']=="eap_lead_support_assignment_added"){
             let dataN =notificationObj['ntc_type_data']?JSON.parse(notificationObj['ntc_type_data']):{};
             leadId = dataN['lead_id'];
           }else if(notificationObj['ntc_type']=="eap_lead_chat_added_eap" || notificationObj['ntc_type']=="eap_lead_chat_added_sph"){
             let dataN =notificationObj['ntc_type_data']?JSON.parse(notificationObj['ntc_type_data']):{};
             leadId = dataN['chat_lead_id'];
           }
         
           this.app.getRootNav().push(EapLeadDetails,{
             "forName":'server',
             'leadId':leadId
           }).then(()=>{
 
             let ntc_id=notificationObj['server_ntc_id'];
             let query="UPDATE notification_center SET ntc_user_read_flag=1, sync_status=0 WHERE server_ntc_id="+ntc_id;
             this.busy=this.sqlS.queryExecuteSql(query,[]).then((respResult:any)=>{
               this.notificationNewLoadIfSPH();
               this.events.publish('notificationCountSet');
             },(error)=>{
               this.notificationNewLoadIfSPH();
                 console.log('error',error);
             });
 
           });
        }else if(hpbeditflag){
          
          let server_hpb_id = JSON.parse(notificationObj['ntc_from_user_data']).hpb_id;
          console.log("server_hpb_id=>",server_hpb_id);
          let qry = "select * from hpb_master where server_hpb_id ="+server_hpb_id;

          this.sqlS.queryExecuteSql(qry,"").then((result)=>{
            if(result && result.rows.length>0){
              this.app.getRootNav().push(HpbParentTabsPage,{
                "hpbData":result.rows.item(0),
                "hpbId" : result.rows.item(0)['hpb_id'],
                "hpbName": result.rows.item(0)['hpb_name'],
                "action":"hpbSpecific",
                "tab":"detail"
              }).then(()=>{
                let ntc_id=notificationObj['server_ntc_id'];
                let query="UPDATE notification_center SET ntc_user_read_flag=1, sync_status=0 WHERE server_ntc_id="+ntc_id;
                this.busy=this.sqlS.queryExecuteSql(query,[]).then((respResult:any)=>{
                  this.notificationNewLoadIfSPH();
                  this.events.publish('notificationCountSet');
                },(error)=>{
                  this.notificationNewLoadIfSPH();
                    console.log('error',error);
                });
              });
            }
          })
        
          }
        
        }
    
      }

}
