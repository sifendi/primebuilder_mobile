
import { IonicPage, NavController, NavParams, App, Events, ModalController } from 'ionic-angular';

import { Component,ViewChild } from '@angular/core';
import { CallNumber } from '@ionic-native/call-number';

import { SqlServices } from "../../../../providers/sqlService";
import { appCommonMethods } from "../../../../providers/appCommonMethods";
import { ShareService } from "../../../../providers/ShareService";
import { App_hpbApi } from "../../../../shared/loopback_sdk/index";
import { TlhHpbDetailsPage } from "../tlh-hpb-detail/tlh-hpb-detail";
import { TlhHpbParentTabsPage } from "../tlh-hpb-parent-tab-page/tlh-hpb-parent-tab-page";
import { ALL_MESSAGE } from "../../../../providers/constant";
import { TlhHpbFilterPage } from "../tlh-hpb-filter/tlh-hpb-filter";


@Component({
  selector: 'tlh-hpb-list',
  templateUrl: 'tlh-hpb-list.html',
})
export class TlhHpbListPage {
 
  
  page1: any = TlhHpbListMasonPage;
  page2: any = TlhHpbListContractorPage;
  selectedIndex:any =0;
  paramsData:any;
  paramsDataC:any;
  paramsDataM:any;
  hpbType="mason";
  hpbFilterArr:any={
     city:null,
     searchFilter:null,
     hpbType:null,
     hpbStatus:null,
  }

  constructor(public navCtrl: NavController,public navParams: NavParams,public sqlS:SqlServices,public appCom:appCommonMethods,public shareS :ShareService,public app:App,public modalCtrl:ModalController,public events:Events) {

        this.page1 = TlhHpbListMasonPage;
        this.page2 = TlhHpbListContractorPage;
  }

    ionViewDidLoad() {
     console.log('ionViewDidLoad HpbListPage');

    }

    goToHpbDetail(hpb_id){
    
    }


    goToHpbFilter(){
       
        let selFilterData={
            hpbType:this.hpbType,
            hpbFilterArr:this.hpbFilterArr
        };
        let filterPageD = this.modalCtrl.create(TlhHpbFilterPage,{selFilterData:selFilterData});
        filterPageD.onDidDismiss((fDataRes:any)=>{
            if( fDataRes['type']=='mason' ){
                this.hpbFilterArr=fDataRes['hpbFilterArr'];
                this.events.publish("tlhHpbMasonListFilter",fDataRes);
                
            }else if( fDataRes['type']=='contractor' ){
                this.hpbFilterArr=fDataRes['hpbFilterArr'];
                this.events.publish("tlhHpbContrListFilter",fDataRes);
            }
            
        });
        filterPageD.present();
    }

    onTabSelect(ev: any) {
        console.log('Tab selected', 'Index: ' + ev.index, 'Unique ID: ' + ev.id);
        if(ev.index==0){
            this.hpbType="mason";
            this.hpbFilterArr['city']=null;
            this.hpbFilterArr['searchFilter']=null;
            this.hpbFilterArr['hpbStatus']=null;
            this.events.publish("cleartlhHpbMasonListFilter"); 
        }else{
            this.hpbType="contractor";
            this.hpbFilterArr['city']=null;
            this.hpbFilterArr['searchFilter']=null;
            this.hpbFilterArr['hpbStatus']=null;
            this.events.publish("cleartlhHpbContrListFilter"); 
        }
    
    }



  addHPB(){

  }

   
 


}






//--------MASON TAB------------------------------------------------------------------------------------------------------------------------------------------------------------------->


@Component({
  selector: 'tlh-hpb-list-mason',
  template: ` 
<ion-header> 
    <ion-searchbar [(ngModel)]="myInput"  (ionInput)="searchHpb($event)" name="searchBar" placeholder="{{ 'SEARCH' | translate }}"></ion-searchbar> 
    
</ion-header>           

    <ion-content fullscreen="false" [ngBusy]="{busy: busy, message:busyMessage, minDuration: 600}" [ngClass]="{'searchExtraMar': (filterby !=undefined && filterby != '') }" >
                 <div class="filterTag" *ngIf="filterby !=undefined && filterby != ''">
        <p>Search by : {{ filterby }} </p>
        <button ion-button color="light" class="closeStyle" (click)="clearFilter()">
            <i class="icon-close-thin"></i>
        </button>
    </div> 
                <ion-list class="listWrap">
                    <div *ngIf="hpbData == undefined || hpbData == '' "> <h2 class="noData contMid">No Masons Found</h2> </div>
                    <div class="itemWrap" *ngFor="let hpb of hpbData">
                        <ion-item class="listItem">
                            <ion-avatar item-left *ngIf="hpb['hpb_profile_pic_parsed'] != undefined && hpb['hpb_profile_pic_parsed'] != ''" >
                                <img [src]="hpb['hpb_profile_pic_parsed']">
                            </ion-avatar>
                            <div class="leftContent">
                                <h2 *ngIf="hpb['hpb_name'] !=undefined && hpb['hpb_name'] !=''">{{ hpb['hpb_name'] }}</h2>
                                <div class="mobileWrap">
                                    <p class="title inline" *ngIf="hpb['primary_mobile_no'] !=undefined && hpb['primary_mobile_no'] !=''">Mobile No.</p>
                                    <span class="value inline">{{ hpb['primary_mobile_no'] }}</span>
                                    <button ion-button color="light" (click)=" makephonecall(hpb['primary_mobile_no'])" >
                                        <i class="icon-call"></i>
                                    </button>
                                    <p class="title dark" *ngIf="hpb['domicile_city'] !=undefined && hpb['domicile_city'] !=''">City: <span> {{ hpb['domicile_city'] }}</span></p>
                                    <p class="title dark">SPH Name: <span> {{ hpb['sph_name']?hpb['sph_name']:'-' }}</span></p>
                                </div>
                            </div>
                            <span class="tag" *ngIf="hpb['hpb_status'] !=undefined && hpb['hpb_status'] !=''">{{ hpb['hpb_status'] }}</span>
                            <!--<div class="arrow_box notVisit">
                                Not Visited
                            </div>-->
                            <!--<button class="checkIn nextTo" ion-button color="light">
                            CHECK IN<i class="icon-next"></i>
                        </button>-->
                        </ion-item>
                        <div class="ntpr">
                            <div class="btn">
                                <button class="vDetail" ion-button type="button" (click)="goToHpbDetail( hpb )">
                        {{ 'VIEW DETAILS' | translate}}
                    </button>
                                <button class="vProject" ion-button type="button" (click)="goToProjectList( hpb )" >
                       {{ 'VIEW PROJECTS' | translate }}
                    </button>
                            </div>
                        </div>
                    </div>
                        <ion-infinite-scroll (ionInfinite)="doInfinite($event)" [enabled]="!dataLoadCompleted">
                            <ion-infinite-scroll-content></ion-infinite-scroll-content>
                        </ion-infinite-scroll>
                </ion-list>
            </ion-content>
  `
})
export class TlhHpbListMasonPage {
 
  hpbData:any=[];
  hpbDataTemp:any=[];
  hpbProfilePic:any;
  filterby:any="";
  myInput:any='';
  busyMessage:any;
  busy:any;
  limit:number = 5;
  pages:number = 0;
  dataLen:number = 0;
  userName:any;
  uId:number;
  userRole="$tlh";
  searchbyall:any=false;
  searchhit:any=false;
  searchString:any=null;
  dataLoadCompleted:any=false;
  hpbFilterArr:any={
     city:null,
     searchFilter:null,
     hpbType:null,
     hpbStatus:null
  }

  constructor(public navCtrl: NavController, public navParams: NavParams,public sqlS:SqlServices,public appCom:appCommonMethods,public shareS :ShareService,public callNumber: CallNumber,public app:App,public events:Events,public hpbApi: App_hpbApi) {
        this.events.subscribe('tlhHpbMasonListFilter',(filterObj) => {
         if(filterObj){
            this.hpbFilterArr = filterObj['hpbFilterArr'];
            this.filterby=filterObj?filterObj['filterby']:"";
            this.pages=0;
            this.hpbData=[];
            this.searchhit=false;
            this.loadData();
         }   

	    });

        // this.events.subscribe('cleartlhHpbMasonListFilter',() => {
        //  console.log("<------------------------------------------------------------->");
        //  this.clearFilter();
        // })

  }

  ionViewDidLoad() {

  }

 async ionViewDidEnter(){
       this.busyMessage = await this.appCom.getTranslatedTxt("Please wait...");
        this.dataLoadCompleted=false;
        this.searchhit=false;
        this.appCom.getAppPreference("userCreds").then(
        resDataU => {
            this.userName = resDataU.user.realm;
            let uId = resDataU.userId;
            this.uId = parseInt(uId);
            this.hpbData=[];
            this.pages=0;
            this.limit=5;
             this.clearFilter();
        },
    err => {
        console.log("err ref", err);
    });

  }

    loadData(){
        return new Promise((resolve,reject)=>{
            let searchObjData = null;
            if(this.hpbFilterArr.searchFilter){
                searchObjData = {'searchFilter':this.hpbFilterArr.searchFilter};
            }
            this.busy =  this.hpbApi.getHpb(null,null,null,null,null,null,this.uId,this.userRole,null,null,null,"mason",this.limit,this.pages,this.hpbFilterArr.hpbStatus,this.hpbFilterArr.city,null,null,searchObjData).subscribe(resData => {
                this.pages++;  
                this.dataLen = resData.result.length;
                console.log("this.dataLen- mason -",this.dataLen);
                this.hpbData=[];
                for (let x=0; x< resData.result.length;x++) {
                    this.hpbData.push(resData.result[x]);
                        let profilePhoto ; 
                        if( this.hpbData != undefined && this.hpbData != '' && this.hpbData.length > 0 ){
                            for( let i=0;i<this.hpbData.length;i++ ){
                                if( this.hpbData[i]['hpb_profile_pic'] != undefined && this.hpbData[i]['hpb_profile_pic'] != '' ){
                                    profilePhoto = JSON.parse( this.hpbData[i]['hpb_profile_pic'] );  
                                    this.hpbData[i]['hpb_profile_pic_parsed'] = profilePhoto[0]['serverPath'];
                                }else{
                                    this.hpbData[i].hpb_profile_pic_parsed = "assets/img/profile.jpg";    
                                }
                            } 
                        }
                }
                this.hpbDataTemp=this.hpbData;
                resolve(true);    
            },error=>{
               reject(error);
            });
        });

    }


  goToHpbDetail(hpb){
    this.app.getRootNav().push(TlhHpbParentTabsPage,{
      "hpbId" : hpb['hpb_id'],
      "hpbName": hpb['hpb_name'],
      "tab":"detail"
    });
  }

   goToProjectList(hpb){
  
    this.app.getRootNav().push(TlhHpbParentTabsPage,{
      "hpbData":hpb,
      "hpbId" :hpb['hpb_id'],
      "hpbName": hpb['hpb_name'],
      "tab":"projects"
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

    //SEARCH Hpb
    searchHpb(ev){
    console.log("ev",ev);
        //this.hpbData=this.hpbDataTemp;
        this.pages=0;
        this.limit=5;
        this.hpbData=[];
        if(ev.target.value != undefined && ev.target.value != '' ){
            this.searchString = ev.target.value;
            this.hpbFilterArr['searchFilter']=this.searchString; 
        }else{
            this.searchString=null;
            this.hpbFilterArr['searchFilter']=this.searchString;
        }
        if(!this.searchhit && this.searchString!=null){
            this.searchhit = true;
            let prevScstrng = parseInt(this.searchString.length);
            this.loadData().then(()=>{
                let currScstrng = parseInt(this.searchString.length);
                this.pages=0;
                if(currScstrng > prevScstrng || currScstrng < prevScstrng){
                    this.loadData().then(()=>{
                        this.searchhit = false;
                    });
                }else{
                    this.searchhit = false;
                }
            });
        }else if(!this.searchhit && this.searchString==null){
            this.searchhit = true;
            this.loadData().then(()=>{
                this.searchhit = false;
                this.pages=0;
                this.loadData();
            });
        }  

    }

    makephonecall(mobno){
      if( mobno !=undefined && mobno !='' ){
             this.callNumber.callNumber(mobno, true)
            .then(() => console.log('Launched dialer!'))
            .catch(() => console.log('Error launching dialer')); 
      }     
    }


  clearFilter(){
        this.hpbFilterArr={
            city:null,
            searchFilter:null,
            hpbType:null,
            hpbStatus:null,
        }
        this.filterby="";
        this.myInput='';
        this.pages=0;
        this.searchbyall=false;
        this.hpbData=[];
        this.loadData();
  }






}



//-----------CONTRACTOR TAB----------------------------------------------------------------------------------------------------------------------------------------------------------------->




@Component({
  selector: 'tlh-hpb-list-contractor',
  template: `
<ion-header>
    <ion-searchbar [(ngModel)]="myInput" (ionInput)="searchHpb($event)" placeholder="{{ 'SEARCH' | translate }}" name="searchBar"></ion-searchbar> 
     
</ion-header>
 
    <ion-content  fullscreen="false" [ngBusy]="{busy: busy, message:busyMessage, minDuration: 600}" [ngClass]="{'searchExtraMar': (filterby !=undefined && filterby != '') }" >
                <div class="filterTag" *ngIf="filterby !=undefined && filterby != ''">
        <p>Search by : {{ filterby }} </p>
        <button ion-button color="light" class="closeStyle" (click)="clearFilter()">
            <i class="icon-close-thin"></i>
        </button>
    </div> 
                <ion-list class="listWrap">
                 <div *ngIf="hpbData == undefined || hpbData == '' "> <h2 class="noData contMid">No Contractors Found</h2> </div>
                    <div class="itemWrap" *ngFor="let hpb of hpbData">
                        <ion-item class="listItem" >
                            <ion-avatar item-left *ngIf="hpb['hpb_profile_pic_parsed'] != undefined && hpb['hpb_profile_pic_parsed'] != ''" >
                                <img [src]="hpb['hpb_profile_pic_parsed']">
                            </ion-avatar>
                            <div class="leftContent">
                                <h2 *ngIf="hpb['hpb_name'] !=undefined && hpb['hpb_name'] !=''">{{ hpb['hpb_name'] }}</h2>
                                <div class="mobileWrap">
                                    <p class="title inline" *ngIf="hpb['primary_mobile_no'] !=undefined && hpb['primary_mobile_no'] !=''">Mobile No.</p>
                                    <span class="value inline">{{ hpb['primary_mobile_no'] }}</span>
                                    <button ion-button color="light" (click)="makephonecall( hpb['primary_mobile_no'] )" >
                                        <i class="icon-call"></i>
                                    </button>
                                    <p class="title dark" *ngIf="hpb['domicile_city'] !=undefined && hpb['domicile_city'] !=''">City: <span> {{ hpb['domicile_city'] }}</span></p>
                                    <p class="title dark">SPH Name: <span> {{ hpb['sph_name']?hpb['sph_name']:'-' }}</span></p>
                                </div>
                            </div>
                            <span class="tag" *ngIf="hpb['hpb_status'] !=undefined && hpb['hpb_status'] !=''">{{ hpb['hpb_status'] }}</span>
                            <!--<div class="arrow_box notVisit">
                                Not Visited
                            </div>-->
                            <!--<button class="checkIn nextTo" ion-button color="light">
                            CHECK IN<i class="icon-next"></i>
                        </button>-->
                        </ion-item>
                        <div class="ntpr">
                            <div class="btn">
                                <button class="vDetail" ion-button type="button" (click)="goToHpbDetail( hpb )">
                        {{ 'VIEW DETAILS' | translate}}
                    </button>
                                <button class="vProject" ion-button type="button" (click)="goToProjectList( hpb )">
                        {{ 'VIEW PROJECTS' | translate }}
                    </button>
                            </div>
                        </div>
                    </div>
                      <ion-infinite-scroll (ionInfinite)="doInfinite($event)" [enabled]="!dataLoadCompleted">
                            <ion-infinite-scroll-content></ion-infinite-scroll-content>
                        </ion-infinite-scroll>
                </ion-list>

            </ion-content>
  
  
  `
})
export class TlhHpbListContractorPage {
  hpbData:any=[];
  hpbDataTemp:any=[];
  hpbProfilePic:any;
  filterby:any="";
  myInput:any='';
  busyMessage:any;
  busy:any;
  limit:number = 5;
  pages:number = 0;
  dataLen:number = 0;
  userName:any;
  uId:number;
  userRole="$tlh";
  searchbyall:any=false;
  searchhit:any=false;
  searchString:any=null;
  dataLoadCompleted:any=false;
  hpbFilterArr:any={
     city:null,
     searchFilter:null,
     hpbType:null,
     hpbStatus:null
  }

  constructor(public navCtrl: NavController, public navParams: NavParams,public sqlS:SqlServices,public appCom:appCommonMethods,public shareS :ShareService,public callNumber: CallNumber,public app:App,public events:Events,public hpbApi: App_hpbApi) {
        this.events.subscribe('tlhHpbContrListFilter',(filterObj) => {
            this.hpbFilterArr = filterObj['hpbFilterArr'];
            this.filterby=filterObj?filterObj['filterby']:"";
            this.pages=0;
            this.hpbData=[];
            this.searchhit=false;
            this.loadData();
	    });
       
        /*this.events.subscribe('cleartlhHpbContrListFilter',() => {
         console.log("<------------------------------------------------------------->");
         this.clearFilter();
        })*/

  }

  ionViewDidLoad() {
    this.searchhit=false;
  }

    async ionViewDidEnter(){
        this.busyMessage = await this.appCom.getTranslatedTxt("Please wait..."); 
        this.searchhit=false;
        this.clearFilter();
    }

    loadData(){
        return new Promise((resolve,reject)=>{
            let searchObjData = null;
            if(this.hpbFilterArr.searchFilter){
                searchObjData = {'searchFilter':this.hpbFilterArr.searchFilter};
            }
            this.busy =  this.hpbApi.getHpb(null,null,null,null,null,null,this.uId,this.userRole,null,null,null,"contractor",this.limit,this.pages,this.hpbFilterArr.hpbStatus,this.hpbFilterArr.city,null,null,searchObjData).subscribe(resData => {
            //this.busy =  this.hpbApi.getHpb(null,null,null,null,null,null,this.uId,this.userRole,null,null,null,"contractor",this.limit,this.pages).subscribe(resData => {
                this.pages++;  
                this.dataLen = resData.result.length;
                console.log("this.dataLen- contractor -",this.dataLen);
                this.hpbData=[];
                for (let x=0; x< resData.result.length;x++) {
                this.hpbData.push(resData.result[x]);
                        let profilePhoto ; 
                        if( this.hpbData != undefined && this.hpbData != '' && this.hpbData.length > 0 ){
                            for( let i=0;i<this.hpbData.length;i++ ){
                                if( this.hpbData[i]['hpb_profile_pic'] != undefined && this.hpbData[i]['hpb_profile_pic'] != '' ){
                                    profilePhoto = JSON.parse( this.hpbData[i]['hpb_profile_pic'] );  
                                    this.hpbData[i]['hpb_profile_pic_parsed'] = profilePhoto[0]['serverPath'];
                                }else{
                                    this.hpbData[i].hpb_profile_pic_parsed = "assets/img/profile.jpg";    
                                }
                            } 
                        }
                }
                resolve(true);    
            },error=>{
                reject(error);
            });
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


    //SEARCH Hpb
    searchHpb(ev){
    console.log("ev",ev);
        //this.hpbData=this.hpbDataTemp;
        this.pages=0;
        this.limit=5;
        this.hpbData=[];
        if(ev.target.value != undefined && ev.target.value != '' ){
            this.searchString = ev.target.value; 
            this.hpbFilterArr['searchFilter']=this.searchString; 
        }else{
            this.searchString=null;
            this.hpbFilterArr['searchFilter']=this.searchString;
        }
        if(!this.searchhit && this.searchString!=null){
            this.searchhit = true;
            let prevScstrng = parseInt(this.searchString.length);
            this.loadData().then(()=>{
                let currScstrng = parseInt(this.searchString.length);
                this.pages=0;
                if(currScstrng > prevScstrng || currScstrng < prevScstrng){
                    this.loadData().then(()=>{
                        this.searchhit = false;
                    });
                }else{
                    this.searchhit = false;
                }
            });
        }else if(!this.searchhit && this.searchString==null){
            this.searchhit = true;
            this.loadData().then(()=>{
                this.searchhit = false;
                this.pages=0;
                this.loadData();
            });
        }

    }

  goToHpbDetail(hpb){
    this.app.getRootNav().push(TlhHpbParentTabsPage,{
      "hpbId" : hpb['hpb_id'],
      "hpbName": hpb['hpb_name'],
      "tab":"detail"
    });
  }

  goToProjectList(hpb){
   
    this.app.getRootNav().push(TlhHpbParentTabsPage,{
      "hpbData":hpb,
      "hpbId" : hpb['hpb_id'],
      "hpbName": hpb['hpb_name'],
      "tab":"projects"
    }); 
  }

 //MAKE PHONE CALL
  makephonecall(mobno){
      if( mobno !=undefined && mobno !='' ){
             this.callNumber.callNumber(mobno, true)
            .then(() => console.log('Launched dialer!'))
            .catch(() => console.log('Error launching dialer')); 
      }     
  }

    clearFilter(){

        this.dataLoadCompleted=false;
        this.appCom.getAppPreference("userCreds").then(
        resDataU => {
            this.userName = resDataU.user.realm;
            let uId = resDataU.userId;
            this.uId = parseInt(uId);
            this.hpbData=[];
            this.pages=0;
            this.limit=5;
            this.myInput='';

            this.hpbFilterArr={
                city:null,
                searchFilter:null,
                hpbType:null,
                hpbStatus:null,
            }
            this.filterby="";
            this.pages=0;
            this.searchbyall=false;
            this.hpbData=[];
            this.loadData();
        },
        err => {
            console.log("err ref", err);
        });

    
   }
   


}






