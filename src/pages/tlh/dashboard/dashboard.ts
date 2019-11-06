import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, App, Events } from 'ionic-angular';
import { SuperTabsModule } from 'ionic2-super-tabs';
import { tlhSrkuPage } from "../tlh-srku/tlh-srku";
import { tlhSwitchingPage } from "../tlh-switching/tlh-switching";
import { tlhMaintainPage } from "../tlh-maintain/tlh-maintain";
import { tlhNewMemberPage } from "../tlh-new-member/tlh-new-member";
import { SyncServices } from "../../../providers/syncServices";
import { ShareService } from "../../../providers/ShareService";

import { appCommonMethods } from "../../../providers/appCommonMethods";
import { App_product_receiptApi } from "../../../shared/loopback_sdk/index";
import { TlhReceiptDetailPage } from "../tlh-receipt-detail/tlh-receipt-detail";
import { TlhProductReceiptsTabPage } from "../tlh-product-receipts-tab/tlh-product-receipts-tab";
import { ProductStatsAcTlhPage } from '../../product-stats-ac-tlh/product-stats-ac-tlh';

import { NotificationsTabPage } from '../../../pages/notification/notifications-tab/notifications-tab';

import { App_notification_centerApi  }  from '../../../shared/loopback_sdk';

import * as moment from 'moment';
import { NoInternet } from "../../no-internet/no-internet";
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
export class TlhDashboardPage {
  newMemberData: any = [];
  maintainData: any = [];
  switchingData: any = [];
  display: boolean = false;
  sphSelect: any;
  srkuData: any = [];
  page1: any = tlhSrkuPage;
  page2: any = tlhSwitchingPage;
  page3: any = tlhMaintainPage;
  page4: any = tlhNewMemberPage;
  notificationCtn=0;
  busy:any;
  busyMessage:any="Please Wait...";
  userName:any;
  uId:number;
  userRole="$tlh";
  productReceiptAllData:any=[];
  limit:number = 1;
  pages:number = 0;
  dataLen:number = 0;
  approval:any="0";
  approval_by:any="$tlh";
  subdistrictData:any = [];
  selectedSubDistrict:any = 'all';
  globalSyncLoaderBtn:boolean = false;

   constructor(private events:Events,private sqlS:SqlServices,private syncS:SyncServices,public navCtrl: NavController, public navParams: NavParams,public productReciptapi: App_product_receiptApi,public appCom:appCommonMethods,public app :App,public shareS:ShareService,private appNotifyCenApi:App_notification_centerApi) {
  
    // let masterSync =  this.shareS.getshareData('masterSync'); 
    // if(masterSync){
    //           this.busy= this.syncS.syncAllMaster().then(()=>{
    //           },()=>{      
    //           });
    //           this.shareS.setshareData('masterSync',false);
    // }

    

    let masterSync = this.shareS.getshareData('masterSync'); 
    console.log(" master sync status ",masterSync);
        if(masterSync){
            this.busy= this.syncS.syncUserData().then(()=>{
                console.log(" masterSync syncUserData called ");
                this.busy= this.syncS.syncHomeStatsAcTlh('sph').then(()=>{
                    console.log(" masterSync syncHomeStatsAcTlh called ");
                    this.shareS.setshareData('masterSync',false);
                    this.firstFunction();
                },(err)=>{      
                    this.shareS.setshareData('masterSync',false);
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
        console.log('respResult',respResult);
            if(respResult['result']){
                this.notificationCtn=respResult['result']['length']?respResult['result']['length']:0;
            }
        },(error)=>{
          console.log('error',error);
        }); 
}

    globalSync(){
        this.globalSyncLoaderBtn = true;
        this.busy= this.syncS.syncUserData().then(()=>{
              console.log(" masterSync syncUserData called ");
              this.syncS.syncHomeStatsAcTlh('sph').then(()=>{
                  console.log(" masterSync syncHomeStatsAcTlh called ");
                  this.shareS.setshareData('masterSync',false);
                  this.firstFunction();
                  this.globalSyncLoaderBtn = false;
                  this.notificationCountSet();
              },(err)=>{      
                  this.globalSyncLoaderBtn = false;
                  this.shareS.setshareData('masterSync',false);
                  console.log(" error occured masterSync user data called ",err);
              });
          },(err)=>{      
              this.globalSyncLoaderBtn = false;
              this.shareS.setshareData('masterSync',false);
              console.log(" error occured syncUserData user data called ",err);
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
      let masterSync = this.shareS.getshareData('masterSync'); 
      console.log(" master sync status ionViewDidEnter ",masterSync);
      if(!masterSync){
        this.firstFunction();      
      }
      this.notificationCountSet();
  }

  firstFunction(){
      this.subdistrictData = [];
        console.log('ionViewDidEnter TlhProductReceiptsAllPage');
        this.busy = this.appCom.getAppPreference("userCreds").then(resDataU => {
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
        },(err) => {
            console.log("err ref", err);
        }); 

        let getSubdistricts = "SELECT DISTINCT json_extract(user_data.subdistrict,'$[0].name') as subdistrict_name,json_extract(user_data.subdistrict,'$[0].id') as subdistrict_id FROM user_data, json_tree(user_data.subdistrict,'$')";
        console.log(" getSubdistricts ",getSubdistricts);
        this.sqlS.selectTableQueryData(getSubdistricts,[]).then((ressqlData:any)=>{
            if(ressqlData.rows.length>0){
                for(let i = 0;i<ressqlData.rows.length;i++){
                    this.subdistrictData.push(ressqlData.rows.item(i));

                    if(i == ressqlData.rows.length-1){
                      this.selectSubDistrict();
                    }
                }
                console.log(" this.subdistrictData ",this.subdistrictData);
                
            }
        },(err)=>{
            console.log("error occured",err);
        });
  }

  loadData(){
 
      this.busy =  this.productReciptapi.getProductReceiptWithApproval(null,null,null,null,null,this.uId,this.userRole,this.approval,this.approval_by,null,null,null,null,this.limit,this.pages,null,null).subscribe(resData => {  
          this.dataLen = resData.result.length;
          this.pages++;
          for (let x=0; x< resData.result.length;x++) {
              this.productReceiptAllData.push(resData.result[x]);
          }
      });
        
  }

  selectSubDistrict(){
      //alert(this.selectedSubDistrict);
      selectedDistrict = this.selectedSubDistrict;
      this.events.publish('refreshStats');
  }

  goToTlhReceiptDetail( receipt ){
    this.navCtrl.push(TlhReceiptDetailPage,{
      "receiptId":receipt['receipt_id']
    });
  }

  timeStampToDate(date){
    let newDateF = moment(date).format("DD MMM YYYY");
    return newDateF;
  }

  productPerformance(){
    this.navCtrl.push(ProductStatsAcTlhPage,{dist_subdist:'user_data.subdistrict'});
  }

  goToTlhReceiptList(){
     this.navCtrl.push(TlhProductReceiptsTabPage);
  }
  goToNotifyPage(){
    this.navCtrl.push(NotificationsTabPage);
  }

}
