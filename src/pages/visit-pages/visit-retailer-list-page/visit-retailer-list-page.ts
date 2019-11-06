import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, App, Events } from 'ionic-angular';
import { ALL_MESSAGE } from '../../../providers/constant';
import { SqlServices } from '../../../providers/sqlService';
import { ShareService } from "../../../providers/ShareService";
import { appCommonMethods } from "../../../providers/appCommonMethods";
import * as moment from 'moment';
import async from 'async';
import { CallNumber } from "@ionic-native/call-number";
import { AddVisitFormPage } from "../visit-add-form/visit-add-form";
import { DistributorRetailerDetailPage } from "../../distributor-retailer-page/distributor-retailer-detail-page/distributor-retailer-detail-page";

declare var cordova;

@Component({
  selector: 'visit-retailer-list-page',
  templateUrl: 'visit-retailer-list-page.html',
})
export class RetailerListVisitPage {
  visitTotal:any=0;
  visitTodayTotal:any=0;
  currentDataSel:any;
  allDataDistTodayList:any=[];
  allDataVisitedList:any = [];
  allCheckInOutDatas:any=[];
  nonVisitedData:any = [];
  allDataMasonTodayList:any = [];
  allData:any = [];
  busy:any;
  uid:any;
  currentUserData={};
  check:any;
  checkV:any=false;
  try:any = 0;
  today:boolean = true;
  achiveDate:any;
//INITIALIZE GLOBAL CHECK-IN OBJECT 
globalCheckInData:any={
    checkinFlag:false,
    checkinType:"",
    insertId:null,
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
        generated_by:null,   
    }
};

  visiListTab:any="notvisited";
  constructor(private events:Events,public app:App,public alertCtrl:AlertController,private callNumber: CallNumber,private shareS:ShareService,private sqlS:SqlServices,public navCtrl: NavController, public navParams: NavParams,public appCom:appCommonMethods) {
      this.currentUserData=this.shareS.getshareData('currSessionUserData');

    this.app.viewDidEnter.subscribe(()=>{
        this.firstFunction();
    })

  }
  ionViewDidEnter() {
        this.firstFunction();
  }  

  firstFunction() {
    console.log('ionViewDidLoad SphTodayVisitPage');
        this.checkV=false;
        this.appCom.getLocalStorageItem("globalCheckinData").then((checkinObj)=>{
            this.globalCheckInData = checkinObj;
            console.log("this.globalCheckInData",this.globalCheckInData);
        });

        if(this.today == false){
            this.dateChange();
            return false;
        }
        this.visitTotal=0;
        this.visitTodayTotal=0;
        this.allDataDistTodayList = [];
        this.allDataVisitedList = [];
        this.allCheckInOutDatas=[];
        this.nonVisitedData = [];
        this.allDataMasonTodayList = [];
        this.allData = [];

        let currSphId = this.currentUserData['role']=='$sph'?this.currentUserData['uid']:0;
    
        this.appCom.getAppPreference("userCreds").then((resDataU)=>{
        console.log("resDataUser",resDataU);
        if( resDataU != undefined && resDataU != '' ){
            this.uid=resDataU.userId;

            let currDate = moment().format("YYYY-MM-DD").toString();   
            console.log('currDate',currDate);
            let visitor_type='retailer';

            let newMemberTotal;
                
                // get all visited, non visited data
             //   let queryVisitedData = "select mft.*,cio.check_in_datetime,rdm.*,rdm.rds_name,rdm.rds_mobile,rdm.rds_phone,rdm.rds_city_name from retailer_distributor_master as rdm LEFT JOIN monthly_forecast_target as mft ON rdm.server_rds_id = mft.visitor_id and date(datetime(mft.target_date / 1000 , 'unixepoch','localtime')) = date('"+currDate+"') LEFT JOIN check_in_out as cio ON rdm.server_rds_id = cio.check_in_out_type_id and date(datetime(cio.check_in_datetime / 1000 , 'unixepoch','localtime')) = date('"+currDate+"') where rdm.rds_type = '"+visitor_type+"' and (cio.check_in_datetime IS NOT NULL OR mft.visitor_id IS NOT NULL) and rdm.rds_status=1 GROUP BY rdm.server_rds_id";
                  let queryVisitedData = "select mft.*,cio.check_in_datetime,rdm.*,rdm.rds_name,rdm.rds_mobile,rdm.rds_phone,rdm.rds_city_name from retailer_distributor_master as rdm LEFT JOIN monthly_forecast_target as mft ON rdm.server_rds_id = mft.visitor_id and date(datetime(mft.target_date / 1000 , 'unixepoch','localtime')) = date('"+currDate+"') LEFT JOIN check_in_out as cio ON rdm.server_rds_id = cio.check_in_out_type_id and date(datetime(cio.check_in_datetime / 1000 , 'unixepoch','localtime')) = date('"+currDate+"') where rdm.rds_type = '"+visitor_type+"' and ( date(datetime(cio.check_in_datetime / 1000 , 'unixepoch','localtime')) = date('"+currDate+"') or date(datetime(mft.target_date / 1000 , 'unixepoch','localtime')) = date('"+currDate+"') ) and rdm.rds_status=1 GROUP BY rdm.server_rds_id"; 
                  console.log(" queryVisitedData -  ",queryVisitedData);
                
                this.busy=this.sqlS.selectTableQueryData(queryVisitedData,[]).then((ressqlData:any)=>{
                    this.allDataVisitedList=[];
                    this.nonVisitedData = [];
                    this.allData = [];
                    this.visitTodayTotal = 0;
                    this.visitTotal = 0;
                    for(let i = 0;i<ressqlData.rows.length;i++){
                        if(ressqlData.rows.item(i).check_in_datetime != null){
                            this.visitTodayTotal++;                                
                            ressqlData.rows.item(i).proPic = '';
                            ressqlData.rows.item(i).visitStatus = true;
                            this.allDataVisitedList.push(ressqlData.rows.item(i));
                        }else{
                            ressqlData.rows.item(i).proPic = '';
                            ressqlData.rows.item(i).visitStatus = false;
                            this.nonVisitedData.push(ressqlData.rows.item(i));
                        }
                        if(ressqlData.rows.item(i).visitor_id != null){
                            this.visitTotal++;
                        }
                        this.allData.push(ressqlData.rows.item(i));
                    }
                },(error)=>{
                    console.log('error',error);
                });

        }else{
            this.uid="";
        }
    },(err)=>{
        console.log('err ref',err);
    });

  }

    dateChange(){
        setTimeout(() => {
            let dateVal = this.currentDataSel;
            let timestamp = this.appCom.dateToTimeStamp(dateVal);
            let date:any=0;
            let now:any=0;

            date = moment(dateVal).format('DD');
            now = moment().format('DD');
            console.log("this.currentDataSel ------------",dateVal,date,now);
            date = parseInt(date);
            now = parseInt(now);
            
            if(date != now){
                this.today = false;
                this.achiveDate = moment(timestamp).format("DD MMM YYYY").toString();
            }else{
                this.today = true;
            }
            this.calenderFilterData(timestamp);
        },500);
    }

    calenderFilterData(dateTime){    
        let currDate = moment(dateTime).format("YYYY-MM-DD").toString(); 

            this.visitTotal=0;
            this.visitTodayTotal=0;
            this.allDataDistTodayList = [];
            this.allDataVisitedList = [];
            this.allCheckInOutDatas=[];
            this.nonVisitedData = [];
            this.allDataMasonTodayList = [];
            this.allData = [];

            let currSphId = this.currentUserData['role']=='$sph'?this.currentUserData['uid']:0;
        
            this.appCom.getAppPreference("userCreds").then((resDataU)=>{
            console.log("resDataUser",resDataU);
            if( resDataU != undefined && resDataU != '' ){
                this.uid=resDataU.userId;

                //let currDate = moment().format("YYYY-MM-DD").toString();   
                console.log('currDate',currDate);
                let visitor_type='retailer';

                let localDate = this.appCom.getCurrentTimeStamp();

                // get all visited, non visited data
                //let queryVisitedData = "select mft.*,cio.check_in_datetime,rdm.*,rdm.rds_name,rdm.rds_mobile,rdm.rds_phone,rdm.rds_city_name from retailer_distributor_master as rdm JOIN monthly_forecast_target as mft ON rdm.server_rds_id = mft.visitor_id LEFT JOIN check_in_out as cio ON mft.visitor_id = cio.check_in_out_type_id and date(datetime(cio.check_in_datetime / 1000 , 'unixepoch','localtime')) = date(datetime(mft.target_date / 1000 , 'unixepoch','localtime')) where mft.sph_id = '"+this.uid+"' and date(datetime(mft.target_date / 1000 , 'unixepoch','localtime')) = date('"+currDate+"') and rdm.rds_type = '"+visitor_type+"' and rdm.rds_status=1 GROUP BY mft.visitor_id";
                
                //let queryVisitedData = "select mft.*,rdm.*,cio.check_in_datetime,rdm.rds_name,rdm.rds_mobile,rdm.rds_phone,rdm.rds_city_name from retailer_distributor_master as rdm LEFT JOIN monthly_forecast_target as mft ON rdm.server_rds_id = mft.visitor_id LEFT JOIN check_in_out as cio ON date(datetime(cio.check_in_datetime / 1000 , 'unixepoch','localtime')) = date('"+currDate+"') where date(datetime(cio.check_in_datetime / 1000 , 'unixepoch','localtime')) = date('"+currDate+"') and cio.check_in_out_type = '"+visitor_type+"' and rdm.rds_status=1 GROUP BY mft.visitor_id";
                
                let queryVisitedData = "select mft.*,cio.check_in_datetime,rdm.*,rdm.rds_name,rdm.rds_mobile,rdm.rds_phone,rdm.rds_city_name from retailer_distributor_master as rdm LEFT JOIN monthly_forecast_target as mft ON rdm.server_rds_id = mft.visitor_id and date(datetime(mft.target_date / 1000 , 'unixepoch','localtime')) = date('"+currDate+"') LEFT JOIN check_in_out as cio ON rdm.server_rds_id = cio.check_in_out_type_id and date(datetime(cio.check_in_datetime / 1000 , 'unixepoch','localtime')) = date('"+currDate+"') where rdm.rds_type = '"+visitor_type+"' and (cio.check_in_datetime IS NOT NULL OR mft.visitor_id IS NOT NULL) and rdm.rds_status=1 GROUP BY rdm.server_rds_id";
                

                console.log(" queryVisitedData -  ",queryVisitedData);

                this.busy=this.sqlS.selectTableQueryData(queryVisitedData,[]).then((ressqlData:any)=>{
                    this.allDataVisitedList=[];
                    this.nonVisitedData = [];                    
                    for(let i = 0;i<ressqlData.rows.length;i++){
                        if(ressqlData.rows.item(i).check_in_datetime != null){
                            this.visitTodayTotal++;                                
                            ressqlData.rows.item(i).proPic = '';
                            ressqlData.rows.item(i).visitStatus = true;
                            this.allDataVisitedList.push(ressqlData.rows.item(i));
                        }else{
                            ressqlData.rows.item(i).proPic = '';
                            ressqlData.rows.item(i).visitStatus = false;
                            this.nonVisitedData.push(ressqlData.rows.item(i));
                        }
                        if(ressqlData.rows.item(i).visitor_id != null){
                            this.visitTotal++;
                        }
                        this.allData.push(ressqlData.rows.item(i));
                    }
                },(error)=>{
                    console.log('error',error);
                });

            }else{
                this.uid="";
            }
        },(err)=>{
            console.log('err ref',err);
        });

    }

    goToRdsDetail(rds){
        this.app.getRootNav().push(DistributorRetailerDetailPage,{
            "rdsData":rds
        });
    }

    goToVisitAdd(rds){
        this.navCtrl.push(AddVisitFormPage,{
            "rdsData":rds
        });   
    }
 
    alreadyCheckInAlert(){
        this.appCom.showAlert(ALL_MESSAGE.ERROR_MESSAGE.ALREADY_CHECKED_IN,"Close","");
    }

    async permissionCheckinpop(details,rds){
        
            let titleYes = await this.appCom.getTranslatedTxt("Yes");
            let titleNo = await this.appCom.getTranslatedTxt("No");
            let title = await this.appCom.getTranslatedTxt("Are you sure you want to check in ?");
        
            let alert = this.alertCtrl.create({
                cssClass: 'confirm',
                title: title,
                buttons: [
                {
                    text: titleYes,
                    handler: () => {
                    console.log('Buy clicked');
                     this.checkV = false
                    //do  checkin                                                                                              
                            this.sqlS.insertData(details,"check_in_out").then((data) => {
                                    this.checkV = false 
                                    this.events.publish('globalSync');
                                    /*this.navCtrl.push(DistributorRetailerDetailPage,{
                                        "rdsData":rds,
                                        "tab":"visit"
                                    });*/
                                    this.app.getRootNav().push(DistributorRetailerDetailPage, {
                                        "rdsData":rds,
                                        "tab":"visit"
                                    });
                                    this.globalCheckInData = {
                                        checkinFlag:true,
                                        checkinType:"rds",
                                        insertId:data['insertId'],
                                        checkinDetails:details
                                    }   
                                    this.appCom.setLocalStorageItem("globalCheckinData",this.globalCheckInData).then(()=>{
                                     this.checkV = false
                                    //this.setElement();
                                    });
                                    //console.log("this.globalCheckInData",this.globalCheckInData,type);
                                    this.appCom.updateRetailerDistStats('retailer');
                                    this.appCom.updateRetailerDistStats('distributor');
                                    
                            }, (error) => {
                                     this.checkV = false
                                    console.log('Error', error);
                            });    


                    }
                },{
                    text: titleNo,
                    handler: () => {
                    console.log('Cancel clicked');
                    //do not checkin    
                     this.checkV = false
                    }
                }
                ],
                enableBackdropDismiss: false
            });
            alert.present();
          }
        
          async permissionCheckoutpop(geoCordinates){
        
            let titleYes = await this.appCom.getTranslatedTxt("Yes");
            let titleNo = await this.appCom.getTranslatedTxt("No");
            let title = await this.appCom.getTranslatedTxt("Are you sure you want to Check Out ?");     
            let titlePlaceHold = await this.appCom.getTranslatedTxt("Comment here");
        
            console.log("geoCordinates------>",geoCordinates);   
            
            if( this.globalCheckInData['visitCheckFlag']  ==true ){
                let alert = this.alertCtrl.create({
                    cssClass: 'confirm',
                    title: title,
                    buttons: [
                    {
                        text: titleYes,
                        handler: () => {
                         this.checkV = false    
                        console.log('Buy clicked');


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
                                                            
                                                            //EMPTY GLOBAL DATA AFTER CHECK OUT
                                                             this.checkV = false
                                                            this.globalCheckInData={
                                                                checkinFlag:false,
                                                                visitCheckFlag:false,
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
                                                             this.checkV = false
                                                            //this.setElement();
                                                            });
                                                            
                                            }, (error) => {
                                                     this.checkV = false
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
                         this.checkV = false
                        }
                    }
                    ],
                    enableBackdropDismiss: false
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
                        placeholder: titlePlaceHold,
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
                            if( c != undefined &&  c != "" ){
                             this.checkV = false    
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
                                            details['check_in_out_comment']=c;
                                            this.appCom.getLocalStorageItem("globalCheckinData").then((checkinObj)=>{
                                                this.globalCheckInData = checkinObj;
                                                console.log("this.globalCheckInData",this.globalCheckInData);                                                                                                                                                                                                                                                                                                                                            
                                                let whereCond =" `check_in_out_id` = "+this.globalCheckInData['insertId']; 
                                                    console.log("whwere cond",whereCond);
                                                    this.sqlS.updateData(details,"check_in_out",whereCond).then((data) => {
                                                            console.log("data  checkout------>",data);
                                                             this.checkV = false
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
                                                             this.checkV = false
                                                            //this.setElement();
                                                            });
                                                            
                                            }, (error) => {
                                                    this.checkV = false
                                                    console.log('Error', error);
                                                    //this.appCom.showToast(ALL_MESSAGE.ERROR_MESSAGE.HPB_ADD_ERR,"middle");
                                                    //this.appCom.showAlert("",ALL_MESSAGE.ERROR_MESSAGE.HPB_ADD_ERR,"Ok","");
                                            });

                                        });                                                                 
                                                        
                                                        
                            }else{
                                 this.checkV = false
                                this.appCom.showToast(ALL_MESSAGE.ERROR_MESSAGE.RDS_VISIT_NOT_FILLED,"middle");
                                return false;   
                            }
                        }
                    },{
                        text: titleNo,
                        handler: () => {
                         this.checkV = false
                        console.log('Cancel clicked');
                        }
                    }
                    ]
                });
                alert.present();

            }
        }
  
  checkIn(rds){

    if( this.checkV == false ){
    this.checkV = false;      

  //get the geo co-ordinates
        this.appCom.isGpsLocationEnabledC((successCallback)=>{			
        if(successCallback)	{
                    this.appCom.getLocationModeC((res) => {
                    console.log("res",res);
                    let type = rds['rds_type'];
                    let id =   rds['server_rds_id'];                                      
                    let  details= {
                                    //check_in_out_user_id:null,
                                    check_in_out_type: type,
                                    check_in_out_type_id:id,
                                    assigned_to:this.uid,
                                    generated_by:this.uid,
                                    check_in_out_user_id:this.uid
                    };
                        //if(res == 'high_accuracy'){                                        
                              this.busy=  this.appCom.getGeoLocationCordinates("checkIn").then((geoCordinates)=>{
                                        console.log("geoCordinates------>",geoCordinates);   
                                        details['check_in_latitude'] = (geoCordinates['coords'])?geoCordinates['coords'].latitude:"";
                                        details['check_in_longitude'] = (geoCordinates['coords'])?geoCordinates['coords'].longitude:"";
                                        details['check_in_datetime'] = new Date().getTime();
                                        details['local_created_date'] = new Date().getTime();
                                        console.log("details =>",details);
                                        this.permissionCheckinpop(details,rds);
                                },(error)=>{
                                     this.checkV = false
                                    console.log(error);
                                    //this.appCom.showAlert(ALL_MESSAGE.ERROR_MESSAGE.GENERIC_LOCATION_ERR,"Ok","");                                       
                                    details['check_in_latitude'] = '';
                                    details['check_in_longitude'] = '';
                                    details['check_in_datetime'] = new Date().getTime();
                                    details['local_created_date'] = new Date().getTime();
                                    console.log("details =>",details);
                                    
                                    this.permissionCheckinpop(details,rds);
                                });        
                        // }else{
                        //  this.checkV = false
                        // //show pop up for set high accuracy..
                        // this.appCom.showAlert(ALL_MESSAGE.ERROR_MESSAGE.GET_LOCATION_COORDS_ERR,"Ok","");                                
                        // }
                },(err)=>{
                     this.checkV = false
                    console.log(err);
                });
        }else{
            //show alert enable gps
            this.appCom.showAlert(ALL_MESSAGE.ERROR_MESSAGE.GET_LOCATION_COORDS_ERR,"Ok","");  
             this.checkV = false
        }	

    },(err)=>{
        console.log(err);
        this.appCom.showAlert(ALL_MESSAGE.ERROR_MESSAGE.GENERIC_LOCATION_ERR,"Ok",""); 
         this.checkV = false
    });

    }else{

    }

  }

  checkOut(rds){

    if( this.checkV == false ){
    this.checkV = false;
            //get the geo co-ordinates
            this.appCom.isGpsLocationEnabledC((successCallback)=>{			
            if(successCallback)	{
                        this.appCom.getLocationModeC((res) => {
                        console.log("res",res);
                            //if(res == 'high_accuracy'){                            
                            this.busy=  this.appCom.getGeoLocationCordinates("checkOut").then((geoCordinates)=>{
                                            console.log("geoCordinates------>",geoCordinates);   

                                            this.permissionCheckoutpop(geoCordinates);     

                                                                                                                                                                                          
                            },(error)=>{
                                    this.checkV = false
                                console.log(error);
                                this.permissionCheckoutpop('');
                                //this.appCom.showAlert(ALL_MESSAGE.ERROR_MESSAGE.GENERIC_LOCATION_ERR,"Ok","");
                            
                            });
                            
                            // }else{
                            //  this.checkV = false;
                            // //show pop up for set high accuracy..
                            // this.appCom.showAlert(ALL_MESSAGE.ERROR_MESSAGE.GET_LOCATION_COORDS_ERR,"Ok","");
                            
                            // }
                    },(err)=>{
                         this.checkV = false;
                        console.log(err);
                    });
            }else{
                 this.checkV = false;
                //show alert enable gps
                this.appCom.showAlert(ALL_MESSAGE.ERROR_MESSAGE.GET_LOCATION_COORDS_ERR,"Ok","");  
                
            }	

        },(err)=>{
             this.checkV = false;
            console.log(err);
            this.appCom.showAlert(ALL_MESSAGE.ERROR_MESSAGE.GENERIC_LOCATION_ERR,"Ok",""); 
            
        });

    }else{

    }    


  }
  
  getCheckInCheckOutDataProcess(dataArr){
    return new Promise((resolve,reject)=>{

        let i=0;
        let dataFinal=[];
        let checkInDataRec =(currData,j)=>{

              if(!currData[j]){
                resolve(dataFinal);
                return false;
              }
              let tableName='';
              let colName='';

              if(currData[j]['check_in_out_type']=='project'){
                  tableName='project_master';
                  colName='project_id';
              }else if(currData[j]['check_in_out_type']=='retailer' || currData[j]['check_in_out_type']=='distributor'){
                  tableName='retailer_distributor_master';
                  colName='server_rds_id';
              }
              let query = "select * from "+tableName+" where "+colName+"="+currData[j]['check_in_out_type_id'];
              this.sqlS.selectTableQueryData(query,[]).then((reslData)=>{

                for(let k=0;k<reslData.rows.length;k++){
                    let tempObj = {};
                    let tmpData = reslData.rows.item(k);
                    tempObj['check_in_out_type']=currData[j]['check_in_out_type'];
                    tempObj['check_in_out_id']=currData[j]['check_in_out_id'];
                    tempObj['check_in_out_type_id']=currData[j]['check_in_out_type_id'];
                    tempObj['hpb_id']= tmpData['hpb_id'] || false;
                    tempObj['server_rds_id']= tmpData['server_rds_id'] || false;
                    tempObj['rds_type']= tmpData['rds_type'] || false;
                    dataFinal.push(tempObj);
                    console.log('reslData',reslData);
                } 
                j++;
                checkInDataRec(dataArr,j);
               
              },(error)=>{
                j++;
                checkInDataRec(dataArr,j);
                console.log('error',error);
              });

        }
        checkInDataRec(dataArr,i);
    });
  }


    call(rds){
        let number =  rds['rds_mobile'] ? rds['rds_mobile'] : rds['rds_phone'] ? rds['rds_phone'] :"";
        if(number){
            this.callNumber.callNumber(number, true)
                .then(() => console.log('Launched dialer!'))
                .catch(() => console.log('Error launching dialer'));
        }
    }

}
