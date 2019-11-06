import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, App, Events } from 'ionic-angular';
import { App_projectsApi } from "../../../shared/loopback_sdk/index";
import { SqlServices } from "../../../providers/sqlService";
import { appCommonMethods } from "../../../providers/appCommonMethods";
import { Subscription } from "rxjs/Rx";
import { TlhProjectDetailPage } from "../tlh-project-detail/tlh-project-detail";
import { ALL_MESSAGE } from "../../../providers/constant";



@Component({
  selector: 'page-tlh-projects-all',
  templateUrl: 'tlh-projects-all.html',
})
export class TlhProjectsAllPage {
  busy: Subscription;
  busyMessage: any;
  userName:any;
  uId:number;
  userRole="$tlh";
  projData:any=[];
  projDataTemp:any=[];
  limit:number = 5;
  pages:number = 0;
  dataLen:number = 0;
  searchString:any=null;
  dataLoadCompleted:any=false;
  filterby:any='';
  projFilterArr:any={
     subDistrict:null,
     projectStage:null,
     projectType:null,
     isSrku:null,
     tabType:null
  }

  constructor(public navCtrl: NavController, public navParams: NavParams,public projectApi:App_projectsApi,public appCom:appCommonMethods,public app :App,public sqlS:SqlServices,public events:Events) {
    this.events.subscribe('tlhProjectAListFilter',(filterObj) => {
      if(filterObj){
          if( filterObj['projFilterArr'] ){ 
              this.projFilterArr = filterObj['projFilterArr'];
              this.filterby=filterObj?filterObj['filterby']:"";

              if(this.projFilterArr['fromDate'] != null && this.projFilterArr['fromDate'] != undefined ){
                  this.projFilterArr['fromDate']=this.appCom.dateToTimeStamp(this.projFilterArr.fromDate);
              }

              if(this.projFilterArr['toDate'] != null && this.projFilterArr['toDate'] != undefined ){
                  this.projFilterArr['toDate']=this.appCom.dateToTimeStamp(this.projFilterArr.toDate);
              }

              this.pages=0;
              this.projData=[];
              this.loadData();
          }
      }    
    });

     /*this.events.subscribe('cleartlhProjectAListFilter',() => {
         console.log("<------------------------------------------------------------->");
         this.clearFilter();
     });*/

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad TlhProjectsAllPage');
  }

  async ionViewDidEnter(){
      this.busyMessage = await this.appCom.getTranslatedTxt("Please wait...");  
      console.log('ionViewDidEnter TlhProductReceiptsAllPage');
      this.clearFilter();  
  }


  	loadData(){
      return new Promise((resolve,reject)=>{
          let tempSrku=(this.projFilterArr.isSrku==0)?"0":this.projFilterArr.isSrku;
          this.busy = this.projectApi.getProjectWithApp(null,null,this.searchString,this.projFilterArr.projectType,this.projFilterArr.projectStage,null,tempSrku,null,null,null,null,this.uId,this.userRole,this.limit,this.pages,null,this.projFilterArr.subDistrict).subscribe(resData => {    
          this.pages++;  
            this.dataLen = resData.result.length;
            if(this.dataLen < this.limit){
              this.dataLoadCompleted = true;
            }
            for (let x=0; x< resData.result.length;x++) {
              this.projData.push(resData.result[x]);

            }
            this.projDataTemp=this.projData;
            resolve(true);
            console.log("this.projData", this.projData);
          },
          error => {
            reject(error);
            console.log("error", error);
          });
      });    
  }

//SEARCH Projects
searchProjects(ev){
     console.log("ev",ev);

        this.pages=0;
        this.limit=5;
        this.projData=[];
        //this.projData=this.projDataTemp;
        if(ev.target.value != undefined && ev.target.value != '' ){
            this.searchString = ev.target.value;
        }else{
            this.searchString=null;
        }
        this.loadData();
        
  }

  goToTlhProjectDetail(projItem){
    this.app.getRootNav().push(TlhProjectDetailPage,{
      "projectId":projItem['project_id']
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

  doRefresh(refresher) {
    //console.log('Begin async operation', refresher);
    setTimeout(() => {
      //console.log('Async operation has ended');
      refresher.complete();
      this.ionViewDidEnter();
    }, 2000);
  }

    clearFilter(){
    this.appCom.getAppPreference("userCreds").then(
        resDataU => {
        this.userName = resDataU.user.realm;
        let uId = resDataU.userId;
        this.uId = parseInt(uId);
        this.projData=[];
        this.pages=0;
        this.limit=5;

        this.projFilterArr={
          subDistrict:null,
          projectStage:null,
          projectType:null,
          isSrku:null,
          tabType:null
        }
        this.filterby="";
        this.pages=0;
        this.projData=[];
        this.loadData();

      },
    err => {
        console.log("err ref", err);
    });
  }

}
