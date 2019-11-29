import { Component,ViewChild } from '@angular/core';
import { Tabs, NavController, NavParams, AlertController, Events, Platform } from 'ionic-angular';
import { ShareService } from "../../../../providers/ShareService";
import { AddVisitFormPage } from "../../../visit-pages/visit-add-form/visit-add-form";
import { VisitDetailsPage } from "../../../visit-pages/visit-detail-page/visit-detail-page";
import { SqlServices } from "../../../../providers/sqlService";
import { appCommonMethods } from "../../../../providers/appCommonMethods";
import { App_rds_visitApi } from "../../../../shared/loopback_sdk/index";

import * as moment from 'moment';
import { ALL_MESSAGE } from "../../../../providers/constant";
import { AcVisitDetailsPage } from "../ac-visit-detail-page/ac-visit-detail-page";
declare var cordova;
declare var sessionUserGlobalData;


@Component({
  selector: 'ac-distributor-retailer-detail-page',
  templateUrl: 'ac-distributor-retailer-detail-page.html',
})
export class AcDistributorRetailerDetailPage {
  page1: any = AcDistributorVisitListPage;
  page2: any = AcDistributorDetail;
  parentThis = this;
  paramsData:any=[];
  selectedIndex:any=0;
  rdsDataArr:any;
  globalCheckInData:any=[];
  insertId:any;
  check:any=false;
    busy:  Promise<any>;
    busyMessage:any;
    userId:any;

  constructor(public navCtrl: NavController, public navParams: NavParams,public shareS :ShareService,public appCom:appCommonMethods,public sqlS: SqlServices,public alertCtrl:AlertController,public events:Events,public platform: Platform ) {


    this.shareS.setshareData("this",this);
    this.paramsData=this.navParams.data;
    this.rdsDataArr=this.paramsData['rdsData'];
    console.log(" rds data ",this.rdsDataArr);
    let tab = this.paramsData['tab'];
    if( tab == "visit" ){
        this.selectedIndex = 1;
    }else{
        this.selectedIndex = 0;
    }


    this.page1 = AcDistributorVisitListPage;
    this.page2 = AcDistributorDetail;
  }

    ionViewDidLoad() {
        console.log('ionViewDidLoad SphVisitPage');

        this.events.subscribe('visitListData',(rdsData) => {
            this.paramsData['rdsData']=rdsData;
            console.log("this.paramsRdsData--,",this.paramsData);
        });

        this.events.subscribe("rdsVisitListRefresh",()=>{
        });

        //GET CURRENT USER DATA
        this.platform.ready().then(() => {
            this.userId = sessionUserGlobalData.userId;
            console.log("Platform is ready");
        });
    }

    async ionViewDidEnter(){
     this.busyMessage = await this.appCom.getTranslatedTxt("Please wait...");
    }

    goToVisitForm(){
        this.navCtrl.push(AddVisitFormPage ,{ "rdsData" : this.rdsDataArr } );
    }

    onTabSelect($event){

    }

    alreadyCheckInAlert(){
        this.appCom.showAlert(ALL_MESSAGE.ERROR_MESSAGE.ALREADY_CHECKED_IN,"Close","");
    }

}





//-----------VISIT LIST--------------------------------------------------------------------------------------------------------->


@Component({
  selector: 'ac-distributor-visit-list',
  template: `



<ion-content  fullscreen="false" [ngBusy]="{busy: busy, message:busyMessage, minDuration: 600}" >
  <div *ngIf="showEmptyFlag">
            <h2 class="noData contMid">{{ 'NO VISITS FOUND' | translate }}</h2>
        </div>
    <div class="flexWrap lineInOne" *ngFor="let visit of retailerDistributorVisitData; let i = index;" (click)="goToVisitDetail(visit)" >
        <span class="indexVisit">{{i+1}}</span>
        <div class="visitDate">
            <h2>{{  visit['visit_date'] }}</h2>
        </div>
        <ion-icon name="log-in"></ion-icon>
    </div>

</ion-content>
  `
})
export class AcDistributorVisitListPage {
    rdsDataArr: any;
    dataLoadCompleted: any = false;
    dataLen: any;
    limit: number;
    pages: number;
    retailerDistributorVisitData: any[];
    uId: number;
    roleName: any;
    userName: any;
    paramsData:any=[];

    visitsData:any=[];
    paramsRdsData:any=[];
    busyMessage:any="Please Wait...";
    busy:any;
    showEmptyFlag:any=false;

  constructor(private appRdsVisit:App_rds_visitApi,public navCtrl: NavController, public navParams: NavParams,public sqlS:SqlServices,public shareS :ShareService,private appCom:appCommonMethods,public events:Events) {
    this.paramsData=this.navParams.data;
    this.rdsDataArr=this.paramsData['rdsData'];
    console.log(" visit tab this.rdsDataArr ",this.rdsDataArr);
  }

    ionViewDidLoad() {
        /*this.events.subscribe("rdsVisitListRefresh",()=>{
            setTimeout(()=> {
                this.listData();
            }, 300);
        });

        this.listData();*/
    }

    async ionViewDidEnter() {
        this.busyMessage = await this.appCom.getTranslatedTxt("Please wait...");
        console.log(" tlh ionViewDidEnter called ");
        this.userName = sessionUserGlobalData.user.userinfo[0].name;
        this.roleName = sessionUserGlobalData.user.roles[0].name;
        let uId = sessionUserGlobalData.userId;
        this.uId = parseInt(uId);
        this.retailerDistributorVisitData=[];
        this.pages=0;
        this.limit=5;
        this.dataLoadCompleted = false;
        this.loadData();
    }

    loadData(){
        console.log('ionViewDidLoad tlh VisitPage');
        this.busy=this.appRdsVisit.getRdsVisit(null,this.rdsDataArr.id).subscribe(resData => {
            this.pages++;
            this.dataLen = resData.result.length;
            if(this.dataLen < this.limit){
                this.dataLoadCompleted = true;
            }
            if(this.dataLen == 0){
                this.showEmptyFlag = true;
            }
            for (let x=0;x<this.dataLen;x++) {
                console.log(" loaded data rds ",resData.result[x]);
                resData.result[x].visit_date = this.appCom.timeStampToDate(resData.result[x].visit_date);
                this.retailerDistributorVisitData.push(resData.result[x]);
            }
        },
        error => {
            console.log("error", error);
        });
    }

  goToVisitDetail(visit){
    var t=  this.shareS.getshareData("this")
    t.navCtrl.push(AcVisitDetailsPage,{
      "visitId" : visit['rds_visit_id'],
      "visitDate":visit['visit_date'],
      //"rdsName":this.paramsRdsData['rdsData']['rds_name']
       "rdsData":this.rdsDataArr
    });
  }






}





//-----------DISTRIBUTOR/CONTRACTOR DETAIL--------------------------------------------------------------------------------------------------------->


@Component({
  selector: 'ac-page-sph-detail',
  template: `


<ion-content fullscreen="false">
    <div class="userForm">
        <div class="form_list">
            <h2 class="labelHeading">{{ rdsDataArr['rds_type']?rdsDataArr['rds_type']:"-" }}</h2>
            <ion-card>
                <ion-card-header>
                    {{ 'MOBILE NO. ' | translate }}
                </ion-card-header>
                <ion-card-content>
                   {{ rdsDataArr['rds_phone']?rdsDataArr['rds_phone']:"-" }}
                </ion-card-content>
            </ion-card>
            <ion-card>
                <ion-card-header>
                    {{ 'ADDRESS' | translate }}
                </ion-card-header>
                <ion-card-content>
                     {{ rdsDataArr['rds_address']?rdsDataArr['rds_address']:"-" }}
                </ion-card-content>
            </ion-card>
            <div class="two_coloum">
                <ion-card>
                    <ion-card-header>
                        {{ "POSTAL CODE" | translate }}
                    </ion-card-header>
                    <ion-card-content>
                        {{ rdsDataArr['postal_code_display_str']?rdsDataArr['postal_code_display_str']:"-" }}
                    </ion-card-content>
                </ion-card>
                <ion-card>
                    <ion-card-header>
                        {{ "PROVINCE" | translate }}
                    </ion-card-header>
                    <ion-card-content>
                        {{ rdsDataArr['province_display_str']?rdsDataArr['province_display_str']:"-" }}
                    </ion-card-content>
                </ion-card>
            </div>
            <div class="two_coloum">
                <ion-card>
                    <ion-card-header>
                        {{ "CITY / MUNICIPALITY" | translate }}
                    </ion-card-header>
                    <ion-card-content>
                       {{ rdsDataArr['city_display_str']?rdsDataArr['city_display_str']:"-" }}
                    </ion-card-content>
                </ion-card>
                <ion-card>
                    <ion-card-header>
                       {{ "SUB DISTRICT" | translate }}
                    </ion-card-header>
                    <ion-card-content>
                        {{ rdsDataArr['sub_district_display_str']?rdsDataArr['sub_district_display_str']:"-" }}
                    </ion-card-content>
                </ion-card>

            </div>
        </div>
    </div>
</ion-content>


  `
})
export class AcDistributorDetail {
  paramsRdsData:any=[];
  rdsDataArr:any=[];
  constructor(public navCtrl: NavController, public navParams: NavParams,public events:Events) {
  this.paramsRdsData=this.navParams.data;
  this.rdsDataArr=this.paramsRdsData['rdsData'];
    console.log(" this.paramsRdsData2 ",this.paramsRdsData,this.rdsDataArr);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad tlh DistributorDetail');
  }

}
