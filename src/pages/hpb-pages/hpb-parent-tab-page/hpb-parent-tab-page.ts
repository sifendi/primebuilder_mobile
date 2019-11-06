import { Component, ViewChild } from '@angular/core';
import { AlertController, Events, IonicPage, NavController, NavParams, Platform } from 'ionic-angular';
import { SuperTabsController } from 'ionic2-super-tabs';
import { HpbProjectListPage } from "../hpb-project-list/hpb-project-list";
import { HpbDetailsPage } from "../hpb-detail/hpb-detail";
import { HpbProductRequestsPage } from "../hpb-product-request/hpb-product-request";
import { HpbProductReceiptsPage } from "../hpb-product-receipts/hpb-product-receipts";
import { AddProjectPage } from "../../project/add-project/add-project";
import { addHpbFormPage } from "../hpb-add-form/hpb-add-form";
import { appCommonMethods } from "../../../providers/appCommonMethods";
import { ALL_MESSAGE } from "../../../providers/constant";
import { SqlServices } from "../../../providers/sqlService";
import { ProjectParentTabsPage } from "../../project/project-parent-tab-page/project-parent-tab-page";

declare let window: any;
declare var cordova:any
declare var sessionUserGlobalData;
declare var globalInternetCheckConnection;

@Component({
  selector: 'hpb-parent-tab-page',
  templateUrl: 'hpb-parent-tab-page.html',
})
export class HpbParentTabsPage {

  page1: any = HpbDetailsPage;
  page2: any = HpbProjectListPage;
  page3: any = HpbProductReceiptsPage;
  page4: any = HpbProductRequestsPage;
  paramsData:any;
  selectedIndex:any ;
  projectName:any="";
  hpbData:any;
  hpbName:any;
  projData:any=[];
  editFlag:any=true;
  globalCheckInData:any=[];
  busy: any;
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
    this.projectName = (this.navParams.data)?this.navParams.data['projName']:"-";
    console.log("paramsData----hpb parent334-->",this.paramsData);

    var tab= this.paramsData.tab ;
    console.log("tab is------>",tab);
    if( tab == "detail" ){
       this.selectedIndex=0;
       this.superTabsCtrl.slideTo(0);
       
       if(sessionUserGlobalData['userId']==this.hpbData['created_by']){
         this.editFlag = true;
       }else{
         this.editFlag = false;
       }
      
       this.appCom.getLocalStorageItem("globalCheckinData").then((checkinObj)=>{
       this.globalCheckInData = checkinObj;   
    });
    }else if( tab == "projects" ){
       this.selectedIndex=1;
       this.superTabsCtrl.slideTo(1);
       this.editFlag = false;
       this.appCom.getLocalStorageItem("globalCheckinData").then((checkinObj)=>{
        this.globalCheckInData = checkinObj; 
        });
    
    }

        this.page1 = HpbDetailsPage;
        this.page2 = HpbProjectListPage; 
        this.page3 = HpbProductReceiptsPage; 
        this.page4 = HpbProductRequestsPage;  
  }

  ionViewDidLoad() {
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
        this.appCom.getLocalStorageItem("globalCheckinData").then((checkinObj)=>{
        this.globalCheckInData = checkinObj;
         console.log("tglobalCheckinDatas------>",this.globalCheckInData);
        });
        this.events.publish("refreshHpbDetailPage");

    // var tab= this.paramsData.tab ;
    // if( tab == "detail" ){
    //    this.selectedIndex=0;
    //      this.superTabsCtrl.slideTo(1);
    //    this.editFlag = true;
    //    this.appCom.getLocalStorageItem("globalCheckinData").then((checkinObj)=>{
    //    this.globalCheckInData = checkinObj;   
    // });
    // }else if( tab == "projects" ){
    //    this.selectedIndex=1;
    //      this.superTabsCtrl.slideTo(1);
    //    this.editFlag = false;
    //    this.appCom.getLocalStorageItem("globalCheckinData").then((checkinObj)=>{
    //    this.globalCheckInData = checkinObj; 
    //    });
    // }


    //this.events.publish("refreshHpbProjectListPage");
       
   

  }

  onTabChange(){
      console.log("tab change");
  }


  goToProjectFilter(){
    
  }

   alreadyCheckInAlert(){
      this.appCom.showAlert(ALL_MESSAGE.ERROR_MESSAGE.ALREADY_CHECKED_IN,"Close","");
  }

  goToProjectForm(){
    this.busy=this.appCom.projectAddCheckPrvSRKUApp().then((resResult:any)=>{
        if(resResult){
              this.navCtrl.push(AddProjectPage);
        }else{
            this.appCom.showAlert(ALL_MESSAGE.ERROR_MESSAGE.NEW_PRE_PROJECT_SRKU_ERR,"Ok",null);
        }
    });
  }

   onTabSelect($event){
    this.selectedIndex =  $event.index; 
         if( $event.index == 0 ){
            if(sessionUserGlobalData['userId']==this.hpbData['created_by']){
              this.editFlag = true;
            }else{
              this.editFlag = false;
            }
         }else{
             this.editFlag = false;
         }
   }

    editProject(){
    this.navCtrl.push(addHpbFormPage,{
      "hpbData":this.hpbData,
      "action":"edit"
    });
  }


 async checkIn(){
    let titleYes = await this.appCom.getTranslatedTxt("Yes");
    let titleNo = await this.appCom.getTranslatedTxt("No");
    let title = await this.appCom.getTranslatedTxt("Are you sure you want to check in ?");
    console.log("this.projData",this.projData);
    //get the geo co-ordinates
        this.appCom.isGpsLocationEnabledC((successCallback)=>{			
        if(successCallback)	{
                this.busy = this.appCom.getLocationModeC((res) => {
                    console.log("res",res);
                        if(res == 'high_accuracy'){                                        
                                this.appCom.getGeoLocationCordinates().then((geoCordinates)=>{
                                        console.log("geoCordinates------>",geoCordinates);   
                                        let type = "project";
                                        let id =    this.projData['project_id'];                                      
                                        let  details= {
                                                        //check_in_out_user_id:null,
                                                        check_in_out_type: type,
                                                        check_in_out_type_id:id,
                                                        assigned_to:this.userId,
                                                        generated_by:this.userId,
                                                        check_in_out_user_id:this.userId,
                                                        check_in_latitude:(geoCordinates['coords'])?geoCordinates['coords'].latitude:"",
                                                        check_in_longitude:(geoCordinates['coords'])?geoCordinates['coords'].longitude:"",
                                                        check_in_datetime:new Date().getTime(),
                                                        local_created_date:new Date().getTime()
                                                        //check_out_latitude:null,
                                                        //check_out_longitude:null,
                                                        //check_out_datetime:null,
                                                        //generated_by:null,
                                                        
                                                        }    
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

                                                                            this.appCom.updateMasonContractorStats('mason');
                                                                            this.appCom.updateMasonContractorStats('contractor');

                                                                            this.events.publish('globalSync');        
                                                                                    this.navCtrl.push(ProjectParentTabsPage,{
                                                                                        "projData":this.projData,
                                                                                        "hpbData":this.hpbData,
                                                                                        "hpbId":this.hpbData['hpb_id'],
                                                                                        "tab":"receipt",

                                                                                    });
                                                                                
                                                                                    this.globalCheckInData = {
                                                                                        checkinFlag:true,
                                                                                        checkinType:"project",
                                                                                        insertId:data['insertId'],
                                                                                        checkinDetails:details
                                                                                    }   
                                                                                    this.appCom.setLocalStorageItem("globalCheckinData",this.globalCheckInData).then(()=>{
                                                                                    //this.setElement();
                                                                                    });
                                                                                    console.log("this.globalCheckInData",this.globalCheckInData);
                                                                                    
                                                                            }, (error) => {
                                                                                    console.log('Error', error);
                                                                            });    


                                                                    }
                                                                },
                                                                {
                                                                    text: titleNo,
                                                                    handler: () => {
                                                                    console.log('Cancel clicked');
                                                                    //do not checkin    


                                                                    }
                                                                }
                                                                ]
                                                            });
                                                            alert.present();


                                },(error)=>{
                                    console.log(error);
                                    this.appCom.showAlert(ALL_MESSAGE.ERROR_MESSAGE.GENERIC_LOCATION_ERR,"Ok","");                                       
                                });        
                        }else{
                        //show pop up for set high accuracy..
                        this.appCom.showAlert(ALL_MESSAGE.ERROR_MESSAGE.GET_LOCATION_COORDS_ERR,"Ok","");                                
                        }
                },(err)=>{
                    console.log(err);
                });
        }else{
            //show alert enable gps
            this.appCom.showAlert(ALL_MESSAGE.ERROR_MESSAGE.GET_LOCATION_COORDS_ERR,"Ok","");  
            
        }	

    },(err)=>{
        console.log(err);
        this.appCom.showAlert(ALL_MESSAGE.ERROR_MESSAGE.GENERIC_LOCATION_ERR,"Ok",""); 
        
    });



  }



  async checkOut(rds){

    let titleYes = await this.appCom.getTranslatedTxt("Yes");
    let titleNo = await this.appCom.getTranslatedTxt("No");
    let title = await this.appCom.getTranslatedTxt("Are you sure you want to Check Out ?");
            //get the geo co-ordinates
            this.appCom.isGpsLocationEnabledC((successCallback)=>{			
            if(successCallback)	{
                        this.appCom.getLocationModeC((res) => {
                        console.log("res",res);
                            if(res == 'high_accuracy'){                            
                                this.busy=    this.appCom.getGeoLocationCordinates().then((geoCordinates)=>{
                                            console.log("geoCordinates------>",geoCordinates);         
                                        this.appCom.getLocalStorageItem("globalCheckinData").then((checkinObj)=>{
                                        this.globalCheckInData = checkinObj;

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
                                                                                    this.events.publish('globalSync');    
                                                                                            console.log("data  checkout------>",data);
                                                                                            
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
                                                                                            //this.setElement();
                                                                                            });
                                                                                            
                                                                            }, (error) => {
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
                                                        console.log('Cancel clicked');
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
                                                                            //generated_by:null
                                                                        }
                                                                        
                                                                            this.appCom.getLocalStorageItem("globalCheckinData").then((checkinObj)=>{
                                                                                this.globalCheckInData = checkinObj;
                                                                                console.log("this.globalCheckInData",this.globalCheckInData);                                                                                                                                                                                                                                                                                                                                            
                                                                                let whereCond =" `check_in_out_id` = "+this.globalCheckInData['insertId']; 
                                                                                    console.log("whwere cond",whereCond);
                                                                                    this.sqlS.updateData(details,"check_in_out",whereCond).then((data) => {
                                                                                    this.events.publish('globalSync');    
                                                                                            console.log("data  checkout------>",data);
                                                                                            
                                                                                            //EMPTY GLOBAL DATA AFTER CHECK OUT
                                                                                        
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
                                                                                            //this.setElement();
                                                                                            });
                                                                                            
                                                                            }, (error) => {
                                                                                    console.log('Error', error);
                                                                                    //this.appCom.showToast(ALL_MESSAGE.ERROR_MESSAGE.HPB_ADD_ERR,"middle");
                                                                                    //this.appCom.showAlert("",ALL_MESSAGE.ERROR_MESSAGE.HPB_ADD_ERR,"Ok","");
                                                                            });

                                                                        });
                                                                                                
                                                                                                
                                                                    }else{
                                                                        this.appCom.showToast(ALL_MESSAGE.ERROR_MESSAGE.PRODUCT_RECEIPT_NOT_FILLED,"middle");
                                                                        return false;   
                                                                    }
                                                                }
                                                            },
                                                            {
                                                                text: titleNo,
                                                                handler: () => {
                                                                console.log('Cancel clicked');
                                                                }
                                                            },
                                                            ]
                                                        });
                                                        alert.present();


                                            }

                                });
                                                                                                                                                                                             
                                    },(error)=>{
                                        console.log(error);
                                        this.appCom.showAlert(ALL_MESSAGE.ERROR_MESSAGE.GENERIC_LOCATION_ERR,"Ok","");
                                    
                                    });
                            
                            }else{
                            //show pop up for set high accuracy..
                            this.appCom.showAlert(ALL_MESSAGE.ERROR_MESSAGE.GET_LOCATION_COORDS_ERR,"Ok","");
                            
                            }
                    },(err)=>{
                        console.log(err);
                    });
            }else{
                //show alert enable gps
                this.appCom.showAlert(ALL_MESSAGE.ERROR_MESSAGE.GET_LOCATION_COORDS_ERR,"Ok","");  
                
            }	

        },(err)=>{
            console.log(err);
            this.appCom.showAlert(ALL_MESSAGE.ERROR_MESSAGE.GENERIC_LOCATION_ERR,"Ok",""); 
            
        });


  }



























}
