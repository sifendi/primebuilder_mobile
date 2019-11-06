import { Component,NgZone } from '@angular/core';
import { Events, IonicPage, NavController, NavParams,AlertController } from 'ionic-angular';
import { App, Platform } from 'ionic-angular';
import { SqlServices } from "../../../../providers/sqlService";
import { appCommonMethods } from "../../../../providers/appCommonMethods";
import { ALL_MESSAGE } from "../../../../providers/constant";
import { App_projectsApi } from "../../../../shared/loopback_sdk/index";
import { CallNumber } from "@ionic-native/call-number";
import { ShareService } from "../../../../providers/ShareService";
import { AcHpbProjectDetailPage } from "../ac-hpb-project-detail/ac-hpb-project-detail";


declare var cordova;

@Component({
  selector: 'ac-hpb-page-project-list',
  templateUrl: 'ac-hpb-project-list.html',
})
export class AcHpbProjectListPage {
  
  projData:any=[];
  projDataTemp:any=[];
  filterby:any="";
  paramData:any;
  globalCheckInData:any=[];

  busy:  any;
  busyMessage:any;
  check:any=false;
  userId:any;
  serverHpbId:any;

  limit:number = 5;
  pages:number = 0;
  dataLen:number = 0;
  userName:any;
  uId:number;
  userRole="$ac";
  dataLoadCompleted:any=false;
  hpbId:any;
   constructor(public navCtrl: NavController, public navParams: NavParams,public sqlS:SqlServices,public appCom:appCommonMethods,public shareS :ShareService,public callNumber: CallNumber,public app:App,public events:Events,public projectApi:App_projectsApi) {
  
  }

  ionViewDidLoad() {

  }

    async ionViewDidEnter(){
        this.busyMessage = await this.appCom.getTranslatedTxt("Please wait..."); 
        let paramData=this.navParams.data;
        this.hpbId =paramData['hpbId']; 
        this.appCom.getAppPreference("userCreds").then(
        resDataU => {
            this.userName = resDataU.user.realm;
            let uId = resDataU.userId;
            this.uId = parseInt(uId);
            this.projData=[];
            this.pages=0;
            this.limit=5;
            this.loadData();
        },
        err => {
            console.log("err ref", err);
        });

    }

    loadData(){
        this.busy =  this.projectApi.getProjectWithApp(this.hpbId,null,null,null,null,null,null,null,null,null,null,null,null,this.limit,this.pages,null).subscribe(resData => {
            this.pages++;  
            this.dataLen = resData.result.length;
            for (let x=0; x< resData.result.length;x++) {
            this.projData.push(resData.result[x]);
            }    
        });
    }

    doInfinite(infiniteScroll) {
        setTimeout(() => {
        if(this.dataLen < this.limit){
            this.dataLoadCompleted = true;
        }else{
            this.loadData();
        }
        infiniteScroll.complete();
        }, 500);
    }

    alreadyCheckInAlert(){
        this.appCom.showAlert(ALL_MESSAGE.ERROR_MESSAGE.ALREADY_CHECKED_IN,"Close","");
    }

   //SEARCH PROJECT
   searchProject(eventVal){

   }
   
   goToProjectDetail(projItem){
       console.log("pushing to detail",projItem);
       this.app.getRootNav().push(AcHpbProjectDetailPage,{
           "projId":projItem['project_id'],
       });
   }

   goToFilterPage(){
     
   }

   clearFilter(){
       
   }

}
