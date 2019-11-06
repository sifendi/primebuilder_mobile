import { Component } from '@angular/core';
import { IonicPage, NavController,Platform, NavParams, AlertController } from 'ionic-angular';
import { SyncServices } from '../../providers/syncServices';
import { LoginPage } from '../../pages/login/login/login';
import { appCommonMethods } from '../../providers/appCommonMethods';
import { SqlServices } from '../../providers/sqlService';
import { ShareService } from '../../providers/ShareService';
import { AppPreferences } from '@ionic-native/app-preferences';
import { ALL_MESSAGE, SQL_QUERY } from '../../providers/constant';
import { User_metaApi, App_loginApi,LoopBackAuth  }  from '../../shared/loopback_sdk';
import * as moment from 'moment';
import async from 'async'; 
declare var globalSyncInProgressFlag;
declare var sessionUserGlobalData;
declare var cordova;
declare var globalInternetCheckConnection;
@Component({
  selector: 'page-sync',
  templateUrl: 'sync.html',
})
export class SyncPage {
  busy:any;
  busyMessage:any="Please Wait...";
  hpbSyncBtn:boolean=false;
  hpbSyncUpdatedDate:any="";
  projectsSyncBtn:boolean=false;
  projectsSyncUpdatedDate:any="";
  receiptsSyncBtn:boolean=false;
  receiptsSyncUpdatedDate:any="";
  productRequestSyncBtn:boolean=false;
  productRequestSyncUpdatedDate:any="";
  rdsViSyncBtn:boolean=false;
  rdsViSyncUpdatedDate:any=""; 
  retDisCuStockSyncBtn:boolean=false;
  retDisCuStockSyncUpdatedDate:any=""; 
  checkInOutSyncBtn:boolean=false;
  checkInOutSyncUpdatedDate:any="";
  allMasterSyncBtn:boolean=false;
  allMasterSyncUpdatedDate:any=""; 
  targetsSyncBtn:boolean=false;
  targetsSyncUpdatedDate:any=""; 
  homeStatsSyncBtn:boolean=false;
  homeStatsSyncUpdatedDate:any="";

  eapLeadsyncBtn:boolean=false;
  eapLeadsSyncUpdatedDate:any="";

  backupBtn:boolean=false;
  backupUpdatedDate:any="";

  resetBtn:boolean=false;
  resetUpdatedDate:any="";

   rdetails= {
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
    insertId:null,

 };
 rGlobalCheckInData={
    checkinFlag:false,
    checkinType:"",
    visitCheckFlag:false,
    checkinDetails: this.rdetails
 };

  role:any;
  currentUserSessionData:any={};
  constructor(private appCom:appCommonMethods,public platform: Platform,private sqlS:SqlServices,private appPrf:AppPreferences, private loopBackAuth:LoopBackAuth,private userLoginApi:App_loginApi,private shareS:ShareService,private alertCtrl:AlertController,private umApi:User_metaApi,private syncS:SyncServices, public navCtrl: NavController, public navParams: NavParams) {
    
  }
  ionViewDidEnter() {
    this.currentUserSessionData=sessionUserGlobalData;
    this.role = sessionUserGlobalData['user']['roles'][0]['name'];
    
    console.log('ionViewDidEnter SyncPage');
   
    this.appCom.getAppPreference('hpbSyncUpdatedDate').then((val)=>{
        this.hpbSyncUpdatedDate=val;
    });
    this.appCom.getAppPreference('projectsSyncUpdatedDate').then((val)=>{
        this.projectsSyncUpdatedDate=val;
    });
    this.appCom.getAppPreference('rdsViSyncUpdatedDate').then((val)=>{
        this.rdsViSyncUpdatedDate=val;
    });
    this.appCom.getAppPreference('targetsSyncUpdatedDate').then((val)=>{
        this.targetsSyncUpdatedDate=val;
    });
    this.appCom.getAppPreference('allMasterSyncUpdatedDate').then((val)=>{
        this.allMasterSyncUpdatedDate=val;
    });
    this.appCom.getAppPreference('homeStatsSyncUpdatedDate').then((val)=>{
        this.homeStatsSyncUpdatedDate=val;
    });

    this.appCom.getAppPreference('eapLeadsSyncUpdatedDate').then((val)=>{
        this.eapLeadsSyncUpdatedDate=val;
    });

    this.appCom.getAppPreference('backupUpdatedDate').then((val)=>{
        this.backupUpdatedDate=val;
    });
    this.appCom.getAppPreference('resetUpdatedDate').then((val)=>{
        this.resetUpdatedDate=val;
    });
   
}


ionViewDidLoad() {
    console.log('ionViewDidLoad SyncPage');
    
}
  
hpbSync(){
    
    if(globalInternetCheckConnection==false){
        this.appCom.showToast(ALL_MESSAGE.COMMON_MESSAGE.SYNC_NO_FAILED_INTERNET,'center');
        return false;
    }
    
     if(this.hpbSyncBtn){
        this.appCom.showToast('Sync already running.','center');
        return false;
      }

      console.log('Hpb Sync');
      this.hpbSyncBtn = true;

       this.syncS.syncHpbD().then(()=>{
            this.syncS.syncHpbApproval().then(()=>{
                console.log('hpb sync ok');
                this.hpbSyncBtn=false;
                let currDate = moment().format("DD-MM-YYYY, h:mm:ss a").toString(); 
                this.hpbSyncUpdatedDate=currDate;
                this.appCom.storeAppPreference('hpbSyncUpdatedDate',this.hpbSyncUpdatedDate);            
            },()=>{
                console.log('hpb sync fail');
                this.hpbSyncBtn=false;
            });
        },(error)=>{
            console.log('hpb sync fail');
            this.hpbSyncBtn=false;
        });
 
  }

  projectsSync(){

        if(globalInternetCheckConnection==false){
            this.appCom.showToast(ALL_MESSAGE.COMMON_MESSAGE.SYNC_NO_FAILED_INTERNET,'center');
            return false;
        }

        if(this.projectsSyncBtn){
            this.appCom.showToast('Sync already running.','center');
            return false;
        }
       console.log('projectsSync');
       this.projectsSyncBtn = true;
       this.syncS.syncProjectAndReceipts().then(()=>{
            console.log('hpb sync ok');
            this.projectsSyncBtn=false;
            let currDate = moment().format("DD-MM-YYYY, h:mm:ss a").toString(); 
            this.projectsSyncUpdatedDate=currDate;
            this.appCom.storeAppPreference('projectsSyncUpdatedDate',this.projectsSyncUpdatedDate);
            this.appCom.storeAppPreference('projectsSyncUpdatedDateTimeStamp',moment().valueOf());
        },(error)=>{
            console.log('projectsSync sync fail');
            this.projectsSyncBtn=false;
        });
  }





rdsViSync(){

    if(globalInternetCheckConnection==false){
        this.appCom.showToast(ALL_MESSAGE.COMMON_MESSAGE.SYNC_NO_FAILED_INTERNET,'center');
        return false;
    }

     if(this.rdsViSyncBtn){
            this.appCom.showToast('Sync already running.','center');
            return false;
      }
    console.log('rdsViSync');
    this.rdsViSyncBtn = true;
      this.syncS.syncRDSVisitAndStock().then(()=>{
              console.log('rdsViSync sync ok');
              this.rdsViSyncBtn=false;
              let currDate = moment().format("DD-MM-YYYY, h:mm:ss a").toString(); 
              this.rdsViSyncUpdatedDate=currDate;
              this.appCom.storeAppPreference('rdsViSyncUpdatedDate',this.rdsViSyncUpdatedDate);
        },(error)=>{
              console.log('rdsViSync sync fail');
              this.rdsViSyncBtn=false;
      });
}

eapLeadsSync(){
    if(globalInternetCheckConnection==false){
        this.appCom.showToast(ALL_MESSAGE.COMMON_MESSAGE.SYNC_NO_FAILED_INTERNET,'center');
        return false;
    }

     if(this.eapLeadsyncBtn){
            this.appCom.showToast('Sync already running.','center');
            return false;
      }
    console.log('eapLeadsyncBtn');
    this.eapLeadsyncBtn = true;
      this.syncS.syncEAPLeadsDandChatSup().then(()=>{
              console.log('eapLeadsyncBtn sync ok');
              this.eapLeadsyncBtn=false;
              let currDate = moment().format("DD-MM-YYYY, h:mm:ss a").toString(); 
              this.eapLeadsSyncUpdatedDate=currDate;
              this.appCom.storeAppPreference('eapLeadsSyncUpdatedDate',this.eapLeadsSyncUpdatedDate);
        },(error)=>{
              console.log('eapLeadsyncBtn sync fail');
              this.eapLeadsyncBtn=false;
      });   
}


targetsSync(){

    if(globalInternetCheckConnection==false){
        this.appCom.showToast(ALL_MESSAGE.COMMON_MESSAGE.SYNC_NO_FAILED_INTERNET,'center');
        return false;
    }

    if(this.targetsSyncBtn){
        this.appCom.showToast('Sync already running.','center');
        return false;
    }

    console.log('allMasterSync');
    this.targetsSyncBtn = true;

    this.syncS.syncTargetsMaster().then(()=>{
        this.appCom.updateMasonContractorStats('mason');
        this.appCom.updateMasonContractorStats('contractor');
        this.appCom.updateRetailerDistStats('retailer');
        this.appCom.updateRetailerDistStats('distributor');
        this.appCom.updateMyPlanStats('mason');
        this.appCom.updateMyPlanStats('contractor');
        
      this.targetsSyncBtn=false;
      let currDate = moment().format("DD-MM-YYYY, h:mm:ss a").toString(); 
      this.targetsSyncUpdatedDate=currDate;
      this.appCom.storeAppPreference('targetsSyncUpdatedDate',this.targetsSyncUpdatedDate);
    },(error)=>{
      this.targetsSyncBtn=false;
    });
 
}
allMasterSync(){

    if(globalInternetCheckConnection==false){
        this.appCom.showToast(ALL_MESSAGE.COMMON_MESSAGE.SYNC_NO_FAILED_INTERNET,'center');
        return false;
    }

    if(this.allMasterSyncBtn){
        this.appCom.showToast('Sync already running.','center');
        return false;
    }

    console.log('allMasterSync');
    this.allMasterSyncBtn = true;

    this.syncS.syncAllMaster().then(()=>{
      this.allMasterSyncBtn=false;
      let currDate = moment().format("DD-MM-YYYY, h:mm:ss a").toString(); 
      this.allMasterSyncUpdatedDate=currDate;
      this.appCom.storeAppPreference('allMasterSyncUpdatedDate',this.allMasterSyncUpdatedDate);
    },(error)=>{
      this.allMasterSyncBtn=false;
    });  
}
homeStatsSync(){

    if(globalInternetCheckConnection==false){
        this.appCom.showToast(ALL_MESSAGE.COMMON_MESSAGE.SYNC_NO_FAILED_INTERNET,'center');
        return false;
    }

    if(this.homeStatsSyncBtn){
        this.appCom.showToast('Sync already running.','center');
        return false;
    }

    console.log('allMasterSync');
    this.homeStatsSyncBtn = true;

    this.syncS.syncHomeStats().then(()=>{
        this.appCom.updateMasonContractorStats('mason');
        this.appCom.updateMasonContractorStats('contractor');
        this.appCom.updateRetailerDistStats('retailer');
        this.appCom.updateRetailerDistStats('distributor');
        this.appCom.updateMyPlanStats('mason');
        this.appCom.updateMyPlanStats('contractor');

        this.homeStatsSyncBtn=false;
        let currDate = moment().format("DD-MM-YYYY, h:mm:ss a").toString(); 
        this.homeStatsSyncUpdatedDate=currDate;
        this.appCom.storeAppPreference('homeStatsSyncUpdatedDate',this.homeStatsSyncUpdatedDate);
    },(error)=>{
      this.homeStatsSyncBtn=false;
    });  
}

homeTlhStatsSync(){
 
    if(globalInternetCheckConnection==false){
        this.appCom.showToast(ALL_MESSAGE.COMMON_MESSAGE.SYNC_NO_FAILED_INTERNET,'center');
        return false;
    }

    if(this.homeStatsSyncBtn){
        this.appCom.showToast('Sync already running.','center');
        return false;
    }

    console.log('allMasterSync');
    this.homeStatsSyncBtn = true;
    
    let currDate = moment().format("DD-MM-YYYY, h:mm:ss a").toString(); 
    this.homeStatsSyncUpdatedDate=currDate;
    this.appCom.storeAppPreference('homeStatsSyncUpdatedDate',this.homeStatsSyncUpdatedDate);

    this.syncS.syncUserData().then(()=>{
        this.syncS.syncHomeStatsAcTlh('sph').then(()=>{
            this.homeStatsSyncBtn=false;
        },(error)=>{
            this.homeStatsSyncBtn=false;
        });
    },(error)=>{
        this.homeStatsSyncBtn=false;
    });  
}

homeAcStatsSync(){

    if(globalInternetCheckConnection==false){
        this.appCom.showToast(ALL_MESSAGE.COMMON_MESSAGE.SYNC_NO_FAILED_INTERNET,'center');
        return false;
    }

    if(this.homeStatsSyncBtn){
        this.appCom.showToast('Sync already running.','center');
        return false;
    }

    console.log('allMasterSync');
    this.homeStatsSyncBtn = true;

    this.syncS.syncHomeStatsAcTlh('sph').then(()=>{
        //this.syncS.syncHomeStatsAcTlh('tlh').then(()=>{
            this.homeStatsSyncBtn=false;
            let currDate = moment().format("DD-MM-YYYY, h:mm:ss a").toString(); 
            this.homeStatsSyncUpdatedDate=currDate;
            this.appCom.storeAppPreference('homeStatsSyncUpdatedDate',this.homeStatsSyncUpdatedDate);
       
            /*},(error)=>{
            this.homeStatsSyncBtn=false;
        });*/  
    },(error)=>{
      this.homeStatsSyncBtn=false;
    });  
}

homeAmStatsSync(){

    if(globalInternetCheckConnection==false){
        this.appCom.showToast(ALL_MESSAGE.COMMON_MESSAGE.SYNC_NO_FAILED_INTERNET,'center');
        return false;
    }

    if(this.homeStatsSyncBtn){
        this.appCom.showToast('Sync already running.','center');
        return false;
    }

    console.log('allMasterSync');
    this.homeStatsSyncBtn = true;


    this.syncS.syncUserData().then(() => {
        this.syncS.syncHomeStatsAcTlh("sph").then(() => {
                console.log(" masterSync syncHomeStatsSph called ");
                this.homeStatsSyncBtn=false;
                let currDate = moment().format("DD-MM-YYYY, h:mm:ss a").toString(); 
                this.homeStatsSyncUpdatedDate=currDate;
                this.appCom.storeAppPreference('homeStatsSyncUpdatedDate',this.homeStatsSyncUpdatedDate);
            },
            err => {
                this.homeStatsSyncBtn=false;
                console.log(" error occured masterSync user data called ", err);
            }
        );
    },
        err => {
            this.homeStatsSyncBtn=false;
            console.log(" error occured syncUserData user data called ", err);
        }
    );
}

backuCF(){

        if(globalInternetCheckConnection==false){
            this.appCom.showToast(ALL_MESSAGE.COMMON_MESSAGE.SYNC_NO_FAILED_INTERNET,'center');
            return false;
        }

       if(this.backupBtn){
            this.appCom.showToast('Sync already running.','center');
            return false;
        }
        this.backupBtn=true;

        this.busy=this.currUserDbBackup().then(()=>{
       //   alert('backuCF');
          this.backupBtn=false;
          let currDate = moment().format("DD-MM-YYYY, h:mm:ss a").toString(); 
          this.backupUpdatedDate=currDate;
          this.appCom.storeAppPreference('backupUpdatedDate',this.backupUpdatedDate);
          this.appCom.showToast('Backup Success.','center');
        },()=>{
          this.backupBtn=false;
          this.appCom.showToast('Backup Failed.','center');
        });
  
}

resetCF(){

        if(globalInternetCheckConnection==false){
            this.appCom.showToast(ALL_MESSAGE.COMMON_MESSAGE.SYNC_NO_FAILED_INTERNET,'center');
            return false;
        }

        if(this.resetBtn){
            this.appCom.showToast('Sync already running.','center');
            return false;
        }
        this.resetBtn=true;
        this.currUserResetApp().then((resFlag:any)=>{
          this.resetBtn=false;
          if(resFlag){
            let currDate = moment().format("DD-MM-YYYY, h:mm:ss a").toString(); 
            this.resetUpdatedDate=currDate;
            this.appCom.storeAppPreference('resetUpdatedDate',this.resetUpdatedDate);         
            
               let userName = sessionUserGlobalData['user']['username'];
               let dataObjP = {username:userName};
               this.busy=this.userLoginApi.getUserDetails(dataObjP).subscribe((resUData:any)=>{
                    let appStatus = sessionUserGlobalData['appStatus'];
                    let appStatusComment = sessionUserGlobalData['appStatusComment'];
                    let pin = sessionUserGlobalData['pin'];
                    let currSessionData = resUData;
                    currSessionData['appStatus']=appStatus;
                    currSessionData['appStatusComment']=appStatusComment;
                    currSessionData['pin']=pin;

                    this.busy=this.appCacheClear().then((succeStatus:any)=>{
                        console.log('succeStatus',succeStatus);
                        this.appCom.storeAppPreference("userCreds",currSessionData).then((success)=>{
                            this.loopBackAuth.setToken(currSessionData);
                            this.loopBackAuth.setUser(currSessionData);
                            this.appCom.setLocalStorageItem("globalCheckinData",this.rGlobalCheckInData);
                            sessionUserGlobalData=currSessionData;
                            this.navCtrl.setRoot(LoginPage).then(()=>{
                                this.shareS.setshareData('masterSync',true);
                                this.appCom.showToast('Reset Success.','center');
                            });
                        });
                    },(error)=>{
                        console.log('error',error);
                        this.navCtrl.setRoot(LoginPage).then(()=>{
                            this.shareS.setshareData('masterSync',true);
                            this.appCom.showToast('Reset Success.','center');
                         });
                    });
               },()=>{
                    this.navCtrl.setRoot(LoginPage).then(()=>{
                       this.shareS.setshareData('masterSync',true);
                       this.appCom.showToast('Reset Success.','center');
                    });
               });

          }
  
        },()=>{
          this.resetBtn=false;
          this.appCom.showToast('Reset Failed.','center');
        });
}

appCacheClear(){
    return new Promise((resolve,reject)=>{
      
        let allCompleteTask = ()=>{
            resolve(true);
        }
        let asyncTask=[];

        asyncTask.push((callback)=>{

            (<any>window).CacheClear((status)=>{
                window.localStorage.clear();
                setTimeout(()=>{

                    this.sqlS.createInitialTables().then(
                        (resD)=>{
                                console.log("create query success",resD);
                                this.sqlS.insertInitialTablesDatas().then((resData)=>{
                                console.log("insert query success",resData);
                                this.appCom.setLocalStorageItem("appDbInit",true);
                                callback();
                              },(err)=>{
                                 console.log("insert query error",err);
                                 callback();
                            });
                        },(error)=>{
                            console.log("create query error ",error);
                            callback();
                      },()=>{
                        callback();
                      });

                },100)
                

            },(error)=>{
                window.localStorage.clear();
                callback();
            });

        });
        

        asyncTask.push((callback)=>{

            this.appPrf.clearAll().then(()=>{
                callback();
            },()=>{
                callback();
            });

        });
        
        async.parallel(asyncTask,allCompleteTask);

    });
}

currUserDbBackup(){
    return new Promise((resolve,reject)=>{
            let temp ={};
            let dbfilename="hpb.db";
            let extType="db";
            //let path = cordova.file.applicationStorageDirectory+'Library/LocalDatabase/'+dbfilename;
            let path = "";
            if( this.platform.is('ios') ) {
            path = cordova.file.applicationStorageDirectory+'Library/LocalDatabase/'+dbfilename; 
            } else {
            path = cordova.file.applicationStorageDirectory+'databases/'+dbfilename;
            }
            console.log("path=>",path);
            let filename = "db_"+sessionUserGlobalData['userId']+"_"+this.appCom.generateRandomString()+"."+extType;
            console.log("filename=>",filename);
            temp['path']=path;
            temp['name']=filename;
            temp['fileType']=extType;
            temp['sync_status']=0;
            temp['serverPath']="";
            temp['container']="dbbackup";
            console.log("temp=>",temp);
            let tmpArr=[];
            tmpArr.push(temp);
            console.log("tmpArr=>",tmpArr);
            let allFileObjeArr={};
            allFileObjeArr['dbbackupF']=JSON.stringify(tmpArr);
            console.log("allFileObjeArr=>",allFileObjeArr);
            this.syncS.uploadLocalFileToServer(allFileObjeArr).then((allFileObjeArrR:any)=>{
                console.log('allFileObjeArrR',allFileObjeArrR);
                let dataObj={};
                dataObj['uid']=sessionUserGlobalData['userId'];
                dataObj['meta_key']='dbbakcup';
                dataObj['meta_value']=JSON.stringify(allFileObjeArrR['dbbackupF']);
                dataObj['created_date']=moment().valueOf();
                dataObj['updated_date']=moment().valueOf();
                dataObj['status']=1;
               this.umApi.create(dataObj).subscribe(()=>{
                    resolve(true);
               },(errorUM)=>{
                    console.log('errorUM',errorUM);
                    reject(false);
               });
            },(error)=>{
                console.log('error',error);
                    reject(false);
            });
    });
}

currUserResetApp(){
    return new Promise((resolve,reject)=>{
         this.busy=this.localDataCheckSync().then((respRes:any)=>{
            if(respRes['respStatus']){ 
                    let message=ALL_MESSAGE.COMMON_MESSAGE.RESET_CONFIRM;
                    if(respRes['dataloss']==true){
                       message=ALL_MESSAGE.COMMON_MESSAGE.RESET_CONFIRM_DL;
                    }
                    let alert = this.alertCtrl.create({
                        subTitle: message,
                        enableBackdropDismiss:false,
                        buttons: [
                        {
                            text: 'Continue',
                            handler: () => {
                            console.log('Continue clicked');
                               
                                 this.busy=this.currUserDbBackup().then(()=>{
                                     this.busy=this.resetAllTable().then(()=>{
                                        resolve(true);
                                    },()=>{
                                        reject(false);
                                    });
                                },()=>{
                                        reject(false);
                                });
                              
                            }
                        },
                        {
                            text: 'Cancel',
                            role: 'cancel',
                            handler: () => {
                            console.log('Cancel clicked');
                              resolve(false);
                            }
                        }


                        ]
                    });
                    alert.present();

            }else{
                 reject(false);
            }
        });

    });
}


localDataCheckSync(){
  return new Promise((resolve,reject)=>{

      let tableLists = SQL_QUERY.TABLE_TLH_SPH_MAIN_LIST;
      let respRet={};
      let tableWithStataArr=[];
      let dataloss = false;
      let respStatus=true;
      async.each(tableLists,(tableListName,callback)=>{
          let querySel="SELECT * FROM "+tableListName+" WHERE sync_status=0";
          this.syncS.queryExecuteSql(querySel,[]).then((reslData:any)=>{
             let resLen = reslData.rows.length;  
              if(resLen>0){
                tableWithStataArr.push({
                  tableName:tableListName,
                  tableRowsPendding:resLen
                });
                dataloss=true;
              }
              callback();
          },(err)=>{
               console.log('localDataCheckSync err',err);
              respStatus=false;
              callback();
          });
      },(error)=>{
        console.log('localDataCheckSync error',error);
        respRet['tableWithStataArr']=tableWithStataArr;
        respRet['dataloss']=dataloss;
        respRet['respStatus']=respStatus;
        resolve(respRet);
      });

  });
 }

 resetAllTable(){
    return new Promise((resolve,reject)=>{
        console.log('resetAllTable');
         let tblLists=SQL_QUERY.TABLE_RESET_LIST;
         async.each(tblLists,(tblList,callback)=>{
              let queryDel="DROP TABLE "+tblList;
              this.syncS.queryExecuteSql(queryDel,[]).then((reslData:any)=>{
                  callback();
              },(err)=>{
                  callback();
              });
          },(error)=>{
              resolve(true);
          });
    });
}

}
