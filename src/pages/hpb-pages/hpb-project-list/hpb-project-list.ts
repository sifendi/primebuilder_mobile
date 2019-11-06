
import { appCommonMethods } from '../../../providers/appCommonMethods';
import { ALL_MESSAGE } from '../../../providers/constant';
import { ProductReceiptsFormPage } from '../../product-receipts/product-receipts-form/product-receipts-form';
import { SqlServices } from '../../../providers/sqlService';
import { Component,NgZone } from '@angular/core';
import { Events, IonicPage, NavController, NavParams,AlertController } from 'ionic-angular';
import { ProjectParentTabsPage } from "../../project/project-parent-tab-page/project-parent-tab-page";
import { ProjectFilterPage } from "../../project/project-filter/project-filter";
import { AddProjectPage } from "../../project/add-project/add-project";
import { App, Platform } from 'ionic-angular';

declare var cordova;

@Component({
  selector: 'hpb-page-project-list',
  templateUrl: 'hpb-project-list.html',
})
export class HpbProjectListPage {
  
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
  hpbData:any;
  showEmptyFlag:any=false;
  firstFunctionCalled:boolean=false; 
  

  constructor(public navCtrl: NavController, public navParams: NavParams,public sqlS:SqlServices,public events:Events,public appCom:appCommonMethods,public app: App,public alertCtrl:AlertController,private ngZone: NgZone, public platform: Platform) {
  
    this.events.subscribe("projFilterEvent",(response)=>{
       this.projData=response.projData;     
       this.filterby=response.filterby;
    });

  
    this.app.viewDidEnter.subscribe(()=>{
          
        this.appCom.getLocalStorageItem("globalCheckinData").then((checkinObj)=>{
        this.globalCheckInData = checkinObj;
         if(this.firstFunctionCalled == false){
            this.firstFunctionCalled = true;
            this.refreshHpbProjectListPage().then((response)=>{
                console.log("response from hpb project list=>",response);
            });
         }
        console.log("this.globalCheckInData",this.globalCheckInData);
        });
    })


  }



  ionViewDidLoad() {
    console.log('ionViewDidLoad HpbProjectListPage');


  
    this.paramData = this.navParams.data; 
    console.log("paramData",this.paramData);

    
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
 
    this.hpbData=this.paramData['hpbData'];
    this.serverHpbId=this.hpbData['server_hpb_id'];        
   

  }

  refreshHpbProjectListPage(){
    
    return new Promise((resolve,reject)=>{

            this.projData=[]; 
            var action = this.paramData['action']
            console.log("action",action);
            if(action == "hpbSpecific"){       
            //OPENS PROJECT FOR SPECIFIC HPB ONLY
            var hpbId = this.serverHpbId;     
            var where = "hm.server_hpb_id = "+hpbId;
            let query="SELECT hm.hpb_name,projm.project_photo,ptt.project_type,nmct.nmc_type,pst.project_stage,projm.project_completion_date,projm.project_province,projm.project_city,projm.project_sub_district,projm.srku_owner_mobile_no,projm.srku_province,projm.srku_city,projm.srku_sub_district,projm.srku_pincode,projm.floor_size,projm.number_of_units,projm.is_micro_credit,projm.additional_comments, projm.hpb_digital_sign,projm.hpb_id,projm.server_hpb_id,projm.project_completion_date,projm.project_quantity_estimation,projm.project_address,projm.project_stage,projm.project_stage_mid,projm.project_sub_district,projm.project_pincode,projm.is_srku,projm.srku_owner_name,projm.srku_owner_address,projm.srku_owner_mobile_no,projm.non_micro_credit_type,projm.non_micro_credit_type_mid,projm.bank_name,projm.nmc_document,projm.bank_document,projm.assigned_to,projm.created_by,projm.updated_by,projm.sync_status,projm.status,projm.local_created_date,projm.local_updated_date,projm.project_id,projm.server_project_id,projm.project_name,projm.project_address,projm.is_srku,hm.hpb_name,hm.server_hpb_id,hm.hpb_id,(SELECT sast.srku_approval_status FROM srku_approval_status_tbl AS sast WHERE sast.project_id = projm.project_id  AND sast.is_closed = 0 ) AS tlh_approval,(SELECT sast.srku_rejection_reason FROM srku_approval_status_tbl AS sast WHERE sast.project_id = projm.project_id  AND sast.is_closed = 0 ) AS tlh_rejection_res FROM project_master projm LEFT JOIN hpb_master hm ON projm.server_hpb_id = hm.server_hpb_id LEFT JOIN project_type_tbl ptt ON projm.project_type_mid = ptt.server_id LEFT JOIN project_stage_tbl pst ON projm.project_stage_mid = pst.server_id LEFT JOIN nmc_tbl nmct ON projm.non_micro_credit_type_mid = nmct.server_id where "+where+" ORDER BY  projm.local_created_date desc ";
            this.busy=this.sqlS.queryExecuteSql(query,[]).then((data) => {    
                    for(let i=0;i<data['rows'].length;i++){       
                    this.projData.push( data['rows'].item(i) );  
                        if(  this.projData[i].hpb_digital_sign !=undefined && this.projData[i].hpb_digital_sign !='' ){
                            this.projData[i].hpb_digital_sign = this.appCom.urlSanitizer(this.projData[i].hpb_digital_sign);    
                        }else{
                            this.projData[i].hpb_digital_sign = "";
                        }
                    }
                    console.log("projData",this.projData);
                        if( this.projData.length == 0 ){
                            this.showEmptyFlag=true;
                        }else{
                            this.showEmptyFlag=false;
                        }
                    this.firstFunctionCalled = false;    
                    resolve(true);    
                }, (error) => {
                    console.log('Error', error);  
                    this.firstFunctionCalled = false;    
                    reject(error);
                });

            }else{
                
                let query=" SELECT  hm.hpb_name,projm.project_photo,ptt.project_type, projm.hpb_digital_sign,projm.hpb_id,projm.server_hpb_id,projm.project_completion_date,projm.project_quantity_estimation,projm.project_address,projm.project_stage,projm.project_stage_mid,projm.project_sub_district,projm.project_pincode,projm.is_srku,projm.srku_owner_name,projm.srku_owner_address,projm.srku_owner_mobile_no,projm.non_micro_credit_type,projm.non_micro_credit_type_mid,projm.bank_name,projm.nmc_document,projm.bank_document,projm.assigned_to,projm.created_by,projm.updated_by,projm.sync_status,projm.status,projm.local_created_date,projm.local_updated_date,projm.project_id,projm.server_project_id,projm.project_name,projm.project_address,projm.is_srku,hm.hpb_name,hm.server_hpb_id,hm.hpb_id,(SELECT sast.srku_approval_status FROM srku_approval_status_tbl AS sast WHERE sast.project_id = projm.project_id  AND sast.is_closed = 0 ) AS tlh_approval,(SELECT sast.srku_rejection_reason FROM srku_approval_status_tbl AS sast WHERE sast.project_id = projm.project_id  AND sast.is_closed = 0 ) AS tlh_rejection_res FROM project_master projm LEFT JOIN hpb_master hm ON projm.server_hpb_id = hm.server_hpb_id LEFT JOIN project_type_tbl ptt ON projm.project_type_mid = ptt.id ORDER BY  projm.local_created_date desc ";
                this.busy=this.sqlS.queryExecuteSql(query,[]).then((data) => {    
                    for(let i=0;i<data['rows'].length;i++){       
                    this.projData.push( data['rows'].item(i) );  
                        if(  this.projData[i].hpb_digital_sign !=undefined && this.projData[i].hpb_digital_sign !='' ){
                            this.projData[i].hpb_digital_sign = this.appCom.urlSanitizer(this.projData[i].hpb_digital_sign);    
                        }else{
                            this.projData[i].hpb_digital_sign = "";
                        }
                    }
                    this.firstFunctionCalled = false;
                    resolve(true);    
                    console.log("projData",this.projData);
                }, (error) => {
                    console.log('Error', error);  
                    this.firstFunctionCalled = false;    
                    reject(error);
                });
                this.projDataTemp= this.projData;
            }

    });
 
  }



 async ionViewDidEnter(){
  this.check=false;
  this.busyMessage = await this.appCom.getTranslatedTxt("Please wait...");   
  
  }

  alreadyCheckInAlert(){
      this.appCom.showAlert(ALL_MESSAGE.ERROR_MESSAGE.ALREADY_CHECKED_IN,"Close","");
  }

   //SEARCH PROJECT
   searchProject(eventVal){
     
        if (typeof eventVal.target.value != 'undefined' && eventVal.target.value.length != 0) {
             
            this.busy=this.sqlS.search_project( eventVal.target.value).then((searchRes)=>{
                console.log("searchRes",searchRes);
                this.projData = [];
                for (let i = 0; i < searchRes['rows'].length; i++) {
                    this.projData.push( searchRes['rows'].item(i) );    

                      var selectField = " `hpb_id`, `hpb_name` ,`hpb_type`,`server_hpb_id` ";
                      var tablename = "hpb_master";
                      var where=" `server_hpb_id` = "+this.projData[i]['server_hpb_id'];
                      var orderBy = " `created_date` DESC"; 
                      this.sqlS.selectTableData(selectField,tablename,where,orderBy,"").then((hpbdata) => {
                            this.projData[i]['user']=hpbdata['rows'].item(0); 
                      }, (error) => {
                          console.log('Error', error);  
                      }); 
                }
            });

        }else{
              this.projData = this.projDataTemp;
              console.log("this.projData",this.projData);
        }
   }


   goToProjectDetail(projItem){
       this.app.getRootNav().push(ProjectParentTabsPage,{
           "projId":projItem['project_id'],
           "projName":projItem['project_name'],
           "hpbName":projItem?projItem['hpb_name']:"",
           "hpbId":projItem?projItem['server_hpb_id']:"",
           "projData":projItem 
       });
   }

   goToProductReceiptForm(projItem){
       let hpbid= projItem?projItem['server_hpb_id']:"";
       if( hpbid !=undefined && hpbid !="" ){
                this.app.getRootNav().push(ProductReceiptsFormPage,{
                "projId":projItem['project_id'],
                "projName":projItem['project_name'],
               
              });
       }else{
            this.appCom.showAlert(ALL_MESSAGE.ERROR_MESSAGE.NO_HPB_ERR,"Ok","");   
       }
       
   }


   goToFilterPage(){
      this.app.getRootNav().push(ProjectFilterPage);
   }

   goToAddProjectForm(){
    this.busy=this.appCom.projectAddCheckPrvSRKUApp().then((resResult:any)=>{
        if(resResult){
              this.navCtrl.push(AddProjectPage);
        }else{
            this.appCom.showAlert(ALL_MESSAGE.ERROR_MESSAGE.NEW_PRE_PROJECT_SRKU_ERR,"Ok",null);
        }
    });
   }

   clearFilter(){
        this.filterby = "";
        this.projData=[];
        var selectField = " * ";
        var tablename = "project_master";
        var orderBy = " `created_date` DESC";  
        this.busy=this.sqlS.selectTableData(selectField,tablename,"",orderBy,"").then((data) => {
            console.log('data fetched', data);
            for(let i=0;i<data['rows'].length;i++){       
            this.projData.push( data['rows'].item(i) );  

                            var selectField = " `hpb_id`, `hpb_name` ,`hpb_type`,`server_hpb_id` ";
                            var tablename = "hpb_master";
                            var where=" `server_hpb_id` = "+this.projData[i]['server_hpb_id'];
                            this.sqlS.selectTableData(selectField,tablename,where,"","").then((hpbdata) => {
                            this.projData[i]['user']=hpbdata['rows'].item(0); 

                            }, (error) => {
                                console.log('Error', error);  
                            }); 

            }
            console.log("projData1",this.projData);
        }, (error) => {
            console.log('Error', error);  
        });
        this.projDataTemp= this.projData;

   }

   async permissionCheckinpop(details,projItem){
    
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
                this.check = false; 
                //do  checkin  
                    this.sqlS.insertData(details,"check_in_out").then((data) => {
                        
                        this.globalCheckInData = {
                            checkinFlag:true,
                            checkinType:"project",
                            insertId:data['insertId'],
                            checkinDetails:details
                        }   
                        this.appCom.setLocalStorageItem("globalCheckinData",this.globalCheckInData).then(()=>{
                            this.check = false;
                            //this.setElement();
                        });
                        
                        this.appCom.updateMasonContractorStats('mason');
                        this.appCom.updateMasonContractorStats('contractor');
                            
                        this.app.getRootNav().push(ProjectParentTabsPage,{
                            "projData":projItem,
                            "projId":projItem['project_id'],
                            "projName":projItem['project_name'],
                            "hpbId":projItem['user']?projItem['user']['hpb_id']:"",
                            "hpbName":projItem['user']?projItem['user']['hpb_name']:"",
                            "tab":"receipt",
                        });
                        
                    }, (error) => {
                            this.check = false;
                            console.log('Error', error);
                    });    
                }
            },
            {
                text: titleNo,
                handler: () => {
                console.log('Cancel clicked');
                //do not checkin    
                this.check = false;  
    
                }
            }]
        });
        alert.present(); 
      }
    
      async permissionCheckoutpop(geoCordinates){
    
        let titleYes = await this.appCom.getTranslatedTxt("Yes");
        let titleNo = await this.appCom.getTranslatedTxt("No");
        let title = await this.appCom.getTranslatedTxt("Are you sure you want to Check Out ?");     
        let titlePlaceHold = await this.appCom.getTranslatedTxt("Comment here");
    
        console.log("geoCordinates------>",geoCordinates);         
        console.log("this.globalCheckInData['visitCheckFlag']==>",this.globalCheckInData['visitCheckFlag']);
        this.appCom.getLocalStorageItem("globalCheckinData").then((checkinObj)=>{
           this.globalCheckInData=checkinObj;
           if( this.globalCheckInData['visitCheckFlag']==true ){
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
                                
                                check_out_latitude:(geoCordinates['coords'])?geoCordinates['coords'].latitude:"",
                                check_out_longitude:(geoCordinates['coords'])?geoCordinates['coords'].longitude:"",
                                check_out_datetime:new Date().getTime(),
                                local_updated_date:new Date().getTime(),
                                sync_status:0
                                
                            }
                                        
                            this.appCom.getLocalStorageItem("globalCheckinData").then((checkinObj)=>{
                            this.globalCheckInData = checkinObj;
                            console.log("this.globalCheckInData",this.globalCheckInData);                                                                                                                                                                                                                                                                                                                                            
                            let whereCond =" `check_in_out_id` = "+this.globalCheckInData['insertId']; 
                                console.log("whwere cond",whereCond);
                                this.sqlS.updateData(details,"check_in_out",whereCond).then((data) => {
                                        this.events.publish('globalSync');
                                        console.log("data  checkout------>",data);
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
                        }
                    },{
                        text: titleNo,
                        handler: () => {
                            console.log('Cancel clicked');
                            this.check = false;
                        }
                        }]
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
                            this.check = false;
                            let c = "";
                            c=data['comment'].trim();
                            //c=c.trim();
                            if( c != undefined &&  c != "" ){
                            
                            let  details= {
                                    
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
                                                    this.events.publish('globalSync');
                                                    console.log("data  checkout------>",data);
                                                    this.check = false; 
                                                    //EMPTY GLOBAL DATA AFTER CHECK OUT
                                                
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
                                this.appCom.showToast(ALL_MESSAGE.ERROR_MESSAGE.PRODUCT_RECEIPT_NOT_FILLED,"middle");
                                return false;   
                            }
                        }
                    },{
                        text: titleNo,
                        handler: () => {
                        console.log('Cancel clicked');
                        this.check = false;
                        }
                    }]
                });
                alert.present();

            }
        });
    }

   checkIn(projItem){
    

    if( this.check == false ){
        this.check = false;     

  //get the geo co-ordinates
        this.appCom.isGpsLocationEnabledC((successCallback)=>{			
        if(successCallback)	{
                    this.appCom.getLocationModeC((res) => {
                    console.log("res",res);
                    let type = "project";
                    let id =    projItem['project_id'];
                    let  details= {
                        
                        check_in_out_type: type,
                        check_in_out_type_id:id,
                        assigned_to:this.userId,
                        generated_by:this.userId,
                        check_in_out_user_id:this.userId,
                    }
                                  
                        //if(res == 'high_accuracy'){                                        
                            this.busy=this.appCom.getGeoLocationCordinates("checkIn").then((geoCordinates)=>{
                                details['check_in_latitude'] = (geoCordinates['coords'])?geoCordinates['coords'].latitude:"";
                                details['check_in_longitude'] = (geoCordinates['coords'])?geoCordinates['coords'].longitude:"";
                                details['check_in_datetime'] = new Date().getTime();
                                details['local_created_date'] = new Date().getTime();
                                console.log("details =>",details);

                                this.permissionCheckinpop(details,projItem);

                            },(error)=>{
                                this.check = false; 
                                console.log(error);
                                //this.appCom.showAlert(ALL_MESSAGE.ERROR_MESSAGE.GENERIC_LOCATION_ERR,"Ok","");                                       
                                details['check_in_latitude'] = "";
                                details['check_in_longitude'] = "";
                                details['check_in_datetime'] = new Date().getTime();
                                details['local_created_date'] = new Date().getTime();
                                console.log("details =>",details);

                                this.permissionCheckinpop(details,projItem);
                            });        
                        // }else{
                        //     this.check = false;    
                        //     //show pop up for set high accuracy..
                        //     //this.appCom.showAlert(ALL_MESSAGE.ERROR_MESSAGE.GET_LOCATION_COORDS_ERR,"Ok",""); 
                        //     details['check_in_latitude'] = "";
                        //     details['check_in_longitude'] = "";
                        //     details['check_in_datetime'] = new Date().getTime();
                        //     details['local_created_date'] = new Date().getTime();
                        //     console.log("details =>",details);

                        //     this.permissionCheckinpop(details,projItem);                               
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


   checkOut(projItem){
  
        if( this.check == false ){
            this.check = false;
            //get the geo co-ordinates
            this.appCom.isGpsLocationEnabledC((successCallback)=>{			
            if(successCallback)	{
                        this.appCom.getLocationModeC((res) => {
                        console.log("res",res);
                            //if(res == 'high_accuracy'){                            
                                this.busy= this.appCom.getGeoLocationCordinates("checkOut").then((geoCordinates)=>{
                                    this.permissionCheckoutpop(geoCordinates);
                                },(error)=>{
                                    this.check = false;
                                    console.log(error);
                                    //this.appCom.showAlert(ALL_MESSAGE.ERROR_MESSAGE.GENERIC_LOCATION_ERR,"Ok","");
                                    this.permissionCheckoutpop('');
                                });
                            
                            // }else{
                            //     this.check  = false;
                            //     //show pop up for set high accuracy..
                            //     //this.appCom.showAlert(ALL_MESSAGE.ERROR_MESSAGE.GET_LOCATION_COORDS_ERR,"Ok","");
                            //     this.permissionCheckoutpop('');
                            // }
                    },(err)=>{
                        this.check= false;
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
