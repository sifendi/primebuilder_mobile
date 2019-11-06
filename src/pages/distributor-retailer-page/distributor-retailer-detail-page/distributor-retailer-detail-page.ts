import { Component,ViewChild } from '@angular/core';
import { Tabs, NavController, NavParams, AlertController, Events, Platform } from 'ionic-angular';
import { ShareService } from "../../../providers/ShareService";
import { AddVisitFormPage } from "../../visit-pages/visit-add-form/visit-add-form";
import { VisitDetailsPage } from "../../visit-pages/visit-detail-page/visit-detail-page";
import { SqlServices } from "../../../providers/sqlService";
import { appCommonMethods } from "../../../providers/appCommonMethods";

import * as moment from 'moment';
import { ALL_MESSAGE } from "../../../providers/constant";
declare var cordova;


@Component({
  selector: 'distributor-retailer-detail-page',
  templateUrl: 'distributor-retailer-detail-page.html',
})
export class DistributorRetailerDetailPage {
  page1: any = DistributorVisitListPage;
  page2: any = DistributorDetail; 
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
       
    this.appCom.getLocalStorageItem("globalCheckinData").then((checkinObj)=>{
    this.globalCheckInData = checkinObj;
    //console.log("this.globalCheckInData",this.globalCheckInData);
    });


    this.shareS.setshareData("this",this);
    this.paramsData=this.navParams.data;
    this.rdsDataArr=this.paramsData['rdsData'];
    let tab = this.paramsData['tab'];
    if( tab == "visit" ){
    this.selectedIndex = 1;
    }else{
    this.selectedIndex = 0; 
    }

 
    this.page1 = DistributorVisitListPage;
    this.page2 = DistributorDetail;

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
    this.appCom.getAppPreference("userCreds").then((resDataU)=>{
                console.log("resDataUser",resDataU);
                if( resDataU != undefined && resDataU != '' ){
                this.userId=resDataU.userId;
                }else{
                this.userId="";
                }
            },(err)=>{
                console.log('err ref',err);
            });
    console.log("Platform is ready");
    });


   
  }

    async ionViewDidEnter(){
        this.busyMessage = await this.appCom.getTranslatedTxt("Please wait...");  
        this.check=false;  
        this.appCom.getLocalStorageItem("globalCheckinData").then((checkinObj)=>{
        this.globalCheckInData = checkinObj;
            //console.log("this.globalCheckInData",this.globalCheckInData);
        });
        this.events.publish('rdsVisitListRefresh');
    }

    goToVisitForm(){
        this.navCtrl.push(AddVisitFormPage ,{ "rdsData" : this.rdsDataArr } );
    }

    onTabSelect($event){

    }

    alreadyCheckInAlert(){
        this.appCom.showAlert(ALL_MESSAGE.ERROR_MESSAGE.ALREADY_CHECKED_IN,"Close","");
    }

    async permissionCheckinpop(details){
        
            let titleYes = await this.appCom.getTranslatedTxt("Yes");
            let titleNo = await this.appCom.getTranslatedTxt("No");
            let title = await this.appCom.getTranslatedTxt("Are you sure you want to check in ?");
        
            let alert = this.alertCtrl.create({
                cssClass: 'confirm',
                title: title,
                enableBackdropDismiss:false,
                buttons: [
                {
                    text: titleYes,
                    handler: () => {
                    console.log('Buy clicked');
                    //do  checkin                                                                                              
                            this.sqlS.insertData(details,"check_in_out").then((data) => {
                            this.events.publish('globalSync');         
                                    // this.navCtrl.push(DistributorRetailerDetailPage,{
                                    //     "rdsData":this.rdsDataArr,
                                    //     "tab":"visit"
                                    // });
                                    this.selectedIndex = 1;
                                    this.page1 = DistributorVisitListPage;
                                    this.page2 = DistributorDetail;
                                
                                    this.globalCheckInData = {
                                        checkinFlag:true,
                                        checkinType:"rds",
                                        insertId:data['insertId'],
                                        checkinDetails:details
                                    }
                                    this.check = false   
                                    this.appCom.setLocalStorageItem("globalCheckinData",this.globalCheckInData).then(()=>{
                                    //this.setElement();
                                    this.check = false
                                    });
                                    console.log("this.globalCheckInData",this.globalCheckInData);
                                    this.appCom.updateRetailerDistStats('retailer');
                                    this.appCom.updateRetailerDistStats('distributor');
                            }, (error) => {
                                   this.check = false
                                    console.log('Error', error);
                            });    


                    }
                },
                                                                                {
                    text: titleNo,
                    handler: () => {
                    console.log('Cancel clicked');
                    //do not checkin    
                    this.check = false

                    }
                },
                ]
            });
            alert.present();
          }
        
          async permissionCheckoutpop(geoCordinates){
        
            let titleYes = await this.appCom.getTranslatedTxt("Yes");
            let titleNo = await this.appCom.getTranslatedTxt("No");
            let title = await this.appCom.getTranslatedTxt("Are you sure you want to Check Out ?");
        
            console.log("geoCordinates------>",geoCordinates);   
            
            if( this.globalCheckInData['visitCheckFlag']  ==true ){
                let alert = this.alertCtrl.create({
                                        cssClass: 'confirm',
                                        title: title,
                                        enableBackdropDismiss:false,
                                        buttons: [
                                        {
                                            text: titleYes,
                                            handler: () => {
                                            console.log('Buy clicked');
                                            this.check = false;  

                                                            let  details= {
                                                                //check_in_out_user_id:null,
                                                                //check_in_out_type:null,
                                                                //check_in_out_type_id:null,
                                                                //check_in_latitude:null,
                                                                //check_in_longitude:null,
                                                                //check_in_datetime:null,
                                                                check_out_latitude:(geoCordinates['coords'])?geoCordinates['coords'].latitude:"",
                                                                check_out_longitude:(geoCordinates['coords'])?geoCordinates['coords'].longitude:"",
                                                                check_out_datetime:new Date().getTime(),
                                                                local_updated_date:new Date().getTime(),
                                                                sync_status:0
                                                                //generated_by:null
                                                            }
                                                            
                                                                this.appCom.getLocalStorageItem("globalCheckinData").then((checkinObj)=>{
                                                                    this.globalCheckInData = checkinObj;
                                                                    console.log("this.globalCheckInData",this.globalCheckInData);                                                                                                                                                                                                                                                                                                                                            
                                                                    let whereCond =" `check_in_out_id` = "+this.globalCheckInData['insertId']; 
                                                                        console.log("whwere cond",whereCond);
                                                                        this.sqlS.updateData(details,"check_in_out",whereCond).then((data) => {
                                                                                console.log("data  checkout------>",data);
                                                                                this.events.publish('globalSync');
                                                                                
                                                                                //EMPTY GLOBAL DATA AFTER CHECK OUT
                                                                                this.check = false;
                                                                                this.globalCheckInData={
                                                                                    checkinFlag:false,
                                                                                    checkinType:"",
                                                                                    checkinDetails: {
                                                                                        check_in_out_user_id:null,
                                                                                        check_in_out_type:null,
                                                                                        check_in_out_type_id:null,
                                                                                        check_in_latitude:null,
                                                                                        check_in_longitude:null,
                                                                                        check_in_datetime:null,
                                                                                        check_out_latitude:null,
                                                                                        check_out_longitude:null,
                                                                                        check_out_datetime:null,
                                                                                        generated_by:null
                                                                                    }
                                                                                };    
                                                                                this.appCom.setLocalStorageItem("globalCheckinData",this.globalCheckInData).then(()=>{
                                                                                //this.setElement();
                                                                                this.check = false;
                                                                                });
                                                                                
                                                                }, (error) => {
                                                                        this.check = false;
                                                                        console.log('Error', error);
                                                                        //this.appCom.showToast(ALL_MESSAGE.ERROR_MESSAGE.HPB_ADD_ERR,"middle");
                                                                        //this.appCom.showAlert("",ALL_MESSAGE.ERROR_MESSAGE.HPB_ADD_ERR,"Ok","");
                                                                });

                                                            });
                                            }
                                        },{
                                            text: titleNo,
                                            handler: () => {
                                            console.log('Cancel clicked');
                                            this.check = false;
                                            }
                                        }
                                        ]
                                    });
                                    alert.present();   
            }else{


                let alert = this.alertCtrl.create({
                    cssClass: 'confirm',
                    title: title,
                    enableBackdropDismiss:false,
                    inputs: [
                    {
                        name: 'comment',
                        placeholder: 'Comment here',
                    }
                    ],
                    buttons: [
                    {
                        text: titleYes,
                            handler: (data) => {
                            console.log('Buy clicked');
                            console.log("data",data);
                            var c = "";
                            c=data['comment'].trim();
                            this.check = false;
                            if( c != undefined &&  c != "" ){
                                                        
                                                let  details= {
                                                    //check_in_out_user_id:null,
                                                    //check_in_out_type:null,
                                                    //check_in_out_type_id:null,
                                                    //check_in_latitude:null,
                                                    //check_in_longitude:null,
                                                    //check_in_datetime:null,
                                                    check_out_latitude:(geoCordinates['coords'])?geoCordinates['coords'].latitude:"",
                                                    check_out_longitude:(geoCordinates['coords'])?geoCordinates['coords'].longitude:"",
                                                    check_out_datetime:new Date().getTime(),
                                                    local_updated_date:new Date().getTime(),
                                                    sync_status:0
                                                }
                                                    details['check_in_out_comment']=c;
                                                    this.appCom.getLocalStorageItem("globalCheckinData").then((checkinObj)=>{
                                                        this.globalCheckInData = checkinObj;
                                                        console.log("this.globalCheckInData",this.globalCheckInData);                                                                                                                                                                                                                                                                                                                                            
                                                        let whereCond =" `check_in_out_id` = "+this.globalCheckInData['insertId']; 
                                                            console.log("whwere cond",whereCond);
                                                            this.sqlS.updateData(details,"check_in_out",whereCond).then((data) => {
                                                                    console.log("data  checkout------>",data);
                                                                    this.events.publish('globalSync');
                                                                    this.check = false;
                                                                    //EMPTY GLOBAL DATA AFTER CHECK OUT
                                                                
                                                                    this.globalCheckInData={
                                                                        checkinFlag:false,
                                                                        checkinType:"",
                                                                        visitCheckFlag:false,
                                                                        checkinDetails: {
                                                                            check_in_out_user_id:null,
                                                                            check_in_out_type:null,
                                                                            check_in_out_type_id:null,
                                                                            check_in_latitude:null,
                                                                            check_in_longitude:null,
                                                                            check_in_datetime:null,
                                                                            check_out_latitude:null,
                                                                            check_out_longitude:null,
                                                                            check_out_datetime:null,
                                                                            generated_by:null
                                                                        }
                                                                    };    
                                                                    this.appCom.setLocalStorageItem("globalCheckinData",this.globalCheckInData).then(()=>{
                                                                    this.check = false;
                                                                    //this.setElement();
                                                                    });
                                                                    
                                                    }, (error) => {
                                                            this.check = false;
                                                            console.log('Error', error);
                                                            //this.appCom.showToast(ALL_MESSAGE.ERROR_MESSAGE.HPB_ADD_ERR,"middle");
                                                            //this.appCom.showAlert("",ALL_MESSAGE.ERROR_MESSAGE.HPB_ADD_ERR,"Ok","");
                                                    });

                                                });                                                                                                
                                                        
                            }else{
                                this.check = false;
                                this.appCom.showToast(ALL_MESSAGE.ERROR_MESSAGE.RDS_VISIT_NOT_FILLED,"middle");
                                return false;   
                            }
                        }
                    },{
                        text: titleNo,
                        handler: () => {
                        console.log('Cancel clicked');
                        this.check = false;
                        }
                    }
                    ]
                });
                alert.present();
            }
        }


 checkIn(){

    //get the geo co-ordinates
    if( this.check == false ){
    this.check = false;

        this.appCom.isGpsLocationEnabledC((successCallback)=>{			
        if(successCallback)	{
                    this.appCom.getLocationModeC((res) => {
                    console.log("res",res);
                    let type = this.rdsDataArr['rds_type'];
                    let id   = this.rdsDataArr['server_rds_id'];                                      
                    let  details= {
                                    //check_in_out_user_id:null,
                                    check_in_out_type: type,
                                    check_in_out_type_id:id,
                                    assigned_to:this.userId,
                                    generated_by:this.userId,
                                    check_in_out_user_id:this.userId
                        }
                        //if(res == 'high_accuracy'){                                        
                         this.busy=     this.appCom.getGeoLocationCordinates("checkIn").then((geoCordinates)=>{
                                        console.log("geoCordinates------>",geoCordinates);   
                                        console.log("this.rdsDataArr",this.rdsDataArr);
                                                                              
                                        console.log("geoCordinates------>",geoCordinates);   
                                        details['check_in_latitude'] = (geoCordinates['coords'])?geoCordinates['coords'].latitude:"";
                                        details['check_in_longitude'] = (geoCordinates['coords'])?geoCordinates['coords'].longitude:"";
                                        details['check_in_datetime'] = new Date().getTime();
                                        details['local_created_date'] = new Date().getTime();
                                        console.log("details =>",details);   
                                                    
                                        this.permissionCheckinpop(details);                   


                        },(error)=>{
                            console.log(error);
                            this.check = false
                            details['check_in_latitude'] = '';
                            details['check_in_longitude'] = '';
                            details['check_in_datetime'] = new Date().getTime();
                            details['local_created_date'] = new Date().getTime();
                            console.log("details =>",details);
                            this.permissionCheckinpop(details);                                       
                        });        
                        // }else{
                        // //show pop up for set high accuracy..
                        //  this.check = false
                        // this.appCom.showAlert(ALL_MESSAGE.ERROR_MESSAGE.GET_LOCATION_COORDS_ERR,"Ok","");                                
                        // }
                },(err)=>{
                     this.check = false
                    console.log(err);
                });
        }else{
            //show alert enable gps
             this.check = false
            this.appCom.showAlert(ALL_MESSAGE.ERROR_MESSAGE.GET_LOCATION_COORDS_ERR,"Ok","");  
            
        }	

    },(err)=>{
        this.check = false
        console.log(err);
        this.appCom.showAlert(ALL_MESSAGE.ERROR_MESSAGE.GENERIC_LOCATION_ERR,"Ok",""); 
        
    });

    }else{
       
    }

  }


  checkOut(){

    if( this.check == false ){
    this.check = false;
        //get the geo co-ordinates
        this.appCom.isGpsLocationEnabledC((successCallback)=>{			
        if(successCallback)	{
                    this.appCom.getLocationModeC((res) => {
                    console.log("res",res);
                        //if(res == 'high_accuracy'){                            
                         this.busy=        this.appCom.getGeoLocationCordinates("checkOut").then((geoCordinates)=>{
                                        console.log("geoCordinates------>",geoCordinates); 

                                        this.permissionCheckoutpop(geoCordinates);       

                        },(error)=>{
                            this.check = false; 
                            console.log(error);
                            this.permissionCheckoutpop('');
                        
                        });
                        
                        // }else{
                        //     this.check = false;   
                        //     //show pop up for set high accuracy..
                        //     this.appCom.showAlert(ALL_MESSAGE.ERROR_MESSAGE.GET_LOCATION_COORDS_ERR,"Ok","");
                        
                        // }
                },(err)=>{
                    this.check = false;
                    console.log(err);
                });
        }else{
             this.check = false;
            //show alert enable gps
            this.appCom.showAlert(ALL_MESSAGE.ERROR_MESSAGE.GET_LOCATION_COORDS_ERR,"Ok","");  
            
        }	

    },(err)=>{
        this.check = false;
        console.log(err);
        this.appCom.showAlert(ALL_MESSAGE.ERROR_MESSAGE.GENERIC_LOCATION_ERR,"Ok",""); 
        
    });

    }else{

    }


  }








}





//-----------VISIT LIST--------------------------------------------------------------------------------------------------------->


@Component({
  selector: 'distributor-visit-list',
  template: `
  
  
 
<ion-content  fullscreen="false" [ngBusy]="{busy: busy, message:busyMessage, minDuration: 600}" >
  <div *ngIf="showEmptyFlag">
            <h2 class="noData contMid">{{ "NO VISITS FOUND" | translate }}</h2>
        </div>
    <div class="flexWrap lineInOne" *ngFor="let visit of visitsData; let i = index;" (click)="goToVisitDetail(visit)" >
        <span class="indexVisit">{{i+1}}</span>
        <div class="visitDate">
            <h2>{{  visit['visit_date'] }}</h2>
        </div>
        <i class="icon-next-thin checkIn"></i>
    </div>
   


</ion-content>

  
  `
})
export class DistributorVisitListPage {
  
    visitsData:any=[];
    paramsRdsData:any=[];
    busyMessage:any="Please Wait...";  
    busy:any;
    showEmptyFlag:any=false;
    //INITIALIZE GLOBAL CHECK-IN OBJECT 
    globalCheckInData:any={
        checkinFlag:false,
        checkinType:"",
        insertId:null,
        checkinDetails: {
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
            
        }
    };
 
  constructor(public navCtrl: NavController, public navParams: NavParams,public sqlS:SqlServices,public shareS :ShareService,private appCom:appCommonMethods,public events:Events) {
      
  }

  ionViewDidLoad() {
    this.events.subscribe("rdsVisitListRefresh",()=>{
        setTimeout(()=> {
        this.listData();
        }, 300);
        
    });   
    

    this.appCom.getLocalStorageItem("globalCheckinData").then((checkinObj)=>{
        this.globalCheckInData = checkinObj;
        console.log("this.globalCheckInData",this.globalCheckInData);
    });    
    this.listData();
  }

  async ionViewDidEnter() {
     this.busyMessage = await this.appCom.getTranslatedTxt("Please wait...");   
  }

  listData(){
    console.log('ionViewDidLoad SphVisitPage');
    this.paramsRdsData=this.navParams.data;
    console.log("this.paramsRdsData2",this.paramsRdsData);   
    if( this.paramsRdsData['rdsData'] !=undefined && this.paramsRdsData['rdsData'] !="" ){
          var selectField = " `rds_visit_id`, `visit_date`, `rds_id` ";
          var tablename = " `rds_visit` ";
          var where = " `rds_id` ="+  this.paramsRdsData['rdsData']['server_rds_id'] ;
          var orderBy = " `local_created_date` DESC";
          this.busy=this.sqlS.selectTableData(selectField,tablename,where,orderBy,"").then((data) => {
            console.log("this.visitsData",this.visitsData);
            this.visitsData=[];
            for(let i=0;i<data['rows'].length;i++){                      
                let tempObj=data['rows'].item(i);
                tempObj['visit_date']=moment( tempObj['visit_date'] ).format('DD MMM YYYY'); 
                this.visitsData.push( data['rows'].item(i) );       
            }
                if( this.visitsData.length == 0 ){
                    this.showEmptyFlag=true;
                }else{
                    this.showEmptyFlag=false;
                }
          }, (error) => {
              console.log('Error', error);
              
          });
    }
  }

  goToVisitDetail(visit){
    var t=  this.shareS.getshareData("this")
    t.navCtrl.push(VisitDetailsPage,{
      "visitId" : visit['rds_visit_id'],
      "visitDate":visit['visit_date'],
      //"rdsName":this.paramsRdsData['rdsData']['rds_name']
       "rdsData":this.paramsRdsData['rdsData']
    });
  }




  

}





//-----------DISTRIBUTOR/CONTRACTOR DETAIL--------------------------------------------------------------------------------------------------------->


@Component({
  selector: 'page-sph-detail',
  template: `
  

<ion-content fullscreen="false">
    <div class="userForm">
        <div class="form_list">
            <h2 class="labelHeading">{{ rdsDataArr['rds_type']?rdsDataArr['rds_type']:"-" }}</h2>
            <ion-card>
                <ion-card-header>                
                    {{ "MOBILE NO." | translate }}  
                </ion-card-header>
                <ion-card-content>
                   {{ rdsDataArr['rds_mobile']?rdsDataArr['rds_mobile']:(rdsDataArr['rds_phone']?rdsDataArr['rds_phone']:"-") }}
                </ion-card-content>
            </ion-card>
            <ion-card>
                <ion-card-header>
                    {{ "ADDRESS" | translate }}  
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
                        {{ appCom.jsonParseCityName(rdsDataArr.rds_postalcode) ? appCom.jsonParseCityName(rdsDataArr.rds_postalcode) : '-' }}
                    </ion-card-content>
                </ion-card>
                <ion-card>
                    <ion-card-header>                     
                        {{ "PROVINCE" | translate }}
                    </ion-card-header>
                    <ion-card-content>
                        {{ appCom.jsonParseCityName(rdsDataArr.rds_province) ? appCom.jsonParseCityName(rdsDataArr.rds_province) : '-' }}
                    </ion-card-content>
                </ion-card>
            </div>
            <div class="two_coloum">
                <ion-card>
                    <ion-card-header>
                        {{ "CITY / MUNICIPALITY" | translate }}                     
                    </ion-card-header>
                    <ion-card-content>
                       {{ appCom.jsonParseCityName(rdsDataArr.rds_city) ? appCom.jsonParseCityName(rdsDataArr.rds_city):"-" }}
                    </ion-card-content>
                </ion-card>
                <ion-card>
                    <ion-card-header>
                        {{ "SUB DISTRICT" | translate }}          
                    </ion-card-header>
                    <ion-card-content>
                        {{ appCom.jsonParseCityName(rdsDataArr.rds_sub_district) ? appCom.jsonParseCityName(rdsDataArr.rds_sub_district): '-' }}
                    </ion-card-content>
                </ion-card>

            </div>
        </div>
    </div>
</ion-content>


  `
})
export class DistributorDetail {
  paramsRdsData:any=[];
  rdsDataArr:any=[];
  constructor(public navCtrl: NavController, public navParams: NavParams,public events:Events,public appCom:appCommonMethods) {
  this.paramsRdsData=this.navParams.data;  
  this.rdsDataArr=this.paramsRdsData['rdsData'];
  console.log("this.paramsRdsData2",this.paramsRdsData);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad DistributorDetail');
    
  }

}