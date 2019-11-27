import { appCommonMethods } from '../providers/appCommonMethods';
import { ALL_MESSAGE, SQL_QUERY } from '../providers/constant';
import { SqlServices } from '../providers/sqlService';
import { SyncServices } from '../providers/syncServices';
import { OtpPage } from '../pages/login/otp/otp';
import { MobileVerifyPage } from '../pages/login/mobile-verify/mobile-verify';
import { ActivationRegisterPage } from '../pages/login/activation-register/activation-register';
import { LoginPage } from '../pages/login/login/login';
import { Component, ViewChild } from '@angular/core';
import { AlertController, MenuController, Nav, Platform,Events } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { Network } from '@ionic-native/network';
import { HomePage } from '../pages/home/home';
import { ProductReceiptsListPage } from '../pages/product-receipts/product-receipts-list/product-receipts-list';
import { NoInternet } from '../pages/no-internet/no-internet';
import { ProjectListPage } from '../pages/project/project-list/project-list';
import { ProductRequestsListPage } from '../pages/product-request/product-requests-list/product-requests-list';

// import { Observable } from 'rxjs/Rx';
// import { timeout } from 'rxjs/operator/timeout';
// import { SelectLanguagePage } from "../pages/select-language/select-language";
// import { AddProjectPage } from '../pages/project/add-project/add-project';
// import { ProjectFilterPage } from '../pages/project/project-filter/project-filter';
// import { CementBagRemovalFormPage } from '../pages/cement-bag-removal/cement-bag-removal-form/cement-bag-removal-form';
// import { CementBagRemovalDetailsPage } from '../pages/cement-bag-removal/cement-bag-removal-details/cement-bag-removal-details';
// import { CementBagRemovalListPage } from '../pages/cement-bag-removal/cement-bag-removal-list/cement-bag-removal-list';
// import { CementBagRemovalSearchPage } from '../pages/cement-bag-removal/cement-bag-removal-search/cement-bag-removal-search';
// import { DistributorRetailerVisitFormPage } from '../pages/distributor-retailer-visit/distributor-retailer-visit-form/distributor-retailer-visit-form';
// import { DistributorRetailerVisitDetailsPage } from '../pages/distributor-retailer-visit/distributor-retailer-visit-details/distributor-retailer-visit-details';
// import { DistributorRetailerVisitListPage } from '../pages/distributor-retailer-visit/distributor-retailer-visit-list/distributor-retailer-visit-list';
// import { DistributorRetailerVisitSearchPage } from '../pages/distributor-retailer-visit/distributor-retailer-visit-search/distributor-retailer-visit-search';
// import { ProductReceiptsFormPage } from '../pages/product-receipts/product-receipts-form/product-receipts-form';
// import { ProductReceiptsDetailsPage } from '../pages/product-receipts/product-receipts-details/product-receipts-details';
// import { ProductReceiptsSearchPage } from '../pages/product-receipts/product-receipts-search/product-receipts-search';
// import { ProductRequestsFormPage } from '../pages/product-request/product-requests-form/product-requests-form';
// import { ProductRequestsDetailsPage } from '../pages/product-request/product-requests-details/product-requests-details';
// import { ProductRequestsSearchPage } from '../pages/product-request/product-requests-search/product-requests-search';
// import { HomeSlidePage } from '../pages/home-slide/home-slide';
// import { AcCementBagRemovalDetailPage } from '../pages/ac/ac-cement-bag-removal-detail/ac-cement-bag-removal-detail';
// import { AcCementBagRemovalFormPage } from '../pages/ac/ac-cement-bag-removal-form/ac-cement-bag-removal-form';
//import { AcProductReceiptsTabPage } from '../pages/ac/ac-product-receipts-tab/ac-product-receipts-tab';
// import { AcReceiptDetailsPage } from '../pages/ac/receipt-details/receipt-details';
// import { AcSphTlsListPage } from '../pages/ac/sph-tls-list/sph-tls-list';
// import { TlhDetailPage } from '../pages/tlh/tlh-detail/tlh-detail';
// import { TlhProductReceiptPage } from '../pages/tlh/tlh-product-receipt/tlh-product-receipt';
//import { TlhProductReceiptsTabPage } from '../pages/tlh/tlh-product-receipts-tab/tlh-product-receipts-tab';
// import { TlhSphListPage } from '../pages/tlh/tlh-sph-list/tlh-sph-list';

import { ShareService } from "../providers/ShareService";
import { TranslateService } from '@ngx-translate/core';
import { Geolocation } from '@ionic-native/geolocation';
import { AmDashboardPage } from '../pages/am/dashboard/dashboard';
import { AcDashboardPage } from '../pages/ac/dashboard/dashboard';
import { AcCementBagRemovalListPage } from '../pages/ac/ac-cement-bag-removal-list/ac-cement-bag-removal-list';
import { AcProductReceiptPageTab } from '../pages/ac/ac-product-receipt-tab/ac-product-receipt-tab';
import { AcAchievementsTabPage } from '../pages/ac/ac-achievements-tab/ac-achievements-tab';
import { AcActivateSphListPage } from '../pages/ac/ac-activate-sph-list/ac-activate-sph-list';
import { TlhAchievementsPage } from '../pages/tlh/achievements/achievements';
import { TlhDashboardPage } from '../pages/tlh/dashboard/dashboard';
import { ActivateSphListPage } from '../pages/tlh/activate-sph-list/activate-sph-list';
import { TlhReceiptDetailPage } from '../pages/tlh/tlh-receipt-detail/tlh-receipt-detail';
import { MasonDashboardPage } from '../pages/mason/dashboard/dashboard';
import { MasonReceiptListPage } from '../pages/mason/mason-receipt-list/mason-receipt-list';
import { MasonRedeemTabPage } from '../pages/mason/mason-redeem-tab/mason-redeem-tab';
import { MasonRedeemListPage } from '../pages/mason/redeem-list/redeem-list';
import { MasonRedeemHistoryPage } from '../pages/mason/redeem-history/redeem-history';
import { MasonRedeemInvoicePage } from '../pages/mason/redeem-invoice/redeem-invoice';
// import { ReceiptDetailPage } from '../pages/mason/receipt-detail/receipt-detail';

// import { PopupDemoPage } from '../pages/popup-demo/popup-demo';
// import { SrkuPage } from '../pages/srku/srku';
// import { SwitchingPage } from '../pages/switching/switching';
// import { MaintainPage } from '../pages/maintain/maintain';
// import { NewMemberPage } from '../pages/new-member/new-member';
// import { Push, PushObject, PushOptions } from '@ionic-native/push';
// import { ProjectParentTabsPage } from "../pages/project/project-parent-tab-page/project-parent-tab-page";
// import { AddVisitFormPage } from "../pages/visit-pages/visit-add-form/visit-add-form";

import { LoopBackConfig , LoopBackAuth, PushApi   } from '../shared/loopback_sdk/index';
import { TermsAndConditon } from "../pages/login/terms-and-conditions-page/terms-and-conditions-page";
import { Storage } from '@ionic/storage';
import { HpbListPage } from "../pages/hpb-pages/hpb-list/hpb-list";
import { DistributorRetailerListPage } from "../pages/distributor-retailer-page/distributor-retailer-list/distributor-retailer-list";
import { SyncPage } from "../pages/sync/sync";
import { SITE_API } from "../providers/constant";
import { TlhProductReceiptsTabPage } from "../pages/tlh/tlh-product-receipts-tab/tlh-product-receipts-tab";
import { TlhProjectsTabPage } from "../pages/tlh/tlh-projects-tab/tlh-projects-tab";
import { TlhProjectDetailPage } from "../pages/tlh/tlh-project-detail/tlh-project-detail";
import { TlhHpbListPage } from "../pages/tlh/tlh-hpb-pages/tlh-hpb-list/tlh-hpb-list";
import { TlhProductReceiptsAllPage } from "../pages/tlh/tlh-product-receipts-all/tlh-product-receipts-all";
import { TlhProductReceiptsPendingPage } from "../pages/tlh/tlh-product-receipts-pending/tlh-product-receipts-pending";
import { TlhProjectsAllPage } from "../pages/tlh/tlh-projects-all/tlh-projects-all";
import { TlhProjectsPendingPage } from "../pages/tlh/tlh-projects-pending/tlh-projects-pending";
import { AcProductReceiptPendingPage } from "../pages/ac/ac-product-receipt-pending/ac-product-receipt-pending";
import { AcProductReceiptAllPage } from "../pages/ac/ac-product-receipt-all/ac-product-receipt-all";

// import { tlhSrkuPage } from "../pages/tlh/tlh-srku/tlh-srku";
// import { tlhSwitchingPage } from "../pages/tlh/tlh-switching/tlh-switching";
// import { tlhMaintainPage } from "../pages/tlh/tlh-maintain/tlh-maintain";
// import { tlhNewMemberPage } from "../pages/tlh/tlh-new-member/tlh-new-member";
// import { acSwitchingPage } from "../pages/ac/ac-switching/ac-switching";
// import { acSrkuPage } from "../pages/ac/ac-srku/ac-srku";
// import { acNewMemberPage } from "../pages/ac/ac-new-member/ac-new-member";
// import { acMaintainPage } from "../pages/ac/ac-maintain/ac-maintain";
// import { TlhHpbParentTabsPage } from "../pages/tlh/tlh-hpb-pages/tlh-hpb-parent-tab-page/tlh-hpb-parent-tab-page";
// import { tlhDistributorDetail, tlhDistributorVisitListPage } from "../pages/tlh/tlh-distributor-retailer-pages/tlh-distributor-retailer-detail-page/tlh-distributor-retailer-detail-page";
import * as moment from 'moment';

import { tlhDistributorRetailerListPage } from "../pages/tlh/tlh-distributor-retailer-pages/tlh-distributor-retailer-list/tlh-distributor-retailer-list";
import { AcHpbListPage, AcHpbListContractorPage, AcHpbListMasonPage } from "../pages/ac/ac-hpb-pages/ac-hpb-list/ac-hpb-list";
import { AcHpbParentTabsPage } from "../pages/ac/ac-hpb-pages/ac-hpb-parent-tab-page/ac-hpb-parent-tab-page";
import { AcHpbProductReceiptsPage } from "../pages/ac/ac-hpb-pages/ac-hpb-product-receipts/ac-hpb-product-receipts";
import { AcHpbProductRequestsPage } from "../pages/ac/ac-hpb-pages/ac-hpb-product-request/ac-hpb-product-request";
import { AcHpbReceiptDetailPage } from "../pages/ac/ac-hpb-pages/ac-hpb-receipt-detail/ac-hpb-receipt-detail";
import { AcHpbProjectDetailPage } from "../pages/ac/ac-hpb-pages/ac-hpb-project-detail/ac-hpb-project-detail";
import { AcHpbProjectListPage } from "../pages/ac/ac-hpb-pages/ac-hpb-project-list/ac-hpb-project-list";
import { AcHpbDetailsPage } from "../pages/ac/ac-hpb-pages/ac-hpb-detail/ac-hpb-detail";
import { AcDistributorRetailerListPage } from "../pages/ac/ac-distributor-retailer-pages/ac-distributor-retailer-list/ac-distributor-retailer-list";
import { Device } from '@ionic-native/device';
import async from 'async'; 
import { TlhProductRequestsListPage } from "../pages/tlh/tlh-product-request-list/tlh-product-request-list";
import { AmAchievementsTabPage } from "../pages/am/am-achievements-tab/am-achievements-tab";
import { AcProductRequestsListPage } from "../pages/ac/ac-product-request-list/ac-product-request-list";
import { AcProjectsTabPage } from "../pages/ac/ac-projects-tab/ac-projects-tab";
import { DisallowRootPage } from "../pages/disallow-root/disallow-root";

/* EAP Page : Start  */
import { EapLeadList } from "../pages/eap-sph/eap-lead-list/eap-lead-list";
import { EapLeadListTlh } from "../pages/tlh/eap-tlh/eap-lead-list-tlh/eap-lead-list-tlh";
import { EapLeadListAc } from "../pages/ac/eap-ac/eap-lead-list-ac/eap-lead-list-ac";
/* EAP Page : End  */

declare var cordova, rootdetection;
declare var sessionUserGlobalData;
declare var globalInternetCheckConnection;
declare var appDeviceInfo;
declare var appDebugModeD; 
declare var appTypeMainTran;
declare var await;
// declare var hotCodePushPath;
// declare var chcp: any;

declare var pleaseWaitTxtTransl,mobisCancelBtnTxtTransl,filterEmptyText,filterPlaceholderText,filterPlaceholderText,mobisBtnArr,allAppPendRejObj,mobisPlaceHolderWaitTxtTransl,mobisSetBtnTxtTransl,mobisClearBtnTxtTransl;

@Component({
  templateUrl: 'app.html'
})
export class MyApp {

  @ViewChild(Nav) nav: Nav;
  busyDB: Promise<any>;
  busyDBMessage:any;
  rootPage: any ;
  appLanguage:String=null;
  netConnection:any;
  userName:any;
  appVersionNumber:any="1.1.3";
  verTextShow:any="Ver";
  pagesSPH: Array<{title: string, component: any,isCurrent:any,section:any,translation :any }>;  
  pagesAC: Array<{title: string, component: any,isCurrent:any,section:any,translation :any }>;
  pagesAM: Array<{title: string, component: any,isCurrent:any,section:any,translation :any }>;
  pagesTLH: Array<{title: string, component: any,isCurrent:any,section:any,translation :any }>;
  pagesACACTMAINSPH: Array<{title: string, component: any,isCurrent:any,section:any,translation :any }>;
  pagesTLHACTMAINSPH: Array<{title: string, component: any,isCurrent:any,section:any,translation :any }>;
  pagesHPB: Array<{title: string, component: any,isCurrent:any,section:any,translation :any }>;
  busy:any;
  busyMessage:any=pleaseWaitTxtTransl;
  gpsAlert:any;
  alertPresent:any;
   
  //INITIALIZE GLOBAL CHECK-IN OBJECT 
  details= {
    check_in_out_user_id:null,
    check_in_out_type:null,
    check_in_out_type_id:null,
    check_in_latitude:null,
    check_in_longitude:null,
    check_in_datetime:null,
    check_out_latitude:null,
    check_out_longitude:null,
    check_out_datetime:null,
    generated_by:null,
    insertId:null,

  }
  globalCheckInData:any={
     checkinFlag:false,
     checkinType:"",
     visitCheckFlag:false,
     checkinDetails: this.details
  };
  
  constructor(private device:Device, private pushApi:PushApi, private syncS:SyncServices,private loopBackAuth:LoopBackAuth,public platform: Platform, public statusBar: StatusBar,public storage: Storage, public splashScreen: SplashScreen,public translate: TranslateService,public geolocation: Geolocation,public shareS:ShareService,public sqlS:SqlServices,public alertCtrl: AlertController,private menu: MenuController,public appCom:appCommonMethods,private network: Network,public events:Events,private splashS:SplashScreen) {
    LoopBackConfig.setBaseURL(SITE_API.SITE_URL);
    LoopBackConfig.setApiVersion('api');
    
    
    this.menu.enable(false);

    this.initializeApp();

    // used for an example of ngFor and navigation
  
  }

  initializeApp() {
  
    this.platform.ready().then(() => {
        this.splashS.hide();
       // this.defualtTranslateTxt();
      // }

      if(appTypeMainTran=="training"){
        this.verTextShow="Training Ver";
      }
  
      if( this.platform.is('ios') ) {
          
          this.appReady();
  
      } else {
  
        // if (typeof(rootdetection) !== 'undefined' && rootdetection) {
          rootdetection.isDeviceRooted((res)=>{
           
          if(res == 1 && !appDebugModeD ){
             this.rootPage= DisallowRootPage;
             let alert = this.alertCtrl.create({
               enableBackdropDismiss: false,
                title: "Rooted device detected",
                subTitle: "Cannot use this app on rooted device",
                buttons: [{
                text: "Ok",
                handler: () => {          
                  this.platform.exitApp();
                  return false;
                }}]
            });
            alert.present();
            return false;
          }else{
              this.appReady();
          }
           
          //  this.push.hasPermission()
          //  .then((res: any) => {           
          //    if (res.isEnabled) {
          //      console.log('We have permission to send push notifications');
          //    } else {
          //      console.log('We do not have permission to send push notifications');
          //    }
  
          //  });
  
          //   const options: PushOptions = {
          //     android: {
          //         senderID: '324389439041'
          //     },
          //     ios: {
          //         alert: 'true',
          //         badge: true,
          //         sound: 'false'
          //     },
          //     windows: {}
          //  };
  
          //  const pushObject: PushObject = this.push.init(options);
  
          //  pushObject.on('notification').subscribe((notification: any) => console.log('Received a notification', notification));
  
          //  pushObject.on('registration').subscribe((registration: any) => {
          //   console.log('Device registered', registration)
  
          //  });
  
          //  pushObject.on('error').subscribe(error => console.error('Error with Push plugin', error));
  
  
        }, (error)=>{
            console.log(" error ",error);
        });
      }
    });

    this.menuInitilize();

  }

  menuInitilize() {
    this.pagesSPH = [
      { title: 'Home', component: HomePage, isCurrent :true,section:"home",translation:"HOME" },
      { title: 'Projects', component: ProjectListPage,isCurrent :false,section:"viewall",translation:"PROJECTS" },
      { title: 'Mason / Contractor', component: HpbListPage,isCurrent :false,section:"viewall",translation:"MASON/CONTRACTOR" },
      { title: 'Distributor / Retailer', component: DistributorRetailerListPage, isCurrent: false,section:"viewall",translation:"DISTRIBUTOR/RETAILER"},
      { title: 'Product Receipts', component: ProductReceiptsListPage, isCurrent: false,section:"viewall",translation:"PRODUCT RECEIPTS"},  
      { title: 'Product Requests', component: ProductRequestsListPage, isCurrent: false,section:"viewall",translation:"PRODUCT REQUESTS"}, 
      { title: 'Duta Holcim Leads', component: EapLeadList, isCurrent: false,section:"viewall",translation:"DUTA DYNAMIX LEADS"}, 
      { title: 'Sync', component: SyncPage, isCurrent: false,section:"viewall",translation:"SYNC"},   
  ]; 

    this.pagesAM = [
      { title: 'Home', component: AmDashboardPage, isCurrent :true,section:"home",translation:"HOME" },
      { title: 'Achievements', component: AmAchievementsTabPage, isCurrent: false,section:"viewall",translation:"ACHIEVEMENTS"},
      { title: 'Sync', component: SyncPage, isCurrent: false,section:"viewall",translation:"SYNC"}
    ];

  this.pagesAC = [  

      { title: 'Home A', component: AcDashboardPage, isCurrent :true,section:"home",translation:"HOME" },
      { title: 'Projects', component: AcProjectsTabPage, isCurrent: false,section:"viewall",translation:"PROJECT LIST"},
      { title: 'Mason / Contractor', component: AcHpbListPage,isCurrent :false,section:"viewall",translation:"MASON/CONTRACTOR" },
      { title: 'Distributor / Retailer', component: AcDistributorRetailerListPage, isCurrent: false,section:"viewall",translation:"DISTRIBUTOR/RETAILER"},
      { title: 'Product Receipts', component: AcProductReceiptPageTab, isCurrent: false,section:"viewall",translation:"PRODUCT RECEIPTS"}, 
      { title: 'Product Requests', component: AcProductRequestsListPage, isCurrent: false,section:"viewall",translation:"PRODUCT REQUESTS"}, 
      { title: 'Cement Bag Removal Receipts', component: AcCementBagRemovalListPage, isCurrent: false,section:"viewall",translation:"CEMENT BAG REMOVAL RECEIPTS"},    
      { title: 'Achievements', component: AcAchievementsTabPage, isCurrent: false,section:"viewall",translation:"ACHIEVEMENTS"}, 
      { title: 'Duta Holcim Leads', component: EapLeadListAc, isCurrent: false,section:"viewall",translation:"DUTA HOLCIM LEADS"}, 
      { title: 'Sync', component: SyncPage, isCurrent: false,section:"viewall",translation:"SYNC"},
  ];  

  this.pagesACACTMAINSPH = [
        { title: 'Home', component: HomePage, isCurrent :true,section:"home",translation:"HOME" },
        { title: 'Projects', component: ProjectListPage,isCurrent :false,section:"viewall",translation:"PROJECTS" },
        { title: 'Mason / Contractor', component: HpbListPage,isCurrent :false,section:"viewall",translation:"MASON/CONTRACTOR" },
        { title: 'Distributor / Retailer', component: DistributorRetailerListPage, isCurrent: false,section:"viewall",translation:"DISTRIBUTOR/RETAILER"},
        { title: 'Product Receipts', component: ProductReceiptsListPage, isCurrent: false,section:"viewall",translation:"Product Receipts"},  
        { title: 'Product Requests', component: ProductRequestsListPage, isCurrent: false,section:"viewall",translation:"Product Requests"}, 
        { title: 'Duta Holcim Leads', component: EapLeadList, isCurrent: false,section:"viewall",translation:"DUTA HOLCIM LEADS"}, 
        { title: 'Sync', component: SyncPage, isCurrent: false,section:"viewall",translation:"SYNC"},   
    ]; 


  this.pagesTLH = [
      { title: 'Home T', component: TlhDashboardPage, isCurrent :true,section:"home",translation:"HOME" },
      { title: 'Product Receipts', component: TlhProductReceiptsTabPage, isCurrent: false,section:"viewall",translation:"PRODUCT RECEIPTS"}, 
      { title: 'Product Requests', component: TlhProductRequestsListPage, isCurrent: false,section:"viewall",translation:"PRODUCT REQUESTS"}, 
      { title: 'Mason / Contractor', component: TlhHpbListPage, isCurrent: false,section:"viewall",translation:"MASON/CONTRACTOR"},
      { title: 'Distributor / Retailer', component: tlhDistributorRetailerListPage, isCurrent: false,section:"viewall",translation:"DISTRIBUTOR/RETAILER"},
      { title: 'Projects', component: TlhProjectsTabPage, isCurrent: false,section:"viewall",translation:"PROJECT LIST"},
      { title: 'Achievements', component: TlhAchievementsPage, isCurrent: false,section:"viewall",translation:"ACHIEVEMENTS"},
      { title: 'Duta Holcim Leads', component: EapLeadListTlh, isCurrent: false,section:"viewall",translation:"DUTA HOLCIM LEADS"}, 
      { title: 'Sync', component: SyncPage, isCurrent: false,section:"viewall",translation:"SYNC"},
  ];
    
    this.pagesTLHACTMAINSPH = [
        { title: 'Home', component: HomePage, isCurrent :true,section:"home",translation:"HOME" },
        { title: 'Projects', component: ProjectListPage,isCurrent :false,section:"viewall",translation:"PROJECTS" },
        { title: 'Mason / Contractor', component: HpbListPage,isCurrent :false,section:"viewall",translation:"MASON/CONTRACTOR" },
        { title: 'Distributor / Retailer', component: DistributorRetailerListPage, isCurrent: false,section:"viewall",translation:"DISTRIBUTOR/RETAILER"},
        { title: 'Product Receipts', component: ProductReceiptsListPage, isCurrent: false,section:"viewall",translation:"Product Receipts"},  
        { title: 'Product Requests', component: ProductRequestsListPage, isCurrent: false,section:"viewall",translation:"Product Requests"}, 
        { title: 'Duta Holcim Leads', component: EapLeadList, isCurrent: false,section:"viewall",translation:"DUTA HOLCIM LEADS"}, 
        { title: 'Sync', component: SyncPage, isCurrent: false,section:"viewall",translation:"SYNC"},   
    ]; 



  this.pagesHPB = [
      { title: 'Home', component: MasonDashboardPage, isCurrent :true,section:"home",translation:"HOME" },
      { title: 'Redeem List', component: MasonRedeemTabPage,isCurrent :false,section:"viewall",translation:"Redeem List" },
      { title: 'Receipt List', component: MasonReceiptListPage,isCurrent :false,section:"viewall",translation:"Receipt List" }
    ]; 
  }

  async appReady() {
    //console.log('this is hot code push example by DyD 786');
    this.syncS.startSync();

    console.log('Device details is: ', this.device);
        
    cordova.getAppVersion().then((valAppVersData)=>{
      console.log(" getAppVersion ",valAppVersData);
      this.appVersionNumber=valAppVersData;
      appDeviceInfo.appVersion =  this.appVersionNumber;
      let deviceInfo:any = {};
      deviceInfo.cordova = this.device.cordova;
      deviceInfo.isVirtual = this.device.isVirtual;
      deviceInfo.manufacturer = this.device.manufacturer;
      deviceInfo.model = this.device.model;
      deviceInfo.platform = this.device.platform;
      deviceInfo.serial = this.device.serial;
      deviceInfo.uuid = this.device.uuid;
      deviceInfo.version = this.device.version;

      appDeviceInfo.deviceInfo = JSON.stringify(deviceInfo);
      appDeviceInfo.uuid = this.device.uuid;
      console.log(" appDeviceInfo ",appDeviceInfo);
      
      this.appCom.get(SITE_API.SITE_URL+'/apps_remote/update.json',{}).subscribe(data => {
        console.log("data is: ",data);
        if( this.platform.is('ios') ) {
          if(data.ios.latest > this.appVersionNumber){
            console.log("data is: ",data.ios.latest);
            this.showUpdateAlert(data.ios.url);
          }else{
            //this.showHotCodePushFixes();
          }
        } else {
          if(data.android.latest > this.appVersionNumber){
            console.log("data is: ",data.android.latest);
            this.showUpdateAlert(data.android.url);
          }else{
            //this.showHotCodePushFixes();
          }
        }
      });

    });

    this.appCom.getLocalStorageItem("language").then((val:any) => {
      console.log("language val----->",val);
        if(val){
          this.translate.setDefaultLang(val);
          this.translate.use(val);
          this.appLanguage=val;
        }else{
            this.translate.setDefaultLang('in');
            this.translate.use('in');
            this.appLanguage='in';
        }
        this.defualtTranslateTxt();
    });

    //this.translate.setDefaultLang('en');

    // Progress to run event
    this.events.subscribe("userDataRefresh",()=>{
            this.appCom.getAppPreference("userCreds").then((resDataU:any)=>{
                this.userName = resDataU.user.realm;
            });
    });

    //USER RELOGINS IF PIN IS SET
    this.appCom.getAppPreference("userCreds").then((resDataU)=>{
        
            let currUserData = resDataU;
            
            if(currUserData){
                  if(currUserData['pin'] && currUserData['pin']!=""){
                    this.userName = resDataU.user.realm;
                    this.loopBackAuth.setToken(resDataU);
                    this.loopBackAuth.setUser(resDataU);
                    sessionUserGlobalData=resDataU;
                    this.rootPage= LoginPage;
                    if(sessionUserGlobalData.appUpdate == 1 && globalInternetCheckConnection == false){
                        this.showUpdateAlert(sessionUserGlobalData.appUrl);
                    }
                    this.appCom.storeAppPreference("userCreds",sessionUserGlobalData);
                }else{
                    this.rootPage= MobileVerifyPage;
                    sessionUserGlobalData=null;
                }
            }else{
                    this.rootPage= MobileVerifyPage;
                    sessionUserGlobalData=null;
            }
          

    },(err)=>{
          console.log('err ref',err);
          this.rootPage= MobileVerifyPage;
          sessionUserGlobalData=null;
    });

    // check internet connection 
    console.log("network type is: ",this.network.type);
    if (this.network.type !== 'none') {
      this.netConnection=true;
      globalInternetCheckConnection = true;
      this.shareS.setshareData('netConnection',this.netConnection);
    }else{
      this.netConnection=false;
      globalInternetCheckConnection = false;
      this.shareS.setshareData('netConnection',this.netConnection);
      try{
        let view = this.nav.getActive(); 
        if(view.instance instanceof MasonDashboardPage || view.instance instanceof MasonReceiptListPage || view.instance instanceof MasonRedeemTabPage || view.instance instanceof MasonRedeemHistoryPage || view.instance instanceof MasonRedeemInvoicePage || view.instance instanceof MasonRedeemListPage || view.instance instanceof TlhDashboardPage || view.instance instanceof TlhProductReceiptsAllPage || view.instance instanceof TlhProductReceiptsPendingPage || view.instance instanceof TlhProductReceiptsTabPage || view.instance instanceof TlhProjectDetailPage || view.instance instanceof TlhProjectsAllPage || view.instance instanceof TlhProjectsPendingPage || view.instance instanceof TlhProjectsTabPage || view.instance instanceof TlhReceiptDetailPage || view.instance instanceof AcDashboardPage || view.instance instanceof AcProductReceiptAllPage || view.instance instanceof AcProductReceiptPendingPage || view.instance instanceof AcProductReceiptPageTab || view.instance instanceof AcHpbReceiptDetailPage || view.instance instanceof AcHpbProjectListPage || view.instance instanceof AcHpbProjectDetailPage || view.instance instanceof AcHpbProductRequestsPage || view.instance instanceof AcHpbProductReceiptsPage || view.instance instanceof AcHpbParentTabsPage ||  view.instance instanceof AcHpbDetailsPage || view.instance instanceof AcHpbListPage || view.instance instanceof AcHpbListMasonPage ||  view.instance instanceof AcHpbListContractorPage ){
        this.nav.push(NoInternet);
        }
      }catch(ee){

      }
    
    }
				
    this.network.onDisconnect().subscribe(() => {
      console.log('network Network :-(');
      this.appCom.showToast('No internet',5000);
      // trigger nointernet page
      globalInternetCheckConnection = false;
      
      try{
          let view = this.nav.getActive(); 
          if(view.instance instanceof MasonDashboardPage || view.instance instanceof MasonReceiptListPage || view.instance instanceof MasonRedeemTabPage || view.instance instanceof MasonRedeemHistoryPage || view.instance instanceof MasonRedeemInvoicePage || view.instance instanceof MasonRedeemListPage || view.instance instanceof TlhDashboardPage || view.instance instanceof TlhProductReceiptsAllPage || view.instance instanceof TlhProductReceiptsPendingPage || view.instance instanceof TlhProductReceiptsTabPage || view.instance instanceof TlhProjectDetailPage || view.instance instanceof TlhProjectsAllPage || view.instance instanceof TlhProjectsPendingPage || view.instance instanceof TlhProjectsTabPage || view.instance instanceof TlhReceiptDetailPage ||view.instance instanceof AcDashboardPage || view.instance instanceof AcProductReceiptAllPage || view.instance instanceof AcProductReceiptPendingPage || view.instance instanceof AcProductReceiptPageTab || view.instance instanceof AcHpbReceiptDetailPage || view.instance instanceof AcHpbProjectListPage || view.instance instanceof AcHpbProjectDetailPage || view.instance instanceof AcHpbProductRequestsPage || view.instance instanceof AcHpbProductReceiptsPage || view.instance instanceof AcHpbParentTabsPage ||  view.instance instanceof AcHpbDetailsPage || view.instance instanceof AcHpbListPage || view.instance instanceof AcHpbListMasonPage ||  view.instance instanceof AcHpbListContractorPage || view.instance instanceof AmAchievementsTabPage || view.instance instanceof AmDashboardPage ){
          this.nav.push(NoInternet);
          }
      }catch(eee){
          console.log(eee);
      }
    

      this.netConnection=false;
      this.shareS.setshareData('netConnection',this.netConnection);
    });

    this.network.onConnect().subscribe(() => {
        console.log('network Network :-)');
        globalInternetCheckConnection = true;
        this.netConnection=true;
        this.shareS.setshareData('netConnection',this.netConnection);
        
        this.appCom.get(SITE_API.SITE_URL+'/apps_remote/update.json',{}).subscribe(data => {
          console.log("data is: ",data,this.appVersionNumber);
          if( this.platform.is('ios') ) {
            
            if(data.ios.latest > this.appVersionNumber){
              console.log("data is: ",data.ios.latest);
              this.appCom.getAppPreference("userCreds").then((uuData:any)=>{
                  sessionUserGlobalData=uuData;
                  sessionUserGlobalData.appUpdate = 1;
                  sessionUserGlobalData.appUrl = data.ios.url;
                  this.appCom.storeAppPreference("userCreds",sessionUserGlobalData);
              },(errr)=>{
                console.log("update errrr",errr);   
              });

              this.showUpdateAlert(data.ios.url);
            }else if(data.ios.latest == this.appVersionNumber){
              this.appCom.getAppPreference("userCreds").then((uuData:any)=>{
                  sessionUserGlobalData=uuData;
                  sessionUserGlobalData.appUpdate = 0;
                  sessionUserGlobalData.appUrl = '';
                  this.appCom.storeAppPreference("userCreds",sessionUserGlobalData);
              },(errr)=>{
                console.log("update errrr",errr);   
              });
              //this.showHotCodePushFixes();              
            }else{
              //this.showHotCodePushFixes();
            }

          } else {

            if(data.android.latest > this.appVersionNumber){
              console.log("data is: ",data.android.latest);
              this.appCom.getAppPreference("userCreds").then((uuData:any)=>{
                  sessionUserGlobalData=uuData;
                  sessionUserGlobalData.appUpdate = 1;
                  sessionUserGlobalData.appUrl = data.android.url;
                  this.appCom.storeAppPreference("userCreds",sessionUserGlobalData);
              },(errr)=>{
                console.log("update errrr",errr);   
              });

              this.showUpdateAlert(data.android.url);
            }else if(data.android.latest == this.appVersionNumber){
              this.appCom.getAppPreference("userCreds").then((uuData:any)=>{
                  sessionUserGlobalData=uuData;
                  sessionUserGlobalData.appUpdate = 0;
                  sessionUserGlobalData.appUrl = '';
                  this.appCom.storeAppPreference("userCreds",sessionUserGlobalData);
              },(errr)=>{
                console.log("update errrr",errr);   
              });   
              //this.showHotCodePushFixes();           
            }else{
             // this.showHotCodePushFixes();
            }
          }

        });

        console.log("netConnection : ",this.netConnection);
    });
    // check internet connection ends here
              
    //SET GLOBAL CHECK IN OUT LOCAL STORAGE 
    this.appCom.getLocalStorageItem("globalCheckinData").then((checkInData)=>{
        if(!checkInData){
          this.appCom.setLocalStorageItem("globalCheckinData",this.globalCheckInData);
        } 
    });

    // Okay, so the platform is ready and our plugins are available.
    // Here you can do any higher level native things you might need.
    
    this.statusBar.styleDefault();
		this.statusBar.overlaysWebView(false);
    
    this.splashScreen.hide();

    //this.setGeoLocation();
    //comment this
    this.appCom.getAddressByLatLong(52.5072095, 13.1452818).then(()=>{

    });
    console.log("start=>");

    // Open DB Connection
    this.sqlS.openDb().then(()=>{
        this.appCom.getLocalStorageItem("appDbInit").then((flag)=>{
          console.log("flag=>",flag);
            if(flag !=true ){
                //CREATE AND POPULATE DB 
                this.busyDBMessage='Please wait...';
                this.busyDB=this.sqlS.createInitialTables().then(
                    (resD)=>{
                        console.log("create query success",resD);
                          this.busyDBMessage='Please wait...';
                          this.busyDB=this.sqlS.insertInitialTablesDatas().then((resData)=>{
                          console.log("insert query success",resData);
                          this.appCom.setLocalStorageItem("appDbInit",true);
                          },(err)=>{
                          console.log("insert query error",err);
                        });
                    },(error)=>{
                        console.log("create query error ",error);
                    }
                );
            }else{

              this.appCom.getLocalStorageItem("appDbUpdateInit186").then((flagU)=>{
                  if(flagU !=true ){

                    this.busyDBMessage='Please wait...';
                    this.busyDB=this.sqlS.createUpdateInitialTables().then(
                        (resD)=>{
        
                            console.log("create query success",resD);
                            this.appCom.setLocalStorageItem("appDbUpdateInit186",true);
                        
                        },(error)=>{
                            console.log("create query error ",error);
                        }
                    );

                  }
              });
            }
        });
    });


    //HARDWARE BACK BUTTON EVENT
    this.platform.registerBackButtonAction(()=>{   

      let alertLen = document.getElementsByTagName("ion-alert").length;
      let modalLen = document.getElementsByTagName("ion-modal").length;
      let pickerLen = document.getElementsByTagName("ion-picker-cmp").length;
      let ionPopver = document.getElementsByTagName("ion-popover").length;
      
        if(alertLen > 0 || modalLen>0 || pickerLen>0 || ionPopver>0){
          return false;
        }
        
        // if(this.menu.isOpen('authenticated')){
        //   this.menu.close();
        //   return false;
        // }
      
        if(this.nav.canGoBack()){
            console.log('go back!!!');
            this.nav.pop();
        }else{
            let view = this.nav.getActive(); 
            if(!(view.instance instanceof HomePage)){
              if( (view.instance instanceof TermsAndConditon) || (view.instance instanceof OtpPage) || (view.instance instanceof LoginPage) || (view.instance instanceof MobileVerifyPage) || (view.instance instanceof ActivationRegisterPage)  || (view.instance instanceof MasonDashboardPage) || (view.instance instanceof TlhDashboardPage) || (view.instance instanceof AcDashboardPage ) || (view.instance instanceof AmDashboardPage )){
                    this.appConfirmExitBox();  
              }else{
                    this.nav.setRoot(HomePage);
              }
                
            }else{
                this.appConfirmExitBox();
            }
        }
    });

  }
  // fetchHotCodePushUpdate() {
  //   const options = {
  //     'config-file': hotCodePushPath+'/chcp.json'
  //   };
  //   chcp.fetchUpdate(this.updateHotCodePushCallback, options);
  // }
  // async updateHotCodePushCallback(error, data) {
  //   if (error) {
  //     console.error(error);
  //   } else {
  //     console.log('Update is loaded...');
  //     let titleR = await this.appCom.getTranslatedTxt("Critical update available.");
  //     let subTitle = await this.appCom.getTranslatedTxt("Download immediately to continue using app.");
  //     let updateTitle = await this.appCom.getTranslatedTxt("Update Now!");
  //     let alert = this.alertCtrl.create({
  //        enableBackdropDismiss: false,
  //        title: titleR,
  //        subTitle: subTitle,
  //          buttons: [{
  //          text: updateTitle,
  //          handler: () => {    
  //           this.busy = chcp.installUpdate(error => {
  //             if (error) {
  //               console.error('Update failed...', error);
  //             } else {
  //               console.log('Update installed...');
  //             }
  //           });
  //         }
  //        }
  
  //       ]
  
  //     });
  //     alert.present();
  //    }
  //  }
  // async showHotCodePushFixes(){
  //   console.log('hotCodePushPath', hotCodePushPath);
  //   chcp.isUpdateAvailableForInstallation(function(error, data) {
  //     console.log('isUpdateAvailableForInstallation error', error);
  //     console.log('isUpdateAvailableForInstallation data', data);
  //     if(error){
  //       return false;
  //     }else{
  //      this.fetchHotCodePushUpdate();
  //     }
  //   });

  //   return true;
  // }

  // Show update alert
  async showUpdateAlert(url){
    let titleR = await this.appCom.getTranslatedTxt("Critical update available.");
    let subTitle = await this.appCom.getTranslatedTxt("Download immediately to continue using app.");
    let updateTitle = await this.appCom.getTranslatedTxt("Update Now!");
		let alert = this.alertCtrl.create({
			 enableBackdropDismiss: false,
			 title: titleR,
			 subTitle: subTitle,
    		 buttons: [{
				 text: updateTitle,
				 handler: () => {          
					window.open(url, '_system');
					return false;
				}
			 }

			]

		});
		alert.present();
  }
  
  changeAppLanguage(event){
    let langName:any = this.appLanguage;
    console.log('lan is ',langName);
    this.translate.setDefaultLang(langName);
    this.translate.use(langName);
    this.appCom.setLocalStorageItem("language", langName);
    setTimeout(()=>{
        this.menu.close();
        this.defualtTranslateTxt();
    },500);
  }

  openPage(page) {
    // Reset the content nav to have just this page
    // we wouldn't want the back button to show in this scenario
      if(page.isRoot){
      this.nav.setRoot(page.component);
      page.isCurrent=true;
      this.setMenuCurrent(page.title);
    }else{
    // console.log('Get Active Index',this.nav.getActive().component);
    // console.log('Get Current Index',page.component);
      if(this.nav.getActive().component!==page.component){
        this.nav.push(page.component);
          page.isCurrent=true;
          this.setMenuCurrent(page.title);
      }
    
    }
  }

  setMenuCurrent(component){
    let checkFlag=0;
    for (let p of this.pagesSPH) {
      if(p.component.name==component.name)
      {
        checkFlag=1;
        p.isCurrent=true;
      }
      else
      {
        p.isCurrent=false;
      }  
    }
    if(!checkFlag){
      this.pagesSPH[0].isCurrent=true;
    }
  }


  async appConfirmExitBox(){
          let titleYes = await this.appCom.getTranslatedTxt("Yes");
          let titleNo = await this.appCom.getTranslatedTxt("No");
          let titleExit = await this.appCom.getTranslatedTxt(ALL_MESSAGE.COMMON_MESSAGE.APP_EXIT_MESSAGE);
          let confirm = this.alertCtrl.create({
                    title: titleExit,
                //  message:ALL_MESSAGE.COMMON_MESSAGE.APP_EXIT_MESSAGE,
                    cssClass:'confirmBox',
                    enableBackdropDismiss:false,
                    buttons: [
                      {
                        text: titleYes,
                        handler: () => {                        
                          this.platform.exitApp();
                        }
                      },
                      {
                        text: titleNo,
                        handler: () => {        
                          console.log('No btn clicked');
                        }
                      }
                    ]
                  });
                  confirm.present();
  }

  //GPS PERMISSION ALERT POP UP
	showGPSPopUp(){

	}


  //SHOW GENERIC ALERT POP UP
  async showPopUp(message:string){
    let titleOk = await this.appCom.getTranslatedTxt("Ok");  
    let messageT = await this.appCom.getTranslatedTxt(message); 
		let alert = this.alertCtrl.create({
			 title: '',
       enableBackdropDismiss:false,
			 subTitle: messageT,
    		 buttons: [{
				 text: titleOk,
        		 role: 'cancel',
				 handler: () => {
					this.platform.exitApp();
					console.log('Cancel clicked');
				}
			 }

			]

		});
		alert.present();
	}



  //LOCATION PERMISSION ALERT POP
  async	showLocationPermissionPopUp(){
    let titleOk = await this.appCom.getTranslatedTxt("Ok");  
    let subTitle = await this.appCom.getTranslatedTxt("Location permission is mandatory. Please accept location permission to access the app.");  
		cordova.plugins.diagnostic.requestLocationAuthorization((successCallback)=>{
			console.log('1',successCallback);
			if(successCallback=='DENIED'){
				//this.platform.exitApp();
				// this.showPopUp("location permission is mandatory ...please accept location permission.");
				let alert = this.alertCtrl.create({
				title: '',
        enableBackdropDismiss:false,
				subTitle: subTitle,
				buttons: [{
              text: titleOk,
              role: 'cancel',
              handler: () => {
                this.showLocationPermissionPopUp();	
              }
				}]
			});
			alert.present();
			}else if( successCallback=='DENIED_ALWAYS'){
				
				this.showPopUp("App cannot be accessed without location permission. Please enable location from app settings to launch app.");
			}else if( successCallback=='GRANTED' || successCallback=='GRANTED_WHEN_IN_USE'){
				this.setGeoLocation();
			}
			// Geolocation
		},(error)=>{
      console.log(error);
    });
	}


  //GET GEO LOCATION
  setGeoLocation(){
    //console.log("inside set geo location");
   	try{ 

              this.geolocation.getCurrentPosition({enableHighAccuracy: true}).then(pos => {
                console.log("getCurrentPosition=>",pos);
              console.log('lat: ' + pos.coords.latitude + ', lon: ' + pos.coords.longitude);
                this.shareS.setshareData("geoCordinates",pos);
              });
            
              let watch = this.geolocation.watchPosition().subscribe(pos => {
                console.log("watchPosition=>",pos);
              this.shareS.setshareData("geoCordinates",pos);
                console.log('lat: ' + pos.coords.latitude + ', lon: ' + pos.coords.longitude);
              });
   


		}catch(err){
			console.log('Geolocation err',err);
		}
  }

  goHome(page){
        if(page == 'sph'){
          this.nav.setRoot(HomePage);
        }else if(page == 'ac'){
          this.nav.setRoot(AcDashboardPage);
        }else if(page == 'am'){
          this.nav.setRoot(AmDashboardPage);
        }else if(page == 'tlh'){
          this.nav.setRoot(TlhDashboardPage);
        }else if(page == 'hpb'){
          this.nav.setRoot(MasonDashboardPage);
        }
        
  }
    
  activateSphByTlh(){
      this.nav.push(ActivateSphListPage,{});
  }

  activateSphByAc(){
      this.nav.push(AcActivateSphListPage,{});
  } 

  deactivateSphByTlh(){
    
      this.sphDeactiveLocalDataCheckSync().then((respRes:any)=>{
          console.log('respRes',respRes);
          this.appCom.getLocalStorageItem("globalCheckinData").then((checkInData)=>{
          console.log("checkInData-------->",checkInData);   

              if(respRes['respStatus']){
                    if(respRes['dataloss']==false){
                        if(!checkInData['checkinFlag']){
                            this.deactivateSphPresentConfirm("tlh");
                        }else{
                            this.appCom.showAlert('Please check out before deactivating','OK',null);
                            return false;
                        }
                      
                    }else{
                      this.appCom.showAlert('Please Sync All Data','OK',null);
                      return false;
                    }
              }else{
                    this.appCom.showAlert(ALL_MESSAGE.SERVER_MESSAGE.COMMON_ERROR,'OK',null);
              }
        
          },error=>{
            
          });
        
      },()=>{
          this.appCom.showAlert(ALL_MESSAGE.SERVER_MESSAGE.COMMON_ERROR,'OK',null);
      });

      
  }

  deactivateSphByAc(){
    
      this.sphDeactiveLocalDataCheckSync().then((respRes:any)=>{
          console.log('respRes',respRes);

              this.appCom.getLocalStorageItem("globalCheckinData").then((checkInData)=>{

                    if(respRes['respStatus']){
                          if(respRes['dataloss']==false){
                              if(!checkInData['checkinFlag']){
                                this.deactivateSphPresentConfirm("ac");
                              }else{
                                this.appCom.showAlert('Please check out before deactivating','OK',null);
                                return false;
                              }
                              
                          }else{
                            this.appCom.showAlert('Please sync all data','OK',null);
                            return false;
                          }

                    }else{
                          this.appCom.showAlert(ALL_MESSAGE.SERVER_MESSAGE.COMMON_ERROR,'OK',null);
                    }


              },error=>{
                    this.appCom.showAlert(ALL_MESSAGE.SERVER_MESSAGE.COMMON_ERROR,'OK',null);
              });

        },()=>{
                this.appCom.showAlert(ALL_MESSAGE.SERVER_MESSAGE.COMMON_ERROR,'OK',null);
        });

      
  }

  sphDeactiveLocalDataCheckSync(){
    return new Promise((resolve,reject)=>{

        let tableLists = SQL_QUERY.TABLE_TLH_SPH_MAIN_LIST;
        let respRet={};
        let tableWithStataArr=[];
        let dataloss = false;
        let respStatus=true;
        async.each(tableLists,(tableListName,callback)=>{
            let querySel="SELECT * FROM "+tableListName+" WHERE sync_status=0";
            this.sqlS.queryExecuteSql(querySel,[]).then((reslData:any)=>{
              let resLen = reslData.rows.length;  
                if(resLen>0){
                  tableWithStataArr.push({
                    tableName:tableListName,
                    tableRowsPendding:resLen
                  });
                  dataloss=true;
                }
                callback();
            },(err)=>{
                console.log('sphDeactiveLocalDataCheckSync err',err);
                respStatus=false;
                callback();
            });
        },(error)=>{
          console.log('sphDeactiveLocalDataCheckSync error',error);
          respRet['tableWithStataArr']=tableWithStataArr;
          respRet['dataloss']=dataloss;
          respRet['respStatus']=respStatus;
          resolve(respRet);
        });

    });
  }

  sphDeactivatedY(){
      return new Promise((resolve,reject)=>{
          console.log('sphDeactivatedY');
                this.appCom.getAppPreference("userCredsTemp").then((uData:any)=>{
                let tempUdata=uData;
                tempUdata['userId']=tempUdata['userId'];
                tempUdata['userIdG']=tempUdata['userId'];
                this.appCom.storeAppPreference("userCreds",tempUdata);
                this.appCom.getAppPreference("userCreds").then((uuData:any)=>{
                      sessionUserGlobalData=uuData;
                      resolve(true);
                },(errr)=>{
                      reject(false);
                });
            },(errr)=>{
                      reject(false);
              });
      });
  }
  
  async deactivateSphScussesPresentAlert() {
      let message = await this.appCom.getTranslatedTxt("You are now Deactivated as SPH. To Activate go to menu and select Activate.");
      let titleOk = await this.appCom.getTranslatedTxt("Ok");
      //let message="You are now Deactivated as SPH. To Activate go to menu and select Activate.";
      let alert = this.alertCtrl.create({
        subTitle: message,
        enableBackdropDismiss:false,
        buttons: [{
          text: titleOk,
          handler: () => {
            console.log('Ok clicked');
          }
        }]
      });
      alert.present();


  }

  async deactivateSphFailedPresentAlert() {
      //let message="SPH Deactivate Failed.";
      let message = await this.appCom.getTranslatedTxt("SPH Deactivate Failed.");
      let titleOk = await this.appCom.getTranslatedTxt("Ok");
      let alert = this.alertCtrl.create({
        subTitle: message,
        enableBackdropDismiss:false,
        buttons: [{
          text: titleOk,
          handler: () => {
            console.log('Ok clicked');
              
          }
        }]
      });
      alert.present();
  }

  async deactivateSphPresentConfirm(fromName) {
    //let subTitle = 'Are you sure you want to deactivate As SPH?';
    let subTitle = await this.appCom.getTranslatedTxt("Are you sure you want to deactivate As SPH?");
    let titleYes = await this.appCom.getTranslatedTxt("Yes");
    let titleCancel = await this.appCom.getTranslatedTxt("Cancel");
    let alert = this.alertCtrl.create({
      subTitle:await this.appCom.getTranslatedTxt(subTitle),
      enableBackdropDismiss:false,
      buttons: [
        {
          text: titleYes,
          handler: () => {
            console.log('Yes clicked');
            //this.activateSphPresentAlert();
            this.busy=this.sphDeactivatedY().then(()=>{
              this.shareS.setshareData('masterSync',true);
                if(fromName=="tlh"){
                      let menuName="tlhMainMenu";
                      this.menu.enable(false);
                      this.menu.enable(true,menuName);
                      this.deactivateSphScussesPresentAlert();
                      this.nav.setRoot(TlhDashboardPage,{}).then(()=>{
                      });
                }else if(fromName=="ac"){
                    let menuName="acMainMenu";
                    this.menu.enable(false);
                    this.menu.enable(true,menuName);
                    this.deactivateSphScussesPresentAlert();
                    this.nav.setRoot(AcDashboardPage,{}).then(()=>{
                    });
                }
            },()=>{
                this.deactivateSphFailedPresentAlert();
            }); 
          }
        },
        {
          text: titleCancel,
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
          }
        }


      ]
    });
    alert.present();
  }

  async defualtTranslateTxt(){
    let tpleaseWaitTxtTransl = await this.appCom.getTranslatedTxt("Please Wait...");
    pleaseWaitTxtTransl = tpleaseWaitTxtTransl.toString();
    let tmobisPlaceHolderWaitTxtTransl = await this.appCom.getTranslatedTxt("Please select");
    mobisPlaceHolderWaitTxtTransl = tmobisPlaceHolderWaitTxtTransl.toString();
    let tmobisSetBtnTxtTransl = await this.appCom.getTranslatedTxt("set");
    mobisSetBtnTxtTransl = tmobisSetBtnTxtTransl.toString();
    let tmobisClearBtnTxtTransl = await this.appCom.getTranslatedTxt("clear");
    mobisClearBtnTxtTransl = tmobisClearBtnTxtTransl.toString();
    let  tmobisCancelBtnTxtTransl = await this.appCom.getTranslatedTxt("cancel");
    mobisCancelBtnTxtTransl = tmobisCancelBtnTxtTransl.toString();
    let tfilterEmptyText = await this.appCom.getTranslatedTxt("No results");
    filterEmptyText = tfilterEmptyText.toString();
    let tfilterPlaceholderText = await this.appCom.getTranslatedTxt("Type to filter");
    filterPlaceholderText = tfilterPlaceholderText.toString();
    mobisBtnArr = [{handler:"set",text:tmobisSetBtnTxtTransl},{handler:"clear",text:tmobisClearBtnTxtTransl},{handler:"cancel",text:mobisCancelBtnTxtTransl}];
    let a = await this.appCom.getTranslatedTxt("Approved");
    let p = await this.appCom.getTranslatedTxt("Pending");
    let r = await this.appCom.getTranslatedTxt("Rejected");
    allAppPendRejObj={a:a,p:p,r:r};
  }

}
