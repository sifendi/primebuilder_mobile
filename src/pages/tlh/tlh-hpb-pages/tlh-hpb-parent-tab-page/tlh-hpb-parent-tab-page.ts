import { Component, ViewChild } from '@angular/core';
import { AlertController, Events, IonicPage, NavController, NavParams, Platform } from 'ionic-angular';
import { SuperTabsController } from 'ionic2-super-tabs';
import { TlhHpbDetailsPage } from "../tlh-hpb-detail/tlh-hpb-detail";
import { TlhHpbProjectListPage } from "../tlh-hpb-project-list/tlh-hpb-project-list";
import { TlhHpbProductReceiptsPage } from "../tlh-hpb-product-receipts/tlh-hpb-product-receipts";
import { TlhHpbProductRequestsPage } from "../tlh-hpb-product-request/tlh-hpb-product-request";
import { appCommonMethods } from "../../../../providers/appCommonMethods";
import { SqlServices } from "../../../../providers/sqlService";
import { ALL_MESSAGE } from "../../../../providers/constant";


declare var cordova;



@Component({
  selector: 'tlh-hpb-parent-tab-page',
  templateUrl: 'tlh-hpb-parent-tab-page.html',
})
export class TlhHpbParentTabsPage {

  page1: any = TlhHpbDetailsPage;
  page2: any = TlhHpbProjectListPage;
  page3: any = TlhHpbProductReceiptsPage;
  page4: any = TlhHpbProductRequestsPage;
  paramsData:any;
  selectedIndex:any ;
  hpbData:any;
  hpbName:any;
  projData:any=[];
  editFlag:any=true;
  globalCheckInData:any=[];
  busy:  Promise<any>;
  busyMessage:any;
  userId:any;


  constructor(public navCtrl: NavController, public navParams: NavParams,public appCom:appCommonMethods,public alertCtrl:AlertController,public sqlS: SqlServices,public events:Events,private superTabsCtrl: SuperTabsController,public platform: Platform) {
     
    this.appCom.getLocalStorageItem("globalCheckinData").then((checkinObj)=>{
    this.globalCheckInData = checkinObj;
    });

    this.selectedIndex=0;
    this.paramsData = this.navParams.data;
    this.hpbName = this.paramsData['hpbName']?this.paramsData['hpbName']:"";
    this.hpbData =this.paramsData['hpbData'];

    var tab= this.paramsData.tab ;
    if( tab == "detail" ){
       this.selectedIndex=0;
       this.superTabsCtrl.slideTo(0);
       this.editFlag = true;

    }else if( tab == "projects" ){
       this.selectedIndex=1;
       this.superTabsCtrl.slideTo(1);
       this.editFlag = false;

    
    }

        this.page1 = TlhHpbDetailsPage; 
        this.page2 = TlhHpbProjectListPage; 
        this.page3 = TlhHpbProductReceiptsPage; 
        this.page4 = TlhHpbProductRequestsPage;  
  }

  ionViewDidLoad() {
     	      //GET CURRENT USER DATA
        this.platform.ready().then(() => {
        this.appCom.getAppPreference("userCreds").then((resDataU)=>{
                    if( resDataU != undefined && resDataU != '' ){
                    this.userId=resDataU.userId;
                    }else{
                    this.userId="";
                    }
                },(err)=>{
                    console.log('err ref',err);
                });
        });


  }

  async ionViewDidEnter(){
    this.busyMessage = await this.appCom.getTranslatedTxt("Please wait...");
  }

  onTabChange(){
      
  }

   onTabSelect($event){
    this.selectedIndex =  $event.index; 
         if( $event.index == 0 ){
           this.editFlag = true;
         }else{
             this.editFlag = false;
         }
   }



}
