import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Events } from 'ionic-angular';
import { SuperTabsModule } from 'ionic2-super-tabs';
import { SrkuPage } from '../../srku/srku';
import { SwitchingPage } from '../../switching/switching';
import { MaintainPage } from '../../maintain/maintain';
import { NewMemberPage } from '../../new-member/new-member';
import { appCommonMethods } from "../../../providers/appCommonMethods";
import { App_product_receiptApi } from "../../../shared/loopback_sdk/index";

import { NotificationsTabPage } from '../../../pages/notification/notifications-tab/notifications-tab';


import * as moment from 'moment';
import { ProductStatsAcTlhPage } from '../../product-stats-ac-tlh/product-stats-ac-tlh';
import { AcReceiptDetailsPage } from "../receipt-details/receipt-details";
import { AcProductReceiptPageTab } from "../ac-product-receipt-tab/ac-product-receipt-tab";
import { ShareService } from "../../../providers/ShareService";
import { NoInternet } from "../../no-internet/no-internet";
import { SyncServices } from "../../../providers/syncServices";
import { App_notification_centerApi  }  from '../../../shared/loopback_sdk';

import { acSrkuPage } from "../ac-srku/ac-srku";
import { acSwitchingPage } from "../ac-switching/ac-switching";
import { acMaintainPage } from "../ac-maintain/ac-maintain";
import { acNewMemberPage } from "../ac-new-member/ac-new-member";
import { SqlServices } from "../../../providers/sqlService";
import { ALL_MESSAGE } from "../../../providers/constant";

declare var selectedDistrict;
declare var globalSyncInProgressFlag;
declare var sessionUserGlobalData;
declare var cordova;
declare var globalInternetCheckConnection;

@Component({
  selector: 'page-dashboard',
  templateUrl: 'dashboard.html',
})
export class AcDashboardPage {
  page1: any = acSrkuPage;
  page2: any = acSwitchingPage;
  page3: any = acMaintainPage;
  page4: any = acNewMemberPage;

  notificationCtn=0;

  busy:any;
  busyMessage:any="Please Wait...";
  userName:any;
  uId:number;
  userRole="$ac";
  productReceiptAllData:any=[];
  limit:number = 1;
  pages:number = 0;
  dataLen:number = 0;
  approval:any="0";
  approval_by:any="$ac";
  districtData:any = [];
  selectedDistrict:any = 'all';
   globalSyncLoaderBtn:boolean=false;
   constructor(private events:Events,private sqlS:SqlServices,private syncS:SyncServices,public navCtrl: NavController, public navParams: NavParams,public productReciptapi: App_product_receiptApi,public appCom:appCommonMethods,public shareS:ShareService,private appNotifyCenApi:App_notification_centerApi) {
      let masterSync = this.shareS.getshareData('masterSync'); 
      console.log(" master sync status ",masterSync);
      if(masterSync){
          this.busy= this.syncS.syncUserData().then(()=>{
              
              this.busy= this.syncS.syncHomeStatsAcTlh('sph').then(()=>{
                  console.log(" masterSync syncHomeStatsSph called ");
                   this.firstFunction(); 
                  this.shareS.setshareData('masterSync',false);                      
              },(err)=>{    
                  this.shareS.setshareData('masterSync',false);    
                  this.firstFunction();  
                  console.log(" error occured masterSync user data called ",err);
              });
          },(err)=>{      
              this.shareS.setshareData('masterSync',false);  
              console.log(" error occured syncUserData user data called ",err);
          });

           this.busy= this.syncS.syncAllMasterTLHACAM().then(()=>{
            },()=>{      
            });
          
      }

      this.events.unsubscribe('notificationCountSet');
      this.events.subscribe('notificationCountSet',()=>{
          this.notificationCountSet();
      });
      this.notificationCountSet();

  }
  notificationCountSet(){
    console.log('notificationCountSet')
    this.busy=this.appNotifyCenApi.getNotifications(null,sessionUserGlobalData['userId'],null,"0").subscribe((respResult:any)=>{
        if(respResult['result']){
            this.notificationCtn=respResult['result']['length']?respResult['result']['length']:0;
        }
    },(error)=>{
      console.log('error',error);
    }); 
}
  globalSync(){
        this.globalSyncLoaderBtn=true;
         this.busy= this.syncS.syncUserData().then(()=>{
         this.busy= this.syncS.syncHomeStatsAcTlh('sph').then(()=>{
            this.firstFunction();        
              this.globalSyncLoaderBtn=false;
              this.notificationCountSet();
            },(err)=>{    
                  this.firstFunction();  
                 this.globalSyncLoaderBtn=false;
            });
        },(err)=>{      
                  this.firstFunction();  
                 this.globalSyncLoaderBtn=false;
        });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad DashboardPage');
    let con =	this.shareS.getshareData('netConnection');
    if(!con){
     this.navCtrl.push(NoInternet);
    }
  }

  async ionViewDidEnter(){
      this.busyMessage = await this.appCom.getTranslatedTxt("Please wait...");   
      this.productReceiptAllData=[];
      this.districtData = [];
      
      let masterSync = this.shareS.getshareData('masterSync'); 
      if(!masterSync){
        this.firstFunction();      
      }
      this.notificationCountSet();
  }

  firstFunction(){
        console.log('ionViewDidEnter TlhProductReceiptsAllPage');
        this.busy= this.appCom.getAppPreference("userCreds").then(
        resDataU => {
          console.log(" resDataU ",resDataU);
          this.userName = resDataU.user.realm;
          let uId = resDataU.userId;
          this.uId = parseInt(uId);
          console.log("this.uId ",this.uId );
          console.log("this.userName ",this.userName );
          this.productReceiptAllData=[];
          this.pages=0;
          this.limit=1;
          this.approval="0";
          this.loadData();
        },
        err => {
          console.log("err ref", err);
        });
    
        let getSubdistricts = "SELECT DISTINCT json_extract(user_data.district,'$[0].name') as district_name,json_extract(user_data.district,'$[0].id') as district_id FROM user_data, json_tree(user_data.district,'$')";
        console.log(" getdistricts ",getSubdistricts);
        this.busy= this.sqlS.selectTableQueryData(getSubdistricts,[]).then((ressqlData:any)=>{
            if(ressqlData.rows.length>0){
                this.districtData = [];
                for(let i = 0;i<ressqlData.rows.length;i++){
                    this.districtData.push(ressqlData.rows.item(i));

                    if(i == ressqlData.rows.length-1){
                      this.selectDistrict();
                    }
                }
                console.log(" this.districtData ",this.districtData);
                
            }
        },(err)=>{
            console.log("error occured",err);
        });
  }

  loadData(){
      try{
          this.busy =  this.productReciptapi.getProductReceiptWithApproval(null,null,null,null,null,this.uId,this.userRole,this.approval,this.approval_by,null,null,null,null,this.limit,this.pages,null,null).subscribe(resData => {  
          this.dataLen = resData.result.length;
          this.pages++;
          for (let x=0; x< resData.result.length;x++) {
            this.productReceiptAllData.push(resData.result[x]);
          }
          });
      }catch(err){
        console.log(err);
      }
  }

  goToAcReceiptDetail( receipt ){
    this.navCtrl.push(AcReceiptDetailsPage,{
      "receiptId":receipt['receipt_id']
    });
  }

  productPerformance(){
    this.navCtrl.push(ProductStatsAcTlhPage,{dist_subdist:'user_data.district'});
  }

  selectDistrict(){
      selectedDistrict = this.selectedDistrict;
      this.events.publish('refreshAcStats');
  }

  timeStampToDate(date){
    let newDateF = moment(date).format("DD MMM YYYY");
    return newDateF;
  }

  goToAcReceiptList(){
     this.navCtrl.push(AcProductReceiptPageTab);
  }

  goToNotifyPage(){
    this.navCtrl.push(NotificationsTabPage);
  }

}
