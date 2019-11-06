import { ProjectListPage } from '../../project/project-list/project-list';
import { HpbDetailsPage } from '../hpb-detail/hpb-detail';
import { addHpbFormPage } from '../hpb-add-form/hpb-add-form';
import { ShareService } from '../../../providers/ShareService';
import { appCommonMethods } from '../../../providers/appCommonMethods';
import { SqlServices } from '../../../providers/sqlService';
import { IonicPage, NavController, NavParams,App,Events, ModalController } from 'ionic-angular';
import { Component } from '@angular/core';
import { CallNumber } from '@ionic-native/call-number';
import { HpbFilterPage } from '../hpb-filter/hpb-filter';
import { ViewChild } from '@angular/core/core';
import { HpbParentTabsPage } from "../hpb-parent-tab-page/hpb-parent-tab-page";
import * as _ from 'lodash';
declare var parentThis ;
declare var hpbTabIndexG;


@Component({
  selector: 'page-hpb-list',
  templateUrl: 'hpb-list.html',
})
export class HpbListPage {
 
  busy:any;
  page1: any = HpbListMasonPage;
  page2: any = HpbListContractorPage;
  parentThis = this;
  selectedIndex:any=0;
  paramsData:any;
  showTabs:any=false;
  paramsDataC:any;
  paramsDataM:any;
  hpbType="mason";
  hpbFilterArr:any={
     city:null,
     hpbType:null,
     hpbStatus:null,
  }
  constructor(public navCtrl: NavController,public modalCtrl:ModalController,public navParams: NavParams,public sqlS:SqlServices,public appCom:appCommonMethods,public shareS :ShareService,public app:App,public events:Events) {
 
          this.showTabs=true;
    
  }

    ionViewDidLoad() {
        console.log('ionViewDidLoad HpbListPage');
  
        hpbTabIndexG=0;
    }

    ionViewDidEnter() {
        this.paramsData=this.navParams.data;
        console.log("paramsData",this.paramsData);

       
        if( this.paramsData !=undefined && this.paramsData !='' ){
            var type= this.paramsData.type ;
            if( type == 'mason' ){
                this.paramsDataC=this.paramsData;
                this.paramsDataM={data:null};
                this.selectedIndex=0;
                hpbTabIndexG=this.selectedIndex;
            }else if( type == 'contractor' ){
                this.paramsDataM=this.paramsData;
                this.paramsDataC={data:null};
                this.selectedIndex=1;
                hpbTabIndexG=this.selectedIndex;
            }else{
                this.refreshSelecTabs();
            }
           
        }else{
            this.refreshSelecTabs();
        }
 
    }

    refreshSelecTabs(){
        let tempSel = hpbTabIndexG;
        console.log('tempSel',tempSel);
        this.showTabs=false;
        this.busy=this.appCom.showBusyInfinite();
            setTimeout(()=>{
                this.showTabs=true;
                this.paramsDataM=this.paramsData;
                this.paramsDataC={data:null};
                this.selectedIndex=tempSel;
                setTimeout(()=>{
                    this.busy=null;
                 },10)
            },500);
    }

    goToHpbDetail(hpb_id){
    
    }

    goToHpbFilter(){
        //this.navCtrl.push(HpbFilterPage);
        let selFilterData={
            hpbType:this.hpbType,
            hpbFilterArr:this.hpbFilterArr
        };
        let filterPageD = this.modalCtrl.create(HpbFilterPage,{selFilterData:selFilterData});
        filterPageD.onDidDismiss((fDataRes:any)=>{
            console.log(" fDataRes ---- ",fDataRes);
            if( fDataRes['type']=='mason' ){
                this.hpbFilterArr=fDataRes['hpbFilterArr'];
                this.events.publish("sphHpbMasonListFilter",fDataRes);
            }else if( fDataRes['type']=='contractor' ){
                this.hpbFilterArr=fDataRes['hpbFilterArr'];
                this.events.publish("sphHpbContrListFilter",fDataRes);
            }
        });
        filterPageD.present();
    }


  onTabSelect(ev: any) {
    console.log('Tab selected', 'Index: ' + ev.index, 'Unique ID: ' + ev.id);
    hpbTabIndexG=ev.index;
     if(ev.index==0){
       
        this.hpbType="mason";
        this.hpbFilterArr['city']=null;
        this.hpbFilterArr['hpbStatus']=null;
     }else{
    
        this.hpbType="contractor";
        this.hpbFilterArr['city']=null;
        this.hpbFilterArr['hpbStatus']=null;
     }

  }
  

  addHPB(){
    this.navCtrl.push(addHpbFormPage,{
        "action":"none"
    });
  }

}






//--------MASON TAB------------------------------------------------------------------------------------------------------------------------------------------------------------------->

// <ion-header> <ion-searchbar [(ngModel)]="myInput"  (ionInput)="searchHpb($event)" name="searchBar" placeholder="Search"></ion-searchbar>
//                 <div class="filterTag">
//                     <p>Search by : Bekasi, 1/12/17 - 19/12/17, </p>
//                     <button ion-button color="light" class="closeStyle">
//                         <i class="icon-close-thin"></i>
//                     </button>
//                 </div>
//             </ion-header>





@Component({
  selector: 'page-hpb-list-mason',
  template: ` 
<ion-header> 
    <ion-searchbar [(ngModel)]="myInput"  (ionInput)="searchHpb($event)" name="searchBar" placeholder="Search"></ion-searchbar>
    
</ion-header>           

            <ion-content fullscreen="false" [ngBusy]="{busy: busy, message:busyMessage, minDuration: 600}" >
                <div class="filterTag" *ngIf="filterby !=undefined && filterby != ''">
                <p>Search by : {{ filterby }} </p>
                <button ion-button color="light" class="closeStyle" (click)="clearFilter()">
                <i class="icon-close-thin"></i>
                </button>
                </div> 
                <ion-list class="listWrap">
                    <div *ngIf="!(hpbData?.length > 0)"> <h2 class="noData contMid">No Masons Found</h2> </div>
                    <div class="itemWrap" *ngFor="let hpb of hpbData">
                        <ion-item class="listItem">
                            <ion-avatar item-left *ngIf="hpb['hpb_profile_pic'] != undefined && hpb['hpb_profile_pic'] != ''" >
                                <img [src]="hpb['hpb_profile_pic']">
                            </ion-avatar>
                            <div class="leftContent">
                                <h2 *ngIf="hpb['hpb_name'] !=undefined && hpb['hpb_name'] !=''">{{ hpb['hpb_name'] }}</h2>
                                <div class="mobileWrap">
                                    <p class="title inline" *ngIf="hpb['primary_mobile_no'] !=undefined && hpb['primary_mobile_no'] !=''">{{ "MOBILE NO." | translate }}</p>
                                    <span class="value inline">{{ hpb['primary_mobile_no'] }}</span>
                                    <button ion-button color="light" (click)=" makephonecall(hpb['primary_mobile_no'])" >
                                        <i class="icon-call"></i>
                                    </button>
                                    <p class="title dark" *ngIf="hpb['domicile_city'] !=undefined && hpb['domicile_city'] !=''">{{ "CITY / MUNICIPALITY" | translate }}: <span> {{ hpb['domicile_city'] }}</span></p>
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
                                    {{ "VIEW DETAILS" | translate }}                      
                                </button>
                                <button class="vProject" ion-button type="button" (click)="goToProjectList( hpb )" >                        
                                    {{ "VIEW PROJECTS" | translate }}
                                </button>
                            </div>
                        </div>
                    </div>
                </ion-list>
                <ion-infinite-scroll (ionInfinite)="doInfinite($event)" [enabled]="!dataLoadCompleted">
                    <ion-infinite-scroll-content></ion-infinite-scroll-content>
                </ion-infinite-scroll>
            </ion-content>
  `
})
export class HpbListMasonPage {
  hpbData:any=[];
  hpbDataTemp:any=[];
  hpbProfilePic:any;
  filterby:any="";
  myInput:any="";
  busyMessage:any="Please Wait...";  
  busy:any;
  showEmptyFlag:any=false;
  hpbFilterArr:any={
     city:null,
     hpbType:null,
     hpbStatus:null,
  }
  dataLen:number = 0;
  dataLoadCompleted:boolean = false;
  limit:any=5;
  offset:any=0;
  searchTxt:any;
  first:boolean = false;
  filters:any = [];
  filtersFlag:boolean = false;
  constructor(public navCtrl: NavController, public navParams: NavParams,public sqlS:SqlServices,public appCom:appCommonMethods,public shareS :ShareService,public callNumber: CallNumber,public app:App,public events:Events) {
        this.events.subscribe('sphHpbMasonListFilter',(filterObj) => {
            console.log("MfilterObj",filterObj);
            this.filtersFlag = filterObj.status;
            this.filters = filterObj;
            this.filterby=filterObj?filterObj['filterby']:"";
           // this.ionViewDidEnter1();
            this.hpbFilterArr = filterObj['hpbFilterArr'];
           // this.ionViewDidEnter();
            /*this.filterby=filterObj?filterObj['filterby']:"";
            this.processHpbData(filterObj['hpbData']);*/
        });
            
        this.app.viewDidEnter.subscribe(()=>{
                //     this.limit=5;
                //     this.offset=0;
                //     this.dataLoadCompleted = false;
                //     this.hpbData=[];
                //    if(this.first == false){
                //         this.ionViewDidEnter1().then((res)=>{
                //             console.log(" this.first subscribe",this.first);
                //             this.first = false;  
                //         },()=>{
                //             this.first = false;  
                //         });    
                //     }
        })
  }
  ionViewWillEnter(){
    this.limit=5;
    this.offset=0;
    this.hpbData=[];
    this.filtersFlag=false;
    this.filters=[];
    this.filterby='';
    
  }
 async ionViewDidEnter(){
    this.dataLoadCompleted = false;
    this.limit=5;
    this.offset=0;
    this.busyMessage = await this.appCom.getTranslatedTxt("Please wait...");  
    this.hpbData=[];
    this.myInput = '';
    this.searchTxt=null;
  // if(this.first == false){
        this.ionViewDidEnter1().then((res)=>{
            console.log(" this.first enter",this.first);
            this.first = false;  
        },()=>{
            this.first = false; 
        });    
  // }    
  }
  
  ionViewDidEnter1() {
    return new Promise((resolve,reject)=>{
      //  this.first = true; 
       // this.filterby="";
        // setTimeout(()=> {
        //   this.first = false;  
        // }, 1000);
        //let queryStr ="select `hpb_id`, `hpb_name` ,`primary_mobile_no` ,`domicile_city` , `hpb_status` , `hpb_profile_pic` from `hpb_master` where hpb_name LIKE '%"+val+"%' AND hpb_type = '"+hpbType+"'" ;
        
        var selectField = " * ";
        var tablename = "hpb_master";
        if(this.searchTxt){
            var where = " (hpb_name LIKE '%"+this.searchTxt+"%' or id_card_number LIKE '%"+this.searchTxt+"%' or primary_mobile_no LIKE '%"+this.searchTxt+"%' or secondary_mobile_no LIKE '%"+this.searchTxt+"%')  AND `hpb_type` = 'mason' ";            
        }else{
            var where = " `hpb_type` = 'mason' ";
        }
        if(this.filtersFlag){
            if(this.filters.city){
                where = where + " and id_card_city = '" +this.filters.city +"'";            
            }
            if(this.filters.hpbStatus){
                where = where + " and hpb_status = '" +this.filters.hpbStatus +"'";    
            }
        }
        var orderBy = " `local_created_date` DESC LIMIT "+this.limit+" offset "+this.offset;


        this.busy=this.sqlS.selectTableData(selectField,tablename,where,orderBy,"").then((data) => {
            console.log('data fetched -----', data.rows,this.offset);
            //this.hpbData=[];
            if(this.offset == 0){
                this.hpbData = [];
            }
            this.dataLen= data.rows.length;
            this.offset = this.offset + this.dataLen;
            
            for(let i=0;i<data['rows'].length;i++){       
                console.log(" filter data ",data['rows'].item(i));
                let dp=[];
                dp=JSON.parse( data['rows'].item(i).hpb_profile_pic );      
                if( data['rows'].item(i).hpb_profile_pic !=undefined && data['rows'].item(i).hpb_profile_pic !='' ){
                    if(dp['length']>0){
                        //data['rows'].item(i).hpb_profile_pic = this.appCom.urlSanitizer(dp[0]['path']);
                        data['rows'].item(i).hpb_profile_pic = this.appCom.getImageLocalPathFull(dp[0]);
                    }else{
                        data['rows'].item(i).hpb_profile_pic = "assets/img/profile.jpg";    
                    }
                   
                }else{
                    data['rows'].item(i).hpb_profile_pic = "assets/img/profile.jpg";
                }
                this.hpbData.push( data['rows'].item(i) );
            }
          // this.hpbData = _.uniqBy(this.hpbData,'hpb_id');
            resolve(true);
            console.log("hpbData------",this.hpbData);
        }, (error) => {
            reject(true);
            console.log('Error', error); 
        });
    });
  }

    doInfinite(infiniteScroll) {
        setTimeout(() => {
            if(this.dataLen < this.limit){
                this.dataLoadCompleted = true;
            }else{
                this.ionViewDidEnter1();
            }
            infiniteScroll.complete();
        }, 500);
    }

  processHpbData(hpbData){
      console.log("hpbData---process--",hpbData);
      return new Promise((resolve,reject)=>{
        if(hpbData != undefined && hpbData != "" && hpbData != null ){
          
                for(let i=0;i<hpbData.length;i++ ){
                    let dp=[];
                        dp=JSON.parse( hpbData[i].hpb_profile_pic );      
                    if(  hpbData[i].hpb_profile_pic !=undefined && hpbData[i].hpb_profile_pic !='' ){
                       //  hpbData[i].hpb_profile_pic = this.appCom.urlSanitizer(dp[0]['path']);
                            if(dp['length']>0){
                            //hpbData[i].hpb_profile_pic = this.appCom.urlSanitizer(dp[0]['path']);
                            hpbData[i].hpb_profile_pic = this.appCom.getImageLocalPathFull(dp[0]);
                        }else{
                            hpbData[i].hpb_profile_pic = "assets/img/profile.jpg";
                        }
                    }else{
                        hpbData[i].hpb_profile_pic = "assets/img/profile.jpg";
                    }                
                }


                if( hpbData.length == 0 ){
                        this.showEmptyFlag=true;
                }else{
                        this.showEmptyFlag=false;
                }
                
                console.log("hpbData---process2--",hpbData);
                this.hpbData=hpbData;

        }else{
            this.hpbData=[];
        }    
          resolve(true); 
       });
  }


  goToHpbDetail(hpb){
  
    this.app.getRootNav().push(HpbParentTabsPage,{
      "hpbData":hpb,
      "hpbId" : hpb['hpb_id'],
      "hpbName": hpb['hpb_name'],
      "action":"hpbSpecific",
      "tab":"detail"
    });
    

  }

   goToProjectList(hpb){
  
    this.app.getRootNav().push(HpbParentTabsPage,{
      "hpbData":hpb,
      "hpbId" :hpb['hpb_id'],
      "hpbName": hpb['hpb_name'],
      "action":"hpbSpecific",
      "tab":"projects"
    }); 
  }

   //SEARCH MASONS
/*   
   searchHpb(eventVal){
     
        if (typeof eventVal.target.value != 'undefined' && eventVal.target.value.length != 0) {
             
            this.sqlS.search_hpb( eventVal.target.value , "mason").then((searchRes)=>{
                console.log("searchRes",searchRes);
                this.hpbData = [];
                for (var i = 0; i < searchRes['rows'].length; i++) {
                    this.hpbData.push( searchRes['rows'].item(i) );    
                }
                try{
                    for(let i=0;i<this.hpbData.length;i++ ){
                        let dp=[];
                        dp=JSON.parse( this.hpbData[i].hpb_profile_pic );      
                        if(  this.hpbData[i].hpb_profile_pic !=undefined && this.hpbData[i].hpb_profile_pic !='' ){
                        this.hpbData[i].hpb_profile_pic = this.appCom.urlSanitizer(dp[0]['path']);
                        }else{
                        this.hpbData[i].hpb_profile_pic = "assets/img/profile.jpg";
                        }
                    }
                        if( this.hpbData.length == 0 ){
                                this.showEmptyFlag=true;
                        }else{
                                this.showEmptyFlag=false;
                        } 
                }catch(e){
                    console.log(e);
                }  
            });

        }else{
              this.hpbData = this.hpbDataTemp;
        }
   }
*/
   searchHpb(eventVal){
        this.hpbData=[]; 
        if (typeof eventVal.target.value != 'undefined' && eventVal.target.value.length != 0) {
                this.limit=5;
                this.offset=0;
                this.searchTxt = eventVal.target.value;
        }else{
            this.limit=5;
            this.offset=0;
            this.searchTxt = null;
        }
        this.ionViewDidEnter1();
  }


     makephonecall(mobno){
      if( mobno !=undefined && mobno !='' ){
             this.callNumber.callNumber(mobno, true)
            .then(() => console.log('Launched dialer!'))
            .catch(() => console.log('Error launching dialer')); 
      }     
  }

  clearFilter(){
        this.filterby = "";
        this.hpbData=[];
        var selectField = " * ";
        var tablename = "hpb_master";
        var where = " `hpb_type` = 'mason' ";
        var orderBy = " `local_created_date` DESC";
        this.sqlS.selectTableData(selectField,tablename,where,orderBy,"").then((data) => {
            console.log('data fetched', data);
            for(let i=0;i<data['rows'].length;i++){       
            this.hpbData.push( data['rows'].item(i) );                
            }
            try{
                for(let i=0;i<this.hpbData.length;i++ ){
                    let dp=[];
                    dp=JSON.parse( this.hpbData[i].hpb_profile_pic );      
                    if(  this.hpbData[i].hpb_profile_pic !=undefined && this.hpbData[i].hpb_profile_pic !='' ){
                       // this.hpbData[i].hpb_profile_pic = this.appCom.urlSanitizer(dp[0]['path']);
                       if(dp['length']>0){
                        //this.hpbData[i].hpb_profile_pic = this.appCom.urlSanitizer(dp[0]['path']);
                        this.hpbData[i].hpb_profile_pic = this.appCom.getImageLocalPathFull(dp[0]);
                    }else{
                        this.hpbData[i].hpb_profile_pic = "assets/img/profile.jpg";
                    }
                    }else{
                        this.hpbData[i].hpb_profile_pic = "assets/img/profile.jpg";
                    }
                }
                    if( this.hpbData.length == 0 ){
                            this.showEmptyFlag=true;
                    }else{
                            this.showEmptyFlag=false;
                    } 
            }catch(e){
                console.log(e);
            }
           

            console.log("hpbData",this.hpbData);
        }, (error) => {
            console.log('Error', error);
            
        });
        this.dataLoadCompleted = false;
        this.hpbDataTemp= this.hpbData;
  }






}



//-----------CONTRACTOR TAB----------------------------------------------------------------------------------------------------------------------------------------------------------------->

// <ion-header>
//                 <ion-searchbar [(ngModel)]="myInput"   (ionInput)="searchHpb($event)" placeholder="Search" name="searchBar"></ion-searchbar>
//                 <div class="filterTag">
//                     <p>Search by : Bekasi, 1/12/17 - 19/12/17, </p>
//                     <button ion-button color="light" class="closeStyle">
//                         <i class="icon-close-thin"></i>
//                     </button>
//                 </div> 
//             </ion-header>




@Component({
  selector: 'page-hpb-list-contractor',
  template: `
<ion-header>
    <ion-searchbar [(ngModel)]="myInput"   (ionInput)="searchHpb($event)" placeholder="Search" name="searchBar"></ion-searchbar>
     
</ion-header>
 
            <ion-content  fullscreen="false" [ngBusy]="{busy: busy, message:busyMessage, minDuration: 600}">
            <div class="filterTag" *ngIf="filterby !=undefined && filterby != ''">
            <p>Search by : {{ filterby }} </p>
            <button ion-button color="light" class="closeStyle" (click)="clearFilter()">
            <i class="icon-close-thin"></i>
            </button>
            </div> 
                <ion-list class="listWrap">
                 <div *ngIf="!(hpbData?.length > 0)"> <h2 class="noData contMid">No Contractors Found</h2> </div>
                    <div class="itemWrap" *ngFor="let hpb of hpbData">
                        <ion-item class="listItem" >
                            <ion-avatar item-left *ngIf="hpb['hpb_profile_pic'] != undefined && hpb['hpb_profile_pic'] != ''" >
                                <img [src]="hpb['hpb_profile_pic']">
                            </ion-avatar>
                            <div class="leftContent">
                                <h2 *ngIf="hpb['hpb_name'] !=undefined && hpb['hpb_name'] !=''">{{ hpb['hpb_name'] }}</h2>
                                <div class="mobileWrap">
                                    <p class="title inline" *ngIf="hpb['primary_mobile_no'] !=undefined && hpb['primary_mobile_no'] !=''">{{ "MOBILE NO." | translate }}</p>
                                    <span class="value inline">{{ hpb['primary_mobile_no'] }}</span>
                                    <button ion-button color="light" (click)="makephonecall( hpb['primary_mobile_no'] )" >
                                        <i class="icon-call"></i>
                                    </button>
                                    <p class="title dark" *ngIf="hpb['domicile_city'] !=undefined && hpb['domicile_city'] !=''">{{ "CITY / MUNICIPALITY" | translate }}: <span> {{ hpb['domicile_city'] }}</span></p>
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
                                    {{ "VIEW DETAILS" | translate }}
                                </button>
                                <button class="vProject" ion-button type="button" (click)="goToProjectList( hpb )">
                                    {{ "VIEW PROJECTS" | translate }}
                                </button>
                            </div>
                        </div>
                    </div>
                </ion-list>
                <ion-infinite-scroll (ionInfinite)="doInfinite($event)" [enabled]="!dataLoadCompleted">
                <ion-infinite-scroll-content></ion-infinite-scroll-content>
            </ion-infinite-scroll>
            </ion-content>
  
  
  `
})
export class HpbListContractorPage {
    hpbData:any=[];
    hpbDataTemp:any=[];
    hpbProfilePic:any;
    filterby:any="";
    myInput:any="";
    hpbProfilePicTemp:any=[];
    hpbDigitalSignTemp:any=[];
    hpbIdCardPicTemp:any=[]; 
    busyMessage:any="Please Wait...";  
    busy:any;
    showEmptyFlag:any=false;
    hpbFilterArr:any={
     city:null,
     hpbType:null,
     hpbStatus:null,
    }
    dataLen:number = 0;
    dataLoadCompleted:boolean = false;
    limit:any=5;
    offset:any=0;
    searchTxt:any;
    first:boolean = false;
    filters:any = [];
    filtersFlag:boolean = false;

  constructor(public navCtrl: NavController, public navParams: NavParams,public sqlS:SqlServices,public appCom:appCommonMethods,public shareS :ShareService,public callNumber: CallNumber,public app:App,public events:Events) {
        this.events.subscribe('sphHpbContrListFilter',(filterObj) => {
             console.log("CfilterObj",filterObj);
             this.filtersFlag = filterObj.status;
             this.filters = filterObj;
             this.hpbFilterArr = filterObj['hpbFilterArr'];
            this.filterby=filterObj?filterObj['filterby']:"";
            this.hpbData=[];
            console.log("filterObj['hpbData']",filterObj['hpbData']);
           // this.ionViewDidEnter();
           // this.processHpbData(filterObj['hpbData']);
	    });

        this.app.viewDidEnter.subscribe(()=>{
        //     this.limit=5;
        //     this.offset=0;
        //     this.dataLoadCompleted = false;
        //   //  if(this.first == false){
        //         this.ionViewDidEnter11().then((res)=>{
        //             this.first = true;   
        //         });    
        //   //  }
        });
  }
  ionViewWillEnter(){
    this.limit=5;
    this.offset=0;
    this.hpbData=[];
    this.filtersFlag=false;
    this.filters=[];
    this.filterby='';
    
  }
  async ionViewDidEnter(){
    this.dataLoadCompleted = false;
    this.limit=5;
    this.offset=0;
    this.busyMessage = await this.appCom.getTranslatedTxt("Please wait...");  
    this.hpbData=[];
    this.myInput = '';
    this.searchTxt=null;
   // if(this.first == false){
        this.ionViewDidEnter11().then((res)=>{
            console.log(" this.first enter",this.first);
            this.first = false;
        });    
   // }    
  }

  ionViewDidEnter11() {
    return new Promise((resolve,reject)=>{
       // this.first = true; 
       // this.filterby="";

        //let queryStr ="select `hpb_id`, `hpb_name` ,`primary_mobile_no` ,`domicile_city` , `hpb_status` , `hpb_profile_pic` from `hpb_master` where hpb_name LIKE '%"+val+"%' AND hpb_type = '"+hpbType+"'" ;
        
        var selectField = " * ";
        var tablename = "hpb_master";
        if(this.searchTxt){
            var where = " (hpb_name LIKE '%"+this.searchTxt+"%' or id_card_number LIKE '%"+this.searchTxt+"%' or primary_mobile_no LIKE '%"+this.searchTxt+"%' or secondary_mobile_no LIKE '%"+this.searchTxt+"%') AND `hpb_type` = 'contractor' ";            
        }else{
            var where = " `hpb_type` = 'contractor' ";        
        }
        if(this.filtersFlag){
            if(this.filters.city){
                where = where + " and id_card_city = '" +this.filters.city +"'";            
            }
            if(this.filters.hpbStatus){
                where = where + " and hpb_status = '" +this.filters.hpbStatus +"'";    
            }
        }
        var orderBy = " `local_created_date` DESC LIMIT "+this.limit+" offset "+this.offset;


        this.busy=this.sqlS.selectTableData(selectField,tablename,where,orderBy,"").then((data) => {
            console.log('data fetched -----', data.rows,this.offset);
            //this.hpbData=[];
            if(this.offset == 0){
                this.hpbData = [];
            }
            this.dataLen= data.rows.length;
            this.offset = this.offset + this.dataLen;
            
            for(let i=0;i<data['rows'].length;i++){       
                console.log(" filter data ",data['rows'].item(i));
                let dp=[];
                dp=JSON.parse( data['rows'].item(i).hpb_profile_pic );      
                if( data['rows'].item(i).hpb_profile_pic !=undefined && data['rows'].item(i).hpb_profile_pic !='' ){
                    if(dp['length']>0){
                        //data['rows'].item(i).hpb_profile_pic = this.appCom.urlSanitizer(dp[0]['path']);
                        data['rows'].item(i).hpb_profile_pic = this.appCom.getImageLocalPathFull(dp[0]);
                    }else{
                        data['rows'].item(i).hpb_profile_pic = "assets/img/profile.jpg";    
                    }
                }else{
                    data['rows'].item(i).hpb_profile_pic = "assets/img/profile.jpg";
                }
                this.hpbData.push( data['rows'].item(i) );
            }
            // setTimeout(()=> {
            //    this.first = false;  
            // }, 3000);
          //  this.hpbData = _.uniqBy(this.hpbData,'hpb_id');
            resolve(true);
            console.log("hpbData------",this.hpbData);
        }, (error) => {
            reject(true);
            console.log('Error', error); 
        });
    });  }

    doInfinite(infiniteScroll) {
        setTimeout(() => {
            if(this.dataLen < this.limit){
                this.dataLoadCompleted = true;
            }else{
                this.ionViewDidEnter11();
            }
            infiniteScroll.complete();
        }, 500);
    }

  	processHpbData(hpbData){
            console.log("hpbData---process3--",hpbData);
      return new Promise((resolve,reject)=>{
            if(hpbData != undefined && hpbData != "" && hpbData != null ){
               
                    for(let i=0;i<hpbData.length;i++ ){
                        let dp=[];
                            dp=JSON.parse( hpbData[i].hpb_profile_pic );      
                        if(  hpbData[i].hpb_profile_pic !=undefined && hpbData[i].hpb_profile_pic !='' ){
                            //hpbData[i].hpb_profile_pic = this.appCom.urlSanitizer(dp[0]['path']);
                            if(dp['length']>0){
                                //hpbData[i].hpb_profile_pic = this.appCom.urlSanitizer(dp[0]['path']);
                                hpbData[i].hpb_profile_pic = this.appCom.getImageLocalPathFull(dp[0]);
                            }else{
                                hpbData[i].hpb_profile_pic = "assets/img/profile.jpg";
                            }
                        }else{
                            hpbData[i].hpb_profile_pic = "assets/img/profile.jpg";
                        }                
                    }
                    
                    if( hpbData.length == 0 ){
                            this.showEmptyFlag=true;
                    }else{
                            this.showEmptyFlag=false;
                    }  
                      console.log("hpbData---process4--",hpbData);
                        this.hpbData=hpbData;
                   
            }else{
                 this.hpbData=[];
            }
             resolve(true); 
            
       });
  }

   //SEARCH CONTRACTORS
/*   searchHpb(eventVal){  
        if (typeof eventVal.target.value != 'undefined' && eventVal.target.value.length != 0) {           
                this.sqlS.search_hpb( eventVal.target.value , "contractor").then((searchRes)=>{
                console.log("searchRes",searchRes);
                this.hpbData = [];
                for (var i = 0; i < searchRes['rows'].length; i++) {
                    this.hpbData.push( searchRes['rows'].item(i) );    
                }
                try{
                    for(let i=0;i<this.hpbData.length;i++ ){
                        let dp=[];
                        dp=JSON.parse( this.hpbData[i].hpb_profile_pic );    
                        if(  this.hpbData[i].hpb_profile_pic !=undefined && this.hpbData[i].hpb_profile_pic !='' ){
                        this.hpbData[i].hpb_profile_pic = this.appCom.urlSanitizer(dp[0]['path']);
                        }else{
                        this.hpbData[i].hpb_profile_pic = "assets/img/profile.jpg";
                        }
                    }
                        if( this.hpbData.length == 0 ){
                            this.showEmptyFlag=true;
                        }else{
                            this.showEmptyFlag=false;
                        }
                }catch(e){
                    console.log(e);
                }  

            });

        }else{
              this.hpbData = this.hpbDataTemp;
        }
   }
*/

searchHpb(eventVal){
    this.hpbData=[]; 
    if (typeof eventVal.target.value != 'undefined' && eventVal.target.value.length != 0) {
            this.limit=5;
            this.offset=0;
            this.searchTxt = eventVal.target.value;
    }else{
        this.limit=5;
        this.offset=0;
        this.searchTxt = null;
    }
    this.ionViewDidEnter11();
}

  goToHpbDetail(hpb){


  
    this.app.getRootNav().push(HpbParentTabsPage,{
      "hpbData":hpb,
      "hpbId"  : hpb['hpb_id'],
      "hpbName": hpb['hpb_name'],
      "action":"hpbSpecific",
      "tab":"detail"
    });
  }

  goToProjectList(hpb){
   
    this.app.getRootNav().push(HpbParentTabsPage,{
      "hpbData":hpb,
      "hpbId" : hpb['hpb_id'],
      "action":"hpbSpecific",
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
        this.filterby = "";
        this.hpbData=[];
        var selectField = " * ";
        var tablename = "hpb_master";
        var where = " `hpb_type` = 'contractor' ";
        var orderBy = " `local_created_date` DESC";  
            this.sqlS.selectTableData(selectField,tablename,where,orderBy,"").then((data) => {
            console.log('data fetched', data);
            for(let i=0;i<data['rows'].length;i++){       
            this.hpbData.push( data['rows'].item(i) );                
            }
            try{
                for(let i=0;i<this.hpbData.length;i++ ){
                    let dp=[];
                    dp=JSON.parse( this.hpbData[i].hpb_profile_pic );    
                    if(  this.hpbData[i].hpb_profile_pic !=undefined && this.hpbData[i].hpb_profile_pic !='' ){
                        //this.hpbData[i].hpb_profile_pic = this.appCom.urlSanitizer(dp[0]['path']);
                        if(dp['length']>0){
                            //this.hpbData[i].hpb_profile_pic = this.appCom.urlSanitizer(dp[0]['path']);
                            this.hpbData[i].hpb_profile_pic = this.appCom.urlSanitizer(dp[0]['path']);
                        }else{
                            this.hpbData[i].hpb_profile_pic = "assets/img/profile.jpg";
                        }
                    }else{
                        this.hpbData[i].hpb_profile_pic = "assets/img/profile.jpg";
                    }                
                }
                    if( this.hpbData.length == 0 ){
                        this.showEmptyFlag=true;
                    }else{
                        this.showEmptyFlag=false;
                    }
            }catch(e){
                console.log(e);
            }


            console.log("hpbData",this.hpbData);
        }, (error) => {
            console.log('Error', error);
            
        });
        this.dataLoadCompleted = false;
        this.hpbDataTemp= this.hpbData;
    
  }
   


}






