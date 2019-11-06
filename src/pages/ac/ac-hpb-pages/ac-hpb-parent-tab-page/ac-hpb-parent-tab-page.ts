import { Component, ViewChild } from '@angular/core';
import { AlertController, Events, IonicPage, NavController, NavParams, Platform } from 'ionic-angular';
import { SuperTabsController } from 'ionic2-super-tabs';
import { appCommonMethods } from "../../../../providers/appCommonMethods";
import { SqlServices } from "../../../../providers/sqlService";
import { ALL_MESSAGE } from "../../../../providers/constant";
import { AcHpbDetailsPage } from "../ac-hpb-detail/ac-hpb-detail";
import { AcHpbProductReceiptsPage } from "../ac-hpb-product-receipts/ac-hpb-product-receipts";
import { AcHpbProductRequestsPage } from "../ac-hpb-product-request/ac-hpb-product-request";
import { AcHpbProjectListPage } from "../ac-hpb-project-list/ac-hpb-project-list";

declare var cordova;



@Component({
  selector: 'ac-hpb-parent-tab-page',
  templateUrl: 'ac-hpb-parent-tab-page.html',
})
export class AcHpbParentTabsPage {

  page1: any = AcHpbDetailsPage;
  page2: any = AcHpbProjectListPage;
  page3: any = AcHpbProductReceiptsPage;
  page4: any = AcHpbProductRequestsPage;
  paramsData:any;
  selectedIndex:any ;
  hpbData:any;
  hpbName:any;
  projData:any=[];
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
    }else if( tab == "projects" ){
       this.selectedIndex=1;
       this.superTabsCtrl.slideTo(1);
    }

        this.page1 = AcHpbDetailsPage; 
        this.page2 = AcHpbProjectListPage; 
        this.page3 = AcHpbProductReceiptsPage; 
        this.page4 = AcHpbProductRequestsPage;  
  }

  ionViewDidLoad() {
     	      //GET CURRENT USER DATA
        this.platform.ready().then(() => {
        this.appCom.getAppPreference("userCreds").then((resDataU)=>{
                    if( resDataU != undefined && resDataU != '' ){
                    this.userId=resDataU['user']['id'];
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







}
