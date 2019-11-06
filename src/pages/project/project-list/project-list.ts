
import { appCommonMethods } from '../../../providers/appCommonMethods';
import { ALL_MESSAGE } from '../../../providers/constant';
import { AddProjectPage } from '../add-project/add-project';
import { ProductReceiptsFormPage } from '../../product-receipts/product-receipts-form/product-receipts-form';

import { ProjectFilterPage } from '../project-filter/project-filter';

import { SqlServices } from '../../../providers/sqlService';
import { Component } from '@angular/core';
import { Events, IonicPage, NavController, NavParams, AlertController, ModalController, Platform } from 'ionic-angular';
import { ProjectDetailsPage } from "../project-details/project-details";
import { ProjectParentTabsPage } from "../project-parent-tab-page/project-parent-tab-page";
declare var cordova;
declare var window;
declare var sessionUserGlobalData;
declare var debugDataCustom;
@Component({
  selector: 'page-project-list',
  templateUrl: 'project-list.html',
})
export class ProjectListPage {

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
            check_in_out_comment:null
           
        }
    };  
  
  projData:any=[];
  projDataTemp:any=[];
  projDataTempF:any=[];
  filterby:any="";
  filterQuery:any="";

   projFilterArr:any={
     subDistrict:null,
     projectStage:null,
     projectType:null,
     filterQuery:null,
     isSrku:null,
  };
   busy:  Promise<any>;
   busyMessage:any="Please Wait...";  
   check:any=false;
   userId:any;
   srkuValue:any
   showEmptyFlag:any=false;
  checkInOutCheckCondition:boolean=true;
  projectSearchTxt:any=null;
  constructor(public navCtrl: NavController,public modalCtrl:ModalController, public navParams: NavParams,public sqlS:SqlServices,public events:Events,public appCom:appCommonMethods,public alertCtrl:AlertController,public platform: Platform) {
     this.events.subscribe("refreshProjList",()=>{
        this.filterby="";
        this.projectSearchTxt=null;
        this.projFilterArr={
        subDistrict:null,
        projectStage:null,
        projectType:null,
        isSrku:null,
        };
        this.initProjectDisList();
    });

    // this.events.subscribe("checkInOutCheckConditionRerender",()=>{
    //         this.checkInOutCheckCondition=false;
    //         console.log('checkInOutCheckConditionRerender',this.checkInOutCheckCondition);
    //         setTimeout(()=>{
    //           this.checkInOutCheckCondition=true;
    //         },1);
    // });

  }

ionViewDidLoad(){
      
}


async ionViewDidEnter() {
       this.busyMessage = await this.appCom.getTranslatedTxt("Please wait...");   
       this.userId=sessionUserGlobalData['userId'];
       this.projectSearchTxt=null;
       if(this.filterby==""){
          this.initProjectDisList(); 
       }
      
  }

 ionViewCanEnter(){
    this.check=false;  
    this.appCom.getLocalStorageItem("globalCheckinData").then((checkinObj)=>{
        this.globalCheckInData = checkinObj;
    });  
  }  


initProjectDisList(){
    return new Promise((resolve,reject)=>{
        this.projData=[];  
        let checkInOutFlag=this.globalCheckInData['checkinFlag'] == true && this.globalCheckInData['checkinDetails']['check_in_out_type_id']>0   &&  this.globalCheckInData['checkinDetails']['check_in_out_type'] == 'project';
        let query=" SELECT  projm.project_photo,ptt.project_type, projm.hpb_digital_sign,projm.hpb_id,projm.server_hpb_id,projm.project_completion_date,projm.project_quantity_estimation,projm.project_address,projm.project_stage,projm.project_stage_mid,projm.project_sub_district,projm.project_pincode,projm.is_srku,projm.srku_owner_name,projm.srku_owner_address,projm.srku_owner_mobile_no,projm.non_micro_credit_type,projm.non_micro_credit_type_mid,projm.bank_name,projm.nmc_document,projm.bank_document,projm.assigned_to,projm.created_by,projm.updated_by,projm.sync_status,projm.status,projm.local_created_date,projm.local_updated_date,projm.project_id,projm.server_project_id,projm.project_name,projm.project_address,projm.is_srku,hm.hpb_name,hm.server_hpb_id,hm.hpb_id,(SELECT sast.srku_approval_status FROM srku_approval_status_tbl AS sast WHERE sast.project_id = projm.project_id  AND sast.is_closed = 0 ) AS tlh_approval,(SELECT sast.srku_rejection_reason FROM srku_approval_status_tbl AS sast WHERE sast.project_id = projm.project_id  AND sast.is_closed = 0 ) AS tlh_rejection_res FROM project_master projm LEFT JOIN hpb_master hm ON projm.server_hpb_id = hm.server_hpb_id LEFT JOIN project_type_tbl ptt ON projm.project_type_mid = ptt.server_id ";

        if(checkInOutFlag){
            query+=" ORDER BY CASE WHEN projm.project_id ="+this.globalCheckInData['checkinDetails']['check_in_out_type_id']+" THEN 1 ELSE 2 END, projm.local_created_date desc";
        }else{
            query+=" ORDER BY  projm.local_created_date desc ";
        }
        console.log('project query',query);
        this.busy=this.sqlS.queryExecuteSql(query,[]).then((data) => {    
            this.projData=[];    
            for(let i=0;i<data['rows'].length;i++){       
                this.projData.push( data['rows'].item(i) );  
                }
            this.projDataTemp=this.projData;
            resolve(true);
            }, (error) => {
                console.log('Error', error);  
                reject(error);
            });
    })

  }


   //SEARCH PROJECT
searchProject(ev){
       if(this.filterby==""){
          this.projData=this.projDataTemp;
       }else{
            this.projData=this.projDataTempF;
       }
        let val = ev.target.value;
        if (val && val.trim() != '') {
            this.projData = this.projData.filter((item) => {
                return (item['project_name'].toLowerCase().indexOf(val.toLowerCase()) > -1);
            })
        }
}

 goToFilterPage(){
     //  this.navCtrl.push(ProjectFilterPage);
     let openFilterM=this.modalCtrl.create(ProjectFilterPage,{projFilterArr:this.projFilterArr});
     openFilterM.onDidDismiss((fData:any)=>{
       // console.log('fData',fData);
        let query="";
        if(fData['filterby']){
             this.filterby = fData['filterby'];
             this.projDataTempF = fData['projData'];
             this.projFilterArr = fData['filterData'];
             this.projData=this.projDataTempF;
             this.filterQuery=fData['filterQuery'];
        }
     });
     openFilterM.present();
 }

clearFilter(){
    this.filterby="";
    this.projData=this.projDataTemp;
    this.projDataTempF=[];
    this.projFilterArr={
     subDistrict:null,
     projectStage:null,
     projectType:null,
     isSrku:null,
  };
}

goToProjectDetail(projItem){
       this.navCtrl.push(ProjectParentTabsPage,{
           "projData":projItem,
           "projId":projItem['project_id'],
           "projName":projItem['project_name'],
           "hpbId":projItem?projItem['server_hpb_id']:"",
           "hpbName":projItem?projItem['hpb_name']:"",
       });
   }

   hpbNotAssigned(){
       this.appCom.showAlert(ALL_MESSAGE.ERROR_MESSAGE.NO_HPB_ERR,"Ok",""); 
  }

   goToProductReceiptForm(projItem){
       let hpbid= projItem?projItem['server_hpb_id']:"";
       if( hpbid !=undefined && hpbid !="" ){
                this.navCtrl.push(ProductReceiptsFormPage,{
                "projId":projItem['project_id'],
                "projName":projItem['project_name'],
              });
       }else{
            this.appCom.showAlert(ALL_MESSAGE.ERROR_MESSAGE.NO_HPB_ERR,"Ok","");   
       }
       
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

  

  alreadyCheckInAlert(){
      this.appCom.showAlert(ALL_MESSAGE.ERROR_MESSAGE.ALREADY_CHECKED_IN,"Close","");
  }



 checkIn(projItem){

    console.log('projItem',projItem);

    if( this.check == false ){
        this.check = false;
        this.checkinRequireRule(projItem);
    } else {

    } 

}
  async checkinRequireRule(projItem) {
      let titleYes = await this.appCom.getTranslatedTxt("Yes");
      let titleNo = await this.appCom.getTranslatedTxt("No");
      let titleAsk = await this.appCom.getTranslatedTxt("Do you need to check in first ?");

      let alert = this.alertCtrl.create({
          cssClass: 'confirm',
          title: titleAsk,
          enableBackdropDismiss: false,
          buttons: [
              {
                text: titleYes,
                handler: () => {
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
                                        
                                        this.busy=  this.appCom.getGeoLocationCordinates("checkIn").then((geoCordinates)=>{
                                            console.log("geoCordinates------>",geoCordinates);   
                                                                                
                                            details['check_in_latitude'] = (geoCordinates['coords'])?geoCordinates['coords'].latitude:"";
                                            details['check_in_longitude'] = (geoCordinates['coords'])?geoCordinates['coords'].longitude:"";
                                            details['check_in_datetime'] = new Date().getTime();
                                            details['local_created_date'] = new Date().getTime();
                                            console.log("details =>",details);
            
                                            this.permissionCheckinpop(details,projItem);
                                        },(error)=>{
                                            console.log("error=>",error);
                                            this.check = false;
                                            details['check_in_latitude'] = '';
                                            details['check_in_longitude'] = '';
                                            details['check_in_datetime'] = new Date().getTime();
                                            details['local_created_date'] = new Date().getTime();
                                            console.log("details =>",details);
                                            //this.appCom.showAlert(ALL_MESSAGE.ERROR_MESSAGE.GENERIC_LOCATION_ERR,"Ok","");
                                            this.permissionCheckinpop(details,projItem);
                                        });        
                                    // }else{
                                    //     this.check = false;
                                    //     // //show pop up for set high accuracy..
                                    //     // this.appCom.showAlert(ALL_MESSAGE.ERROR_MESSAGE.GET_LOCATION_COORDS_ERR,"Ok","");
                                    //     details['check_in_latitude'] = '';
                                    //     details['check_in_longitude'] = '';
                                    //     details['check_in_datetime'] = new Date().getTime();
                                    //     details['local_created_date'] = new Date().getTime();
                                    //     console.log("details =>",details);
                                        
                                    //     this.permissionCheckinpop(details,projItem);
            
                                    // }
                                },(err)=>{
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
                }
              },
              {
                text: titleNo,
                handler: () => {
                    this.navCtrl.push(ProjectParentTabsPage,{
                        "projData":projItem,
                        "projId":projItem['project_id'],
                        "projName":projItem['project_name'],
                        "hpbId":projItem['user']?projItem['user']['hpb_id']:"",
                        "hpbName":projItem['user']?projItem['user']['hpb_name']:"",
                        "tab":"receipt",
                    });
                }
              }
          ]
      });
      alert.present();
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

                    this.navCtrl.push(ProjectParentTabsPage,{
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

    if( this.globalCheckInData['visitCheckFlag']  ==true ){
        let alert = this.alertCtrl.create({
            cssClass: 'confirm',
            title: title,
            enableBackdropDismiss:false,
            buttons: [
            {
                text: titleYes,
                handler: () => {
                    this.check = false;    
                    console.log('Buy clicked');

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
                        },(error) => {
                            this.check = false;
                            console.log('Error', error);
                            //this.appCom.showToast(ALL_MESSAGE.ERROR_MESSAGE.HPB_ADD_ERR,"middle");
                            //this.appCom.showAlert("",ALL_MESSAGE.ERROR_MESSAGE.HPB_ADD_ERR,"Ok","");
                        });
                    });
                }
            },
            {
                text: titleNo,
                handler: () => {
                this.check = false;     
                console.log('Cancel clicked');
                }
            },
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
                        var c = "";
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
                                                console.log("data  checkout------>",data);
                                                                        
                                                //EMPTY GLOBAL DATA AFTER CHECK OUT
                                                this.check = false;
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
                },
                {
                    text: titleNo,
                    handler: () => {
                    console.log('Cancel clicked');
                        this.check = false;
                    }
                }]
        });
        alert.present();
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
                            this.busy=  this.appCom.getGeoLocationCordinates("checkOut").then((geoCordinates)=>{
                                console.log("geoCordinates------>",geoCordinates);   
                                this.permissionCheckoutpop(geoCordinates);
                            },(error)=>{
                                this.check = false;
                                console.log(error);
                                //this.appCom.showAlert(ALL_MESSAGE.ERROR_MESSAGE.GENERIC_LOCATION_ERR,"Ok","");
                                this.permissionCheckoutpop('');
                            });
                        // }else{
                        //     this.check = false;
                        //     //show pop up for set high accuracy..
                        //     //this.appCom.showAlert(ALL_MESSAGE.ERROR_MESSAGE.GET_LOCATION_COORDS_ERR,"Ok","");
                        //     this.permissionCheckoutpop('');
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
