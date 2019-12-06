import { Platform,ToastController,AlertController } from 'ionic-angular';
import { Injectable } from '@angular/core';
import { AppPreferences } from '@ionic-native/app-preferences';
import { ALL_KEYS, SQL_QUERY, SITE_API, ALL_MESSAGE } from './constant';
import * as moment from 'moment';
import { FileTransfer, FileUploadOptions, FileTransferObject } from '@ionic-native/file-transfer';
import { File } from '@ionic-native/file';
import { SqlServices } from '../providers/sqlService';
import 'rxjs/add/operator/toPromise';
import { App_notification_centerApi,Hpb_update_approvalApi,App_rdsApi,App_product_requestApi,User_mappingApi,Products_request_brand_capture_tblApi, App_productsApi,App_product_receipt_approvalApi,App_srku_approvalApi, App_projectsApi,App_check_in_outApi,App_product_receiptApi,App_rds_stockApi,App_rds_visitApi,Project_typeApi,Project_stageApi, NmcApi, Monthly_actual_targetApi, Monthly_forecast_targetApi, Monthly_visiting_scheduleApi, App_hpbApi,Eap_support_chatApi,Monthly_statsApi, Eap_leadApi   }  from '../shared/loopback_sdk';
import { TranslateService } from '@ngx-translate/core';
import CryptoJS from 'crypto-js';

import async from 'async';  
import 'rxjs/add/operator/map';

declare let window: any;
declare var cordova:any
declare var sessionUserGlobalData;
declare var globalInternetCheckConnection;

@Injectable()
export class SyncServices {	
    syncCustomerRunningFlag: any;
    
    storageSql:any;
    currUserData:any;
    rdsVisitUpdatedORInsertedIds:any=[];
    projectReciptsUpdatedORInsertedIds:any=[];
    syncAllUpDownLocalMasterRuningFlag:boolean=false;
    syncAllOtherDataRunningFlag:boolean=false;
    syncHpbApproveRejectFlag:boolean=false;
    syncAllHpbApproveRejectFlag:boolean=false;
    syncHpbDRunningFlag:boolean=false;
    syncHpbDERunningFlag:boolean=false;
    syncProjectAndReceiptsRunningFlag:boolean=false;
    syncProjectDRunningFlag:boolean=false;
    syncReceiptsDRunningFlag:boolean=false;
    syncReceiptsUpSync2RunningFlag:boolean=false;
    syncRequestDRunningFlag:boolean=false;
    syncRequestBrandDRunningFlag:boolean=false;
    syncRDSVisitAndStockRunningFlag:boolean=false;
    syncRDSVisitDRunningFlag:boolean=false;
    syncRetCurSkDRunningFlag:boolean=false;
    syncCheckInCheckOutDRunningFlag:boolean=false;
    syncAllMasterRunningFlag:boolean=false;
    syncRdsMRunningFlag:boolean=false;
    syncProductMRunningFlag:boolean=false;
    syncProjectStageMRunningFlag:boolean=false;
    syncProjectTypeMRunningFlag:boolean=false;
    syncProjectNmcMRunningFlag:boolean=false;
    syncTargetsMasterRunningFlag:boolean=false;
    syncEAPLeadsDRunningFlag: boolean;
    toastSflag:boolean=false;
    constructor(public appPreferences: AppPreferences,public sqlS: SqlServices,private userMapping:User_mappingApi,private monthlyStats:Monthly_statsApi,private prodReqBrandCap:Products_request_brand_capture_tblApi,private appProdReq:App_product_requestApi,private toastCtrl:ToastController,private  appProdRecApproval:App_product_receipt_approvalApi,private hpbUpdateApproval:Hpb_update_approvalApi,private appSrkuApproval:App_srku_approvalApi,private app_hpbApi:App_hpbApi,private app_check_in_outApi:App_check_in_outApi, private appProjApi:App_projectsApi,private app_rds_stockApi:App_rds_stockApi,private appRdsVisitApi:App_rds_visitApi,private appProdApi:App_product_receiptApi,private monthly_actual_targetApi:Monthly_actual_targetApi,private monthly_forecast_targetApi:Monthly_forecast_targetApi, private monthly_visiting_scheduleApi:Monthly_visiting_scheduleApi  , private nmcApi:NmcApi,private project_typeApi:Project_typeApi,private project_stageApi:Project_stageApi,private app_rdsApi:App_rdsApi,private appNotifyCenApi:App_notification_centerApi,private app_productsApi:App_productsApi,private elApi:Eap_leadApi,private escApi:Eap_support_chatApi,public platform:Platform,private transfer: FileTransfer, private file: File,private translateS:TranslateService) {
        console.log('SyncServices...');
        window["thisRef"] = this;
        platform.ready().then(()=>{
            this.storageSql = window.sqlitePlugin.openDatabase({name: 'hpb.db', key: ALL_KEYS.DB_KEY, location: 'default',createFromLocation: 1});     
        });
}

openSyncDb(){
    return new Promise((resolve, reject) => {
        this.storageSql = window.sqlitePlugin.openDatabase({name: "hpb.db",key: ALL_KEYS.DB_KEY, location: 'default',createFromLocation: 1});
        resolve(true);
    });
}

startSync(){
    this.openSyncDb();
    console.log('startSync');
}
   
endSync(){
    console.log('endSync');
}

async showSyncToast(title){
        
        let t =  await this.getTranslatedTxt(title)   
        if(!this.toastSflag){
            let toast = this.toastCtrl.create({
                message: t ,
                duration: 5000,
                position: 'bottom',
            });
            toast.onDidDismiss(() => {
              this.toastSflag=false;
            });
            this.toastSflag=true;
            toast.present();
        }
        
}

 async getTranslatedTxt(txt:any):Promise<any> {
    return new Promise<any>((resolve,reject)=>{
       
        this.translateS.get(txt.toUpperCase()).subscribe((val)=>{
             console.log('getTranslatedTxt ok',txt,val);   
            resolve(val);
        },(err)=>{
            console.log('getTranslatedTxt error',err,txt);
            resolve(txt);
        });
        
    });
  }

storeAppPreference(key,value){
    let obj = CryptoJS.AES.encrypt(JSON.stringify(value), ALL_KEYS.LOCAL_STORE_KEY).toString();
    return this.appPreferences.store(key, obj);
}

getAppPreference(key){
    return new Promise<any>((resolve,reject)=>{
        this.appPreferences.fetch(key).then(res => {
            let resData = null;
            console.log(" appprefrence ------- resJson ",res);
            if(res){
                let bytes  = CryptoJS.AES.decrypt(res,  ALL_KEYS.LOCAL_STORE_KEY);
                resData = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
            }
            console.log(" appprefrence res ",resData);
            resolve(resData);
        },(err)=>{
            reject(false);
        });
    });   
}

syncAllUpDownLocalMaster(){
        return new Promise((resolve,reject)=>{

            console.log("syncAllUpDownLocalMaster started========>");
            
              if(globalInternetCheckConnection==false){
                this.showSyncToast(ALL_MESSAGE.COMMON_MESSAGE.SYNC_NO_FAILED_INTERNET);
                reject(true);
                return false;
               }

               if(this.syncAllUpDownLocalMasterRuningFlag){
                    this.syncAllUpDownLocalMasterRuningFlag=true;
                    //this.showSyncToast(ALL_MESSAGE.COMMON_MESSAGE.SYNC_RUN_GLOABL_INTERNET);
                    reject(true);
                    return false;
               }

              this.syncAllOtherData().then((resData)=>{
                this.syncAllUpDownLocalMasterRuningFlag=false;  
                resolve(true);
              },(error)=>{
                this.syncAllUpDownLocalMasterRuningFlag=false;
                reject(true);
              });
        });
}

syncgetCurrentTimeStamp(){
    let newDateUnix = moment().valueOf();
    return newDateUnix;
}

syncAllOtherData(){
      
      return new Promise((resolve,reject)=>{
      console.log('syncAllMaster');
      console.log('sessionUserGlobalData',sessionUserGlobalData);
      console.log("syncAllOtherData");

      
       if(globalInternetCheckConnection==false){
                this.showSyncToast(ALL_MESSAGE.COMMON_MESSAGE.SYNC_NO_FAILED_INTERNET);
                reject(true);
                return false;
        }

       if(this.syncAllOtherDataRunningFlag){
                    this.syncAllOtherDataRunningFlag=true;
                    //this.showSyncToast(ALL_MESSAGE.COMMON_MESSAGE.SYNC_RUN_GLOABL_INTERNET);
                    reject(true);
                    return false;
       }

        let allTaskComplete = ()=>{
            this.syncCheckInCheckOutD().then(()=>{
                this.syncAllOtherDataRunningFlag=false;
                resolve(true);                
             },()=>{
                this.syncAllOtherDataRunningFlag=false;
                resolve(true);
                //callback();
             });
        }


      	var asyncTasks = [];


        asyncTasks.push((callback)=>{
                this.syncHpbD().then(()=>{
                        this.syncProjectAndReceipts().then(()=>{
                          callback();
                        },()=>{
                            callback();
                        });
                },()=>{
               
                        this.syncProjectAndReceipts().then(()=>{
                            callback();
                        },()=>{
                         callback();
                        });
               
                });
        });
        
        asyncTasks.push((callback)=>{
            this.syncHpbApproval().then(()=>{
                callback();
            },()=>{
                callback();
            });
        });

        // asyncTasks.push((callback)=>{
        //     this.syncAllHpbApproveRejectData().then(()=>{
        //         callback();
        //     },()=>{
        //         callback();
        //     });
        // });
       
        asyncTasks.push((callback)=>{
                this.syncRDSVisitAndStock().then(()=>{
                   callback();
                },()=>{
                  callback();
                });
        });
     
        asyncTasks.push((callback)=>{
            this.syncTargetsMaster().then(()=>{
                callback();
            },()=>{
                callback();
            });
        });                    
        
        asyncTasks.push((callback)=>{
            this.syncHomeStats().then(()=>{
                callback();
            },()=>{
                callback();
            });
        });   

        asyncTasks.push((callback)=>{
            this.syncEAPLeadsDandChatSup().then(()=>{
                callback();
            },()=>{
                callback();
            });
        }); 
        
        asyncTasks.push((callback)=>{
            this.syncNotificationCenterD().then(()=>{
                callback();
            },()=>{
                callback();
            });
        }); 

        async.parallelLimit(asyncTasks,1, function(){
            allTaskComplete();
        });

  
    });
}

hpbExistsCheckByNumber(username){
    return new Promise((resolve,reject)=>{
        this.app_hpbApi.getHpb(null,null,null,null,null,null,null,null,username).subscribe((resUserData) => {
            let responseResults = resUserData['result'];
            if(responseResults.length > 0){
                resolve(true);
            }else{
                resolve(false);
            }
        },(err)=>{
            reject(false);    
        })
    });
}

syncHpbD(){
    return new Promise((resolve,reject)=>{
        
        if(globalInternetCheckConnection==false){
                this.showSyncToast(ALL_MESSAGE.COMMON_MESSAGE.SYNC_NO_FAILED_INTERNET);
                reject(true);
                return false;
        }

       if(this.syncHpbDRunningFlag){
                //this.showSyncToast(ALL_MESSAGE.COMMON_MESSAGE.SYNC_RUN_GLOABL_INTERNET);
                reject(true);
                return false;
       }
       this.syncHpbDRunningFlag=true;
        let tableName='hpb_master';
        let filterS={};
        let query="SELECT * FROM "+tableName+" ORDER BY updated_date desc LIMIT 1";

        this.queryExecuteSql(query,[]).then((resDataQ:any)=>{
                let filterDataH={};
              
                //filterDataH['created_by']=sessionUserGlobalData['userId'];
                filterDataH['assigned_to']=sessionUserGlobalData['userId'];
                console.log('resDataQ',resDataQ); 
                 if(resDataQ.rows.length > 0){
                    let tmpDataObj=resDataQ.rows.item(0);
                    filterDataH['updated_date']=tmpDataObj['updated_date'];
                }

                // loop for limit offset and assigned_to



                this.app_hpbApi.getHpb(null,null,filterDataH['updated_date'],null,null,filterDataH['assigned_to']).subscribe((respDatas:any)=>{
                    
                    console.log('respDatas',respDatas);

                    let responseResults = respDatas['result'];

                    console.log('responseResults',responseResults);

                    // DownSync Start
                    
                    async.each(responseResults,(respData,callback:any)=>{
                        
                        console.log('DownSync each respData',respData);

                        let sQuery="SELECT * FROM "+tableName+" WHERE server_hpb_id="+respData['hpb_id']+"";
                        
                        this.queryExecuteSql(sQuery,[]).then((resQuData:any)=>{

                            console.log('queryExecuteSql resQuData',resQuData);

                            if(resQuData.rows.length > 0){
                                    
                                    let locaDataRow=resQuData.rows.item(0);

                                    console.log('locaDataRow',locaDataRow);

                                    let updateObj={};
                                    let syncStatus=1;
                                   
                                    let allFileObjeArr = {};

                                    if(locaDataRow['sync_status']==1){
                                            updateObj['hpb_name']=respData['hpb_name'];
                                            updateObj['hpb_type']=respData['hpb_type'];
                                            updateObj['hpb_profile_pic']=respData['hpb_profile_pic'];
                                            if(locaDataRow['hpb_profile_pic']!=respData['hpb_profile_pic']){
                                              allFileObjeArr['hpb_profile_pic']=respData['hpb_profile_pic'];
                                            }
                                            updateObj['primary_mobile_no']=respData['primary_mobile_no'];
                                            updateObj['secondary_mobile_no']=respData['secondary_mobile_no'];
                                            updateObj['hpb_email']=respData['hpb_email'];
                                            updateObj['place_of_birth']=respData['place_of_birth'];
                                            updateObj['date_of_birth']=respData['date_of_birth'];
                                            updateObj['id_photo']=respData['id_photo'];
                                            if(locaDataRow['id_photo']!=respData['id_photo']){
                                              allFileObjeArr['id_photo']=respData['id_photo'];
                                            }
                                            updateObj['id_card_address']=respData['id_card_address'];
                                            updateObj['id_card_province']=respData['id_card_province'];
                                            updateObj['id_card_number']=respData['id_card_number'];
                                            updateObj['id_card_city']=respData['id_card_city'];
                                            updateObj['id_card_sub_district']=respData['id_card_sub_district'];
                                            updateObj['id_card_pincode']=respData['id_card_pincode'];
                                            updateObj['domicile_same_as_id_card']=respData['domicile_same_as_id_card'];
                                            updateObj['domicile_address']=respData['domicile_address'];
                                            updateObj['domicile_province']=respData['domicile_province'];
                                            updateObj['domicile_city']=respData['domicile_city'];
                                            updateObj['domicile_sub_district']=respData['domicile_sub_district'];
                                            updateObj['domicile_pincode']=respData['domicile_pincode'];
                                            updateObj['company_name']=respData['company_name'];
                                            updateObj['company_representative_name']=respData['company_representative_name'];
                                            updateObj['company_designation']=respData['company_designation'];
                                            updateObj['hpb_status']=respData['hpb_status'];
                                            updateObj['hpb_digital_sign']=respData['hpb_digital_sign'];
                                            if(locaDataRow['hpb_digital_sign']!=respData['hpb_digital_sign']){
                                              allFileObjeArr['hpb_digital_sign']=respData['hpb_digital_sign'];
                                            }
                                            updateObj['additional_comments']=respData['additional_comments'];
                                            updateObj['latitude']=respData['latitude'];
                                            updateObj['longitude']=respData['longitude'];
                                            updateObj['created_date']=respData['created_date'];
                                            updateObj['updated_date']=respData['updated_date'];
                                            updateObj['created_by']=respData['created_by'];
                                            updateObj['updated_by']=respData['updated_by'];
                                            updateObj['local_updated_date']=respData['local_updated_date'];
                                            updateObj['local_created_date']=respData['local_created_date'];
                                            updateObj['assigned_to']=respData['assigned_to'];
                                            updateObj['generated_by']=respData['generated_by'];
                                            updateObj['status']=respData['status'];
                                    }


                                    updateObj['ext_data']="";
                                    let whereCon=" server_hpb_id="+respData['hpb_id']+" ";
                                 
                                    this.downloadServerFileToLocal(allFileObjeArr).then((allFileObjeArrRet)=>{
                                        if(locaDataRow['hpb_profile_pic']!=respData['hpb_profile_pic']){
                                            updateObj['hpb_profile_pic']=JSON.stringify(allFileObjeArrRet['hpb_profile_pic']);
                                        }
                                        if(locaDataRow['id_photo']!=respData['id_photo']){
                                            updateObj['id_photo']=JSON.stringify(allFileObjeArrRet['id_photo']);
                                        }
                                        if(locaDataRow['hpb_digital_sign']!=respData['hpb_digital_sign']){
                                            updateObj['hpb_digital_sign']=JSON.stringify(allFileObjeArrRet['hpb_digital_sign']);
                                        }
                                        this.updateData(updateObj,tableName,whereCon).then((resInsData)=>{
                                      
                                          callback();

                                        // File Save To Local IF Updated

                                        },(err)=>{

                                          callback();

                                        }); 

                                },(errDDDDD)=>{

                                     callback();

                                });
                                  
                                  


                            }else{


                                    let insertObj={};
                                    insertObj['server_hpb_id']=respData['hpb_id'];
                                    insertObj['hpb_name']=respData['hpb_name'];
                                    insertObj['hpb_type']=respData['hpb_type'];
                                    insertObj['hpb_profile_pic']=respData['hpb_profile_pic'];
                                    insertObj['primary_mobile_no']=respData['primary_mobile_no'];
                                    insertObj['secondary_mobile_no']=respData['secondary_mobile_no'];
                                    insertObj['hpb_email']=respData['hpb_email'];
                                    insertObj['place_of_birth']=respData['place_of_birth'];
                                    insertObj['date_of_birth']=respData['date_of_birth'];
                                    insertObj['id_photo']=respData['id_photo'];
                                    insertObj['id_card_address']=respData['id_card_address'];
                                    insertObj['id_card_province']=respData['id_card_province'];
                                    insertObj['id_card_number']=respData['id_card_number'];
                                    insertObj['id_card_city']=respData['id_card_city'];
                                    insertObj['id_card_sub_district']=respData['id_card_sub_district'];
                                    insertObj['id_card_pincode']=respData['id_card_pincode'];
                                    insertObj['domicile_same_as_id_card']=respData['domicile_same_as_id_card'];
                                    insertObj['domicile_address']=respData['domicile_address'];
                                    insertObj['domicile_province']=respData['domicile_province'];
                                    insertObj['domicile_city']=respData['domicile_city'];
                                    insertObj['domicile_sub_district']=respData['domicile_sub_district'];
                                    insertObj['domicile_pincode']=respData['domicile_pincode'];
                                    insertObj['company_name']=respData['company_name'];
                                    insertObj['company_representative_name']=respData['company_representative_name'];
                                    insertObj['company_designation']=respData['company_designation'];
                                    insertObj['hpb_status']=respData['hpb_status'];
                                    insertObj['hpb_digital_sign']=respData['hpb_digital_sign'];
                                    insertObj['additional_comments']=respData['additional_comments'];
                                    insertObj['latitude']=respData['latitude'];
                                    insertObj['longitude']=respData['longitude'];
                                    insertObj['created_date']=respData['created_date'];
                                    insertObj['updated_date']=respData['updated_date'];
                                    insertObj['created_by']=respData['created_by'];
                                    insertObj['updated_by']=respData['updated_by'];
                                    insertObj['local_updated_date']=respData['local_updated_date'];
                                    insertObj['local_created_date']=respData['local_created_date'];
                                    insertObj['assigned_to']=respData['assigned_to'];
                                    insertObj['generated_by']=respData['generated_by'];
                                    insertObj['status']=respData['status'];
                                    insertObj['sync_status']=1;
                                    insertObj['ext_data']="";

                                    let allFileObjeArr = {};
                                    allFileObjeArr['hpb_profile_pic']=respData['hpb_profile_pic'];
                                    allFileObjeArr['id_photo']=respData['id_photo'];
                                    allFileObjeArr['hpb_digital_sign']=respData['hpb_digital_sign'];

                                    this.downloadServerFileToLocal(allFileObjeArr).then((allFileObjeArrRet)=>{

                                        insertObj['hpb_profile_pic']=JSON.stringify(allFileObjeArrRet['hpb_profile_pic']);
                                        insertObj['id_photo']=JSON.stringify(allFileObjeArrRet['id_photo']);
                                        insertObj['hpb_digital_sign']=JSON.stringify(allFileObjeArrRet['hpb_digital_sign']);


                                        this.insertData(insertObj,tableName).then((resInsData)=>{
                                                callback();
                                            },(err)=>{
                                                callback();
                                          });

                                    },(errDDD)=>{

                                        callback();

                                    });
                            }
                        },(errChild)=>{
                                callback();
                        });

                    
                    },(err)=>{
                        

                        // UpSync Start
                        
                        let queryU="SELECT * FROM "+tableName+" WHERE sync_status=0";

                            this.queryExecuteSql(queryU,[]).then((resDataU:any)=>{
                                    console.log('resDataU',resDataU);

                                    let resDatasUss=[];
                                    for(let m=0;m<resDataU.rows.length;m++){
                                        resDatasUss.push(resDataU.rows.item(m));
                                    }
                                    
                                     async.each(resDatasUss,(resDatasUs,callbackUss)=>{

                                                let hpb_id=0;
                                                let insertUpdateObj={};
                                               
                                                


                                                insertUpdateObj['hpb_name']=resDatasUs['hpb_name'];
                                                insertUpdateObj['hpb_type']=resDatasUs['hpb_type'];
                                                insertUpdateObj['primary_mobile_no']=resDatasUs['primary_mobile_no'];
                                                insertUpdateObj['secondary_mobile_no']=resDatasUs['secondary_mobile_no'];
                                                insertUpdateObj['hpb_email']=resDatasUs['hpb_email'];
                                                insertUpdateObj['place_of_birth']=resDatasUs['place_of_birth'];
                                                insertUpdateObj['date_of_birth']=resDatasUs['date_of_birth'];
                                                insertUpdateObj['id_card_address']=resDatasUs['id_card_address'];
                                            
                                                insertUpdateObj['id_card_province']=resDatasUs['id_card_province'];
                                                insertUpdateObj['id_card_number']=resDatasUs['id_card_number'];
                                                insertUpdateObj['id_card_city']=resDatasUs['id_card_city'];
                                                insertUpdateObj['id_card_sub_district']=resDatasUs['id_card_sub_district'];
                                                insertUpdateObj['id_card_pincode']=resDatasUs['id_card_pincode'];
                                                insertUpdateObj['domicile_same_as_id_card']=resDatasUs['domicile_same_as_id_card'];
                                                insertUpdateObj['domicile_address']=resDatasUs['domicile_address'];
                                                insertUpdateObj['domicile_province']=resDatasUs['domicile_province'];
                                                insertUpdateObj['domicile_city']=resDatasUs['domicile_city'];
                                                insertUpdateObj['domicile_sub_district']=resDatasUs['domicile_sub_district'];
                                                insertUpdateObj['domicile_pincode']=resDatasUs['domicile_pincode'];
                                                insertUpdateObj['company_name']=resDatasUs['company_name'];
                                                insertUpdateObj['company_representative_name']=resDatasUs['company_representative_name'];
                                                insertUpdateObj['company_designation']=resDatasUs['company_designation'];
                                                insertUpdateObj['hpb_status']=resDatasUs['hpb_status'];
                                                insertUpdateObj['additional_comments']=resDatasUs['additional_comments'];
                                                insertUpdateObj['local_updated_date']=resDatasUs['local_updated_date'];
                                                insertUpdateObj['updated_by']=resDatasUs['updated_by'];
                                                insertUpdateObj['assigned_to']=resDatasUs['assigned_to'];
                                                
                                                insertUpdateObj['status']=resDatasUs['status'];
                                                
                                                 if(resDatasUs['server_hpb_id']>0){
                                                   hpb_id=resDatasUs['server_hpb_id'];
                                                }else{
                                                    insertUpdateObj['latitude']=resDatasUs['latitude'];
                                                    insertUpdateObj['longitude']=resDatasUs['longitude'];
                                                    insertUpdateObj['local_created_date']=resDatasUs['local_created_date'];
                                                    insertUpdateObj['created_by']=resDatasUs['created_by'];
                                                    insertUpdateObj['generated_by']=resDatasUs['generated_by'];
                                               }

                                                //insertUpdateObj['hpb_profile_pic']=resDatasUs['hpb_profile_pic'];
                                                //insertUpdateObj['id_photo']=resDatasUs['id_photo'];
                                                //insertUpdateObj['hpb_digital_sign']=resDatasUs['hpb_digital_sign'];

                                                let allFileObjeArr = {};
                                                if( this.platform.is('ios') ) {
                                                    allFileObjeArr['hpb_profile_pic']=(resDatasUs['hpb_profile_pic'] && resDatasUs['hpb_profile_pic']!="")?this.alterimgPath(resDatasUs['hpb_profile_pic']):"";
                                                    allFileObjeArr['id_photo']=(resDatasUs['id_photo'] && resDatasUs['id_photo']!="")?this.alterimgPath(resDatasUs['id_photo']):"";
                                                    allFileObjeArr['hpb_digital_sign']=(resDatasUs['hpb_digital_sign'] && resDatasUs['hpb_digital_sign']!="")?this.alterimgPath(resDatasUs['hpb_digital_sign']):"";
                                                } else {
                                                    allFileObjeArr['hpb_profile_pic']=resDatasUs['hpb_profile_pic'];
                                                    allFileObjeArr['id_photo']=resDatasUs['id_photo'];
                                                    allFileObjeArr['hpb_digital_sign']=resDatasUs['hpb_digital_sign'];
                                                }

                                                if(hpb_id == 0){
                                                    this.hpbExistsCheckByNumber(insertUpdateObj['primary_mobile_no']).then((respStatus)=>{

                                                        if(respStatus == false){

                                                            this.uploadLocalFileToServer(allFileObjeArr).then((allFileObjeArrRet)=>{

                                                                // allFileObjeArrRet
                                                               // insertUpdateObj['hpb_profile_pic']=JSON.stringify(allFileObjeArrRet['hpb_profile_pic']);
                                                               // insertUpdateObj['id_photo']=JSON.stringify(allFileObjeArrRet['id_photo']);
                                                              //  insertUpdateObj['hpb_digital_sign']=JSON.stringify(allFileObjeArrRet['hpb_digital_sign']);

                                                                if(allFileObjeArrRet['hpb_profile_pic'].length>0){
                                                                    insertUpdateObj['hpb_profile_pic']=JSON.stringify(allFileObjeArrRet['hpb_profile_pic']);
                                                                }
                                                                if(allFileObjeArrRet['id_photo'].length>0){
                                                                    insertUpdateObj['id_photo']=JSON.stringify(allFileObjeArrRet['id_photo']);
                                                                }
                                                                if(allFileObjeArrRet['hpb_digital_sign'].length>0){
                                                                    insertUpdateObj['hpb_digital_sign']=JSON.stringify(allFileObjeArrRet['hpb_digital_sign']);
                                                                }

                                                                this.app_hpbApi.addEditHpb(insertUpdateObj,hpb_id).subscribe((resSSSData:any)=>{
                                                                    console.log('resSSSData',resSSSData);
                                                                    let updateDataObj={};
                                                                    if(allFileObjeArrRet['hpb_profile_pic'].length>0){
                                                                        updateDataObj['hpb_profile_pic']=insertUpdateObj['hpb_profile_pic'];
                                                                    }
                                                                    if(allFileObjeArrRet['id_photo'].length>0){
                                                                        updateDataObj['id_photo']=insertUpdateObj['id_photo'];
                                                                    }
                                                                    if(allFileObjeArrRet['hpb_digital_sign'].length>0){
                                                                         updateDataObj['hpb_digital_sign']=insertUpdateObj['hpb_digital_sign'];
                                                                    }
                                                                    updateDataObj['server_hpb_id']=resSSSData['result']['id']?resSSSData['result']['id']:0;
                                                                    updateDataObj['updated_date']=resSSSData['result']['updated_date']?resSSSData['result']['updated_date']:0;
                                                                    updateDataObj['sync_status']=1;
                                                                    let whereCond=" hpb_id="+resDatasUs['hpb_id'];
                                                                    this.updateData(updateDataObj,tableName,whereCond).then(()=>{
                                                                        
                                                                        callbackUss();
                                                                    },()=>{
                                                                        callbackUss();
                                                                    });
                                                                        
                                                                },(errSSS)=>{
                                                                    console.log('errSSS',errSSS);
                                                                    callbackUss();
                                                                });

                                                            },()=>{
                                                                callbackUss();
                                                            });

                                                        }else{

                                                            let removeLocalHpb = 'DELETE FROM hpb_master WHERE hpb_id ='+resDatasUs['hpb_id'];
                                                            console.log(" deleted hpb ",removeLocalHpb);
                                                            this.queryExecuteSql(removeLocalHpb,[]).then(()=>{
                                                                console.log('successfully deleted');
                                                                callbackUss();
                                                            },()=>{
                                                                callbackUss();
                                                            });
                                                            
                                                        }

                                                    },(errorHp)=>{
                                                        callbackUss();
                                                    });
                                                }else{
                                                    this.uploadLocalFileToServer(allFileObjeArr).then((allFileObjeArrRet)=>{

                                                        //allFileObjeArrRet
                                                       // insertUpdateObj['hpb_profile_pic']=JSON.stringify(allFileObjeArrRet['hpb_profile_pic']);
                                                      //  insertUpdateObj['id_photo']=JSON.stringify(allFileObjeArrRet['id_photo']);
                                                     //   insertUpdateObj['hpb_digital_sign']=JSON.stringify(allFileObjeArrRet['hpb_digital_sign']);

                                                      if(allFileObjeArrRet['hpb_profile_pic'].length>0){
                                                         insertUpdateObj['hpb_profile_pic']=JSON.stringify(allFileObjeArrRet['hpb_profile_pic']);
                                                        }
                                                        if(allFileObjeArrRet['id_photo'].length>0){
                                                          insertUpdateObj['id_photo']=JSON.stringify(allFileObjeArrRet['id_photo']);
                                                        }
                                                        if(allFileObjeArrRet['hpb_digital_sign'].length>0){
                                                         insertUpdateObj['hpb_digital_sign']=JSON.stringify(allFileObjeArrRet['hpb_digital_sign']);
                                                        }

                                                        this.app_hpbApi.addEditHpb(insertUpdateObj,hpb_id).subscribe((resSSSData:any)=>{
                                                            console.log('resSSSData',resSSSData);
                                                            let updateDataObj={};
                                                            if(allFileObjeArrRet['hpb_profile_pic'].length>0){
                                                            updateDataObj['hpb_profile_pic']=insertUpdateObj['hpb_profile_pic'];
                                                            }
                                                            if(allFileObjeArrRet['id_photo'].length>0){
                                                            updateDataObj['id_photo']=insertUpdateObj['id_photo'];
                                                            }
                                                            if(allFileObjeArrRet['hpb_digital_sign'].length>0){
                                                            updateDataObj['hpb_digital_sign']=insertUpdateObj['hpb_digital_sign'];
                                                            }
                                                            updateDataObj['server_hpb_id']=resSSSData['result']['id']?resSSSData['result']['id']:0;
                                                            updateDataObj['updated_date']=resSSSData['result']['updated_date']?resSSSData['result']['updated_date']:0;
                                                            updateDataObj['sync_status']=1;
                                                            let whereCond=" hpb_id="+resDatasUs['hpb_id'];
                                                            this.updateData(updateDataObj,tableName,whereCond).then(()=>{
                                                                
                                                                callbackUss();
                                                            },()=>{
                                                                callbackUss();
                                                            });
                                                                
                                                        },(errSSS)=>{
                                                            console.log('errSSS',errSSS);
                                                            callbackUss();
                                                        });

                                                    },()=>{
                                                        callbackUss();
                                                    });

                                                }




                                                
                                     },(errSSS)=>{
                                         this.syncHpbDRunningFlag=false;
                                        resolve(true); 

                                    });

                                    
                            },(errorU)=>{
                                    console.log('errorU',errorU);
                                     this.syncHpbDRunningFlag=false;
                                    resolve(true); 
                            });



                  });



                },(error)=>{
                    this.syncHpbDRunningFlag=false;
                    reject(false);
                });



        },()=>{
            this.syncHpbDRunningFlag=false;
            reject(true);
        });

    });    
}

syncHpbDExtra(){
        
    return new Promise((resolve,reject)=>{

        if(globalInternetCheckConnection==false){
                this.showSyncToast(ALL_MESSAGE.COMMON_MESSAGE.SYNC_NO_FAILED_INTERNET);
                reject(true);
                return false;
        }

       if(this.syncHpbDERunningFlag){
                reject(true);
                return false;
       }
       
        this.syncHpbDERunningFlag=true;
        let filterS={};
        let tableName='hpb_master';
        let query="SELECT server_hpb_id FROM project_master where server_hpb_id NOT IN (SELECT server_hpb_id from hpb_master WHERE server_hpb_id > 0 ) AND server_hpb_id>0";
        this.queryExecuteSql(query,[]).then((resDataQ:any)=>{
                let dataIds = [];
                for(let i=0;i<resDataQ.rows.length;i++){
                    let tempObj = resDataQ.rows.item(i);
                    dataIds.push(tempObj['server_hpb_id']);
                }
                
                let filterH={"where":{and:[{hpb_id:{inq:dataIds}}]}};
                this.app_hpbApi.find(filterH).subscribe((respDatas:any)=>{
                        let responseResults = respDatas;
                        async.each(responseResults,(respData,callback:any)=>{
                        
                        console.log('DownSync each respData',respData);

                        let sQuery="SELECT * FROM "+tableName+" WHERE server_hpb_id="+respData['hpb_id']+"";
                        
                        this.queryExecuteSql(sQuery,[]).then((resQuData:any)=>{

                            console.log('queryExecuteSql resQuData',resQuData);

                            if(resQuData.rows.length > 0){
                                    
                                    let locaDataRow=resQuData.rows.item(0);

                                    console.log('locaDataRow',locaDataRow);

                                    let updateObj={};
                                    let syncStatus=1;
                                   
                                    let allFileObjeArr = {};

                                    if(locaDataRow['sync_status']==1){
                                            updateObj['hpb_name']=respData['hpb_name'];
                                            updateObj['hpb_type']=respData['hpb_type'];
                                            updateObj['hpb_profile_pic']=respData['hpb_profile_pic'];
                                            if(locaDataRow['hpb_profile_pic']!=respData['hpb_profile_pic']){
                                              allFileObjeArr['hpb_profile_pic']=respData['hpb_profile_pic'];
                                            }
                                            updateObj['primary_mobile_no']=respData['primary_mobile_no'];
                                            updateObj['secondary_mobile_no']=respData['secondary_mobile_no'];
                                            updateObj['hpb_email']=respData['hpb_email'];
                                            updateObj['place_of_birth']=respData['place_of_birth'];
                                            updateObj['date_of_birth']=respData['date_of_birth'];
                                            updateObj['id_photo']=respData['id_photo'];
                                            if(locaDataRow['id_photo']!=respData['id_photo']){
                                              allFileObjeArr['id_photo']=respData['id_photo'];
                                            }
                                            updateObj['id_card_address']=respData['id_card_address'];
                                            updateObj['id_card_province']=respData['id_card_province'];
                                            updateObj['id_card_number']=respData['id_card_number'];
                                            updateObj['id_card_city']=respData['id_card_city'];
                                            updateObj['id_card_sub_district']=respData['id_card_sub_district'];
                                            updateObj['id_card_pincode']=respData['id_card_pincode'];
                                            updateObj['domicile_same_as_id_card']=respData['domicile_same_as_id_card'];
                                            updateObj['domicile_address']=respData['domicile_address'];
                                            updateObj['domicile_province']=respData['domicile_province'];
                                            updateObj['domicile_city']=respData['domicile_city'];
                                            updateObj['domicile_sub_district']=respData['domicile_sub_district'];
                                            updateObj['domicile_pincode']=respData['domicile_pincode'];
                                            updateObj['company_name']=respData['company_name'];
                                            updateObj['company_representative_name']=respData['company_representative_name'];
                                            updateObj['company_designation']=respData['company_designation'];
                                            updateObj['hpb_status']=respData['hpb_status'];
                                            updateObj['hpb_digital_sign']=respData['hpb_digital_sign'];
                                            if(locaDataRow['hpb_digital_sign']!=respData['hpb_digital_sign']){
                                              allFileObjeArr['hpb_digital_sign']=respData['hpb_digital_sign'];
                                            }
                                            updateObj['additional_comments']=respData['additional_comments'];
                                            updateObj['latitude']=respData['latitude'];
                                            updateObj['longitude']=respData['longitude'];
                                            updateObj['created_date']=respData['created_date'];
                                            updateObj['updated_date']=respData['updated_date'];
                                            updateObj['created_by']=respData['created_by'];
                                            updateObj['updated_by']=respData['updated_by'];
                                            updateObj['local_updated_date']=respData['local_updated_date'];
                                            updateObj['local_created_date']=respData['local_created_date'];
                                            updateObj['assigned_to']=respData['assigned_to'];
                                            updateObj['generated_by']=respData['generated_by'];
                                            updateObj['status']=respData['status'];
                                    }


                                    updateObj['ext_data']="";
                                    let whereCon=" server_hpb_id="+respData['hpb_id']+" ";
                                 
                                    this.downloadServerFileToLocal(allFileObjeArr).then((allFileObjeArrRet)=>{
                                        if(locaDataRow['hpb_profile_pic']!=respData['hpb_profile_pic']){
                                            updateObj['hpb_profile_pic']=JSON.stringify(allFileObjeArrRet['hpb_profile_pic']);
                                        }
                                        if(locaDataRow['id_photo']!=respData['id_photo']){
                                            updateObj['id_photo']=JSON.stringify(allFileObjeArrRet['id_photo']);
                                        }
                                        if(locaDataRow['hpb_digital_sign']!=respData['hpb_digital_sign']){
                                            updateObj['hpb_digital_sign']=JSON.stringify(allFileObjeArrRet['hpb_digital_sign']);
                                        }
                                        this.updateData(updateObj,tableName,whereCon).then((resInsData)=>{
                                      
                                          callback();

                                        // File Save To Local IF Updated

                                        },(err)=>{

                                          callback();

                                        }); 

                                },(errDDDDD)=>{

                                     callback();

                                });
                                  
                                  


                            }else{


                                    let insertObj={};
                                    insertObj['server_hpb_id']=respData['hpb_id'];
                                    insertObj['hpb_name']=respData['hpb_name'];
                                    insertObj['hpb_type']=respData['hpb_type'];
                                    insertObj['hpb_profile_pic']=respData['hpb_profile_pic'];
                                    insertObj['primary_mobile_no']=respData['primary_mobile_no'];
                                    insertObj['secondary_mobile_no']=respData['secondary_mobile_no'];
                                    insertObj['hpb_email']=respData['hpb_email'];
                                    insertObj['place_of_birth']=respData['place_of_birth'];
                                    insertObj['date_of_birth']=respData['date_of_birth'];
                                    insertObj['id_photo']=respData['id_photo'];
                                    insertObj['id_card_address']=respData['id_card_address'];
                                    insertObj['id_card_province']=respData['id_card_province'];
                                    insertObj['id_card_number']=respData['id_card_number'];
                                    insertObj['id_card_city']=respData['id_card_city'];
                                    insertObj['id_card_sub_district']=respData['id_card_sub_district'];
                                    insertObj['id_card_pincode']=respData['id_card_pincode'];
                                    insertObj['domicile_same_as_id_card']=respData['domicile_same_as_id_card'];
                                    insertObj['domicile_address']=respData['domicile_address'];
                                    insertObj['domicile_province']=respData['domicile_province'];
                                    insertObj['domicile_city']=respData['domicile_city'];
                                    insertObj['domicile_sub_district']=respData['domicile_sub_district'];
                                    insertObj['domicile_pincode']=respData['domicile_pincode'];
                                    insertObj['company_name']=respData['company_name'];
                                    insertObj['company_representative_name']=respData['company_representative_name'];
                                    insertObj['company_designation']=respData['company_designation'];
                                    insertObj['hpb_status']=respData['hpb_status'];
                                    insertObj['hpb_digital_sign']=respData['hpb_digital_sign'];
                                    insertObj['additional_comments']=respData['additional_comments'];
                                    insertObj['latitude']=respData['latitude'];
                                    insertObj['longitude']=respData['longitude'];
                                    insertObj['created_date']=respData['created_date'];
                                    insertObj['updated_date']=respData['updated_date'];
                                    insertObj['created_by']=respData['created_by'];
                                    insertObj['updated_by']=respData['updated_by'];
                                    insertObj['local_updated_date']=respData['local_updated_date'];
                                    insertObj['local_created_date']=respData['local_created_date'];
                                    insertObj['assigned_to']=respData['assigned_to'];
                                    insertObj['generated_by']=respData['generated_by'];
                                    insertObj['status']=respData['status'];
                                    insertObj['sync_status']=1;
                                    insertObj['ext_data']="";

                                    let allFileObjeArr = {};
                                    allFileObjeArr['hpb_profile_pic']=respData['hpb_profile_pic'];
                                    allFileObjeArr['id_photo']=respData['id_photo'];
                                    allFileObjeArr['hpb_digital_sign']=respData['hpb_digital_sign'];

                                    this.downloadServerFileToLocal(allFileObjeArr).then((allFileObjeArrRet)=>{

                                        insertObj['hpb_profile_pic']=JSON.stringify(allFileObjeArrRet['hpb_profile_pic']);
                                        insertObj['id_photo']=JSON.stringify(allFileObjeArrRet['id_photo']);
                                        insertObj['hpb_digital_sign']=JSON.stringify(allFileObjeArrRet['hpb_digital_sign']);


                                        this.insertData(insertObj,tableName).then((resInsData)=>{
                                               console.log('hpb insertScuees',resInsData);   
                                            callback();
                                            },(err)=>{
                                                console.log('hpb error',err);
                                                callback();
                                          });

                                    },(errDDD)=>{
                                        console.log('hpb errDDD',errDDD);
                                        callback();

                                    });
                                    
                            }
                            

                        },(errChild)=>{
                               console.log('hpb errDDD',errChild);
                                callback();
                        });

                    
                    },(err)=>{
                         this.syncHpbDERunningFlag=false;
                         resolve(true);
                    });

                },(error)=>{
                        this.syncHpbDERunningFlag=false;
                        reject(true);
                });

               
        },()=>{
               this.syncHpbDERunningFlag=false;
               reject(true);
        });     

    });

}

syncHpbApproval(){
    return new Promise((resolve,reject)=>{
            if(globalInternetCheckConnection==false){
            this.showSyncToast(ALL_MESSAGE.COMMON_MESSAGE.SYNC_NO_FAILED_INTERNET);
            reject(true);
            return false;
            }

            if(this.syncHpbApproveRejectFlag){
            //this.showSyncToast(ALL_MESSAGE.COMMON_MESSAGE.SYNC_RUN_GLOABL_INTERNET);
            reject(true);
            return false;
            }

            this.syncHpbApproveRejectFlag=true;



            let tableName = 'hpb_update_approval';
            let filterS={};
            let query="SELECT * FROM "+tableName+" ORDER BY updated_date desc LIMIT 1";
            let hbpCheckSync=0;
            this.queryExecuteSql(query,[]).then((resDataQ:any)=>{
                    let filterDataH={};
                    filterDataH['created_by']=sessionUserGlobalData['userId'];
                     if(resDataQ.rows.length > 0){
                        let tmpDataObj=resDataQ.rows.item(0);
                        filterDataH['updated_date']=tmpDataObj['updated_date'];
                    }

                    this.hpbUpdateApproval.getUpdateHpb(filterDataH).subscribe((respDatas:any)=>{
                                console.log('respDatas',respDatas);
                                let responseResults = respDatas['result'];
                                console.log('responseResults',responseResults);
                                // DownSync Start
                                async.each(responseResults,(respData,callback:any)=>{
                                    
                                    console.log('DownSync each respData',respData);
            
                                    let sQuery="SELECT * FROM "+tableName+"  WHERE server_hua_id="+respData['id']+"";
                                    
                                    this.queryExecuteSql(sQuery,[]).then((resQuData:any)=>{
            
                                        console.log('queryExecuteSql resQuData',resQuData);

            
                                        if(resQuData.rows.length > 0){
                                            let locaDataRow=resQuData.rows.item(0);
                                            console.log('locaDataRow',locaDataRow);
                                            let updateObj={};
                                            let syncStatus=1;
                                            if(locaDataRow['sync_status']==1){
                                                updateObj['approval_status'] = respData['approval_status'];
                                                updateObj['server_hpb_id'] = respData['hpb_id'];
                                                updateObj['is_closed'] = respData['is_closed'];
                                                updateObj['reason'] = respData['rejection_reason'];
                                                updateObj['created_date'] = respData['created_date'];
                                                updateObj['updated_date'] = respData['updated_date'];
                                                updateObj['local_created_date'] = respData['created_date'];
                                                updateObj['local_updated_date'] = respData['updated_date'];
                                                updateObj['updated_by'] = respData['updated_by'];
                                                updateObj['created_by'] = respData['created_by'];
                                                updateObj['field_name'] = respData['field_name'];
                                                updateObj['field_new_value'] = respData['field_new_value'];
                                                updateObj['field_old_value'] = respData['field_old_value'];
                                                let whereCon = " server_hua_id = "+respData['id']+" ";
                                                this.sqlS.updateData(updateObj,tableName,whereCon).then((res)=>{
                                                    callback();
                                                },(err)=>{
                                                    console.log(err);
                                                    callback();
                                                })
                                            }else{
                                                callback();
                                            }
                                        }else{

                                            let insertObj = {};
                                            insertObj['server_hua_id'] = respData['id'];
                                            insertObj['server_hpb_id'] = respData['hpb_id'];
                                            insertObj['field_name'] = respData['field_name'];
                                            insertObj['field_new_value'] = respData['field_new_value'];
                                            insertObj['field_old_value'] = respData['field_old_value'];
                                            insertObj['created_date'] = respData['created_date'];
                                            insertObj['updated_date'] = respData['updated_date'];
                                            insertObj['local_created_date'] = respData['created_date'];
                                            insertObj['local_updated_date'] = respData['updated_date'];
                                            insertObj['is_closed'] = respData['is_closed'];
                                            insertObj['reason'] = respData['rejection_reason'];
                                            insertObj['approval_status'] = respData['approval_status'];
                                            insertObj['created_by'] = respData['created_by'];
                                            insertObj['updated_by'] = respData['updated_by'];
                                            insertObj['sync_status'] = 1;
                                            this.sqlS.insertData(insertObj,tableName).then((success)=>{
                                                callback();
                                            },(err)=>{
                                                callback();
                                            })
                                        }
                                    },(error)=>{
                                        console.log(error);
                                        callback();
                                    });
                                },()=>{
                                    // up sync
                                    let queryU="SELECT * FROM "+tableName+" WHERE sync_status=0";

                                    this.queryExecuteSql(queryU,[]).then((resDataU:any)=>{
                                    console.log('resDataU',resDataU);

                                    let resDatasUss=[];
                                    for(let m=0;m<resDataU.rows.length;m++){
                                    resDatasUss.push(resDataU.rows.item(m));
                                    }
                                    console.log('resDatasUss',resDatasUss);
                                        async.each(resDatasUss,(resDatasUs,callbackUss)=>{

                                         console.log('resDatasUs aync',resDatasUs);
                                        
                                            let hua_id=0;
                                            let insertUpdateObj={};
                                            insertUpdateObj['hpb_id'] = resDatasUs['server_hpb_id'];
                                            insertUpdateObj['field_name'] = resDatasUs['field_name'];
                                            insertUpdateObj['field_new_value'] = resDatasUs['field_new_value'];
                                            insertUpdateObj['field_old_value'] = resDatasUs['field_old_value'];
                                            insertUpdateObj['is_closed'] = resDatasUs['is_closed'];
                                            insertUpdateObj['reason'] = resDatasUs['rejection_reason'];
                                            insertUpdateObj['approval_status'] = resDatasUs['approval_status'];
                                            insertUpdateObj['created_by'] = resDatasUs['created_by'];
                                            insertUpdateObj['updated_by'] = resDatasUs['updated_by'];
                                         
                                            if(resDatasUs['server_hua_id']>0){
                                                hua_id=resDatasUs['server_hua_id'];
                                            }

                                            let whereMaster:any = "";
                                            let whereApproval = {"where":{"and":[{"field_new_value":resDatasUs['field_new_value']},{"field_name":resDatasUs['field_name']}]}};

                                            if(resDatasUs['field_name']=='Mobile'){
                                                
                                                whereMaster = {"where":{"primary_mobile_no":resDatasUs['field_new_value']}};
                        
                                            }else{
                        
                                                whereMaster = {"where":{"id_card_number":resDatasUs['field_new_value']}};
                        
                                            }


                                            this.app_hpbApi.find(whereMaster).subscribe((resultmaster)=>{
                                                console.log("mobile or id card exist in hpb master server level result length=>",resultmaster.length);
                        
                                                if( resultmaster.length == 0 || resultmaster == undefined || resultmaster == null ){
                                                    console.log("mobile or id card not exist in hpb master server level");
                        
                                                    this.hpbUpdateApproval.find(whereApproval).subscribe((result)=>{
                                                        console.log("mobile or id card exist in hpb update approval server level result length=>",result.length);
                        
                                                        if( result.length == 0 || result == undefined || result == null ){

                                                            this.hpbUpdateApproval.addEditHpbUpadteApproval(insertUpdateObj,hua_id).subscribe((resSSSData:any)=>{
                                                                console.log('resSSSData',resSSSData);
                                                                let updateDataObj={};
                                                                updateDataObj['server_hua_id']=resSSSData['result']['id']?resSSSData['result']['id']:0;
                                                                updateDataObj['updated_date']=resSSSData['result']['updated_date']?resSSSData['result']['updated_date']:0;
                                                                updateDataObj['sync_status']=1;
                                                                let whereCond=" hua_id="+resDatasUs['hua_id'];
                                                                this.updateData(updateDataObj,tableName,whereCond).then(()=>{
                                                                    callbackUss();
                                                                },()=>{
                                                                    callbackUss();
                                                                });
                                                            },(errSSS)=>{
                                                                    console.log('errSSS',errSSS);
                                                                    callbackUss();
                                                            });
                                                        }else{
                                                            //set is closed to 1
                                                            //triger notification
                                                            console.log("mobile or id card exist in hpb master server level");
                                                            if(hua_id==0){

                                                           
                                                            let delQry = "Delete from hpb_update_approval where hua_id="+resDatasUs['hua_id'];
                                                            console.log("delQry=>",delQry);
                                
                                                            this.sqlS.queryExecuteSql(delQry,[]).then((deleted)=>{
                                
                                                                console.log("data deleted");
                                                                callbackUss();
                                
                                                            },(err)=>{
                                
                                                                console.log("data not  deleted");
                                                                callbackUss();
                                                            });
                                                            }else{
                                                                callbackUss();
                                                            }
                                                        }
                                                    },(err)=>{
                                                        callbackUss();
                                                    })
                                                }else{
                                                    //set is closed to 1
                                                    //triger notification
                                                    if(hua_id==0){
                                                                                                                                                                           
                                                        let delQry = "Delete from hpb_update_approval where hua_id="+resDatasUs['hua_id'];
                                                        console.log("delQry=>",delQry);
                            
                                                        this.sqlS.queryExecuteSql(delQry,[]).then((deleted)=>{
                            
                                                            console.log("data deleted");
                                                            callbackUss();
                            
                                                        },(err)=>{
                            
                                                            console.log("data not  deleted");
                                                            callbackUss();
                                                        });
                                                        }else{
                                                            callbackUss();
                                                        }
                                                }
                                            },(err)=>{
                                                callbackUss();
                                            });
                                           
                                        },()=>{
                                            this.syncHpbApproveRejectFlag=false;
                                            resolve(true);
                                        })
                                    },(err)=>{
                                        this.syncHpbApproveRejectFlag=false;
                                        reject(true);
                                    });
                                });

                    },()=>{
                        this.syncHpbApproveRejectFlag=false;
                        reject(true); 
                    });

            },()=>{
                this.syncHpbApproveRejectFlag=false;
                 reject(true);
            });

    });
}

syncProjectAndReceipts(){
    return new Promise((resolve,reject)=>{

        if(globalInternetCheckConnection==false){
                    this.showSyncToast(ALL_MESSAGE.COMMON_MESSAGE.SYNC_NO_FAILED_INTERNET);
                    reject(true);
                    return false;
         }

        if(this.syncProjectAndReceiptsRunningFlag){
                //this.showSyncToast(ALL_MESSAGE.COMMON_MESSAGE.SYNC_RUN_GLOABL_INTERNET);
                reject(true);
                return false;
        }

        // this.showSyncToast("Sync Call Project DDD =="+this.syncProjectAndReceiptsRunningFlag);
        // console.log("Sync Call Project DDD =="+this.syncProjectAndReceiptsRunningFlag);

            this.syncProjectAndReceiptsRunningFlag=true;
            this.syncProjectD().then(()=>{

                let allTaskComplete = ()=>{
                   this.syncProjectAndReceiptsRunningFlag=false;
                   resolve(true);
                }


                var asyncTasks = [];

                asyncTasks.push((callback)=>{
                    this.syncHpbDExtra().then(()=>{
                        callback();
                    },()=>{
                        callback();
                    });
                });

                asyncTasks.push((callback)=>{
                
                    this.syncReceiptsD().then(()=>{
                    
                        this.syncReceiptsApprovalD().then(()=>{
                            callback();
                        },(error11)=>{
                            callback();
                        });
                    },(error1)=>{
                    

                        this.syncReceiptsApprovalD().then(()=>{
                              callback();
                        },(error11)=>{
                              callback();
                        });

                    });

                });

                asyncTasks.push((callback)=>{
                    
                    this.syncReceiptsUpSync2().then(()=>{
                    

                        this.syncReceiptsApprovalD().then(()=>{
                            callback();
                        },(error11)=>{
                            
                            callback();
                        });

                    },(error1)=>{
                    
                        

                    this.syncReceiptsApprovalD().then(()=>{
                            callback();
                        },(error11)=>{
                            
                            callback();
                        });

                    });

                });

                
                 asyncTasks.push((callback)=>{
                        this.syncSrkuApprovalD().then(()=>{
                              callback();
                        },(error11)=>{
                              callback();
                        });
                 });

                asyncTasks.push((callback)=>{
                        this.syncProjectRequestD().then(()=>{
                            //  callback();

                            this.syncProjectRequestBrandD().then(()=>{
                                callback();
                            },()=>{
                                callback();
                            });

                        },(error11)=>{
                            //  callback();
                             this.syncProjectRequestBrandD().then(()=>{
                                callback();
                            },()=>{
                                callback();
                            });
                        });
                 });

                 
               
                async.parallel(asyncTasks, function(){
                    allTaskComplete();
                });


            },(error)=>{

                 var asyncTasks = [];
                 

                let allTaskComplete = ()=>{
                   this.syncProjectAndReceiptsRunningFlag=false;
                   resolve(true);
                }

                    asyncTasks.push((callback)=>{
                        this.syncHpbDExtra().then(()=>{
                            callback();
                        },()=>{
                            callback();
                        });
                    });

                    asyncTasks.push((callback)=>{

                    this.syncReceiptsD().then(()=>{
                    

                        this.syncReceiptsApprovalD().then(()=>{
                            callback();
                        },(error11)=>{
                            
                            callback();
                        });

                    },(error1)=>{
                    
                        

                    this.syncReceiptsApprovalD().then(()=>{
                            callback();
                        },(error11)=>{
                            
                            callback();
                        });

                    });

                });    


                asyncTasks.push((callback)=>{
                    
                    this.syncReceiptsUpSync2().then(()=>{
                    

                        this.syncReceiptsApprovalD().then(()=>{
                            callback();
                        },(error11)=>{
                            
                            callback();
                        });

                    },(error1)=>{
                    
                        

                    this.syncReceiptsApprovalD().then(()=>{
                            callback();
                        },(error11)=>{
                            
                            callback();
                        });

                    });

                });



            
              asyncTasks.push((callback)=>{
                        this.syncSrkuApprovalD().then(()=>{
                              callback();
                        },(error11)=>{
                              callback();
                        });
               });


             
                asyncTasks.push((callback)=>{
                        this.syncProjectRequestD().then(()=>{
                            //  callback();

                            this.syncProjectRequestBrandD().then(()=>{
                                callback();
                            },()=>{
                                callback();
                            });

                        },(error11)=>{
                            //  callback();
                             this.syncProjectRequestBrandD().then(()=>{
                                callback();
                            },()=>{
                                callback();
                            });
                        });
                 });

             async.parallel(asyncTasks, function(){
                    allTaskComplete();
              });

            });
        
    });
}

syncProjectD(){
 return new Promise((resolve,reject)=>{
      
        if(globalInternetCheckConnection==false){
            this.showSyncToast(ALL_MESSAGE.COMMON_MESSAGE.SYNC_NO_FAILED_INTERNET);
            reject(true);
            return false;
        }

      
        let tableName='project_master';
        let tableNameDepnd='hpb_master';
        let filterS={};
        let query="SELECT * FROM "+tableName+" ORDER BY updated_date desc LIMIT 1";
        let hbpCheckSync=0;
        this.queryExecuteSql(query,[]).then((resDataQ:any)=>{
                let filterDataH={};
              
                filterDataH['created_by']=sessionUserGlobalData['userId'];
                filterDataH['assigned_to']=sessionUserGlobalData['userId'];
                console.log('resDataQ',resDataQ);
                 if(resDataQ.rows.length > 0){
                    let tmpDataObj=resDataQ.rows.item(0);
                    filterDataH['updated_date']=tmpDataObj['updated_date'];
                }

                 // loop for limit offset and assigned_to

                this.appProjApi.getProject(null,null,null,null,null,null,null,null,null,null,filterDataH['updated_date'],null,null,null,null,null,null,filterDataH['assigned_to']).subscribe((respDatas:any)=>{
                    
                    console.log('respDatas',respDatas);

                    let responseResults = respDatas['result'];

                    console.log('responseResults',responseResults);

                    // DownSync Start
                    
                    async.each(responseResults,(respData,callback:any)=>{
                        
                        console.log('DownSync each respData',respData);

                        let sQuery="SELECT * FROM "+tableName+"  WHERE server_project_id="+respData['project_id']+"";
                        
                        this.queryExecuteSql(sQuery,[]).then((resQuData:any)=>{

                            console.log('queryExecuteSql resQuData',resQuData);

                            if(resQuData.rows.length > 0){
                                    
                                    let locaDataRow=resQuData.rows.item(0);

                                    console.log('locaDataRow',locaDataRow);

                                    let updateObj={};
                                    let syncStatus=1;

                                    
                                    let allFileObjeArr = {};
                                   

                                   if(locaDataRow['sync_status']==1){
                                    updateObj['project_name']=respData['project_name'];
                                    updateObj['server_hpb_id']=respData['hpb_id'];
                                    updateObj['project_completion_date']=respData['project_completion_date'];
                                    updateObj['project_quantity_estimation']=respData['project_quantity_estimation'];
                                    updateObj['project_type_mid']=respData['project_type'];
                                    updateObj['project_stage_mid']=respData['project_stage'];
                                    updateObj['project_photo']=respData['project_photo'];
                                    if(locaDataRow['project_photo']!=respData['project_photo']){
                                         allFileObjeArr['project_photo']=respData['project_photo'];
                                    }
                                    updateObj['project_address']=respData['project_address'];
                                    updateObj['project_province']=respData['project_province'];
                                    updateObj['project_city']=respData['project_city'];
                                    updateObj['project_sub_district']=respData['project_sub_district'];
                                    updateObj['project_pincode']=respData['project_pincode'];
                                    updateObj['is_srku']=respData['is_srku'];
                                    updateObj['srku_owner_name']=respData['srku_owner_name'];
                                    updateObj['srku_owner_address']=respData['srku_owner_address'];
                                    updateObj['srku_owner_mobile_no']=respData['srku_owner_mobile_no'];
                                    updateObj['srku_province']=respData['srku_province'];
                                    updateObj['srku_city']=respData['srku_city'];
                                    updateObj['srku_sub_district']=respData['srku_sub_district'];
                                    updateObj['srku_pincode']=respData['srku_pincode'];
                                    updateObj['floor_size']=respData['floor_size'];
                                    updateObj['number_of_units']=respData['number_of_units'];
                                    updateObj['is_micro_credit']=respData['is_micro_credit'];
                                    updateObj['bank_name']=respData['bank_name'];
                                    updateObj['bank_document']=respData['bank_document'];
                                    if(locaDataRow['bank_document']!=respData['bank_document']){
                                         allFileObjeArr['bank_document']=respData['bank_document'];
                                    }
                                    updateObj['non_micro_credit_type_mid']=respData['non_micro_credit_type'];
                                    updateObj['nmc_document']=respData['nmc_document'];
                                    if(locaDataRow['nmc_document']!=respData['nmc_document']){
                                         allFileObjeArr['nmc_document']=respData['nmc_document'];
                                    }
                                    updateObj['additional_comments']=respData['additional_comments'];
                                    updateObj['hpb_digital_sign']=respData['hpb_digital_sign'];
                                    if(locaDataRow['hpb_digital_sign']!=respData['hpb_digital_sign']){
                                         allFileObjeArr['hpb_digital_sign']=respData['hpb_digital_sign'];
                                    }
                                    updateObj['latitude']=respData['latitude'];
                                    updateObj['longitude']=respData['longitude'];
                                    updateObj['created_date']=respData['created_date'];
                                    updateObj['updated_date']=respData['updated_date'];
                                    updateObj['created_by']=respData['created_by'];
                                    updateObj['updated_by']=respData['updated_by'];
                                    updateObj['assigned_to']=respData['assigned_to'];
                                    updateObj['generated_by']=respData['generated_by'];
                                    updateObj['local_updated_date']=respData['local_updated_date'];
                                    updateObj['local_created_date']=respData['local_created_date'];
                                    updateObj['status']=respData['status'];
                                   }
                                  

                                    
                                    updateObj['ext_data']="";
                                    let whereCon=" server_project_id="+respData['project_id']+" ";
                                  
                                   
                                    this.downloadServerFileToLocal(allFileObjeArr).then((allFileObjeArrRet)=>{

                                        if(locaDataRow['project_photo']!=respData['project_photo']){
                                          updateObj['project_photo']=JSON.stringify(allFileObjeArrRet['project_photo']);
                                        }
                                        if(locaDataRow['bank_document']!=respData['bank_document']){
                                          updateObj['bank_document']=JSON.stringify(allFileObjeArrRet['bank_document']);
                                        }
                                        if(locaDataRow['nmc_document']!=respData['nmc_document']){
                                          updateObj['nmc_document']=JSON.stringify(allFileObjeArrRet['nmc_document']);
                                        }
                                        if(locaDataRow['hpb_digital_sign']!=respData['hpb_digital_sign']){
                                          updateObj['hpb_digital_sign']=JSON.stringify(allFileObjeArrRet['hpb_digital_sign']);
                                        }
                                       
                                        this.updateData(updateObj,tableName,whereCon).then((resInsData)=>{
                                      
                                         
                                         callback();
                                        // File Save To Local IF Updated

                                        },(err)=>{

                                          callback();

                                        }); 

                                },(errDDDDD)=>{

                                     callback();

                                });
                                  
                                  


                            }else{





                                    let insertObj={};
                                    insertObj['server_project_id']=respData['project_id'];
                                    insertObj['project_name']=respData['project_name'];
                                    insertObj['server_hpb_id']=respData['hpb_id'];
                                    insertObj['hpb_id']=0;
                                    insertObj['project_completion_date']=respData['project_completion_date'];
                                    insertObj['project_quantity_estimation']=respData['project_quantity_estimation'];
                                    insertObj['project_type_mid']=respData['project_type'];
                                    insertObj['project_stage_mid']=respData['project_stage'];
                                    insertObj['project_photo']=respData['project_photo'];
                                    insertObj['project_address']=respData['project_address'];
                                    insertObj['project_province']=respData['project_province'];
                                    insertObj['project_city']=respData['project_city'];
                                    insertObj['project_sub_district']=respData['project_sub_district'];
                                    insertObj['project_pincode']=respData['project_pincode'];
                                    insertObj['is_srku']=respData['is_srku'];
                                    insertObj['srku_owner_name']=respData['srku_owner_name'];
                                    insertObj['srku_owner_address']=respData['srku_owner_address'];
                                    insertObj['srku_owner_mobile_no']=respData['srku_owner_mobile_no'];
                                    insertObj['srku_province']=respData['srku_province'];
                                    insertObj['srku_city']=respData['srku_city'];
                                    insertObj['srku_sub_district']=respData['srku_sub_district'];
                                    insertObj['srku_pincode']=respData['srku_pincode'];
                                    insertObj['floor_size']=respData['floor_size'];
                                    insertObj['number_of_units']=respData['number_of_units'];
                                    insertObj['is_micro_credit']=respData['is_micro_credit'];
                                    insertObj['bank_name']=respData['bank_name'];
                                    insertObj['bank_document']=respData['bank_document'];
                                    insertObj['non_micro_credit_type_mid']=respData['non_micro_credit_type'];
                                    insertObj['nmc_document']=respData['nmc_document'];
                                    insertObj['additional_comments']=respData['additional_comments'];
                                    insertObj['hpb_digital_sign']=respData['hpb_digital_sign'];
                                    insertObj['latitude']=respData['latitude'];
                                    insertObj['longitude']=respData['longitude'];
                                    insertObj['created_date']=respData['created_date'];
                                    insertObj['updated_date']=respData['updated_date'];
                                    insertObj['created_by']=respData['created_by'];
                                    insertObj['updated_by']=respData['updated_by'];
                                    insertObj['assigned_to']=respData['assigned_to'];
                                    insertObj['generated_by']=respData['generated_by'];
                                    insertObj['local_updated_date']=respData['local_updated_date'];
                                    insertObj['local_created_date']=respData['local_created_date'];
                                    insertObj['status']=respData['status'];
                                   
                                    insertObj['sync_status']=1;
                                    insertObj['ext_data']="";

                                    let allFileObjeArr = {};
                                    allFileObjeArr['project_photo']=respData['project_photo'];
                                    allFileObjeArr['bank_document']=respData['bank_document'];
                                    allFileObjeArr['nmc_document']=respData['nmc_document'];
                                    allFileObjeArr['hpb_digital_sign']=respData['hpb_digital_sign'];

                                    this.downloadServerFileToLocal(allFileObjeArr).then((allFileObjeArrRet)=>{

                                    insertObj['project_photo']=JSON.stringify(allFileObjeArrRet['project_photo']);
                                    insertObj['bank_document']=JSON.stringify(allFileObjeArrRet['bank_document']);
                                    insertObj['nmc_document']=JSON.stringify(allFileObjeArrRet['nmc_document']);
                                    insertObj['hpb_digital_sign']=JSON.stringify(allFileObjeArrRet['hpb_digital_sign']);


                                    this.insertData(insertObj,tableName).then((resInsData)=>{
                                        console.log('resInsData',resInsData);
                                          
                                          
                                        callback();
                                    },(err)=>{
                                        callback();
                                    });


                                 },(errDDD)=>{
                                     console.log('errDDD',errDDD);
                                      callback();

                                 });


                                    


                            }
                            

                        },(errChild)=>{
                                callback();
                        });

                    
                  },(err)=>{
                        

                        // UpSync Start
                        
                        let queryU="SELECT * FROM "+tableName+" WHERE sync_status=0";

                            this.queryExecuteSql(queryU,[]).then((resDataU:any)=>{
                                    console.log('resDataU',resDataU);

                                    let resDatasUss=[];
                                    for(let m=0;m<resDataU.rows.length;m++){
                                        resDatasUss.push(resDataU.rows.item(m));
                                    }
                                    console.log('resDatasUss project',resDatasUss);
                                     async.each(resDatasUss,(resDatasUs,callbackUss)=>{

                                                console.log('resDatasUs aync',resDatasUs);

                                                let project_id=0;
                                                let insertUpdateObj={};
                                               
                                                
                                                insertUpdateObj['project_name']=resDatasUs['project_name'];
                                                insertUpdateObj['hpb_id']=resDatasUs['server_hpb_id'];
                                                insertUpdateObj['project_completion_date']=resDatasUs['project_completion_date'];
                                                insertUpdateObj['project_quantity_estimation']=resDatasUs['project_quantity_estimation'];
                                                insertUpdateObj['project_type']=resDatasUs['project_type_mid'];
                                                insertUpdateObj['project_stage']=resDatasUs['project_stage_mid'];
                                              //  insertUpdateObj['project_photo']=resDatasUs['project_photo'];
                                                insertUpdateObj['project_address']=resDatasUs['project_address'];
                                                insertUpdateObj['project_province']=resDatasUs['project_province'];
                                                insertUpdateObj['project_city']=resDatasUs['project_city'];
                                                insertUpdateObj['project_sub_district']=resDatasUs['project_sub_district'];
                                                insertUpdateObj['project_pincode']=resDatasUs['project_pincode'];
                                                insertUpdateObj['is_srku']=resDatasUs['is_srku'];
                                                insertUpdateObj['srku_owner_name']=resDatasUs['srku_owner_name'];
                                                insertUpdateObj['srku_owner_address']=resDatasUs['srku_owner_address'];
                                                insertUpdateObj['srku_owner_mobile_no']=resDatasUs['srku_owner_mobile_no'];
                                                insertUpdateObj['srku_province']=resDatasUs['srku_province'];
                                                insertUpdateObj['srku_city']=resDatasUs['srku_city'];
                                                insertUpdateObj['srku_sub_district']=resDatasUs['srku_sub_district'];
                                                insertUpdateObj['srku_pincode']=resDatasUs['srku_pincode'];
                                                insertUpdateObj['floor_size']=resDatasUs['floor_size'];
                                                insertUpdateObj['number_of_units']=resDatasUs['number_of_units'];
                                                insertUpdateObj['is_micro_credit']=resDatasUs['is_micro_credit'];
                                                insertUpdateObj['bank_name']=resDatasUs['bank_name'];
                                              //  insertUpdateObj['bank_document']=resDatasUs['bank_document'];
                                                insertUpdateObj['non_micro_credit_type']=resDatasUs['non_micro_credit_type_mid'];
                                              //  insertUpdateObj['nmc_document']=resDatasUs['nmc_document'];
                                                insertUpdateObj['additional_comments']=resDatasUs['additional_comments'];
                                                insertUpdateObj['hpb_digital_sign']=resDatasUs['hpb_digital_sign'];
                                                insertUpdateObj['updated_date']=resDatasUs['updated_date'];
                                                insertUpdateObj['updated_by']=resDatasUs['updated_by'];
                                                insertUpdateObj['assigned_to']=resDatasUs['assigned_to'];
                                                insertUpdateObj['local_updated_date']=resDatasUs['local_updated_date'];
                                                insertUpdateObj['generated_by']=resDatasUs['generated_by'];
                                                

                                                if(resDatasUs['server_project_id']>0){
                                                   project_id=resDatasUs['server_project_id'];
                                                }else{
                                                    insertUpdateObj['latitude']=resDatasUs['latitude'];
                                                    insertUpdateObj['longitude']=resDatasUs['longitude'];
                                                    insertUpdateObj['local_created_date']=resDatasUs['local_created_date'];
                                                    insertUpdateObj['created_by']=resDatasUs['created_by'];
                                                    //insertUpdateObj['generated_by']=insertUpdateObj['generated_by'];
                                                }



                                                let allFileObjeArr = {};
                                                if( this.platform.is('ios') ) {
                                                    //console.log("resDatasUs['hpb_digital_sign']=>",resDatasUs['hpb_digital_sign']);
                                                    //insertUpdateObj['hpb_digital_sign']=(resDatasUs['hpb_digital_sign'] && resDatasUs['hpb_digital_sign']!="")?this.alterimgPath(resDatasUs['hpb_digital_sign']):"";
                                                    //console.log("project_photo=>",resDatasUs['project_photo']);
                                                    allFileObjeArr['project_photo']=(resDatasUs['project_photo'] && resDatasUs['project_photo']!="")?this.alterimgPath(resDatasUs['project_photo']):"";
                                                    allFileObjeArr['bank_document']=(resDatasUs['bank_document'] && resDatasUs['bank_document']!="")?this.alterimgPath(resDatasUs['bank_document']):"";
                                                    allFileObjeArr['nmc_document']=(resDatasUs['nmc_document'] && resDatasUs['nmc_document']!="")?this.alterimgPath(resDatasUs['nmc_document']):"";
                                                } else {
                                                    //insertUpdateObj['hpb_digital_sign']=resDatasUs['hpb_digital_sign'];
                                                    allFileObjeArr['project_photo']=resDatasUs['project_photo'];
                                                    allFileObjeArr['bank_document']=resDatasUs['bank_document'];
                                                    allFileObjeArr['nmc_document']=resDatasUs['nmc_document'];
                                                }
                                                
                                              //  allFileObjeArr['hpb_digital_sign']=resDatasUs['hpb_digital_sign'];
                                                console.log('upload LOcal to server start');
                                               
                                            

                                                this.uploadLocalFileToServer(allFileObjeArr).then((allFileObjeArrRet)=>{
                                                  console.log('upload LOcal to server end');
                                                       // a llFileObjeArrRet
                                                    //    insertUpdateObj['project_photo']=JSON.stringify(allFileObjeArrRet['project_photo']);
                                                    //    insertUpdateObj['bank_document']=JSON.stringify(allFileObjeArrRet['bank_document']);
                                                    //    insertUpdateObj['nmc_document']=JSON.stringify(allFileObjeArrRet['nmc_document']);
                                                    //    insertUpdateObj['hpb_digital_sign']=JSON.stringify(allFileObjeArrRet['hpb_digital_sign']);

                                                        if(allFileObjeArrRet['project_photo'].length>0){
                                                            insertUpdateObj['project_photo']=JSON.stringify(allFileObjeArrRet['project_photo']);
                                                        }
                                                        if(allFileObjeArrRet['bank_document'].length>0){
                                                            insertUpdateObj['bank_document']=JSON.stringify(allFileObjeArrRet['bank_document']);
                                                        }
                                                        if(allFileObjeArrRet['nmc_document'].length>0){
                                                            insertUpdateObj['nmc_document']=JSON.stringify(allFileObjeArrRet['nmc_document']);
                                                        }
                                                        if(allFileObjeArrRet['hpb_digital_sign'].length>0){
                                                            insertUpdateObj['hpb_digital_sign']=JSON.stringify(allFileObjeArrRet['hpb_digital_sign']);
                                                        }

                                                        this.appProjApi.addEditProject(insertUpdateObj,project_id).subscribe((resSSSData:any)=>{
                                                                console.log('resSSSData',resSSSData);
                                                                let updateDataObj={};
                                                               
                                                                if(allFileObjeArrRet['project_photo'].length>0){
                                                                updateDataObj['project_photo']=insertUpdateObj['project_photo'];
                                                                }
                                                                if(allFileObjeArrRet['bank_document'].length>0){
                                                                updateDataObj['bank_document']=insertUpdateObj['bank_document'];
                                                                }
                                                                if(allFileObjeArrRet['nmc_document'].length>0){
                                                                updateDataObj['nmc_document']=insertUpdateObj['nmc_document'];
                                                                }
                                                                
                                                                // if(allFileObjeArrRet['hpb_digital_sign'].length>0){
                                                                // updateDataObj['hpb_digital_sign']=insertUpdateObj['hpb_digital_sign'];
                                                                // }

                                                                updateDataObj['server_project_id']=resSSSData['result']['id']?resSSSData['result']['id']:0;
                                                                updateDataObj['updated_date']=resSSSData['result']['updated_date']?resSSSData['result']['updated_date']:0;
                                                                updateDataObj['sync_status']=1;
                                                                let whereCond=" project_id="+resDatasUs['project_id'];
                                                                this.updateData(updateDataObj,tableName,whereCond).then(()=>{
   
                                                                   callbackUss();
                                                                },()=>{
                                                                    callbackUss();
                                                                });

                                                                
                                                        },(errSSS)=>{
                                                                console.log('errSSS',errSSS);
                                                                callbackUss();
                                                        });


                                                    },(errRejU)=>{
                                                           console.log('errRejU',errRejU);
                                                            callbackUss();
                                                 });

                                                
                                     },(errSSS)=>{

                                        resolve(true); 

                                    });

                                    
                            },(errorU)=>{
                                    console.log('errorU',errorU);
                                    resolve(true); 
                            });



                  });



                },(error)=>{
                    
                    reject(false);

                });


        },()=>{
            reject(true);
        });

    });    
}

syncReceiptProjectGet(){
    return new Promise((resolve, reject) => {
        let tableName='project_master';
        let query="SELECT * FROM "+tableName+" WHERE server_project_id>0";
        let allProjectsData=[];
        this.queryExecuteSql(query,[]).then((resSQLData:any)=>{
            for(let i=0;i<resSQLData.rows.length;i++){
                let currProjectobj = resSQLData.rows.item(i);
                allProjectsData.push(currProjectobj);
            }
            console.log('syncReceiptProjectGet',allProjectsData);
            resolve(allProjectsData);
        },(error)=>{
            console.log('error syncReceiptProjectGet',error);
            resolve(allProjectsData);
        });
    })
}

syncProjectRequestGet(){
    return new Promise((resolve, reject) => {
        let tableName='products_request_tbl';
        let query="SELECT * FROM "+tableName+" WHERE server_id>0";
        let allProjectsData=[];
        this.queryExecuteSql(query,[]).then((resSQLData:any)=>{
            for(let i=0;i<resSQLData.rows.length;i++){
                let currProjectobj = resSQLData.rows.item(i);
                allProjectsData.push(currProjectobj);
            }
            //console.log('syncReceiptProjectGet',allProjectsData);
            resolve(allProjectsData);
        },(error)=>{
           // console.log('error syncReceiptProjectGet',error);
            resolve(allProjectsData);
        });
    })
}

syncReceiptsUpSync2():any{
    
      return  new Promise(async (resolve,reject)=>{
  
              console.log("<================syncReceiptsUpSync2=============>");
  
              if(globalInternetCheckConnection==false){
                      this.showSyncToast(ALL_MESSAGE.COMMON_MESSAGE.SYNC_NO_FAILED_INTERNET);
                      reject(true);
                      return false;
              }
  
              if(this.syncReceiptsUpSync2RunningFlag){
                  reject(true);
                  return false;
              }
  
              this.syncReceiptsUpSync2RunningFlag=true;
              let allProjectsData:any =   await this.syncReceiptProjectGet();
              console.log('allProjectsData',allProjectsData);
              async.each(allProjectsData,(cProjectObj,callback0)=>{
              let cProjectId=cProjectObj['server_project_id'];
              let cLProjectId=cProjectObj['project_id'];
              let tableName='product_receipt_master';
              let filterS={};
              //let query="SELECT * FROM "+tableName+" WHERE server_project_id="+cProjectId+" ORDER BY updated_date desc LIMIT 1";
              let userId=sessionUserGlobalData['userId'];
                  
             // UpSync Start
                          
             let queryU="SELECT * FROM "+tableName+" WHERE sync_status=2 AND project_id="+cLProjectId;
             console.log("syncReceiptsD UpSync Start queryU with sync_status=2=>",queryU);

                 this.queryExecuteSql(queryU,[]).then((resDataU:any)=>{
                         console.log('queryU resDataU sync_status=2',resDataU.rows.length);

                         let resDatasUss=[];
                         for(let m=0;m<resDataU.rows.length;m++){
                             resDatasUss.push(resDataU.rows.item(m));
                         }
                         
                          async.each(resDatasUss,(resDatasUs,callbackUss)=>{

                                         let receipt_id=0;
                                         let insertUpdateObj={};
                                         let allFileObjeArr = {};
                                     this.syncProductReqProjHpbLocalIdToServerIdFetch(resDatasUs['project_id'],resDatasUs['hpb_id'],'local').then((resltData:any)=>{
                                         console.log('syncProductReqProjHpbLocalIdToServerIdFetch local',resltData);
                                         if(resltData['p_localId']==0 || resltData['p_serverId']==0){
                                           callbackUss();
                                         }else{

                                            
                                             insertUpdateObj['hpb_id']=resltData['h_serverId'];
                                             insertUpdateObj['project_id']=resltData['p_serverId'];
                                             insertUpdateObj['hpb_status']=resDatasUs['hpb_status'];
                                             insertUpdateObj['product_id']=resDatasUs['product_id'];
                                             insertUpdateObj['rds_id']=resDatasUs['rds_id'];
                                             insertUpdateObj['quantity']=resDatasUs['quantity'];
                                             insertUpdateObj['unit']=resDatasUs['unit'];
                                             insertUpdateObj['purchase_date']=resDatasUs['purchase_date'];
                                             // insertUpdateObj['invoice_image']=resDatasUs['invoice_image'];
                                             insertUpdateObj['invoice_quantity']=resDatasUs['invoice_quantity'];
                                             //insertUpdateObj['digital_sign']=resDatasUs['digital_sign'];
                                             insertUpdateObj['additional_comments']=resDatasUs['additional_comments'];
                                             insertUpdateObj['points']=resDatasUs['points'];
                                             insertUpdateObj['updated_by']=resDatasUs['updated_by'];
                                          //  insertUpdateObj['assigned_to']=resDatasUs['assigned_to'];
                                             insertUpdateObj['local_updated_date']=resDatasUs['local_updated_date'];
                                             insertUpdateObj['latitude']=resDatasUs['latitude'];
                                             insertUpdateObj['longitude']=resDatasUs['longitude'];
                                             insertUpdateObj['local_created_date']=resDatasUs['local_created_date'];
                                             insertUpdateObj['created_by']=resDatasUs['created_by'];
                                             insertUpdateObj['generated_by']=resDatasUs['generated_by'];
                                             // insertUpdateObj['invoice_image']=resDatasUs['invoice_image'];
                                             // insertUpdateObj['digital_sign']=resDatasUs['digital_sign'];
                                             if( this.platform.is('ios') ) {
                                                 allFileObjeArr['invoice_image']=(resDatasUs['invoice_image'] && resDatasUs['invoice_image']!="")?this.alterimgPath(resDatasUs['invoice_image']):"";
                                                 allFileObjeArr['digital_sign']=(resDatasUs['digital_sign'] && resDatasUs['digital_sign']!="")?this.alterimgPath(resDatasUs['digital_sign']):"";
                                             } else {
                                                 allFileObjeArr['invoice_image']=resDatasUs['invoice_image'];
                                                 allFileObjeArr['digital_sign']=resDatasUs['digital_sign'];
                                             }
                                          
                                             if(resDatasUs['server_receipt_id']>0){
                                                  receipt_id=resDatasUs['server_receipt_id'];
                                             }else{
                                                 
                                            }

                                          this.uploadLocalFileToServer(allFileObjeArr).then((allFileObjeArrRet)=>{

                                                  // allFileObjeArrRet
                                                     if(allFileObjeArrRet['invoice_image'].length>0){
                                                         insertUpdateObj['invoice_image']=JSON.stringify(allFileObjeArrRet['invoice_image']);
                                                     }
                                                     if(allFileObjeArrRet['digital_sign'].length>0){
                                                         insertUpdateObj['digital_sign']=JSON.stringify(allFileObjeArrRet['digital_sign']);
                                                     }

                                                     let updateDataObj={};
                                                     updateDataObj['sync_status']=2;
                                                     let whereCond=" receipt_id="+resDatasUs['receipt_id'];
                                                     console.log("up sync data updated with sync_status = 2 start");

                                                     this.updateData(updateDataObj,tableName,whereCond).then(()=>{
                                                         console.log("up sync data updated with sync_status = 2 success");
                                                         
                                                         this.appProdApi.addEditProductReceipt(insertUpdateObj,receipt_id).subscribe((resSSSData:any)=>{
                                                             console.log("up sync of product receipt to api completed");
                                                             console.log('resSSSData',resSSSData);
                                                            
                                                             if(allFileObjeArrRet['invoice_image'].length>0){
                                                                 updateDataObj['invoice_image']=insertUpdateObj['invoice_image'];
                                                             }
                                                             if(allFileObjeArrRet['digital_sign'].length>0){
                                                                 updateDataObj['digital_sign']=insertUpdateObj['digital_sign'];
                                                             }
                                                             
                                                             updateDataObj['server_hpb_id']=resltData['h_serverId'];
                                                             updateDataObj['server_project_id']=resltData['p_serverId'];
                                                             updateDataObj['server_receipt_id']=resSSSData['result']['id']?resSSSData['result']['id']:0;
                                                             updateDataObj['updated_date']=resSSSData['result']['updated_date']?resSSSData['result']['updated_date']:0;
                                                             updateDataObj['sync_status']=1;
                                                             // let whereCond=" receipt_id="+resDatasUs['receipt_id'];
                                                             this.updateData(updateDataObj,tableName,whereCond).then(()=>{
                                                                 console.log("up sync of product receipt updated into table with sync_status=1 successfully");
                                                                 callbackUss();
                                                             },()=>{
                                                                 console.log("up sync of product receipt updated into table with sync_status=1 failure");
                                                                 callbackUss();
                                                             });
                                                          
                                                         },(errSSS)=>{
                                                             console.log("up sync of product receipt to api failure");
                                                             console.log('errSSS',errSSS);
                                                             callbackUss();
                                                         });
                                                     },(error)=>{
                                                         console.log("up sync data updated with sync_status = 2 failure");
                                                         callbackUss();
                                                     });
                                         },()=>{
                                                 callbackUss();
                                         });

                                      } 

                                     },(err)=>{
                                             callbackUss();
                                     });

                                 // here         
                                     
                          },(errSSS)=>{

                            // resolve(true); 
                            callback0();
                         });

                         
                 },(errorU)=>{
                         console.log('errorU',errorU);
                         //resolve(true); 
                         callback0();
                 });
  
          },(endSync0)=>{
              this.syncReceiptsUpSync2RunningFlag=false;
              resolve(true);
          });
  
  
      });   
      
  }

syncReceiptsD():any{
  
    return  new Promise(async (resolve,reject)=>{

            console.log("<================syncReceiptsD=============>");

            if(globalInternetCheckConnection==false){
                    this.showSyncToast(ALL_MESSAGE.COMMON_MESSAGE.SYNC_NO_FAILED_INTERNET);
                    reject(true);
                    return false;
            }

            if(this.syncReceiptsDRunningFlag){
                reject(true);
                return false;
            }

            this.syncReceiptsDRunningFlag=true;
            let allProjectsData:any =   await this.syncReceiptProjectGet();
            console.log('allProjectsData',allProjectsData);
            async.each(allProjectsData,(cProjectObj,callback0)=>{
            let cProjectId=cProjectObj['server_project_id'];
            let cLProjectId=cProjectObj['project_id'];
            let tableName='product_receipt_master';
            let filterS={};
            let query="SELECT * FROM "+tableName+" WHERE server_project_id="+cProjectId+" ORDER BY updated_date desc LIMIT 1";
            let userId=sessionUserGlobalData['userId'];
                
            this.queryExecuteSql(query,[]).then((resPSQLData:any)=>{
                
                let updated_date=1;
                if(resPSQLData.rows.length>0){
                    let currUpData = resPSQLData.rows.item(0);
                    updated_date=currUpData['updated_date'];
                }
               
                this.appProdApi.getProductReceipt(null,null,cProjectId,null,null,null,null,null,null,null,null,updated_date).subscribe((respDatas:any)=>{


                    let responseResults = respDatas['result']?respDatas['result']:[];

                    // DownSync Start
                    
                    async.each(responseResults,(respData,callback:any)=>{
                        
                      
                        let sQuery="SELECT * FROM "+tableName+" WHERE server_receipt_id="+respData['receipt_id']+"";
                        this.queryExecuteSql(sQuery,[]).then((resQuData:any)=>{

                         
                             if(resQuData.rows.length > 0){
                                    
                                 
                                  
                                            let locaDataRow=resQuData.rows.item(0);
                                            let updateObj={};
                                            let allFileObjeArr = {};

                                            if(locaDataRow['sync_status']==1 || locaDataRow['sync_status']==2){
                                                updateObj['server_receipt_id']=respData['receipt_id'];
                                                updateObj['server_hpb_id']=respData['hpb_id'];
                                                updateObj['hpb_status']=respData['hpb_status'];
                                                updateObj['server_project_id']=respData['project_id'];
                                                updateObj['product_id']=respData['product_id'];
                                                updateObj['rds_id']=respData['rds_id'];
                                                updateObj['quantity']=respData['quantity'];
                                                updateObj['unit']=respData['unit'];
                                                updateObj['purchase_date']=respData['purchase_date'];
                                                updateObj['invoice_image']=respData['invoice_image'];
                                                if(locaDataRow['invoice_image']!=respData['invoice_image']){
                                                    allFileObjeArr['invoice_image']=respData['invoice_image'];
                                                }
                                                updateObj['invoice_quantity']=respData['invoice_quantity'];
                                                updateObj['digital_sign']=respData['digital_sign'];
                                                if(locaDataRow['digital_sign']!=respData['digital_sign']){
                                                    allFileObjeArr['digital_sign']=respData['digital_sign'];
                                                }
                                                updateObj['additional_comments']=respData['additional_comments'];
                                                updateObj['points']=respData['points'];
                                                updateObj['latitude']=respData['latitude'];
                                                updateObj['longitude']=respData['longitude'];
                                                updateObj['created_date']=respData['created_date'];
                                                updateObj['updated_date']=respData['updated_date'];
                                                updateObj['created_by']=respData['created_by'];
                                                updateObj['updated_by']=respData['updated_by'];
                                                updateObj['generated_by']=respData['generated_by'];
                                                updateObj['local_updated_date']=respData['local_updated_date'];
                                                updateObj['status']=respData['status'];
                                            }

                                           
                                            updateObj['ext_data']="";
                                            let whereCon=" server_receipt_id="+respData['receipt_id']+" ";

                                            this.downloadServerFileToLocal(allFileObjeArr).then((allFileObjeArrRet)=>{
                   
                                                if(locaDataRow['invoice_image']!=respData['invoice_image']){
                                                     updateObj['invoice_image']=JSON.stringify(allFileObjeArrRet['invoice_image']);
                                                }
                                                if(locaDataRow['digital_sign']!=respData['digital_sign']){
                                                     updateObj['digital_sign']=JSON.stringify(allFileObjeArrRet['digital_sign']);
                                                }
                                                this.updateData(updateObj,tableName,whereCon).then((resInsData)=>{
                                                    callback();
                                                },(err)=>{
                                                   callback();
                                                }); 

                                            },(errDDDDD)=>{
                                             callback();
                                            });
                                  


                            }else{

                                    
                                this.syncProductReqProjHpbLocalIdToServerIdFetch(respData['project_id'],respData['hpb_id'],'server').then((resltData:any)=>{
                                      console.log('syncProductReqProjHpbLocalIdToServerIdFetch server',resltData);
                                    if(resltData['p_localId']==0 || resltData['p_serverId']==0){
                                        callback();
                                    }else{

                                    
                                        let insertObj={};
                                            insertObj['server_receipt_id']=respData['receipt_id'];
                                            insertObj['server_hpb_id']=resltData['h_serverId'];
                                            insertObj['hpb_id']=resltData['h_localId'];
                                            insertObj['hpb_status']=respData['hpb_status'];
                                            insertObj['server_project_id']=resltData['p_serverId'];
                                            insertObj['project_id']=resltData['p_localId'];
                                            insertObj['product_id']=respData['product_id'];
                                            insertObj['rds_id']=respData['rds_id'];
                                            insertObj['quantity']=respData['quantity'];
                                            insertObj['unit']=respData['unit'];
                                            insertObj['purchase_date']=respData['purchase_date'];
                                            insertObj['invoice_image']=respData['invoice_image'];
                                            insertObj['invoice_quantity']=respData['invoice_quantity'];
                                            insertObj['digital_sign']=respData['digital_sign'];
                                            insertObj['additional_comments']=respData['additional_comments'];
                                            insertObj['points']=respData['points'];
                                            insertObj['latitude']=respData['latitude'];
                                            insertObj['longitude']=respData['longitude'];
                                            insertObj['created_date']=respData['created_date'];
                                            insertObj['updated_date']=respData['updated_date'];
                                            insertObj['created_by']=respData['created_by'];
                                            insertObj['updated_by']=respData['updated_by'];
                                            insertObj['generated_by']=respData['generated_by'];
                                            insertObj['local_updated_date']=respData['local_updated_date'];
                                            insertObj['local_created_date']=respData['local_created_date'];
                                            insertObj['status']=respData['status'];
                                            insertObj['sync_status']=1;
                                            insertObj['ext_data']="";

                                            let allFileObjeArr = {};
                                            allFileObjeArr['invoice_image']=respData['invoice_image'];
                                            allFileObjeArr['digital_sign']=respData['digital_sign'];
                                        
                                            this.downloadServerFileToLocal(allFileObjeArr).then((allFileObjeArrRet)=>{

                                                insertObj['invoice_image']=JSON.stringify(allFileObjeArrRet['invoice_image']);
                                                insertObj['digital_sign']=JSON.stringify(allFileObjeArrRet['digital_sign']);
                                                
                                                this.insertData(insertObj,tableName).then((resInsData)=>{
                                                        callback();
                                                    },(err)=>{
                                                        callback();
                                                });

                                            },(errDDD)=>{

                                                callback();

                                            });

                                }


                                  },(err)=>{
                                        callback();
                                  });

                        

                            }
                            

                        },(errChild)=>{
                                callback();
                        });

                    
                  },(err)=>{
                        

                        // UpSync Start
                        
                        let queryU="SELECT * FROM "+tableName+" WHERE sync_status=0 AND project_id="+cLProjectId;
                        console.log("syncReceiptsD UpSync Start queryU=>",queryU);

                            this.queryExecuteSql(queryU,[]).then((resDataU:any)=>{
                                    console.log('queryU resDataU',resDataU.rows.length);

                                    let resDatasUss=[];
                                    for(let m=0;m<resDataU.rows.length;m++){
                                        resDatasUss.push(resDataU.rows.item(m));
                                    }
                                    
                                     async.each(resDatasUss,(resDatasUs,callbackUss)=>{

                                                    let receipt_id=0;
                                                    let insertUpdateObj={};
                                                    let allFileObjeArr = {};
                                                this.syncProductReqProjHpbLocalIdToServerIdFetch(resDatasUs['project_id'],resDatasUs['hpb_id'],'local').then((resltData:any)=>{
                                                    console.log('syncProductReqProjHpbLocalIdToServerIdFetch local',resltData);
                                                    if(resltData['p_localId']==0 || resltData['p_serverId']==0){
                                                      callbackUss();
                                                    }else{

                                                       
                                                        insertUpdateObj['hpb_id']=resltData['h_serverId'];
                                                        insertUpdateObj['project_id']=resltData['p_serverId'];
                                                        insertUpdateObj['hpb_status']=resDatasUs['hpb_status'];
                                                        insertUpdateObj['product_id']=resDatasUs['product_id'];
                                                        insertUpdateObj['rds_id']=resDatasUs['rds_id'];
                                                        insertUpdateObj['quantity']=resDatasUs['quantity'];
                                                        insertUpdateObj['unit']=resDatasUs['unit'];
                                                        insertUpdateObj['purchase_date']=resDatasUs['purchase_date'];
                                                        // insertUpdateObj['invoice_image']=resDatasUs['invoice_image'];
                                                        insertUpdateObj['invoice_quantity']=resDatasUs['invoice_quantity'];
                                                        //insertUpdateObj['digital_sign']=resDatasUs['digital_sign'];
                                                        insertUpdateObj['additional_comments']=resDatasUs['additional_comments'];
                                                        insertUpdateObj['points']=resDatasUs['points'];
                                                        insertUpdateObj['updated_by']=resDatasUs['updated_by'];
                                                     //  insertUpdateObj['assigned_to']=resDatasUs['assigned_to'];
                                                        insertUpdateObj['local_updated_date']=resDatasUs['local_updated_date'];
                                                        insertUpdateObj['latitude']=resDatasUs['latitude'];
                                                        insertUpdateObj['longitude']=resDatasUs['longitude'];
                                                        insertUpdateObj['local_created_date']=resDatasUs['local_created_date'];
                                                        insertUpdateObj['created_by']=resDatasUs['created_by'];
                                                        insertUpdateObj['generated_by']=resDatasUs['generated_by'];
                                                        // insertUpdateObj['invoice_image']=resDatasUs['invoice_image'];
                                                        // insertUpdateObj['digital_sign']=resDatasUs['digital_sign'];
                                                        if( this.platform.is('ios') ) {
                                                            allFileObjeArr['invoice_image']=(resDatasUs['invoice_image'] && resDatasUs['invoice_image']!="")?this.alterimgPath(resDatasUs['invoice_image']):"";
                                                            allFileObjeArr['digital_sign']=(resDatasUs['digital_sign'] && resDatasUs['digital_sign']!="")?this.alterimgPath(resDatasUs['digital_sign']):"";
                                                        } else {
                                                            allFileObjeArr['invoice_image']=resDatasUs['invoice_image'];
                                                            allFileObjeArr['digital_sign']=resDatasUs['digital_sign'];
                                                        }
                                                     
                                                        if(resDatasUs['server_receipt_id']>0){
                                                             receipt_id=resDatasUs['server_receipt_id'];
                                                        }else{
                                                            
                                                       }

                                                     this.uploadLocalFileToServer(allFileObjeArr).then((allFileObjeArrRet)=>{

                                                             // allFileObjeArrRet
                                                                if(allFileObjeArrRet['invoice_image'].length>0){
                                                                    insertUpdateObj['invoice_image']=JSON.stringify(allFileObjeArrRet['invoice_image']);
                                                                }
                                                                if(allFileObjeArrRet['digital_sign'].length>0){
                                                                    insertUpdateObj['digital_sign']=JSON.stringify(allFileObjeArrRet['digital_sign']);
                                                                }

                                                                let updateDataObj={};
                                                                updateDataObj['sync_status']=2;
                                                                let whereCond=" receipt_id="+resDatasUs['receipt_id'];
                                                                console.log("up sync data updated with sync_status = 2 start");

                                                                this.updateData(updateDataObj,tableName,whereCond).then(()=>{
                                                                    console.log("up sync data updated with sync_status = 2 success");
                                                                    
                                                                    this.appProdApi.addEditProductReceipt(insertUpdateObj,receipt_id).subscribe((resSSSData:any)=>{
                                                                        console.log("up sync of product receipt to api completed");
                                                                        console.log('resSSSData',resSSSData);
                                                                       
                                                                        if(allFileObjeArrRet['invoice_image'].length>0){
                                                                            updateDataObj['invoice_image']=insertUpdateObj['invoice_image'];
                                                                        }
                                                                        if(allFileObjeArrRet['digital_sign'].length>0){
                                                                            updateDataObj['digital_sign']=insertUpdateObj['digital_sign'];
                                                                        }
                                                                        
                                                                        updateDataObj['server_hpb_id']=resltData['h_serverId'];
                                                                        updateDataObj['server_project_id']=resltData['p_serverId'];
                                                                        updateDataObj['server_receipt_id']=resSSSData['result']['id']?resSSSData['result']['id']:0;
                                                                        updateDataObj['updated_date']=resSSSData['result']['updated_date']?resSSSData['result']['updated_date']:0;
                                                                        updateDataObj['sync_status']=1;
                                                                        // let whereCond=" receipt_id="+resDatasUs['receipt_id'];
                                                                        this.updateData(updateDataObj,tableName,whereCond).then(()=>{
                                                                            console.log("up sync of product receipt updated into table with sync_status=1 successfully");
                                                                            callbackUss();
                                                                        },()=>{
                                                                            console.log("up sync of product receipt updated into table with sync_status=1 failure");
                                                                            callbackUss();
                                                                        });
                                                                     
                                                                    },(errSSS)=>{
                                                                        console.log("up sync of product receipt to api failure");
                                                                        console.log('errSSS',errSSS);
                                                                        callbackUss();
                                                                    });
                                                                },(error)=>{
                                                                    console.log("up sync data updated with sync_status = 2 failure");
                                                                    callbackUss();
                                                                });
                                                    },()=>{
                                                            callbackUss();
                                                    });

                                                 } 

                                                },(err)=>{
                                                        callbackUss();
                                                });

                                            // here         
                                                
                                     },(errSSS)=>{

                                       // resolve(true); 
                                       callback0();
                                    });

                                    
                            },(errorU)=>{
                                    console.log('errorU',errorU);
                                    //resolve(true); 
                                    callback0();
                            });



                  });



                },(error)=>{
                     //resolve(true); 
                     callback0();
                });

            },(error)=>{
                console.log('error',error); 
                //resolve(true);
                callback0();
           });

        },(endSync0)=>{
            this.syncReceiptsDRunningFlag=false;
            resolve(true);
        });


    });   
    
}

syncReceiptsApprovalD(){
    return new Promise((resolve,reject)=>{
        if(globalInternetCheckConnection==false){
                this.showSyncToast(ALL_MESSAGE.COMMON_MESSAGE.SYNC_NO_FAILED_INTERNET);
                reject(true);
                return false;
        }

        let tableNamePP='project_master';
        let tableNameP='product_receipt_master';
        let tableName='products_receipt_approval_tbl';
        let filterS={};
        let queryPP="SELECT project_id, server_project_id FROM "+tableNamePP+"";
        

         this.queryExecuteSql(queryPP,[]).then((resDataQPP:any)=>{
             let lenResQPP=resDataQPP.rows.length;
             let resQPPS=[];
             for(let i=0;i<lenResQPP;i++){
                resQPPS.push(resDataQPP.rows.item(i));
             }

             async.each(resQPPS,(resQPP,callbackQPP)=>{

                  let project_id=resQPP['project_id'];
                  let server_project_id=resQPP['server_project_id'];
                  let queryP="SELECT receipt_id, server_receipt_id FROM "+tableNameP+" where project_id="+project_id+" or server_project_id="+server_project_id;
                    this.queryExecuteSql(queryP,[]).then((resDataQP:any)=>{
                    let lenResQP=resDataQP.rows.length;
                    let resQPS=[];
                    for(let j=0;j<lenResQP;j++){
                         resQPS.push(resDataQP.rows.item(j));
                    }

                     async.each(resQPS,(resQP,callbackQP)=>{

                        let receipt_id=resQP['receipt_id'];
                        let server_receipt_id=resQP['server_receipt_id'];
                        let query="SELECT DISTINCT receipt_id,id, server_receipt_id, updated_date FROM "+tableName+" where receipt_id="+receipt_id+" or server_receipt_id="+server_receipt_id+" GROUP BY receipt_id ORDER BY MIN(updated_date) DESC";
                        console.log('approval query tbl recipt',query);
                         this.queryExecuteSql(query,[]).then((resDataQ:any)=>{
                              let lenResQ=resDataQ.rows.length;
                              let resQS=[];
                              for(let j=0;j<lenResQ;j++){
                                  resQS.push(resDataQ.rows.item(j));
                               }
                                console.log('approval result resQS query',query);
                                console.log('approval result resQS',resQS);
                             
                                if(resQS.length>0){
                                        async.each(resQS,(resQ,callbackQ)=>{

                                                console.log('syncReceiptsApprovalDProcess resQ',resQ);
                                                this.syncReceiptsApprovalDProcess(project_id,server_project_id,receipt_id,server_receipt_id,resQ).then((dataC)=>{
                                                    callbackQ();
                                                },(errC)=>{
                                                    callbackQ();
                                                });


                                        },(errA)=>{
                                            callbackQP();
                                        }); 
                                }else{  
                                        let resQ={"id":0,"updated_date":0};
                                        this.syncReceiptsApprovalDProcess(project_id,server_project_id,receipt_id,server_receipt_id,resQ).then((dataC)=>{
                                                    callbackQP();
                                           },(errC)=>{
                                                    callbackQP();
                                         });
                                }

                                


                         },()=>{
                            callbackQP();
                         });


                     },(errAP)=>{
                         callbackQPP();
                     });


                 },(errSP)=>{
                      callbackQPP();  
                 });


             },(errAPP)=>{
                resolve(true);
             });

               
         },(errSPP)=>{
            reject(true);
        });

        
     });
}

syncReceiptsApprovalDProcess(project_id,server_project_id,receipt_id,server_receipt_id,resQ){
       return new Promise((resolve,reject)=>{

            if(server_receipt_id==0){
                resolve(true);
                return 
            }

            let tableName="products_receipt_approval_tbl";
            let s_receipt_id=server_receipt_id;
            let updated_date=1;
            let local_id = resQ['id'];
            if(resQ['updated_date'] > 0){
                 // updated_date=resQ['updated_date'];
            }
            this.appProdRecApproval.getProductReceiptApproval(null,s_receipt_id,null,null,null,null,updated_date).subscribe((respDatas:any)=>{
                       let responseResults = respDatas['result']?respDatas['result']:[];
                        async.each(responseResults,(respData,callback:any)=>{

                                    let sQuery="SELECT * FROM "+tableName+" WHERE server_id="+respData['id']+"";
                                    this.queryExecuteSql(sQuery,[]).then((resQuData:any)=>{
                                    
                                    if(resQuData.rows.length > 0){

                                            let locaDataRow=resQuData.rows.item(0);
                                            let updateObj={};
                                            let allFileObjeArr = {};

                                            if(locaDataRow['sync_status']==1){
                                                updateObj['server_receipt_id']=respData['receipt_id'];
                                                updateObj['approval_status']=respData['approval_status'];
                                                updateObj['approved_by']=respData['approved_by'];
                                                updateObj['approval_role']=respData['approval_role'];
                                                updateObj['rejection_reason']=respData['rejection_reason'];
                                                updateObj['is_closed']=respData['is_closed'];
                                                updateObj['created_date']=respData['created_date'];
                                                updateObj['updated_date']=respData['updated_date'];
                                                updateObj['created_by']=respData['created_by'];
                                                updateObj['updated_by']=respData['updated_by'];
                                                updateObj['local_updated_date']=respData['local_updated_date'];
                                            }                                           
                                            updateObj['ext_data']="";
                                            let whereCon=" server_id="+respData['id']+" ";
                                            this.downloadServerFileToLocal(allFileObjeArr).then((allFileObjeArrRet)=>{

                                                this.updateData(updateObj,tableName,whereCon).then((resInsData)=>{
                                                    callback();
                                                },(err)=>{
                                                    callback();
                                                }); 

                                            },(errDDDDD)=>{
                                               callback();
                                            });

                                    }else{


                                            let insertObj={};
                                            insertObj['server_id']=respData['id'];
                                            insertObj['server_receipt_id']=respData['receipt_id'];
                                            insertObj['receipt_id']=receipt_id;
                                            insertObj['approval_status']=respData['approval_status'];
                                            insertObj['approved_by']=respData['approved_by'];
                                            insertObj['approval_role']=respData['approval_role'];
                                            insertObj['rejection_reason']=respData['rejection_reason'];
                                            insertObj['is_closed']=respData['is_closed'];
                                            insertObj['created_date']=respData['created_date'];
                                            insertObj['updated_date']=respData['updated_date'];
                                            insertObj['created_by']=respData['created_by'];
                                            insertObj['updated_by']=respData['updated_by'];
                                            insertObj['local_created_date']=respData['local_created_date'];
                                            insertObj['local_updated_date']=respData['local_updated_date'];

                                            insertObj['sync_status']=1;
                                            insertObj['ext_data']="";

                                            let allFileObjeArr = {};


                                            this.downloadServerFileToLocal(allFileObjeArr).then((allFileObjeArrRet)=>{

                                            this.insertData(insertObj,tableName).then((resInsData)=>{
                                            callback();
                                            },(err)=>{
                                            callback();
                                            });

                                            },(errDDD)=>{

                                            callback();

                                            });
                                    }

                                    },(errChild)=>{
                                        callback();
                                    });                    

                                },(error2)=>{

                                    let queryU="SELECT * FROM "+tableName+" WHERE sync_status=0 and receipt_id="+receipt_id+"";
                                    this.queryExecuteSql(queryU,[]).then((resDataU:any)=>{
                                            let resDatasUss=[];
                                            for(let m=0;m<resDataU.rows.length;m++){
                                                resDatasUss.push(resDataU.rows.item(m));
                                            }

                                            async.each(resDatasUss,(resDatasUs,callbackUss)=>{


                                                        let id=0;
                                                        let insertUpdateObj={};

                                                     
                                                        insertUpdateObj['receipt_id']=server_receipt_id;
                                                        insertUpdateObj['approval_status']=resDatasUs['approval_status'];
                                                        insertUpdateObj['approved_by']=resDatasUs['approved_by'];
                                                        insertUpdateObj['approval_role']=resDatasUs['approval_role'];
                                                        insertUpdateObj['rejection_reason']=resDatasUs['rejection_reason'];
                                                        insertUpdateObj['is_closed']=resDatasUs['is_closed'];                                                      
                                                        insertUpdateObj['created_by']=resDatasUs['created_by'];
                                                        insertUpdateObj['updated_by']=resDatasUs['updated_by'];
                                                        insertUpdateObj['local_created_date']=resDatasUs['local_created_date'];
                                                        insertUpdateObj['local_updated_date']=resDatasUs['local_updated_date'];

                                                        
                                                        if(resDatasUs['server_id']>0){
                                                            id=resDatasUs['server_id'];
                                                        }else{
                                                            insertUpdateObj['local_created_date']=resDatasUs['local_created_date'];
                                                            insertUpdateObj['created_by']=resDatasUs['created_by'];
                                                        }


                                                        let allFileObjeArr = {};
                                                      
                                                        this.uploadLocalFileToServer(allFileObjeArr).then((allFileObjeArrRet)=>{

                                                                console.log('id addEditProdReceiptApproval',id);
                                                                this.appProdRecApproval.addEditProdReceiptApproval(insertUpdateObj,id).subscribe((resSSSData:any)=>{
                                                                        console.log('resSSSData',resSSSData);
                                                                        let updateDataObj={};
                                                                        updateDataObj['server_id']=resSSSData['result']['id']?resSSSData['result']['id']:0;
                                                                        updateDataObj['updated_date']=resSSSData['result']['updated_date']?resSSSData['result']['updated_date']:0;
                                                                        updateDataObj['server_receipt_id']=server_receipt_id;
                                                                        updateDataObj['sync_status']=1;
                                                                        let whereCond=" id="+resDatasUs['id'];
                                                                        this.updateData(updateDataObj,tableName,whereCond).then(()=>{
                                                                            
                                                                            callbackUss();

                                                                        },()=>{
                                                                            callbackUss();

                                                                        });

                                                                        
                                                                },(errSSS)=>{
                                                                        console.log('errSSS',errSSS);
                                                                        callbackUss();
                                                                });


                                                            },()=>{
                                                                    callbackUss();
                                                        });


                                            },(error3)=>{
                                                resolve(true);    
                                            });


                                    },(errorU)=>{
                                            console.log('errorU',errorU);
                                             resolve(true);
                                    });

                                });
                //resolve(true);

            },(err)=>{
                reject(true);
            });

            
       });
}

syncSrkuApprovalD(){
  
     return new Promise((resolve,reject)=>{
                  if(globalInternetCheckConnection==false){
                            this.showSyncToast(ALL_MESSAGE.COMMON_MESSAGE.SYNC_NO_FAILED_INTERNET);
                            reject(true);
                            return false;
                   }

                  let tableNameP='project_master';
                  let tableName='srku_approval_status_tbl';
                  let filterS={};
                  let queryP="SELECT project_id, server_project_id FROM "+tableNameP+"";
                    this.queryExecuteSql(queryP,[]).then((resDataQP:any)=>{
                    let lenResQP=resDataQP.rows.length;
                    let resQPS=[];
                    for(let j=0;j<lenResQP;j++){
                         resQPS.push(resDataQP.rows.item(j));
                    }

                     async.each(resQPS,(resQP,callbackQP)=>{

                        let project_id=resQP['project_id'];
                        let server_project_id=resQP['server_project_id'];
                        let query="SELECT srku_approval_id, updated_date FROM "+tableName+" where project_id="+project_id+" or server_project_id="+server_project_id+" ORDER BY updated_date desc LIMIT 1";
                        console.log('approval query tbl srku',query);
                         this.queryExecuteSql(query,[]).then((resDataQ:any)=>{
                              let lenResQ=resDataQ.rows.length;
                              let resQS=[];
                              for(let j=0;j<lenResQ;j++){
                                  resQS.push(resDataQ.rows.item(j));
                               }
                                console.log('approval result srku resQS query',query);
                                console.log('approval result srku resQS',resQS);

                                if(resQS.length>0){
                                        async.each(resQS,(resQ,callbackQ)=>{

                                                console.log('syncReceiptsApprovalDProcess resQ',resQ);
                                                this.syncSrkuApprovalDProcess(project_id,server_project_id,resQ).then((dataC)=>{
                                                    callbackQ();
                                                },(errC)=>{
                                                    callbackQ();
                                                });


                                        },(errA)=>{
                                            callbackQP();
                                        }); 
                                }else{
                                        let resQ={srku_approval_id:0,updated_date:0};
                                        this.syncSrkuApprovalDProcess(project_id,server_project_id,resQ).then((dataC)=>{
                                                    callbackQP();
                                                },(errC)=>{
                                                    callbackQP();
                                         });
                                }

                                



                         },()=>{
                            callbackQP();
                         });


                     },(errAP)=>{
                         resolve(true);
                     });


                 },(errSP)=>{
                      resolve(true);  
                 });

     });

}

syncSrkuApprovalDProcess(project_id,server_project_id,resQ){
       return new Promise((resolve,reject)=>{
        
        
          if(server_project_id==0 || !server_project_id){
                resolve(true);
                return 
          }


     
           console.log('resQ',resQ);
            let tableName="srku_approval_status_tbl";
            let s_project_id=server_project_id;
            let updated_date=1;
            let local_id = resQ['srku_approval_id'];
            if(resQ['updated_date'] > 0){
                   //     updated_date=resQ['updated_date'];
            }
            this.appSrkuApproval.getSrkuApproval(null,s_project_id,null,null,null,null,updated_date).subscribe((respDatas:any)=>{


                       let responseResults = respDatas['result']?respDatas['result']:[];
                        async.each(responseResults,(respData,callback:any)=>{

                                    let sQuery="SELECT * FROM "+tableName+" WHERE server_srku_approval_id="+respData['srku_approval_id']+"";
                                    this.queryExecuteSql(sQuery,[]).then((resQuData:any)=>{

                                    if(resQuData.rows.length > 0){

                                            let locaDataRow=resQuData.rows.item(0);
                                            let updateObj={};
                                            let allFileObjeArr = {};

                                            if(locaDataRow['sync_status']==1){
                                                updateObj['server_srku_approval_id']=respData['srku_approval_id'];
                                                updateObj['server_project_id']=server_project_id;
                                                updateObj['srku_approval_status']=respData['srku_approval_status'];
                                                updateObj['srku_rejection_reason']=respData['srku_rejection_reason'];
                                                updateObj['approved_by']=respData['approved_by'];
                                                updateObj['is_closed']=respData['is_closed'];
                                                updateObj['created_date']=respData['created_date'];
                                                updateObj['updated_date']=respData['updated_date'];
                                                updateObj['local_updated_date']=respData['local_updated_date'];
                                            }
                                            
                                           
                                            updateObj['ext_data']="";
                                            let whereCon=" srku_approval_id="+locaDataRow['srku_approval_id']+" ";

                                            this.downloadServerFileToLocal(allFileObjeArr).then((allFileObjeArrRet)=>{
                                            this.updateData(updateObj,tableName,whereCon).then((resInsData)=>{
                                            callback();
                                            },(err)=>{
                                            callback();
                                            }); 

                                            },(errDDDDD)=>{
                                            callback();
                                            });




                                    }else{


                                            let insertObj={};
                                            insertObj['server_srku_approval_id']=respData['srku_approval_id'];
                                            insertObj['project_id']=project_id;
                                            insertObj['server_project_id']=server_project_id;
                                            insertObj['srku_approval_status']=respData['srku_approval_status'];
                                            insertObj['srku_rejection_reason']=respData['srku_rejection_reason'];
                                            insertObj['approved_by']=respData['approved_by'];
                                            insertObj['is_closed']=respData['is_closed'];
                                            insertObj['created_date']=respData['created_date'];
                                            insertObj['updated_date']=respData['updated_date'];
                                            insertObj['local_created_date']=respData['local_created_date'];
                                            insertObj['local_updated_date']=respData['local_updated_date'];
                                            insertObj['sync_status']=1;
                                            insertObj['ext_data']="";

                                            let allFileObjeArr = {};


                                            this.downloadServerFileToLocal(allFileObjeArr).then((allFileObjeArrRet)=>{


                                            this.insertData(insertObj,tableName).then((resInsData)=>{
                                            callback();
                                            },(err)=>{
                                            callback();
                                            });

                                            },(errDDD)=>{

                                            callback();

                                            });
                                    }

                                    },(errChild)=>{
                                        callback();
                                    });                    

                                },(error2)=>{

                                    let queryU="SELECT * FROM "+tableName+" WHERE sync_status=0 and project_id="+project_id+"";
                                    this.queryExecuteSql(queryU,[]).then((resDataU:any)=>{
                                            let resDatasUss=[];
                                            for(let m=0;m<resDataU.rows.length;m++){
                                                resDatasUss.push(resDataU.rows.item(m));
                                            }

                                            async.each(resDatasUss,(resDatasUs,callbackUss)=>{


                                                        let srku_approval_id=0;
                                                        let insertUpdateObj={};

                                                     

                                                        insertUpdateObj['project_id']=server_project_id;
                                                        insertUpdateObj['srku_approval_status']=resDatasUs['srku_approval_status'];
                                                        insertUpdateObj['srku_rejection_reason']=resDatasUs['srku_rejection_reason'];
                                                        insertUpdateObj['approved_by']=resDatasUs['approved_by'];
                                                        insertUpdateObj['local_created_date']=resDatasUs['local_created_date'];
                                                        insertUpdateObj['local_updated_date']=resDatasUs['local_updated_date'];
                                                        insertUpdateObj['is_closed']=resDatasUs['is_closed'];
                                                        
                                                        if(resDatasUs['server_srku_approval_id']>0){
                                                            srku_approval_id=resDatasUs['server_srku_approval_id'];
                                                        }else{
                                                            insertUpdateObj['local_created_date']=resDatasUs['local_created_date'];
                                                           
                                                        }


                                                        let allFileObjeArr = {};
                                                      
                                                        this.uploadLocalFileToServer(allFileObjeArr).then((allFileObjeArrRet)=>{

                                                                console.log('srku_approval_id addEditProdReceiptApproval',srku_approval_id);
                                                                this.appSrkuApproval.addEditSrkuApproval(insertUpdateObj,srku_approval_id).subscribe((resSSSData:any)=>{
                                                                        console.log('resSSSData',resSSSData);
                                                                        let updateDataObj={};
                                                                        updateDataObj['server_srku_approval_id']=resSSSData['result']['id']?resSSSData['result']['id']:0;
                                                                        updateDataObj['updated_date']=resSSSData['result']['updated_date']?resSSSData['result']['updated_date']:0;
                                                                        updateDataObj['server_project_id']=server_project_id;
                                                                        updateDataObj['sync_status']=1;
                                                                        let whereCond=" srku_approval_id="+resDatasUs['srku_approval_id'];
                                                                        this.updateData(updateDataObj,tableName,whereCond).then(()=>{
                                                                            
                                                                            callbackUss();
                                                                        },()=>{
                                                                            callbackUss();
                                                                        });

                                                                        
                                                                },(errSSS)=>{
                                                                        console.log('errSSS',errSSS);
                                                                        callbackUss();
                                                                });


                                                            },()=>{
                                                                    callbackUss();
                                                        });


                                            },(error3)=>{
                                                resolve(true);    
                                            });


                                    },(errorU)=>{
                                            console.log('errorU',errorU);
                                             resolve(true);
                                    });

                                });
                //resolve(true);

            },(err)=>{
                reject(true);
            });

            
       });
}

syncRDSVisitAndStock(){
    return new Promise((resolve,reject)=>{

            if(globalInternetCheckConnection==false){
                this.showSyncToast(ALL_MESSAGE.COMMON_MESSAGE.SYNC_NO_FAILED_INTERNET);
                reject(true);
                return false;
            }

            if(this.syncRDSVisitAndStockRunningFlag){
                //this.showSyncToast(ALL_MESSAGE.COMMON_MESSAGE.SYNC_RUN_GLOABL_INTERNET);
                reject(true);
                return false;
            }
            this.syncRDSVisitAndStockRunningFlag=true;
            this.syncRDSVisitD().then(()=>{

                this.syncRetCurSkD().then(()=>{
                    this.syncRDSVisitAndStockRunningFlag=false;
                    resolve(true);
                },(error1)=>{
                    this.syncRDSVisitAndStockRunningFlag=false;
                    resolve(true);
                });

            },(error)=>{

                 this.syncRetCurSkD().then(()=>{
                    this.syncRDSVisitAndStockRunningFlag=false;
                    resolve(true);
                },(error1)=>{
                    this.syncRDSVisitAndStockRunningFlag=false;
                    resolve(true);
                });


            });

    });
}

syncRDSVisitD(){

     return new Promise((resolve,reject)=>{
       
        if(globalInternetCheckConnection==false){
                this.showSyncToast(ALL_MESSAGE.COMMON_MESSAGE.SYNC_NO_FAILED_INTERNET);
                reject(true);
                return false;
        }
       
        this.rdsVisitUpdatedORInsertedIds=[];
        let tableName='rds_visit';
        let filterS={};
        let query="SELECT * FROM "+tableName+" ORDER BY updated_date desc LIMIT 1";

        this.queryExecuteSql(query,[]).then((resDataQ:any)=>{
                let filterDataH={};
              
                filterDataH['created_by']=sessionUserGlobalData['userId'];
                console.log('resDataQ',resDataQ);
                 if(resDataQ.rows.length > 0){
                    let tmpDataObj=resDataQ.rows.item(0);
                    filterDataH['updated_date']=tmpDataObj['updated_date'];
                }

                this.appRdsVisitApi.getRdsVisit(null,null,null,filterDataH['created_by'],filterDataH['updated_date']).subscribe((respDatas:any)=>{
                    
                    console.log('respDatas',respDatas);

                    let responseResults = respDatas['result'];

                    console.log('responseResults',responseResults);

                    // DownSync Start
                    
                    async.each(responseResults,(respData,callback:any)=>{
                        
                        console.log('DownSync each respData',respData);

                        let sQuery="SELECT * FROM "+tableName+" WHERE server_rds_visit_id="+respData['rds_visit_id']+"";
                        
                        this.queryExecuteSql(sQuery,[]).then((resQuData:any)=>{

                            console.log('queryExecuteSql resQuData',resQuData);

                            if(resQuData.rows.length > 0){
                                    
                                    let locaDataRow=resQuData.rows.item(0);

                                    console.log('locaDataRow',locaDataRow);

                                    let updateObj={};
                                    let syncStatus=1;
                                    
                                    if(locaDataRow['sync_status']==1){
                                        updateObj['server_rds_visit_id']=respData['rds_visit_id'];
                                        updateObj['rds_id']=respData['rds_id'];
                                        updateObj['visit_date']=respData['visit_date'];
                                        updateObj['additional_comments']=respData['additional_comments'];
                                        updateObj['latitude']=respData['latitude'];
                                        updateObj['longitude']=respData['longitude'];
                                        updateObj['created_date']=respData['created_date'];
                                        updateObj['updated_date']=respData['updated_date'];
                                        updateObj['created_by']=respData['created_by'];
                                        updateObj['updated_by']=respData['updated_by'];
                                        updateObj['local_updated_date']=respData['local_updated_date'];
                                        updateObj['local_created_date']=respData['local_created_date'];
                                        updateObj['assigned_to']=respData['assigned_to'];
                                        updateObj['generated_by']=respData['generated_by'];
                                    }


                                    updateObj['sync_status']=syncStatus;
                                    updateObj['ext_data']="";
                                    let whereCon=" server_rds_visit_id="+respData['rds_visit_id']+" ";
                                  
                                    let allFileObjeArr = {};
                                   
                                    
                                    this.downloadServerFileToLocal(allFileObjeArr).then((allFileObjeArrRet)=>{

                                       
                                        this.updateData(updateObj,tableName,whereCon).then((resInsData)=>{
                                      
                                          
                                        //  this.rdsVisitUpdatedORInsertedIds.push({
                                        //      "parent_server_id":respData['rds_visit_id'],
                                        //      "parent_local_id":locaDataRow['rds_visit_id']
                                        //  });

                                          callback();

                                        // File Save To Local IF Updated

                                        },(err)=>{

                                          callback();

                                        }); 

                                },(errDDDDD)=>{

                                     callback();

                                });
                                  
                                  


                            }else{


                                    let insertObj={};
                                    insertObj['server_rds_visit_id']=respData['rds_visit_id'];
                                    insertObj['rds_id']=respData['rds_id'];
                                    insertObj['visit_date']=respData['visit_date'];
                                    insertObj['additional_comments']=respData['additional_comments'];
                                    insertObj['latitude']=respData['latitude'];
                                    insertObj['longitude']=respData['longitude'];
                                    insertObj['created_date']=respData['created_date'];
                                    insertObj['updated_date']=respData['updated_date'];
                                    insertObj['created_by']=respData['created_by'];
                                    insertObj['updated_by']=respData['updated_by'];
                                    insertObj['local_updated_date']=respData['local_updated_date'];
                                    insertObj['local_created_date']=respData['local_created_date'];
                                    insertObj['assigned_to']=respData['assigned_to'];
                                    insertObj['generated_by']=respData['generated_by'];


                                    if(respData['status']){
                                        insertObj['status']=respData['status'];
                                    }else{
                                         insertObj['status']=1;
                                    }
                                    insertObj['sync_status']=1;
                                    insertObj['ext_data']="";

                                    let allFileObjeArr = {};
                                    
                                   
                                    this.downloadServerFileToLocal(allFileObjeArr).then((allFileObjeArrRet)=>{

                                        this.insertData(insertObj,tableName).then((resInsData:any)=>{
                                                let currInsertId=resInsData["insertId"];
                                                // this.rdsVisitUpdatedORInsertedIds.push({
                                                // "parent_server_id":respData['rds_visit_id'],
                                                // "parent_local_id":currInsertId
                                                // });
                                                callback();

                                               

                                            },(err)=>{
                                                callback();
                                        });

                                    },(errDDD)=>{

                                        callback();

                                    });


                                    


                            }
                            

                        },(errChild)=>{
                                callback();
                        });

                    
                  },(err)=>{
                        

                        // UpSync Start
                        
                        let queryU="SELECT * FROM "+tableName+" WHERE sync_status=0";

                            this.queryExecuteSql(queryU,[]).then((resDataU:any)=>{
                                    console.log('resDataU',resDataU);

                                    let resDatasUss=[];
                                    for(let m=0;m<resDataU.rows.length;m++){
                                        resDatasUss.push(resDataU.rows.item(m));
                                    }
                                    
                                     async.each(resDatasUss,(resDatasUs,callbackUss)=>{

                                                let rds_visit_id=0;
                                                let insertUpdateObj={};
                                               
                                                insertUpdateObj['rds_id']=resDatasUs['rds_id'];
                                                insertUpdateObj['visit_date']=resDatasUs['visit_date'];
                                                insertUpdateObj['additional_comments']=resDatasUs['additional_comments'];
                                                insertUpdateObj['created_date']=resDatasUs['created_date'];
                                                insertUpdateObj['updated_date']=resDatasUs['updated_date'];
                                                
                                                insertUpdateObj['updated_by']=resDatasUs['updated_by'];
                                                insertUpdateObj['local_updated_date']=resDatasUs['local_updated_date'];
                                                insertUpdateObj['local_created_date']=resDatasUs['local_created_date'];
                                                insertUpdateObj['assigned_to']=resDatasUs['assigned_to'];
                                                

                                                
                                                 if(resDatasUs['server_rds_visit_id']>0){
                                                      rds_visit_id=resDatasUs['server_rds_visit_id'];
                                                }else{
                                                    insertUpdateObj['latitude']=resDatasUs['latitude'];
                                                    insertUpdateObj['longitude']=resDatasUs['longitude'];
                                                    insertUpdateObj['local_created_date']=resDatasUs['local_created_date'];
                                                    insertUpdateObj['created_by']=resDatasUs['created_by'];
                                                    insertUpdateObj['generated_by']=resDatasUs['generated_by'];
                                                }

                                                
                                               

                                                let allFileObjeArr = {};
                                                 
                                                 this.uploadLocalFileToServer(allFileObjeArr).then((allFileObjeArrRet)=>{

                                          
                                                        this.appRdsVisitApi.addEditRdsVisit(insertUpdateObj,rds_visit_id).subscribe((resSSSData:any)=>{
                                                                console.log('resSSSData',resSSSData);
                                                                let updateDataObj={};
                                                                
                                                                updateDataObj['server_rds_visit_id']=resSSSData['result']['id']?resSSSData['result']['id']:0;
                                                                updateDataObj['updated_date']=resSSSData['result']['updated_date']?resSSSData['result']['updated_date']:0;
                                                                updateDataObj['sync_status']=1;
                                                                let whereCond=" rds_visit_id="+resDatasUs['rds_visit_id'];
                                                                this.updateData(updateDataObj,tableName,whereCond).then(()=>{
                                                                    
                                                                    
                                                                    // this.rdsVisitUpdatedORInsertedIds.push({
                                                                    // "parent_server_id":updateDataObj['server_rds_visit_id'],
                                                                    // "parent_local_id":resDatasUs['rds_visit_id']
                                                                    // });

                                                                     callbackUss();


                                                                },()=>{
                                                                    callbackUss();
                                                                });

                                                                
                                                        },(errSSS)=>{
                                                                console.log('errSSS',errSSS);
                                                                callbackUss();
                                                        });


                                                    },()=>{
                                                            callbackUss();
                                                 });

                                                
                                     },(errSSS)=>{

                                        resolve(true); 

                                    });

                                    
                            },(errorU)=>{
                                    console.log('errorU',errorU);
                                    resolve(true); 
                            });



                  });



                },(error)=>{
                    reject(false);
                });


        },()=>{
            reject(true);
        });

    });    


}



syncRetCurSkD(){
      return new Promise((resolve,reject)=>{
                  if(globalInternetCheckConnection==false){
                            this.showSyncToast(ALL_MESSAGE.COMMON_MESSAGE.SYNC_NO_FAILED_INTERNET);
                            reject(true);
                            return false;
                   }

                  let tableNameP='rds_visit';
                  let tableName='retailer_curent_stock';
                  let filterS={};
                  let queryP="SELECT rds_visit_id, server_rds_visit_id, rds_id FROM "+tableNameP+"";
                    this.queryExecuteSql(queryP,[]).then((resDataQP:any)=>{
                    let lenResQP=resDataQP.rows.length;
                    let resQPS=[];
                    for(let j=0;j<lenResQP;j++){
                         resQPS.push(resDataQP.rows.item(j));
                    }

                     async.each(resQPS,(resQP,callbackQP)=>{

                        let rds_visit_id=resQP['rds_visit_id'];
                        let server_rds_visit_id=resQP['server_rds_visit_id'];
                        let rds_id=resQP['rds_id'];
                        let query="SELECT stock_id,server_stock_id, updated_date FROM "+tableName+" where rds_visit_id="+rds_visit_id+" or server_rds_visit_id="+server_rds_visit_id+" ORDER BY updated_date desc LIMIT 1";
                   
                         this.queryExecuteSql(query,[]).then((resDataQ:any)=>{
                              let lenResQ=resDataQ.rows.length;
                              let resQS=[];
                              for(let j=0;j<lenResQ;j++){
                                  resQS.push(resDataQ.rows.item(j));
                               }
                             
                                if(resQS.length>0){
                                        async.each(resQS,(resQ,callbackQ)=>{

                                                console.log('syncReceiptsApprovalDProcess resQ',resQ);
                                                this.syncRetCurSkDProcess(rds_visit_id,server_rds_visit_id,rds_id,resQ).then((dataC)=>{
                                                    callbackQ();
                                                },(errC)=>{
                                                    callbackQ();
                                                });


                                        },(errA)=>{
                                            callbackQP();
                                        }); 
                                }else{
                                        let resQ={srku_approval_id:0,updated_date:0};
                                         this.syncRetCurSkDProcess(rds_visit_id,server_rds_visit_id,rds_id,resQ).then((dataC)=>{
                                                    callbackQP();
                                                },(errC)=>{
                                                    callbackQP();
                                         });
                                }

                                



                         },()=>{
                            callbackQP();
                         });


                     },(errAP)=>{
                         resolve(true);
                     });


                 },(errSP)=>{
                      resolve(true);  
                 });

     });
}

syncRetCurSkDProcess(rds_visit_id,server_rds_visit_id,rds_id,resQ){
 return new Promise((resolve,reject)=>{
        
            if(server_rds_visit_id==0 || !server_rds_visit_id){
                    resolve(true);
                    return 
            }

            let tableName="retailer_curent_stock";
            let s_rds_visit_id=server_rds_visit_id;
            let updated_date=1;
            let local_id = resQ['stock_id'];
            if(resQ['updated_date'] > 0){
               //  updated_date=resQ['updated_date'];
            }
                   let filterS={"where":{"or":[{"rds_visit_id":s_rds_visit_id}]}}
                   this.app_rds_stockApi.getStock(s_rds_visit_id,null,null,updated_date).subscribe((respDatas:any)=>{
                        let responseResults = respDatas['result']?respDatas['result']:[];
                        async.each(responseResults,(respData,callback:any)=>{

                            let sQuery="SELECT * FROM "+tableName+" WHERE server_stock_id="+respData['stock_id']+"";
                            this.queryExecuteSql(sQuery,[]).then((resQuData:any)=>{

                                 if(resQuData.rows.length > 0){
                                    
                                    let locaDataRow=resQuData.rows.item(0);

                                    console.log('locaDataRow',locaDataRow);

                                    let updateObj={};
                                    let syncStatus=1;
                                   

                                   if(locaDataRow['sync_status']==1){
                                
                                        updateObj['server_stock_id']=respData['stock_id'];
                                        updateObj['rds_visit_id']=rds_visit_id;
                                        updateObj['server_rds_visit_id']=respData['rds_visit_id'];
                                        updateObj['product_brand_id']=respData['product_brand_id'];
                                        updateObj['stock_selling_price']=respData['stock_selling_price'];
                                        updateObj['stock_promo']=respData['stock_promo'];
                                        updateObj['stock_quantity']=respData['stock_quantity'];
                                        updateObj['stock_unit']=respData['stock_unit'];
                                        updateObj['local_created_date']=respData['local_created_date'];
                                        updateObj['local_updated_date']=respData['local_updated_date'];
                                        updateObj['created_date']=respData['created_date'];
                                        updateObj['updated_date']=respData['updated_date'];
                                    
                                   }

                                 
                                    updateObj['ext_data']="";
                                    let whereCon=" stock_id="+locaDataRow['stock_id']+" ";
                                  
                                    let allFileObjeArr = {};
                                   
                                    
                                    this.downloadServerFileToLocal(allFileObjeArr).then((allFileObjeArrRet)=>{

                                       
                                        this.updateData(updateObj,tableName,whereCon).then((resInsData)=>{
                                      
                                          callback();

                                        // File Save To Local IF Updated

                                        },(err)=>{

                                          callback();

                                        }); 

                                },(errDDDDD)=>{

                                     callback();

                                });
                                  
                                  


                            }else{


                                    let insertObj={};
                                    insertObj['server_stock_id']=respData['stock_id'];
                                    insertObj['rds_visit_id']=rds_visit_id;
                                    insertObj['server_rds_visit_id']=server_rds_visit_id;
                                    insertObj['product_brand_id']=respData['product_brand_id'];
                                    insertObj['stock_selling_price']=respData['stock_selling_price'];
                                    insertObj['stock_promo']=respData['stock_promo'];
                                    insertObj['stock_quantity']=respData['stock_quantity'];
                                    insertObj['stock_unit']=respData['stock_unit'];
                                    insertObj['local_created_date']=respData['local_created_date'];
                                    insertObj['local_updated_date']=respData['local_updated_date'];
                                    insertObj['created_date']=respData['created_date'];
                                    insertObj['updated_date']=respData['updated_date'];
                                  
                                    insertObj['sync_status']=1;
                                    insertObj['ext_data']="";

                                    let allFileObjeArr = {};
                                    
                                   
                                    this.downloadServerFileToLocal(allFileObjeArr).then((allFileObjeArrRet)=>{

                                        this.insertData(insertObj,tableName).then((resInsData)=>{
                                                callback();
                                            },(err)=>{
                                                callback();
                                          });

                                    },(errDDD)=>{

                                        callback();

                                    });

                            }

                            },(errChild)=>{
                                callback();
                             });                    

                        },(error2)=>{

                            let queryU="SELECT * FROM "+tableName+" WHERE sync_status=0 and rds_visit_id="+rds_visit_id;
                            this.queryExecuteSql(queryU,[]).then((resDataU:any)=>{
                                    let resDatasUss=[];
                                    for(let m=0;m<resDataU.rows.length;m++){
                                        resDatasUss.push(resDataU.rows.item(m));
                                    }

                                    async.each(resDatasUss,(resDatasUs,callbackUss)=>{


                                               let stock_id=0;
                                               let insertUpdateObj={};
                                               
                                                insertUpdateObj['rds_visit_id']=server_rds_visit_id;
                                                insertUpdateObj['product_brand_id']=resDatasUs['product_brand_id'];
                                                insertUpdateObj['stock_selling_price']=resDatasUs['stock_selling_price'];
                                                insertUpdateObj['stock_promo']=resDatasUs['stock_promo'];
                                                insertUpdateObj['stock_quantity']=resDatasUs['stock_quantity'];
                                                insertUpdateObj['stock_unit']=resDatasUs['stock_unit'];
                                                insertUpdateObj['local_updated_date']=resDatasUs['local_updated_date'];
                                                insertUpdateObj['local_created_date']=resDatasUs['local_created_date'];
                                                
                                                 if(resDatasUs['server_stock_id']>0){
                                                      stock_id=resDatasUs['server_stock_id'];
                                                 }else{
                                                      
                                                 }

                                                
                                               

                                                let allFileObjeArr = {};
                                                 
                                                 this.uploadLocalFileToServer(allFileObjeArr).then((allFileObjeArrRet)=>{
                                                              
                                                    this.app_rds_stockApi.addEditStock(insertUpdateObj,stock_id).subscribe((resSSSData:any)=>{
                                                                let updateDataObj={};
                                                                updateDataObj['server_stock_id']=resSSSData['result']['id']?resSSSData['result']['id']:0;;
                                                                updateDataObj['rds_visit_id']=rds_visit_id;
                                                                updateDataObj['server_rds_visit_id']=server_rds_visit_id;
                                                                updateDataObj['updated_date']=resSSSData['result']['updated_date']?resSSSData['result']['updated_date']:0;
                                                                updateDataObj['sync_status']=1;
                                                                let whereCond=" stock_id="+resDatasUs['stock_id'];
                                                                this.updateData(updateDataObj,tableName,whereCond).then(()=>{
                                                                    callbackUss();
                                                                },()=>{
                                                                    callbackUss();
                                                                });
                                                                
                                                                },(errSSS)=>{
                                                                        console.log('errSSS',errSSS);
                                                                        callbackUss();
                                                                });
                                                     


                                                    },()=>{
                                                            callbackUss();
                                                    });


                                    },(error3)=>{
                                          resolve(true);    
                                    });


                            },(errorU)=>{
                                    console.log('errorU',errorU);
                                    resolve(true); 
                            });

                        });

                   },(error1)=>{

                        resolve(true);

                   });

            
       });
}



syncCheckInCheckOutD(){

         return new Promise((resolve,reject)=>{

                if(globalInternetCheckConnection==false){
                        this.showSyncToast(ALL_MESSAGE.COMMON_MESSAGE.SYNC_NO_FAILED_INTERNET);
                        reject(true);
                        return false;
                }


                let tableName='check_in_out';
                let filterS={};
                let query="SELECT * FROM "+tableName+" ORDER BY updated_date desc LIMIT 1";
                let userId=sessionUserGlobalData['userId'];
                filterS={"where":{"or":[{"check_in_out_user_id":userId}]}};
                let updated_date=0;


                             
                
            this.queryExecuteSql(query,[]).then((resPSQLData:any)=>{
                
                let updated_date=1;
                if(resPSQLData.rows.length>0){
                    let currUpData = resPSQLData.rows.item(0);
                    updated_date=currUpData['updated_date'];
                }

                this.app_check_in_outApi.getCheckInOut(null,userId,null,null,null,null,null,null,null,updated_date).subscribe((respDatas:any)=>{

                    let responseResults = respDatas['result']?respDatas['result']:[];
                    console.log(" check in out data res ",responseResults);
                    // DownSync Start
                    
                    async.each(responseResults,(respData,callback:any)=>{
                        
                      
                        let sQuery="SELECT * FROM "+tableName+" WHERE server_check_in_out_id="+respData['check_in_out_id']+"";
                        this.queryExecuteSql(sQuery,[]).then((resQuData:any)=>{

                         
                             if(resQuData.rows.length > 0){
                                    
                                    let locaDataRow=resQuData.rows.item(0);
                                    let updateObj={};
                                
                                    if(locaDataRow['sync_status']==1){
                                       // updateObj['server_check_in_out_id']=respData['check_in_out_id'];
                                        updateObj['check_in_out_user_id']=respData['check_in_out_user_id'];
                                        updateObj['check_in_out_type']=respData['check_in_out_type'];
                                        updateObj['server_check_in_out_type_id']=respData['check_in_out_type_id'];
                                        //updateObj['check_in_out_type_id']=respData['check_in_out_type_id'];
                                        updateObj['check_in_latitude']=respData['check_in_latitude'];
                                        updateObj['check_in_longitude']=respData['check_in_longitude'];
                                        updateObj['check_out_latitude']=respData['check_out_latitude'];
                                        updateObj['check_out_longitude']=respData['check_out_longitude'];
                                        updateObj['check_in_datetime']=respData['check_in_datetime'];
                                        updateObj['check_out_datetime']=respData['check_out_datetime'];
                                        updateObj['check_in_out_comment']=respData['check_in_out_comment'];
                                        updateObj['local_updated_date']=respData['local_updated_date'];
                                        updateObj['local_created_date']=respData['local_created_date'];
                                        updateObj['updated_date']=respData['updated_date'];
                                        updateObj['created_date']=respData['created_date'];
                                        updateObj['assigned_to']=respData['assigned_to'];
                                        updateObj['generated_by']=respData['generated_by'];
                                        updateObj['status']=respData['status']; 
                                    }


                                    updateObj['ext_data']="";
                                    let whereCon=" server_check_in_out_id="+respData['check_in_out_id']+"";
                                  
                                    let allFileObjeArr = {};
                                   
                                    
                                    this.downloadServerFileToLocal(allFileObjeArr).then((allFileObjeArrRet)=>{

                                     
                                       
                                        this.updateData(updateObj,tableName,whereCon).then((resInsData)=>{
                                      
                                          callback();

                                        // File Save To Local IF Updated

                                        },(err)=>{
                                            console.log(" updateData err ",err)
                                          callback();

                                        }); 

                                },(errDDDDD)=>{
                                    console.log(" insertData1 errDDDDD ",errDDDDD)
                                     callback();

                                });
                                  
                                  


                            }else{


                                  this.syncCheckInOutLocalIdToServerIdFetch(respData['check_in_out_type_id'],respData['check_in_out_type'],'server').then((resltData:any)=>{
                                     console.log('first syncCheckInOutLocalIdToServerIdFetch resltData',resltData);
                                    if(resltData['localId']==0 || resltData['serverId']==0){
                                        callback();
                                    }else{

                                    
                                    let insertObj={};
                                    insertObj['server_check_in_out_id']=respData['check_in_out_id'];
                                    insertObj['check_in_out_user_id']=respData['check_in_out_user_id'];
                                    insertObj['check_in_out_type']=respData['check_in_out_type'];
                                    insertObj['server_check_in_out_type_id']=resltData['serverId']
                                    insertObj['check_in_out_type_id']=resltData['localId'];
                                    insertObj['check_in_latitude']=respData['check_in_latitude'];
                                    insertObj['check_in_longitude']=respData['check_in_longitude'];
                                    insertObj['check_out_latitude']=respData['check_out_latitude'];
                                    insertObj['check_out_longitude']=respData['check_out_longitude'];
                                    insertObj['check_in_datetime']=respData['check_in_datetime'];
                                    insertObj['check_out_datetime']=respData['check_out_datetime'];
                                    insertObj['check_in_out_comment']=respData['check_in_out_comment'];
                                    insertObj['local_updated_date']=respData['local_updated_date'];
                                    insertObj['local_created_date']=respData['local_created_date'];
                                    insertObj['updated_date']=respData['updated_date'];
                                    insertObj['created_date']=respData['created_date'];
                                    insertObj['assigned_to']=respData['assigned_to'];
                                    insertObj['generated_by']=respData['generated_by'];
                                    insertObj['status']=respData['status']; 
                                    insertObj['sync_status']=1;
                                    insertObj['ext_data']="";

                                    let allFileObjeArr = {};
                                    
                                    this.downloadServerFileToLocal(allFileObjeArr).then((allFileObjeArrRet)=>{

                                        this.insertData(insertObj,tableName).then((resInsData)=>{
                                                callback();
                                            },(err)=>{
                                                console.log(" insertData2 err ",err)
                                                callback();
                                          });

                                    },(errDDD)=>{
                                        console.log(" insertData2 errDDD ",errDDD)
                                        callback();

                                    });

                                }


                                  },(err)=>{
                                    console.log(" insertData2 err out ",err)
                                    callback();
                                  });

                        

                            }
                            

                        },(errChild)=>{
                            console.log(" insertData2 errChild ",errChild)
                                callback();
                        });

                    
                  },(err)=>{
                        

                        // UpSync Start
                        
                        let queryU="SELECT * FROM "+tableName+" WHERE sync_status=0";

                            this.queryExecuteSql(queryU,[]).then((resDataU:any)=>{
                                    console.log('resDataU',resDataU);

                                    let resDatasUss=[];
                                    for(let m=0;m<resDataU.rows.length;m++){
                                        resDatasUss.push(resDataU.rows.item(m));
                                    }
                                    
                                     async.each(resDatasUss,(resDatasUs,callbackUss)=>{

                                                let check_in_out_id=0;
                                                let insertUpdateObj={};
                                            
                                                this.syncCheckInOutLocalIdToServerIdFetch(resDatasUs['check_in_out_type_id'],resDatasUs['check_in_out_type'],'local').then((resltData:any)=>{
                                                console.log('syncCheckInOutLocalIdToServerIdFetch resltData',resltData);
                                                if(resltData['localId']==0 || resltData['serverId']==0){
                                                        callbackUss();
                                                }else{
                                               
                                                insertUpdateObj['check_in_out_user_id']=resDatasUs['check_in_out_user_id'];
                                                insertUpdateObj['check_in_out_type']=resDatasUs['check_in_out_type'];
                                                insertUpdateObj['check_in_out_type_id']=resltData['serverId'];
                                                insertUpdateObj['check_in_latitude']=resDatasUs['check_in_latitude'];
                                                insertUpdateObj['check_in_longitude']=resDatasUs['check_in_longitude'];
                                                insertUpdateObj['check_out_latitude']=resDatasUs['check_out_latitude'];
                                                insertUpdateObj['check_out_longitude']=resDatasUs['check_out_longitude'];
                                                insertUpdateObj['check_in_out_comment']=resDatasUs['check_in_out_comment'];
                                                insertUpdateObj['check_in_datetime']=resDatasUs['check_in_datetime'];
                                                insertUpdateObj['check_out_datetime']=resDatasUs['check_out_datetime'];
                                                insertUpdateObj['local_updated_date']=resDatasUs['local_updated_date'];
                                                insertUpdateObj['local_created_date']=resDatasUs['local_created_date'];
                                                insertUpdateObj['assigned_to']=resDatasUs['assigned_to'];
                        
                                                
                                                 if(resDatasUs['server_check_in_out_id']>0){
                                                      check_in_out_id=resDatasUs['server_check_in_out_id'];
                                                }else{
                                                      insertUpdateObj['generated_by']=resDatasUs['generated_by'];

                                                }

                                                let allFileObjeArr = {};
                                                 
                                                 this.uploadLocalFileToServer(allFileObjeArr).then((allFileObjeArrRet)=>{

                                                       // let whereSerC={"check_in_out_id":check_in_out_id}
                                                        this.app_check_in_outApi.addEditCheckInOut(insertUpdateObj,check_in_out_id).subscribe((resSSSData:any)=>{
                                                                console.log('resSSSData',resSSSData);
                                                                let updateDataObj={};
                                                                
                                                                updateDataObj['server_check_in_out_id']=resSSSData['result']['id']?resSSSData['result']['id']:0;
                                                                updateDataObj['server_check_in_out_type_id']=resltData['serverId'];
                                                                updateDataObj['sync_status']=1;
                                                                updateDataObj['updated_date']=resSSSData['result']['updated_date']?resSSSData['result']['updated_date']:0;
                                                                let whereCond=" check_in_out_id="+resDatasUs['check_in_out_id'];
                                                                this.updateData(updateDataObj,tableName,whereCond).then(()=>{
                                                                    
                                                                    callbackUss();
                                                                },()=>{
                                                                    callbackUss();
                                                                });
                                                            //  callbackUss();
                                                                
                                                        },(errSSS)=>{
                                                                console.log('errSSS',errSSS);
                                                                callbackUss();
                                                        });


                                                    },()=>{
                                                            callbackUss();
                                                    });

                                                 } 

                                                },(err)=>{
                                                        callbackUss();
                                                });

                                            // here         
                                                
                                     },(errSSS)=>{

                                        resolve(true); 

                                    });

                                    
                            },(errorU)=>{
                                    console.log('errorU',errorU);
                                    resolve(true); 
                            });



                  });



                },(error)=>{
                    reject(false);
                });


                },(error8)=>{
                    console.log('error8',error8);
                      reject(false);
                })
      

    });   

}


syncCheckInOutLocalIdToServerIdFetch(lsId,type,fromName){
    
    return new Promise((resolve,reject)=>{
    console.log('lsId',lsId);
    console.log('type',type);
    console.log('fromName',fromName);
    let idsArr={localId:0,serverId:0};

        if(type=="project"){

          
                //project_id , server_project_id
                let query="SELECT * FROM project_master WHERE 1=0"
                if(fromName=="server"){
                    query="SELECT * FROM project_master WHERE server_project_id="+lsId;
                }else{
                    query="SELECT * FROM project_master WHERE project_id="+lsId;
                }
                this.queryExecuteSql(query,[]).then((respData:any)=>{
                    
                    if(respData.rows.length>0){
                        let respTempData = respData.rows.item(0);
                        idsArr['serverId']=respTempData['server_project_id'];
                        idsArr['localId']=respTempData['project_id'];
                        resolve(idsArr);
                    }else{
                        resolve(idsArr);
                    }
                    

                },(err)=>{
                    console.log('syncCheckInOutLocalIdToServerIdFetch err',err);
                    reject(false);
                });
                
        
           

        }else{
                idsArr['serverId']=lsId;
                idsArr['localId']=lsId;
                resolve(idsArr);
        }



    });
}

syncProductReqBrandInUseLocalIdToServerIdFetch(lsId,fromName){
    
    return new Promise((resolve,reject)=>{

    let idsArr={localId:0,serverId:0};


          
                //project_id , server_project_id
                let query="SELECT * FROM products_request_tbl WHERE 1=0"
                if(fromName=="server"){
                    query="SELECT * FROM products_request_tbl WHERE server_id="+lsId;
                }else{
                    query="SELECT * FROM products_request_tbl WHERE id="+lsId;
                }
                console.log('syncProductReqBrandInUseLocalIdToServerIdFetch query ',query);
                this.queryExecuteSql(query,[]).then((respData:any)=>{
                    
                    if(respData.rows.length>0){
                        let respTempData = respData.rows.item(0);
                        idsArr['serverId']=respTempData['server_id'];
                        idsArr['localId']=respTempData['id'];
                        resolve(idsArr);
                    }else{
                        resolve(idsArr);
                    }
                    

                },(err)=>{
                    console.log('syncCheckInOutLocalIdToServerIdFetch err',err);
                    reject(false);
                });
                
        
           

     



    });
}

syncProductReqProjHpbLocalIdToServerIdFetch(p_lsId,h_lsId,fromName){
    
    return new Promise((resolve,reject)=>{

              let idsArr={p_localId:0,p_serverId:0,h_localId:0,h_serverId:0};

                
                 var asyncTasks = [];
                 

              asyncTasks.push((callback)=>{
                    //project_id , server_project_id
                    let query="SELECT * FROM project_master WHERE 1=0"
                    if(fromName=="server"){
                        query="SELECT * FROM project_master WHERE server_project_id="+p_lsId;
                    }else{
                        query="SELECT * FROM project_master WHERE project_id="+p_lsId;
                    }
                    this.queryExecuteSql(query,[]).then((respData:any)=>{
                        
                        if(respData.rows.length>0){
                            let respTempData = respData.rows.item(0);
                            idsArr['p_serverId']=respTempData['server_project_id'];
                            idsArr['p_localId']=respTempData['project_id'];
                            callback();
                        }else{
                           callback();
                        }
                        

                    },(err)=>{
                        console.log(' err',err);
                       callback();
                    });

                }); 

               
                  asyncTasks.push((callback)=>{
                    //project_id , server_project_id
                    let query="SELECT * FROM hpb_master WHERE 1=0"
                    if(fromName=="server"){
                        query="SELECT * FROM hpb_master WHERE server_hpb_id="+h_lsId;
                    }else{
                        query="SELECT * FROM hpb_master WHERE hpb_id="+h_lsId;
                    }
                    this.queryExecuteSql(query,[]).then((respData:any)=>{
                        
                        if(respData.rows.length>0){
                            let respTempData = respData.rows.item(0);
                            idsArr['h_serverId']=respTempData['server_hpb_id'];
                            idsArr['h_localId']=respTempData['hpb_id'];
                            callback();
                        }else{
                            callback();
                        }
                        

                    },(err)=>{
                        console.log(' err',err);
                        callback();
                    });

                }); 


                
                let allTaskComplete = ()=>{
                   resolve(idsArr);
                }

              async.parallel(asyncTasks, function(){
                    allTaskComplete();
              });

                

    });
}

syncProjectRequestD(){
  
     return new Promise(async (resolve,reject)=>{

                //let waitTime:any = await this.waitForSyncTime(10);

                if(globalInternetCheckConnection==false){
                        this.showSyncToast(ALL_MESSAGE.COMMON_MESSAGE.SYNC_NO_FAILED_INTERNET);
                        reject(true);
                        return false;
                }

                if(this.syncRequestDRunningFlag){
                    reject(true);
                    return false;
                }
                this.syncRequestDRunningFlag=true;
                let allProjectsData:any = await this.syncReceiptProjectGet();
                console.log('syncProjectRequestD allProjectsData',allProjectsData);
                let aynscNew:any = async;
                aynscNew.each(allProjectsData,(cProjectObj,callback0)=>{
                let cProjectId=cProjectObj['server_project_id'];
                let cLProjectId=cProjectObj['project_id'];
                let tableName='products_request_tbl';
                let filterS={};
                //let query="SELECT * FROM "+tableName+" ORDER BY updated_date desc LIMIT 1";
                let query="SELECT * FROM "+tableName+" WHERE server_project_id="+cProjectId+" ORDER BY updated_date desc LIMIT 1";
                let userId=sessionUserGlobalData['userId'];
                this.queryExecuteSql(query,[]).then((resPSQLData:any)=>{
                        
                        let updateDate=1;
                        if(resPSQLData.rows.length>0){
                            let currUpData = resPSQLData.rows.item(0);
                            updateDate=currUpData['updated_date'];
                        }

                        this.appProdReq.getProductRequest(null,null,null,null,updateDate,null,null,null,null,null,cProjectId).subscribe((respDatas:any)=>{

                            let responseResults = respDatas['result']?respDatas['result']:[];

                            // DownSync Start
                            
                            async.each(responseResults,(respData,callback:any)=>{
                                
                            
                                let sQuery="SELECT * FROM "+tableName+" WHERE server_id="+respData['id']+"";
                                this.queryExecuteSql(sQuery,[]).then((resQuData:any)=>{
                                    
                                
                                    if(resQuData.rows.length > 0){
                                            
                                            let locaDataRow=resQuData.rows.item(0);
                                            let updateObj={};
                                            let allFileObjeArr = {};
                                            if(locaDataRow['sync_status']==1){
                                            
                                                updateObj['request_date']=respData['request_date'];
                                                updateObj['server_project_id']=respData['project_id'];
                                            // updateObj['project_id']=respData['project_id'];
                                                updateObj['server_hpb_id']=respData['hpb_id'];
                                            // updateObj['hpb_id']=respData['hpb_id'];
                                                updateObj['quantity_required']=respData['quantity_required'];
                                                updateObj['rds_id']=respData['rds_id'];
                                                updateObj['pic_same_as_hpb']=respData['pic_same_as_hpb'];
                                                updateObj['pic_name']=respData['pic_name'];
                                                updateObj['pic_designation']=respData['pic_designation'];
                                                updateObj['pic_mobile']=respData['pic_mobile'];
                                                updateObj['new_price_request']=respData['new_price_request'];
                                                updateObj['term_of_payment']=respData['term_of_payment'];
                                                updateObj['product_request_status']=respData['product_request_status'];
                                                updateObj['product_request_status_remark']=respData['product_request_status_remark'];
                                                updateObj['product_request_status_remark_comment']=respData['product_request_status_remark_comment'];
                                                updateObj['status_change_date']=respData['status_change_date'];
                                                updateObj['additional_comments']=respData['additional_comments'];
                                                updateObj['latitude']=respData['latitude']; 
                                                updateObj['longitude']=respData['longitude']; 
                                                updateObj['created_by']=respData['created_by']; 
                                                updateObj['updated_by']=respData['updated_by']; 
                                                updateObj['generated_by']=respData['generated_by']; 
                                                updateObj['local_created_date']=respData['local_created_date']; 
                                                updateObj['local_updated_date']=respData['local_updated_date']; 
                                                updateObj['created_date']=respData['created_date']; 
                                                updateObj['updated_date']=respData['updated_date'];
                                                updateObj['status']=respData['status'];
                                                updateObj['hpb_digital_sign']=respData['hpb_digital_sign'];
                                                if(locaDataRow['hpb_digital_sign']!=respData['hpb_digital_sign']){
                                                allFileObjeArr['hpb_digital_sign']=respData['hpb_digital_sign'];
                                                }  
                                            }
                                            console.log('syncProduct updateObj',updateObj);
                                            updateObj['ext_data']="";
                                            let whereCon=" server_id="+respData['id']+"";
                        
                                            
                                            this.downloadServerFileToLocal(allFileObjeArr).then((allFileObjeArrRet)=>{

                                                if(locaDataRow['hpb_digital_sign']!=respData['hpb_digital_sign']){
                                                    updateObj['hpb_digital_sign']=JSON.stringify(allFileObjeArrRet['hpb_digital_sign']);
                                                }
                                            
                                                this.updateData(updateObj,tableName,whereCon).then((resInsData)=>{
                                            
                                                callback();

                                                // File Save To Local IF Updated

                                                },(err)=>{

                                                callback();

                                                }); 

                                        },(errDDDDD)=>{

                                            callback();

                                        });
                                        
                                        


                                    }else{

                                            
                                        this.syncProductReqProjHpbLocalIdToServerIdFetch(respData['project_id'],respData['hpb_id'],'server').then((resltData:any)=>{
                                            console.log('syncProductReqProjHpbLocalIdToServerIdFetch server',resltData);
                                            if(resltData['p_localId']==0 || resltData['p_serverId']==0){
                                                callback();
                                            }else{

                                            
                                                let insertObj={};
                                                let allFileObjeArr = {};
                                                insertObj['server_id']=respData['id'];
                                                insertObj['request_date']=respData['request_date'];
                                                insertObj['server_project_id']=respData['project_id'];
                                                insertObj['project_id']=resltData['p_localId'];
                                                insertObj['server_hpb_id']=respData['hpb_id'];
                                                insertObj['hpb_id']=resltData['h_localId'];
                                                insertObj['quantity_required']=respData['quantity_required'];
                                                insertObj['rds_id']=respData['rds_id'];
                                                insertObj['pic_same_as_hpb']=respData['pic_same_as_hpb'];
                                                insertObj['pic_name']=respData['pic_name'];
                                                insertObj['pic_designation']=respData['pic_designation'];
                                                insertObj['pic_mobile']=respData['pic_mobile'];
                                                insertObj['new_price_request']=respData['new_price_request'];
                                                insertObj['term_of_payment']=respData['term_of_payment'];
                                                insertObj['product_request_status']=respData['product_request_status'];
                                                insertObj['product_request_status_remark']=respData['product_request_status_remark'];
                                                insertObj['product_request_status_remark_comment']=respData['product_request_status_remark_comment'];
                                                insertObj['status_change_date']=respData['status_change_date'];
                                                insertObj['additional_comments']=respData['additional_comments'];
                                                insertObj['latitude']=respData['latitude']; 
                                                insertObj['longitude']=respData['longitude']; 
                                                insertObj['created_by']=respData['created_by']; 
                                                insertObj['updated_by']=respData['updated_by']; 
                                                insertObj['generated_by']=respData['generated_by']; 
                                                insertObj['local_created_date']=respData['local_created_date']; 
                                                insertObj['local_updated_date']=respData['local_updated_date']; 
                                                insertObj['created_date']=respData['created_date']; 
                                                insertObj['updated_date']=respData['updated_date'];
                                                insertObj['status']=respData['status'];
                                                insertObj['hpb_digital_sign']=respData['hpb_digital_sign'];
                                                insertObj['status']=respData['status']; 
                                                insertObj['sync_status']=1;
                                                insertObj['ext_data']="";
                                                allFileObjeArr['hpb_digital_sign']=respData['hpb_digital_sign'];
                                                console.log('syncProduct insertObj',insertObj);
                                                this.downloadServerFileToLocal(allFileObjeArr).then((allFileObjeArrRet)=>{
                                                    insertObj['hpb_digital_sign']=JSON.stringify(allFileObjeArrRet['hpb_digital_sign']);
                                                    this.insertData(insertObj,tableName).then((resInsData)=>{
                                                            callback();
                                                        },(err)=>{
                                                            callback();
                                                    });

                                                },(errDDD)=>{

                                                    callback();

                                                });

                                        }


                                        },(err)=>{
                                                callback();
                                        });

                                

                                    }
                                    

                                },(errChild)=>{
                                        callback();
                                });

                            
                        },(err)=>{
                                

                                // UpSync Start
                                
                                    let queryU="SELECT * FROM "+tableName+" WHERE sync_status=0 AND project_id="+cLProjectId;

                                    this.queryExecuteSql(queryU,[]).then((resDataU:any)=>{
                                            console.log('resDataU',resDataU);

                                            let resDatasUss=[];
                                            for(let m=0;m<resDataU.rows.length;m++){
                                                resDatasUss.push(resDataU.rows.item(m));
                                            }
                                            
                                            async.each(resDatasUss,(resDatasUs,callbackUss)=>{

                                                        let id=0;
                                                        let insertUpdateObj={};
                                                        let allFileObjeArr = {};
                                                        this.syncProductReqProjHpbLocalIdToServerIdFetch(resDatasUs['project_id'],resDatasUs['hpb_id'],'local').then((resltData:any)=>{
                                                            console.log('syncProductReqProjHpbLocalIdToServerIdFetch local',resltData);
                                                            if(resltData['p_localId']==0 || resltData['p_serverId']==0){
                                                            callbackUss();
                                                            }else{

                                                            insertUpdateObj['request_date']=resDatasUs['request_date'];
                                                            insertUpdateObj['project_id']=resltData['p_serverId'];
                                                            insertUpdateObj['hpb_id']=resltData['h_serverId'];
                                                            insertUpdateObj['quantity_required']=resDatasUs['quantity_required'];
                                                            insertUpdateObj['rds_id']=resDatasUs['rds_id'];
                                                            insertUpdateObj['pic_same_as_hpb']=resDatasUs['pic_same_as_hpb'];
                                                            insertUpdateObj['pic_name']=resDatasUs['pic_name'];
                                                            insertUpdateObj['pic_designation']=resDatasUs['pic_designation'];
                                                            insertUpdateObj['pic_mobile']=resDatasUs['pic_mobile'];
                                                            insertUpdateObj['new_price_request']=resDatasUs['new_price_request'];
                                                            insertUpdateObj['term_of_payment']=resDatasUs['term_of_payment'];
                                                            insertUpdateObj['product_request_status']=resDatasUs['product_request_status'];
                                                            insertUpdateObj['product_request_status_remark']=resDatasUs['product_request_status_remark'];
                                                            insertUpdateObj['product_request_status_remark_comment']=resDatasUs['product_request_status_remark_comment'];
                                                            insertUpdateObj['status_change_date']=resDatasUs['status_change_date'];
                                                            insertUpdateObj['additional_comments']=resDatasUs['additional_comments'];
                                                            insertUpdateObj['latitude']=resDatasUs['latitude']; 
                                                            insertUpdateObj['longitude']=resDatasUs['longitude']; 
                                                            insertUpdateObj['created_by']=resDatasUs['created_by']; 
                                                            insertUpdateObj['updated_by']=resDatasUs['updated_by'];
                                                            insertUpdateObj['generated_by']=resDatasUs['generated_by']; 
                                                            insertUpdateObj['local_created_date']=resDatasUs['local_created_date']; 
                                                            insertUpdateObj['local_updated_date']=resDatasUs['local_updated_date']; 
                                                            insertUpdateObj['status']=resDatasUs['status'];
                                                        //  insertUpdateObj['hpb_digital_sign']=resDatasUs['hpb_digital_sign'];       
                                                            if( this.platform.is('ios') ) {
                                                                allFileObjeArr['hpb_digital_sign']=(resDatasUs['hpb_digital_sign'] && resDatasUs['hpb_digital_sign']!="")?this.alterimgPath(resDatasUs['hpb_digital_sign']):"";
                                                            } else {
                                                                allFileObjeArr['hpb_digital_sign']=resDatasUs['hpb_digital_sign'];
                                                            }
                                                            
                                                        
                                                            if(resDatasUs['server_id']>0){
                                                                id=resDatasUs['server_id'];
                                                            }else{
                                
                                                            }

                                                    
                                                        
                                                        this.uploadLocalFileToServer(allFileObjeArr).then((allFileObjeArrRet)=>{

                                                                if(allFileObjeArrRet['hpb_digital_sign'].length>0){
                                                                    insertUpdateObj['hpb_digital_sign']=JSON.stringify(allFileObjeArrRet['hpb_digital_sign']);
                                                                }
                                                                this.appProdReq.addEditRequest(insertUpdateObj,id).subscribe((resSSSData:any)=>{
                                                                    
                                                                        let updateDataObj={};
                                                                        if(allFileObjeArrRet['hpb_digital_sign'].length>0){
                                                                            updateDataObj['hpb_digital_sign']=insertUpdateObj['hpb_digital_sign'];
                                                                        }
                                                                        updateDataObj['server_id']=resSSSData['result']['id']?resSSSData['result']['id']:0;
                                                                        updateDataObj['sync_status']=1;
                                                                        updateDataObj['server_project_id']=resltData['p_serverId'];
                                                                        updateDataObj['server_hpb_id']=resltData['h_serverId'];
                                                                        updateDataObj['server_hpb_id']=resltData['h_serverId'];
                                                                    
                                                                        let whereCond=" id="+resDatasUs['id'];
                                                                        this.updateData(updateDataObj,tableName,whereCond).then(()=>{                                                                            
                                                                            callbackUss();
                                                                        },()=>{
                                                                            callbackUss();
                                                                        });
                                                                    //  callbackUss();
                                                                        
                                                                },(errSSS)=>{
                                                                        console.log('errSSS',errSSS);
                                                                        callbackUss();
                                                                });


                                                            },()=>{
                                                                    callbackUss();
                                                            });

                                                        } 

                                                        },(err)=>{
                                                                callbackUss();
                                                        });

                                                    // here         
                                                        
                                            },(errSSS)=>{

                                               // resolve(true); 
                                               callback0();

                                            });

                                            
                                    },(errorU)=>{
                                            console.log('errorU',errorU);
                                           // resolve(true); 
                                           callback0();
                                    });



                        });



                        },(error)=>{
                              //  resolve(true); 
                              callback0();
                        });

                    },(error)=>{
                        console.log('error',error); 
                        //resolve(true);
                        callback0();
                    });

                },(endSync0)=>{
                    this.syncRequestDRunningFlag=false;
                    resolve(true);
                });
      

    });   
    
}

syncProjectRequestBrandD(){
    
     return new Promise(async (resolve,reject)=>{

            if(globalInternetCheckConnection==false){
                    this.showSyncToast(ALL_MESSAGE.COMMON_MESSAGE.SYNC_NO_FAILED_INTERNET);
                    reject(true);
                    return false;
            }

            if(this.syncRequestBrandDRunningFlag){
                reject(true);
                return false;
            }
            this.syncRequestBrandDRunningFlag=true;

            let allRequestData:any =   await this.syncProjectRequestGet();
            async.each(allRequestData,(cRequestObj,callback0)=>{
            let cRequestId=cRequestObj['server_id'];
            let cLRequestId=cRequestObj['id'];
            let tableName='products_request_brand_capture_tbl';
            let filterS={};
           // let query="SELECT * FROM "+tableName+" ORDER BY updated_date desc LIMIT 1";
           let query="SELECT * FROM "+tableName+" WHERE server_request_id="+cRequestId+" ORDER BY updated_date desc LIMIT 1";
           let userId=sessionUserGlobalData['userId'];  
                this.queryExecuteSql(query,[]).then((resPSQLData:any)=>{
                    
                    let updateDate=1;
                    if(resPSQLData.rows.length>0){
                        let currUpData = resPSQLData.rows.item(0);
                        updateDate=currUpData['updated_date'];
                    }
                    let userId=sessionUserGlobalData['userId']; 
                    this.prodReqBrandCap.getBrandCapture(cRequestId,null,null,null,null,updateDate).subscribe((respDatas:any)=>{

                        let responseResults = respDatas['result']?respDatas['result']:[];


                        // DownSync Start
                        
                        async.each(responseResults,(respData,callback:any)=>{
                            
                        
                            let sQuery="SELECT * FROM "+tableName+" WHERE server_id="+respData['id']+"";
                            this.queryExecuteSql(sQuery,[]).then((resQuData:any)=>{

                            
                                if(resQuData.rows.length > 0){
                                        
                                        let locaDataRow=resQuData.rows.item(0);
                                        let updateObj={};
                                        let allFileObjeArr = {};
                                        if(locaDataRow['sync_status']==1){
                                        
                                        // updateObj['request_id']=respData['request_id'];
                                            updateObj['server_request_id']=respData['request_id'];
                                            updateObj['server_brand_id']=respData['brand_id'];
                                            updateObj['req_rds_name']=respData['req_rds_name'];
                                            updateObj['price']=respData['price']; 
                                            updateObj['created_by']=respData['created_by']; 
                                            updateObj['updated_by']=respData['updated_by']; 
                                            updateObj['local_created_date']=respData['local_created_date']; 
                                            updateObj['local_updated_date']=respData['local_updated_date']; 
                                            updateObj['created_date']=respData['created_date']; 
                                            updateObj['updated_date']=respData['updated_date'];
                                            updateObj['status']=respData['status'];
                                        }

                                    // updateObj['ext_data']="";
                                        let whereCon=" server_id="+respData['id']+"";
                    
                                        
                                        this.downloadServerFileToLocal(allFileObjeArr).then((allFileObjeArrRet)=>{

                                        
                                            this.updateData(updateObj,tableName,whereCon).then((resInsData)=>{
                                        
                                            callback();

                                            // File Save To Local IF Updated

                                            },(err)=>{

                                            callback();

                                            }); 

                                    },(errDDDDD)=>{

                                        callback();

                                    });
                                    
                                    


                                }else{


                                this.syncProductReqBrandInUseLocalIdToServerIdFetch(respData['request_id'],'server').then((resltData:any)=>{
                                    console.log('syncProductReqBrandInUseLocalIdToServerIdFetch server',resltData);
                                        
                                        if(resltData['localId']==0 || resltData['serverId']==0){
                                            callback();
                                        }else{

                                        
                                            let insertObj={};
                                            let allFileObjeArr = {};
                                            insertObj['server_request_id']=respData['request_id'];
                                            insertObj['request_id']=resltData['localId'];
                                            insertObj['server_brand_id']=respData['brand_id'];
                                            insertObj['brand_id']=respData['brand_id'];
                                            insertObj['req_rds_name']=respData['req_rds_name'];
                                            insertObj['price']=respData['price']; 
                                            insertObj['created_by']=respData['created_by']; 
                                            insertObj['updated_by']=respData['updated_by']; 
                                            insertObj['local_created_date']=respData['local_created_date']; 
                                            insertObj['local_updated_date']=respData['local_updated_date']; 
                                            insertObj['created_date']=respData['created_date']; 
                                            insertObj['updated_date']=respData['updated_date'];
                                            insertObj['status']=respData['status'];
                                            insertObj['sync_status']=1;
                                        //   insertObj['ext_data']="";
                                        
                                            this.downloadServerFileToLocal(allFileObjeArr).then((allFileObjeArrRet)=>{
                                        
                                                this.insertData(insertObj,tableName).then((resInsData)=>{
                                                        callback();
                                                    },(err)=>{
                                                        callback();
                                                });

                                            },(errDDD)=>{

                                                callback();

                                            });

                                    }


                                    },(err)=>{
                                            callback();
                                    });

                            

                                }
                                

                            },(errChild)=>{
                                    callback();
                            });

                        
                    },(err)=>{
                            

                            // UpSync Start
                            
                            let queryU="SELECT * FROM "+tableName+" WHERE sync_status=0 AND request_id="+cLRequestId;

                                this.queryExecuteSql(queryU,[]).then((resDataU:any)=>{
                                        console.log('resDataU',resDataU);

                                        let resDatasUss=[];
                                        for(let m=0;m<resDataU.rows.length;m++){
                                            resDatasUss.push(resDataU.rows.item(m));
                                        }
                                        
                                        async.each(resDatasUss,(resDatasUs,callbackUss)=>{

                                                    let id=0;
                                                    let insertUpdateObj={};
                                                    let allFileObjeArr = {};
                                            this.syncProductReqBrandInUseLocalIdToServerIdFetch(resDatasUs['request_id'],'local').then((resltData:any)=>{
                                                    console.log('syncProductReqBrandInUseLocalIdToServerIdFetch local',resltData);
                                        
                                                    if(resltData['localId']==0 || resltData['serverId']==0){
                                                            callbackUss();
                                                    }else{
                                                
                                                        
                                                        insertUpdateObj['request_date']=resDatasUs['request_date'];
                                                        insertUpdateObj['request_id']=resltData['serverId'];
                                                        insertUpdateObj['brand_id']=resDatasUs['server_brand_id'];
                                                        insertUpdateObj['req_rds_name']=resDatasUs['req_rds_name'];
                                                        insertUpdateObj['price']=resDatasUs['price']; 
                                                        insertUpdateObj['created_by']=resDatasUs['created_by']; 
                                                        insertUpdateObj['updated_by']=resDatasUs['updated_by']; 
                                                        insertUpdateObj['local_created_date']=resDatasUs['local_created_date']; 
                                                        insertUpdateObj['local_updated_date']=resDatasUs['local_updated_date']; 
                                                        insertUpdateObj['status']=resDatasUs['status'];
                                    
                                                        if(resDatasUs['server_id']>0){
                                                            id=resDatasUs['server_id'];
                                                        }else{
                            
                                                        }

                                                
                                                    
                                                    this.uploadLocalFileToServer(allFileObjeArr).then((allFileObjeArrRet)=>{

                                                        this.prodReqBrandCap.addEditBrandCapture(insertUpdateObj,id).subscribe((resSSSData:any)=>{
                                                                
                                                                    let updateDataObj={};
                                                                    
                                                                    updateDataObj['server_id']=resSSSData['result']['id']?resSSSData['result']['id']:0;
                                                                    updateDataObj['sync_status']=1;
                                                                    updateDataObj['updated_date']=resSSSData['result']['updated_date']?resSSSData['result']['updated_date']:0;
                                                                    updateDataObj['server_request_id']=resltData['serverId'];
                                                                    let whereCond=" id="+resDatasUs['id'];
                                                                    this.updateData(updateDataObj,tableName,whereCond).then(()=>{
                                                                        
                                                                        callbackUss();
                                                                    },()=>{
                                                                        callbackUss();
                                                                    });
                                                                //  callbackUss();
                                                                    
                                                            },(errSSS)=>{
                                                                    console.log('errSSS',errSSS);
                                                                    callbackUss();
                                                            });


                                                        },()=>{
                                                                callbackUss();
                                                        });

                                                    } 

                                                    },(err)=>{
                                                            callbackUss();
                                                    });

                                                // here         
                                                    
                                        },(errSSS)=>{

                                           // resolve(true); 
                                           callback0();

                                        });

                                        
                                },(errorU)=>{
                                        console.log('errorU',errorU);
                                        //resolve(true); 
                                        callback0();
                                });



                    });



                    },(error)=>{
                          //  resolve(true); 
                          callback0();
                    });

                },(error)=>{
                    console.log('error',error); 
                   // resolve(true);
                   callback0();
            });
        },(endSync0)=>{
            this.syncRequestBrandDRunningFlag=false;
            resolve(true);
        });




      

    });  
}

waitForSyncTime(time){
    return new Promise(async (resolve,reject)=>{
        setTimeout(()=>{
            resolve(true);
        },time)
    });
}

syncNotificationCenterD(){
    
       return new Promise((resolve,reject)=>{
  
                  if(globalInternetCheckConnection==false){
                          this.showSyncToast(ALL_MESSAGE.COMMON_MESSAGE.SYNC_NO_FAILED_INTERNET);
                          reject(true);
                          return false;
                  }
  
  
                  let tableName='notification_center';
                  let filterS={};
                  let query="SELECT * FROM "+tableName+" ORDER BY updated_date desc LIMIT 1";
                  let userId=sessionUserGlobalData['userId'];
                  
                  
              this.queryExecuteSql(query,[]).then((resPSQLData:any)=>{
                  
                  let updateDate=1;
                  if(resPSQLData.rows.length>0){
                      let currUpData = resPSQLData.rows.item(0);
                      updateDate=currUpData['updated_date'];
                  }
  
                  this.appNotifyCenApi.getNotifications(null,userId,null,null,null,null,null,null,updateDate).subscribe((respDatas:any)=>{
  
                      let responseResults = respDatas['result']?respDatas['result']:[];
  
                      // DownSync Start
                      
                      async.each(responseResults,(respData,callback:any)=>{
                          
                        
                          let sQuery="SELECT * FROM "+tableName+" WHERE server_ntc_id="+respData['ntc_id']+"";
                          this.queryExecuteSql(sQuery,[]).then((resQuData:any)=>{
                               
                           
                               if(resQuData.rows.length > 0){
                                      
                                        let locaDataRow=resQuData.rows.item(0);
                                        let updateObj={};
                                        if(locaDataRow['sync_status']==1){
                                            
                                           
                                            updateObj['ntc_app_name']=respData['ntc_app_name'];
                                            updateObj['ntc_type']=respData['ntc_type'];
                                            updateObj['ntc_type_id']=respData['ntc_type_id'];
                                            updateObj['ntc_type_data']=respData['ntc_type_data'];
                                            updateObj['ntc_from_user_id']=respData['ntc_from_user_id'];
                                            updateObj['ntc_from_user_data']=respData['ntc_from_user_data'];
                                            updateObj['ntc_to_user_id']=respData['ntc_to_user_id'];
                                            updateObj['ntc_to_user_data']=respData['ntc_to_user_data'];
                                            updateObj['ntc_user_read_flag']=respData['ntc_user_read_flag'];
                                            updateObj['created_date']=respData['created_date'];
                                            updateObj['updated_date']=respData['updated_date'];
                                            updateObj['status']=respData['status'];
                                            updateObj['local_created_date']=respData['created_date'];
                                            updateObj['local_updated_date']=respData['updated_date'];
                                            
                                        }
                                    
                                          let whereCon=" server_ntc_id="+respData['ntc_id']+"";
                  
                                          this.updateData(updateObj,tableName,whereCon).then((resInsData)=>{
                                        
                                            callback();
  
                                          },(err)=>{
  
                                            callback();
  
                                          }); 
  
                                 
                                    
                                    
  
  
                              }else{
  
                                          let insertObj={};
                                          insertObj['server_ntc_id']=respData['ntc_id'];
                                          insertObj['ntc_app_name']=respData['ntc_app_name'];
                                          insertObj['ntc_type']=respData['ntc_type'];
                                          insertObj['ntc_type_id']=respData['ntc_type_id'];
                                          insertObj['ntc_type_data']=respData['ntc_type_data'];
                                          insertObj['ntc_from_user_id']=respData['ntc_from_user_id'];
                                          insertObj['ntc_from_user_data']=respData['ntc_from_user_data'];
                                          insertObj['ntc_to_user_id']=respData['ntc_to_user_id'];
                                          insertObj['ntc_to_user_data']=respData['ntc_to_user_data'];
                                          insertObj['ntc_user_read_flag']=respData['ntc_user_read_flag'];
                                          insertObj['created_date']=respData['created_date'];
                                          insertObj['updated_date']=respData['updated_date'];
                                          insertObj['status']=respData['status'];
                                          insertObj['local_created_date']=respData['created_date'];
                                          insertObj['local_updated_date']=respData['updated_date'];
                                          insertObj['sync_status']=respData['sync_status'];
                                          this.insertData(insertObj,tableName).then((resInsData)=>{
                                                   callback();
                                         },(err)=>{
                                                   callback();
                                          });
  
         
  
  
                              }
                              
  
                          },(errChild)=>{
                                  callback();
                          });
  
                      
                    },(err)=>{
                          
  
                          // UpSync Start
                          
                          let queryU="SELECT * FROM "+tableName+" WHERE sync_status=0";
  
                              this.queryExecuteSql(queryU,[]).then((resDataU:any)=>{
                                      console.log('resDataU',resDataU);
  
                                      let resDatasUss=[];
                                      for(let m=0;m<resDataU.rows.length;m++){
                                          resDatasUss.push(resDataU.rows.item(m));
                                      }
                                      
                                       async.each(resDatasUss,(resDatasUs,callbackUss)=>{
  
                                                  let id=0;
                                                  let insertUpdateObj={};
                                                  
  
                                                        insertUpdateObj['ntc_app_name']=resDatasUs['ntc_app_name'];
                                                        insertUpdateObj['ntc_type']=resDatasUs['ntc_type'];
                                                        insertUpdateObj['ntc_type_id']=resDatasUs['ntc_type_id'];
                                                        insertUpdateObj['ntc_type_data']=resDatasUs['ntc_type_data'];
                                                        insertUpdateObj['ntc_from_user_id']=resDatasUs['ntc_from_user_id'];
                                                        insertUpdateObj['ntc_from_user_data']=resDatasUs['ntc_from_user_data'];
                                                        insertUpdateObj['ntc_to_user_id']=resDatasUs['ntc_to_user_id'];
                                                        insertUpdateObj['ntc_to_user_data']=resDatasUs['ntc_to_user_data'];
                                                        insertUpdateObj['ntc_user_read_flag']=resDatasUs['ntc_user_read_flag'];
                                                        insertUpdateObj['status']=resDatasUs['status'];
                                                        insertUpdateObj['ntc_user_read_flag']=resDatasUs['ntc_user_read_flag'];

                                                    if(resDatasUs['server_ntc_id']>0){
                                                        id = resDatasUs['server_ntc_id'];
                                                    }
                                                 
                                                       this.appNotifyCenApi.addEditNotifications(insertUpdateObj,id).subscribe((resSSSData:any)=>{
                                                                  let updateDataObj={};
                                                                  updateDataObj['sync_status']=1;
                                                                  updateDataObj['updated_date']=resSSSData['result']['updated_date']?resSSSData['result']['updated_date']:0;
                                                                  updateDataObj['server_ntc_id']=resSSSData['result']['id']?resSSSData['result']['id']:0;
                                                                  let whereCond=" ntc_id="+resDatasUs['ntc_id'];
                                                                  this.updateData(updateDataObj,tableName,whereCond).then(()=>{
                                                                      callbackUss();
                                                                  },()=>{
                                                                      callbackUss();
                                                                  });
                                                                  
                                                          },(errSSS)=>{
                                                                  console.log('errSSS',errSSS);
                                                                  callbackUss();
                                                         });
                                                  
                                       },(errSSS)=>{
  
                                          resolve(true); 
  
                                      });
  
                                      
                              },(errorU)=>{
                                      console.log('errorU',errorU);
                                      resolve(true); 
                              });
  
  
  
                    });
  
  
  
                  },(error)=>{
                           resolve(true); 
                  });
  
              },(error)=>{
                  console.log('error',error); 
                  resolve(true);
             });
  
        
  
      });   
      
  }

getMineTypes(extType){

        let mimeType="image/jpeg";

        if(extType=="jpeg" || extType=="jpg"){
            mimeType="image/jpeg";
        }else if(extType=="png"){
            mimeType="image/png";
        }else if(extType=="gif"){
            mimeType="image/gif";
        }else if(extType=="pdf"){
            mimeType="application/pdf";
        }else if(extType=="doc"){
            mimeType="application/msword";
        }else if(extType=="doc"){
            mimeType="application/vnd.openxmlformats-officedocument.wordprocessingml.document";
        }else if(extType=="doc"){
            mimeType="application/vnd.openxmlformats-officedocument.wordprocessingml.document";
        }else if(extType=="xls"){
            mimeType="application/vnd.ms-excel";
        }else if(extType=="xlsx"){
            mimeType="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
        }else if(extType=="db"){
            mimeType="application/x-sqlite3";
        }

        return mimeType;
}

uploadLocalFileToServer(allFileObjeArr){

      return new Promise((resolve,reject)=>{

        console.log('allFileObjeArr',allFileObjeArr);

        let newAllFileObjeArr={};

         let  asyncTaksFiles = [];

        const fileTransfer: FileTransferObject = this.transfer.create();

        for (let key in allFileObjeArr) {

            console.log('key upload object',key);

            let keyName=key;

            if(allFileObjeArr.hasOwnProperty(keyName)){
                newAllFileObjeArr[keyName]=[];
                
                let filesArrs = allFileObjeArr[keyName] && allFileObjeArr[keyName]!="" ?JSON.parse(allFileObjeArr[keyName]):[];
               
                 console.log('key upload object',key);

                asyncTaksFiles.push((callback)=>{

                   async.each(filesArrs,(fileS,callbackC)=>{

                        if(fileS['sync_status']==1 || fileS['sync_status']=="1"){
                            newAllFileObjeArr[keyName].push(fileS);
                            callbackC();
                            return false;
                        }
                        
                        let mimeType=this.getMineTypes(fileS['fileType']);
                        let fileName=fileS['name'];
                        let fileLocalPath=fileS['path'];
                        let uploadUrl=SITE_API.CONTAINER+fileS['container']+"/upload";
                        let options = {
                            fileKey: "file",
                            fileName: fileName,
                            chunkedMode: false,
                            mimeType: mimeType,
                            params : {"fileName":fileName}
                        };
                        console.log("fileLocalPath=>",fileLocalPath);
                        console.log("uploadUrl=>",uploadUrl);
                        console.log("options=>",options);

                        console.log("<===========================================>");
                        console.log("cordova.file.datadirectory=>",cordova.file.dataDirectory);
                        console.log("cordova.file.applicationStorageDirectory=>",cordova.file.applicationStorageDirectory);
                        console.log("fileLocalPath=>",fileLocalPath);
                        console.log("<===========================================>");

                        fileTransfer.upload(fileLocalPath,uploadUrl,options)
                        .then((dataT) => {
                             // success
                             console.log('File Upload suceess',dataT);
                             fileS['serverPath']=SITE_API.CONTAINER+fileS['container']+"/download/"+fileName;
                             fileS['sync_status']=1;
                             newAllFileObjeArr[keyName].push(fileS);
                             callbackC();
                        }, (errT) => {
                             // error
                              console.log('File Upload error',errT);
                              callbackC();
                        });
                            
                        
                    },(error)=>{

                        callback();
                    });

                });
          }

     }

    
         let allTaskComplete = ()=>{
            resolve(newAllFileObjeArr);
        }

        async.parallel(asyncTaksFiles, function(){
            allTaskComplete();
        });

         
      });
}

downloadServerFileToLocal113(allFileObjeArr){
         return new Promise((resolve,reject)=>{


        let newAllFileObjeArr={};

         let  asyncTaksFiles = [];

        const fileTransfer: FileTransferObject = this.transfer.create();

        for (let key in allFileObjeArr) {

            let keyName=key;
            if(allFileObjeArr.hasOwnProperty(keyName)){
                newAllFileObjeArr[keyName]=[];
                let filesArrs = JSON.parse(allFileObjeArr[keyName]);

                asyncTaksFiles.push((callback)=>{

                   async.each(filesArrs,(fileS,callbackC)=>{

                            //let downloadPath = fileS['serverPath'];
                            let downFileName = fileS['name'];
                            let downloadPath=SITE_API.CONTAINER+fileS['container']+"/download/"+downFileName;
                            fileTransfer.download(downloadPath, this.file.dataDirectory + downFileName).then((entry) => {
                              //  console.log('download complete: ' + entry.toURL());
                                let downPath = entry.toURL();
                                console.log('File Download suceess',entry);
                                fileS['path']=downPath;
                                fileS['sync_status']=1;
                                newAllFileObjeArr[keyName].push(fileS);
                                callbackC();

                             }, (errT) => {
                                // handle error
                                console.log('File download error',errT);
                                callbackC();
                            });
                            
                        
                    },(error)=>{

                        callback();
                    });

                });
          }

     }

    
         let allTaskComplete = ()=>{
            resolve(newAllFileObjeArr);
        }

        async.parallel(asyncTaksFiles, function(){
            allTaskComplete();
        });

         
      });    
}

downloadServerFileToLocal(allFileObjeArr){
    return new Promise((resolve,reject)=>{


   let newAllFileObjeArr={};

    let  asyncTaksFiles = [];

   const fileTransfer: FileTransferObject = this.transfer.create();

   for (let key in allFileObjeArr) {

       let keyName=key;
       if(allFileObjeArr.hasOwnProperty(keyName)){
           newAllFileObjeArr[keyName]=[];
           let filesArrs = JSON.parse(allFileObjeArr[keyName]);

           asyncTaksFiles.push((callback)=>{

              async.each(filesArrs,(fileS,callbackC)=>{

                       //let downloadPath = fileS['serverPath'];
                       let downFileName = fileS['name'];
                       let downloadPath=SITE_API.CONTAINER+fileS['container']+"/download/"+downFileName;
                       let mineType = this.getMineTypes(fileS['fileType']);
                    //    fileTransfer.download(downloadPath, this.file.dataDirectory + downFileName).then((entry) => {
                    //      //  console.log('download complete: ' + entry.toURL());
                    //        let downPath = entry.toURL();
                    //        console.log('File Download suceess',entry);
                    //        fileS['path']=downPath;
                    //        fileS['sync_status']=1;
                    //        newAllFileObjeArr[keyName].push(fileS);
                    //        callbackC();

                    //     }, (errT) => {
                    //        // handle error
                    //        console.log('File download error',errT);
                    //        callbackC();
                    //    });
                      window.resolveLocalFileSystemURL(this.file.dataDirectory,(dirEntry)=> {
                            this.createFile(dirEntry,downFileName,downloadPath,mineType).then((fileData) =>{
                               console.log('fileData', fileData);
                               fileS['path']=this.file.dataDirectory + downFileName;
                               fileS['sync_status']=1;
                               newAllFileObjeArr[keyName].push(fileS);
                                callbackC();
                            }, (errorTT) => {
                                callbackC();
                            });
                        },(errT)=>{
                           console.log('File download error',errT);
                           callbackC();
                       });
                   
               },(error)=>{

                   callback();
               });

           });
     }

}


    let allTaskComplete = ()=>{
       resolve(newAllFileObjeArr);
   }

   async.parallel(asyncTaksFiles, function(){
       allTaskComplete();
   });

    
 });    
}

createFile(dirEntry,downFileName,downloadPath,mineType){
    return new Promise((resolve, reject) => {
        dirEntry.getFile(downFileName, {create: true, exclusive: false}, function(fileEntry) {
            console.log('createFile');
            let xhr = new XMLHttpRequest();
            xhr.open('GET', downloadPath, true);
            xhr.responseType = 'blob';

            xhr.onload = function() {
                console.log('xhr.status', xhr.status);
                if (xhr.status == 200) {
                let blob = new Blob([xhr.response], { type: mineType, });
                 window["thisRef"].writeFile(fileEntry, blob).then((data)=>{
                    resolve(data);
                 },()=>{
                    reject(true);
                 });
                }else{
                    reject(true);
                }
            };
            xhr.send();
        },(onFSError)=>{
             console.log(JSON.stringify(onFSError));
             reject(true);
        });
    });
}
writeFile(fileEntry, data){
    return new Promise((resolve, reject) => {
        console.log('writeFile');
        fileEntry.createWriter((fileWriter)=>{
            console.log('createWriter');
            fileWriter.onerror = function(e) {
                console.log("Failed file write: " + e.toString());
                reject(false);
            };

            function writeFinish() {
                function success(file) {
                    console.log("Wrote file with size: " + file);
                    resolve(file);
                }
                function fail(error) {
                  console.log("Unable to retrieve file properties: " + error.code);
                  reject(false);
                }
                fileEntry.file(success, fail);
            }
            var written = 0;
            var BLOCK_SIZE = 1*1024*1024; // write 1M every time of write
            function writeNext(cbFinish) {
                fileWriter.onwrite = function(evt) {
                    if (written < data.size)
                        writeNext(cbFinish);
                    else
                        cbFinish();
                };
                if (written) fileWriter.seek(fileWriter.length);
                fileWriter.write(data.slice(written, written + Math.min(BLOCK_SIZE, data.size - written)));
                written += Math.min(BLOCK_SIZE, data.size - written);
            }
            writeNext(writeFinish);
        });
    });    
}
syncAllMasterTLHACAM(){
     return new Promise((resolve,reject)=>{
     
        if(globalInternetCheckConnection==false){
                this.showSyncToast(ALL_MESSAGE.COMMON_MESSAGE.SYNC_NO_FAILED_INTERNET);
                reject(true);
                return false;
        }      
        
        if(this.syncAllMasterRunningFlag){
            this.syncAllMasterRunningFlag=true;
            //this.showSyncToast(ALL_MESSAGE.COMMON_MESSAGE.SYNC_RUN_GLOABL_INTERNET);
            reject(true);
            return false;
        }

      console.log('syncAllMaster');
      console.log('sessionUserGlobalData',sessionUserGlobalData);


        let allTaskComplete = ()=>{
            this.syncAllMasterRunningFlag=false;
            resolve(true);
        }


      	var asyncTasks = [];

     

        asyncTasks.push((callback)=>{
                this.syncProductM().then(()=>{
                   // resolve(true);
                   callback();
                },()=>{
                  //   reject(true);
                  callback();
                });
        });  

  

        asyncTasks.push((callback)=>{
                this.syncProjectStageM().then(()=>{
                   // resolve(true);
                   callback();
                },()=>{
                  //   reject(true);
                  callback();
                });
        }); 

        asyncTasks.push((callback)=>{
                this.syncProjectTypeM().then(()=>{
                   // resolve(true);
                   callback();
                },()=>{
                  //   reject(true);
                  callback();
                });
        });

        asyncTasks.push((callback)=>{
                this.syncProjectNmcM().then(()=>{
                   // resolve(true);
                   callback();
                },()=>{
                  //   reject(true);
                  callback();
                });
        });      

                      


        async.parallel(asyncTasks, function(){
            allTaskComplete();
        });


      //let allMasterTableList=['retailer_distributor_master','product_master','brand_master','project_stage_tbl','project_type_tbl','nmc_tbl','monthly_actual_target','monthly_forecast_target','monthly_visiting_schedule'];
      
 });
}

// Sync all master data from API to local DB
syncAllMaster(){
     return new Promise((resolve,reject)=>{
        
        // If no internet access
        if(globalInternetCheckConnection==false){
                this.showSyncToast(ALL_MESSAGE.COMMON_MESSAGE.SYNC_NO_FAILED_INTERNET);
                reject(true);
                return false;
        }      
        

        if(this.syncAllMasterRunningFlag){
            this.syncAllMasterRunningFlag=true;
            //this.showSyncToast(ALL_MESSAGE.COMMON_MESSAGE.SYNC_RUN_GLOABL_INTERNET);
            reject(true);
            return false;
        }

      console.log('syncAllMaster');
      console.log('sessionUserGlobalData',sessionUserGlobalData);
      console.log("syncAllMaster");


        let allTaskComplete = ()=>{
            this.syncAllMasterRunningFlag=false;
            resolve(true);
        }


      	var asyncTasks = [];

        asyncTasks.push((callback)=>{
                this.syncRdsM().then(()=>{
                   // resolve(true);
                   callback();
                },()=>{
                  //   reject(true);
                  callback();
                });
        });

        asyncTasks.push((callback)=>{
                this.syncProductM().then(()=>{
                   // resolve(true);
                   callback();
                },()=>{
                  //   reject(true);
                  callback();
                });
        });  

        asyncTasks.push((callback)=>{
                this.syncProjectStageM().then(()=>{
                   // resolve(true);
                   callback();
                },()=>{
                  //   reject(true);
                  callback();
                });
        }); 

        asyncTasks.push((callback)=>{
                this.syncProjectTypeM().then(()=>{
                   // resolve(true);
                   callback();
                },()=>{
                  //   reject(true);
                  callback();
                });
        });

        asyncTasks.push((callback)=>{
                this.syncProjectNmcM().then(()=>{
                   // resolve(true);
                   callback();
                },()=>{
                  //   reject(true);
                  callback();
                });
        });      

        asyncTasks.push((callback)=>{
                this.syncHomeStats().then(()=>{
                   // resolve(true);
                   callback();
                },()=>{
                  //   reject(true);
                  callback();
                });
        });   

        // asyncTasks.push((callback)=>{
        //         this.syncTargetsMaster().then(()=>{
        //            // resolve(true);
        //            callback();
        //         },()=>{
        //           //   reject(true);
        //           callback();
        //         });
        // });                


        async.parallel(asyncTasks, function(){
            allTaskComplete();
        });


      //let allMasterTableList=['retailer_distributor_master','product_master','brand_master','project_stage_tbl','project_type_tbl','nmc_tbl','monthly_actual_target','monthly_forecast_target','monthly_visiting_schedule'];
      
 });
 
}

syncRdsM(){
     return new Promise((resolve,reject)=>{
         
        if(globalInternetCheckConnection==false){
                this.showSyncToast(ALL_MESSAGE.COMMON_MESSAGE.SYNC_NO_FAILED_INTERNET);
                reject(true);
                return false;
        } 

        //  let subDist = sessionUserGlobalData['user']['subdistrict'];
        //  let subDistFilterArr=[];
        //  console.log('S subDistFilterArr',subDistFilterArr);
        //  let subDistStr="";
        //  for(let l=0;l<subDist.length;l++){
        //    if(l>0){
        //       subDistStr+=","+ subDist[l]['id'];
        //    }else{
        //       subDistStr+=""+subDist[l]['id'];
        //    }
        //     subDistFilterArr.push(subDist[l]['id']);
        //  }

        
      //  let filterS={"subDistrict":subDistFilterArr};
      //  let filterS={"subDistrict":subDistStr}; 
       //  console.log('filterS',filterS);

        let tableName='retailer_distributor_master';
        let userId = sessionUserGlobalData['userId'];
        this.app_rdsApi.getRds(null,null,null,null,userId).subscribe((respDatas)=>{
                  console.log('resData',respDatas);
                  let resDatas = respDatas['result']?respDatas['result']:[];
                  async.each(resDatas,(resData,callback:any)=>{
                    let insertObj={};
                    insertObj['server_rds_id']=resData['id'];
                    insertObj['holcim_id']=resData['holcim_id'];
                    insertObj['rds_name']=resData['rds_name'];
                    insertObj['rds_mobile']=resData['rds_mobile'];
                    insertObj['rds_phone']=resData['rds_phone'];
                    insertObj['rds_email']=resData['rds_email'];
                    insertObj['rds_gender']=resData['rds_gender'];
                    insertObj['rds_type']=resData['rds_type'];
                    insertObj['rds_address']=resData['rds_address'];

                    insertObj['rds_province']=JSON.stringify(resData['province']);
                    //insertObj['rds_province_name']=resData['province_name'];
                    insertObj['rds_sub_district']=JSON.stringify(resData['subdistrict']);
                   // insertObj['rds_sub_district_name']=resData['sub_district_name'];
                    insertObj['rds_city']=JSON.stringify(resData['municipality']);
                   // insertObj['rds_city_name']=resData['city_name'];
                    insertObj['rds_postalcode']=JSON.stringify(resData['postal_code']);

                    insertObj['rds_status']=resData['rds_status'];
                    insertObj['created_date']=resData['created_date'];
                    insertObj['updated_date']=resData['updated_date'];
                    insertObj['created_by']=resData['created_by'];
                    insertObj['updated_by']=resData['updated_by'];
                    insertObj['sync_status']=1;
                    insertObj['ext_data']="";
                   
                    this.insertOrReplaceData(insertObj,tableName).then((resInsData)=>{
                         console.log('insertObj---->',insertObj);
                        callback();
                    },(err)=>{
                        callback();
                    })                     
                  },(err)=>{
                        resolve(true); 
                  })
        },(error)=>{
                console.log('app_rdsApi error',error);
                reject(false);
        });
     });
}

syncHomeStats(){
     return new Promise((resolve,reject)=>{
        console.log(" syncHomeStats triggered ");
        if(globalInternetCheckConnection==false){
            this.showSyncToast(ALL_MESSAGE.COMMON_MESSAGE.SYNC_NO_FAILED_INTERNET);
            reject(true);
            return false;
        }
        let sphId = sessionUserGlobalData['userId'];
        
        let tableName='home_stats';
        let filterS={"where":{'sph_id':sphId}};
        this.monthlyStats.getStats(sphId).subscribe((resDatas)=>{
                    let resultDatas = resDatas['result']
                  async.each(resultDatas,(resData,callback:any)=>{
                    console.log('resData homeStats resData',resData);
                    let insertObj={};
                    insertObj['stats_date']=moment(resData['stat_date']).valueOf();
                    insertObj['sphid']=resData['sph_id'];
                    insertObj['target_for']=resData['target_for'];
                    insertObj['monthly_target']=Math.round(resData['monthly_target'] * 100) / 100;
                    insertObj['achieved_target']=Math.round(resData['achieved_target'] * 100) / 100;
                    insertObj['target_remaining']=Math.round(resData['remaining_target'] * 100) / 100;
                    insertObj['todays_target']=Math.round(resData['todays_target'] * 100) / 100;
                    insertObj['todays_achievement']=Math.round(resData['todays_achievement'] * 100) / 100;
                    insertObj['estimated_target']=Math.round(resData['estimated_target'] * 100) / 100;
                    insertObj['created_date']=resData['created_date'];
                    insertObj['updated_date']=resData['updated_date'];
                    this.insertOrReplaceData(insertObj,tableName).then((resInsData)=>{
                        console.log(" syncHomeStats inserting ");
                        callback();
                    },(err)=>{
                        console.log(" syncHomeStats error ",err,err.message);
                        callback();
                    })                     
                  },(err)=>{
                        resolve(true); 
                  })
        },(error)=>{
                console.log('app_rdsApi error',error);
                reject(false);
        });
     });
}

syncHomeStatsAcTlh(roleType:any){
     return new Promise((resolve,reject)=>{
        console.log(" syncHomeStats triggered ");
        if(globalInternetCheckConnection==false){
            this.showSyncToast(ALL_MESSAGE.COMMON_MESSAGE.SYNC_NO_FAILED_INTERNET);
            reject(true);
        }

        let uIds;
        if(roleType == 'sph'){
            uIds = sessionUserGlobalData['associatedSph'];
        }else if(roleType == 'tlh'){
            uIds = sessionUserGlobalData['associatedTlh'];
        }

        let currDate = moment().format("YYYY-MM-DD").toString(); 
        let tableName='home_stats_ac_tlh';
        
        if(uIds.length > 0){
            this.monthlyStats.getStats(uIds,currDate).subscribe((resDatas)=>{
                let resultDatas = resDatas['result']

                if(resultDatas.length > 0){

                    let deleteData = 'DELETE FROM home_stats_ac_tlh';
                    this.queryExecuteSql(deleteData,[]).then((data) => {
                        console.log(" deleteData called ",deleteData);

                        async.each(resultDatas,(resData,callback:any)=>{
                            console.log('resData homeStats resData',resData);
                            let insertObj={};
                            insertObj['stats_date']=moment(resData['stat_date']).valueOf();
                            insertObj['sphid']=resData['sph_id'];
                            insertObj['target_for']=resData['target_for'];
                            insertObj['monthly_target']=Math.round(resData['monthly_target'] * 100) / 100;
                            insertObj['achieved_target']=Math.round(resData['achieved_target'] * 100) / 100;
                            insertObj['target_remaining']=Math.round(resData['remaining_target'] * 100) / 100;
                            insertObj['todays_target']=Math.round(resData['todays_target'] * 100) / 100;
                            insertObj['todays_achievement']=Math.round(resData['todays_achievement'] * 100) / 100;
                            insertObj['estimated_target']=Math.round(resData['estimated_target'] * 100) / 100;
                            insertObj['created_date']=resData['created_date'];
                            insertObj['updated_date']=resData['updated_date'];
                            this.insertOrReplaceData(insertObj,tableName).then((resInsData)=>{
                                console.log(" syncHomeStats inserting ");
                                callback();
                            },(err)=>{
                                console.log(" syncHomeStats error ",err,err.message);
                                callback();
                            })                     
                        },(err)=>{
                            resolve(true); 
                        })
                
                    },(err)=>{
                        resolve(true); 
                        console.log(" error occured ");
                    });
                
                }else{
                    resolve(true);
                }

            },(error)=>{
                    console.log('app_rdsApi error',error);
                    reject(false);
            });
            
        }else{
            reject(false);
        }

     });
}

syncUserData(){
     return new Promise((resolve,reject)=>{
        console.log(" syncHomeStats triggered ");
        if(globalInternetCheckConnection==false){
            this.showSyncToast(ALL_MESSAGE.COMMON_MESSAGE.SYNC_NO_FAILED_INTERNET);
            reject(true);
            return false;
        }
        let uId = sessionUserGlobalData['userId'];
        let role = sessionUserGlobalData['user']['roles'][0]['name'];
        
        let tableName='user_data';
        this.userMapping.getUserMapped(uId,role).subscribe((resDatas)=>{
                    let resultDatas = resDatas['result'];
                    console.log('resultDatas.length',resultDatas.length);
                    if(resultDatas.length > 0){
                                                
                            let deleteData = 'DELETE FROM user_data';
                            this.queryExecuteSql(deleteData,[]).then((data) => {
                                let acData = [];
                                let tlhData = [];
                                let sphData = [];
                                async.each(resultDatas,(resData,callback)=>{                                    
                                    if(resData['rolename'] == '$tlh'){
                                        tlhData.push(resData['uid']);
                                    }else if(resData['rolename'] == '$sph'){
                                        sphData.push(resData['uid']);
                                    }else if(resData['rolename'] == '$ac'){
                                        acData.push(resData['uid']);
                                    }
                                    console.log('resData userData resData',resData);
                                    let insertObj={};
                                    insertObj['uid']=resData['uid'];
                                    insertObj['pid']=resData['parent_id'];
                                    insertObj['role']=resData['rolename'];
                                    insertObj['name']=resData['user_name'];
                                    insertObj['mobile']='';
                                    insertObj['postal_code']=JSON.stringify(resData['postal_code']);
                                    insertObj['provience']=JSON.stringify(resData['province']);
                                    insertObj['muncipality']=JSON.stringify(resData['municipality']);
                                    insertObj['district']=JSON.stringify(resData['district']);
                                    insertObj['subdistrict']=JSON.stringify(resData['subdistrict']);
                                    insertObj['status']='';
                                    this.insertOrReplaceData(insertObj,tableName).then((resInsData)=>{
                                        console.log(" syncUserData inserting ");
                                        callback();
                                    },(err)=>{
                                        console.log(" syncUserData error ",err,err.message);
                                        callback();
                                    })                     
                                },(err)=>{
                                    this.getAppPreference("userCreds").then((resDataU:any) => {
                                        resDataU.associatedAc = acData.join();
                                        resDataU.associatedTlh = tlhData.join();
                                        resDataU.associatedSph = sphData.join();
                                        console.log(" resDataU ",resDataU);
                                        this.storeAppPreference("userCreds",resDataU);
                                        sessionUserGlobalData['associatedAc'] = acData.join();
                                        sessionUserGlobalData['associatedTlh'] = tlhData.join();
                                        sessionUserGlobalData['associatedSph'] = sphData.join();
                                        resolve(true);
                                    },(err)=>{
                                        reject(err);
                                    })
                                    
                                })
                                
                            },(error) => {
                                console.log('failed select query');
                                reject(error);
                            });
                        
                    }else{
                        reject(false);
                    }

        },(error)=>{
                console.log('app_rdsApi error',error);
                reject(false);
        });
     });
}



syncCustomerOrLeadExistsCheckByNumber(mobileNum){
    return new Promise((resolve,reject)=>{
        let whereF=null;
        whereF={"where":{"and":[{"lead_mobile":mobileNum}]}};
        this.elApi.find(whereF).subscribe((respSD:any)=>{
            if(respSD.length>0){
              resolve(true);
            }else{
              resolve(false);
            }
        },(error)=>{
           resolve(false);
        });
    });
}

syncEAPLeadsDandChatSup(){
    return new Promise(async (resolve,reject)=>{

         if(globalInternetCheckConnection==false){
                this.showSyncToast(ALL_MESSAGE.COMMON_MESSAGE.SYNC_NO_FAILED_INTERNET);
                reject(true);
                return false;
         }

        if(this.syncCustomerRunningFlag){
                this.showSyncToast(ALL_MESSAGE.COMMON_MESSAGE.SYNC_RUN_GLOABL_INTERNET);
                reject(true);
                return false;
        }
        this.syncCustomerRunningFlag=true;
        let allTaskComplete = ()=>{
                this.syncCustomerRunningFlag=false;
                resolve(true);
        }

        let asyncTasks = [];

        asyncTasks.push((callback)=>{
            this.syncEAPLeadsD().then(()=>{
                callback();
            },()=>{
                callback();
            });
        });

        asyncTasks.push((callback)=>{
            this.syncEAPLeadsDChatSupLeads().then(()=>{
                callback();
            },()=>{
                callback();
            });
        });

        async.parallelLimit(asyncTasks,1,allTaskComplete);

    })
}

syncEAPLeadsD(){
    return new Promise(async (resolve,reject)=>{
        
       
        
        let tableName='eap_lead';
        let filterS={};
        let query="SELECT * FROM "+tableName+" ORDER BY updated_date desc LIMIT 1";

        this.queryExecuteSql(query,[]).then((resDataQ:any)=>{
                let filterDataH={};
              
           
                 let postCArr = sessionUserGlobalData['user']['postal_code'];
                 let postCFilterArr=[];
                 let postCtStr="";
                 for(let l=0;l<postCArr.length;l++){
                   if(l>0){
                    postCtStr+=","+ postCArr[l]['id'];
                   }else{
                    postCtStr+=""+postCArr[l]['id'];
                   }
                   postCFilterArr.push(postCArr[l]['id']);
                 }
                 if(postCtStr!=""){
                   filterDataH['lead_postal_code_id']=postCtStr;
                 }else{
                  filterDataH['lead_postal_code_id']="0";
                 }
                 if(resDataQ.rows.length > 0){
                    let tmpDataObj=resDataQ.rows.item(0);
                    filterDataH['updated_date']=tmpDataObj['updated_date'];
                }
              
                this.elApi.getLead(filterDataH).subscribe((respDatas:any)=>{
                    
                    console.log('respDatas',respDatas);

                    let responseResults = respDatas['result'];

                    console.log('responseResults',responseResults);

                    // DownSync Start
                    
                    async.each(responseResults,(respData,callback:any)=>{
                        
                        console.log('DownSync each respData',respData);

                        let sQuery="SELECT * FROM "+tableName+" WHERE server_lead_id="+respData['lead_id']+"";
                        
                        this.queryExecuteSql(sQuery,[]).then((resQuData:any)=>{

                            console.log('queryExecuteSql resQuData',resQuData);

                            if(resQuData.rows.length > 0){
                                    
                                    let locaDataRow=resQuData.rows.item(0);

                                    console.log('locaDataRow',locaDataRow);

                                    let updateObj={};
                                    let syncStatus=1;
                                   
                                    let allFileObjeArr = {};

                                    if(locaDataRow['sync_status']==1){
                                            updateObj['lead_name']=respData['lead_name'];
                                            updateObj['lead_segment']=respData['lead_segment'];
                                            
                                            updateObj['lead_mobile']=respData['lead_mobile'];
                                            updateObj['lead_status']=respData['lead_status'];
                                            updateObj['server_lead_refer_id']=respData['lead_refer_id'];
                                            updateObj['lead_visit_date']=respData['lead_visit_date'];
                                            updateObj['lead_postal_code']=respData['lead_postal_code'];
                                            updateObj['lead_postal_code_id']=respData['lead_postal_code_id'];
                                            updateObj['lead_province']=respData['lead_province'];
                                            updateObj['lead_province_id']=respData['lead_province_id'];
                                            updateObj['lead_city']=respData['lead_city'];
                                            updateObj['lead_city_id']=respData['lead_city_id'];
                                            updateObj['lead_sub_district']=respData['lead_sub_district'];
                                            updateObj['lead_sub_district_id']=respData['lead_sub_district_id'];
                                            updateObj['lead_address']=respData['lead_address'];
                                            updateObj['lead_interview_result']=respData['lead_interview_result'];
                                            updateObj['lead_support_ac']=respData['lead_support_ac'];
                                            updateObj['lead_support_telesales']=respData['lead_support_telesales'];
                                            updateObj['lead_photos']=respData['lead_photos'];
                                            if(locaDataRow['lead_photos']!=respData['lead_photos']){
                                              allFileObjeArr['lead_photos']=respData['lead_photos'];
                                            }
                                         
                                            updateObj['latitude']=respData['latitude'];
                                            updateObj['longitude']=respData['longitude'];
                                            updateObj['created_date']=respData['created_date'];
                                            updateObj['updated_date']=respData['updated_date'];
                                            updateObj['created_by']=respData['created_by'];
                                            updateObj['created_by_name']=respData['createdBy'];
                                            updateObj['updated_by']=respData['updated_by'];
                                            updateObj['local_updated_date']=respData['local_updated_date'];
                                            updateObj['local_created_date']=respData['local_created_date'];
                                            updateObj['status']=respData['status'];
                                    }

                                           // Lead Points
                                           updateObj['leadTotal']=respData['leadTotal'];
                                           updateObj['momentTotal']=respData['momentTotal'];
                                           updateObj['referTotal']=respData['referTotal'];
                                           updateObj['invoiceTotal']=respData['invoiceTotal'];

                                           // Lead new Data
                                           updateObj['segmentDetail']=respData['segmentDetail']?JSON.stringify(respData['segmentDetail']):"[]";
                                           updateObj['assigned_sph']=respData['assigned_sph'] && respData['assigned_sph']!='null'?respData['assigned_sph']:0;
                                           updateObj['sphDetail']=respData['sphDetail']?JSON.stringify(respData['sphDetail']):"[]";
                                           updateObj['referDetail']=respData['referDetail']?JSON.stringify(respData['referDetail']):"[]";

                                    updateObj['ext_data']="";
                                    let whereCon=" lead_id="+locaDataRow['lead_id']+" ";
                                 
                                    this.downloadServerFileToLocal(allFileObjeArr).then((allFileObjeArrRet)=>{
                                        if(locaDataRow['lead_photos']!=respData['lead_photos']){
                                            updateObj['lead_photos']=JSON.stringify(allFileObjeArrRet['lead_photos']);
                                        }
                                        
                                        this.updateData(updateObj,tableName,whereCon).then((resInsData)=>{
                                      
                                          callback();

                                        // File Save To Local IF Updated

                                        },(err)=>{

                                          callback();

                                        }); 

                                },(errDDDDD)=>{

                                     callback();

                                });
                                  
                                  


                            }else{


                                            let insertObj={};
                                            insertObj['server_lead_id']=respData['lead_id'];
                                            insertObj['lead_segment']=respData['lead_segment'];
                                            insertObj['server_lead_refer_id']=respData['lead_refer_id'];

                                            insertObj['lead_refer_id']=0;
                                            
                                            insertObj['lead_name']=respData['lead_name'];
                                            insertObj['lead_mobile']=respData['lead_mobile'];
                                            insertObj['lead_status']=respData['lead_status'];
                                            insertObj['lead_visit_date']=respData['lead_visit_date'];
                                            insertObj['lead_postal_code']=respData['lead_postal_code'];
                                            insertObj['lead_postal_code_id']=respData['lead_postal_code_id'];
                                            insertObj['lead_province']=respData['lead_province'];
                                            insertObj['lead_province_id']=respData['lead_province_id'];
                                            insertObj['lead_city']=respData['lead_city'];
                                            insertObj['lead_city_id']=respData['lead_city_id'];
                                            insertObj['lead_sub_district']=respData['lead_sub_district'];
                                            insertObj['lead_sub_district_id']=respData['lead_sub_district_id'];
                                            insertObj['lead_address']=respData['lead_address'];
                                            insertObj['lead_interview_result']=respData['lead_interview_result'];
                                            insertObj['lead_support_ac']=respData['lead_support_ac'];
                                            insertObj['lead_support_telesales']=respData['lead_support_telesales'];
                                            insertObj['lead_photos']=respData['lead_photos'];
                                            insertObj['latitude']=respData['latitude'];
                                            insertObj['longitude']=respData['longitude'];
                                            insertObj['created_date']=respData['created_date'];
                                            insertObj['updated_date']=respData['updated_date'];
                                            insertObj['created_by']=respData['created_by'];
                                            insertObj['created_by_name']=respData['createdBy'];
                                            insertObj['updated_by']=respData['updated_by'];

                                             // Lead Points
                                             insertObj['leadTotal']=respData['leadTotal'];
                                             insertObj['momentTotal']=respData['momentTotal'];
                                             insertObj['referTotal']=respData['referTotal'];
                                             insertObj['invoiceTotal']=respData['invoiceTotal'];

                                              // Lead new Data
                                              insertObj['segmentDetail']=respData['segmentDetail']?JSON.stringify(respData['segmentDetail']):"[]";
                                              insertObj['assigned_sph']=respData['assigned_sph'] && respData['assigned_sph']!='null'?respData['assigned_sph']:0;
                                              insertObj['sphDetail']=respData['sphDetail']?JSON.stringify(respData['sphDetail']):"[]";
                                              insertObj['referDetail']=respData['referDetail']?JSON.stringify(respData['referDetail']):"[]";

                                            insertObj['local_updated_date']=respData['local_updated_date'];
                                            insertObj['local_created_date']=respData['local_created_date'];
                                            insertObj['status']=respData['status'];
                                            insertObj['sync_status']=1;

                                    let allFileObjeArr = {};
                                    allFileObjeArr['lead_photos']=respData['lead_photos'];
                    
                                    this.downloadServerFileToLocal(allFileObjeArr).then((allFileObjeArrRet)=>{

                                        insertObj['lead_photos']=JSON.stringify(allFileObjeArrRet['lead_photos']);

                                        this.insertData(insertObj,tableName).then((resInsData)=>{
                                                callback();
                                            },(err)=>{
                                                callback();
                                          });

                                    },(errDDD)=>{

                                        callback();

                                    });


                                    


                            }
                            

                        },(errChild)=>{
                                callback();
                        });

                    
                    },(err)=>{
                        

                        // UpSync Start
                        
                        let queryU="SELECT * FROM "+tableName+" WHERE sync_status=0";

                            this.queryExecuteSql(queryU,[]).then((resDataU:any)=>{
                                    console.log('resDataU',resDataU);

                                    let resDatasUss=[];
                                    for(let m=0;m<resDataU.rows.length;m++){
                                        resDatasUss.push(resDataU.rows.item(m));
                                    }
                                    
                                     async.each(resDatasUss,(async (resDatasUs,callbackUss)=>{

                                                let lead_id=0;
                                                let insertUpdateObj={};
                                               
                                                
                                                



                                                insertUpdateObj['lead_name']=resDatasUs['lead_name'];
                                                insertUpdateObj['lead_segment']=resDatasUs['lead_segment'];
                                                insertUpdateObj['lead_mobile']=resDatasUs['lead_mobile'];
                                                insertUpdateObj['lead_status']=resDatasUs['lead_status'];
                                                insertUpdateObj['lead_refer_id']=resDatasUs['server_lead_refer_id'];
                                                insertUpdateObj['lead_status']=resDatasUs['lead_status'];
                                                insertUpdateObj['lead_visit_date']=resDatasUs['lead_visit_date'];
                                                insertUpdateObj['lead_photos']=resDatasUs['lead_photos'];
                                                insertUpdateObj['lead_postal_code']=resDatasUs['lead_postal_code'];
                                                insertUpdateObj['lead_postal_code_id']=resDatasUs['lead_postal_code_id'];
                                                insertUpdateObj['lead_province']=resDatasUs['lead_province'];
                                                insertUpdateObj['lead_province_id']=resDatasUs['lead_province_id'];
                                                insertUpdateObj['lead_city']=resDatasUs['lead_city'];
                                                insertUpdateObj['lead_city_id']=resDatasUs['lead_city_id'];
                                                insertUpdateObj['lead_sub_district']=resDatasUs['lead_sub_district'];
                                                insertUpdateObj['lead_sub_district_id']=resDatasUs['lead_sub_district_id'];
                                                insertUpdateObj['lead_address']=resDatasUs['lead_address'];
                                                insertUpdateObj['lead_interview_result']=resDatasUs['lead_interview_result'];
                                                insertUpdateObj['lead_support_ac']=resDatasUs['lead_support_ac'];
                                                insertUpdateObj['lead_support_telesales']=resDatasUs['lead_support_telesales'];
                                                insertUpdateObj['latitude']=resDatasUs['latitude'];
                                                insertUpdateObj['longitude']=resDatasUs['longitude'];
                                                insertUpdateObj['created_by']=resDatasUs['created_by'];
                                                insertUpdateObj['updated_by']=resDatasUs['updated_by'];
                                                insertUpdateObj['local_created_date']=resDatasUs['local_created_date'];
                                                insertUpdateObj['local_updated_date']=resDatasUs['local_updated_date'];
                                                insertUpdateObj['status']=resDatasUs['status'];
 
                                                
                                                 if(resDatasUs['server_lead_id']>0){
                                                   lead_id=resDatasUs['server_lead_id'];
                                                }

                                              
                                 
                                                let allFileObjeArr = {};
                                                if( this.platform.is('ios') ) {
                                                    allFileObjeArr['lead_photos']=(insertUpdateObj['lead_photos'] && insertUpdateObj['lead_photos']!="")?this.alterimgPath(insertUpdateObj['lead_photos']):"";
                                                } else {
                                                    allFileObjeArr['lead_photos']=insertUpdateObj['lead_photos'];
                                                }
                                                
                                                
                                                let nextExLFlag=true;
                                                if(lead_id==0){
                                                    let dupCusLeadCheckFlag= await this.syncCustomerOrLeadExistsCheckByNumber(resDatasUs['lead_mobile']);
                                                    if(dupCusLeadCheckFlag){
                                                        nextExLFlag=false;
                                                        let removeLocalLeadQ = 'DELETE FROM eap_lead WHERE lead_id ='+resDatasUs['lead_id'];
                                                        console.log(" deleted removeLocalLeadQ ",removeLocalLeadQ);
                                                        this.queryExecuteSql(removeLocalLeadQ,[]).then(()=>{
                                                        console.log('successfully deleted');
                                                             callbackUss();
                                                        },()=>{
                                                             callbackUss();    
                                                        });

                                                    }
                                                }
                                                

                                                
                                                if(nextExLFlag){
                                                    
                                                 
                                                this.uploadLocalFileToServer(allFileObjeArr).then((allFileObjeArrRet)=>{

                                                        // allFileObjeArrRet
                                                        insertUpdateObj['lead_photos']=JSON.stringify(allFileObjeArrRet['lead_photos']);
            
                                                        this.elApi.addEditLead(insertUpdateObj,lead_id).subscribe((resSSSData:any)=>{
                                                            console.log('resSSSData',resSSSData);
                                                            let updateDataObj={};
                                                            updateDataObj['lead_photos']=insertUpdateObj['lead_photos'];
                                                            updateDataObj['server_lead_id']=resSSSData['result']['id']?resSSSData['result']['id']:0;
                                                            updateDataObj['updated_date']=resSSSData['result']['updated_date']?resSSSData['result']['updated_date']:0;
                                                            updateDataObj['sync_status']=1;
                                                            let whereCond=" lead_id="+resDatasUs['lead_id'];
                                                            this.updateData(updateDataObj,tableName,whereCond).then(()=>{
                                                                
                                                                callbackUss();
                                                            },()=>{
                                                                callbackUss();
                                                            });
                                                                
                                                        },(errSSS)=>{
                                                            console.log('errSSS',errSSS);
                                                            callbackUss();
                                                        });

                                                    },()=>{
                                                        callbackUss();
                                                    });

                                                }

                                              




                                                
                                     }),(errSSS)=>{
                                      //   this.syncCustomerRunningFlag=false;
                                        resolve(true); 

                                    });

                                    
                            },(errorU)=>{
                                    console.log('errorU',errorU);
                                  //   this.syncCustomerRunningFlag=false;
                                    resolve(true); 
                            });



                  });



                },(error)=>{
                  //  this.syncCustomerRunningFlag=false;
                    reject(false);
                });


        },()=>{
           // this.syncCustomerRunningFlag=false;
            reject(true);
        });

    }); 
}

async syncEAPLeadsDChatSupLeads(){
    return new Promise(async (resolve,reject)=>{
          let query =` SELECT server_lead_id,lead_id FROM eap_lead WHERE server_lead_id>0`;  
          let resDataQ:any = await this.queryExecuteSql(query,[]).catch((reson)=>{console.log('reson',reson)}); 
          if(!resDataQ){
              reject(false);
          }
          let allLeadIds = [];
          for(let i=0;i<resDataQ.rows.length;i++){
            let tempObj = resDataQ.rows.item(i);
            allLeadIds.push(tempObj);
          }

         async.each(allLeadIds,async(allLeadObj,callback:any)=>{
            let s_lead_id = allLeadObj['server_lead_id'];
            let l_lead_id = allLeadObj['lead_id'];
            let tableName='eap_support_chat';
            let queryQ=`SELECT * FROM ${tableName} WHERE server_chat_lead_id=${s_lead_id}  ORDER BY updated_date desc LIMIT 1`;
            let resDataQQ:any = await this.queryExecuteSql(queryQ,[]).catch((reson)=>{console.log('reson',reson)}); 
            if(!resDataQQ){
                callback();
                return false;
            }
            let filterDataH={}
            filterDataH['chat_lead_id']=s_lead_id;
            if(resDataQQ.rows.length > 0){
                let tmpDataObj=resDataQQ.rows.item(0);
                filterDataH['updated_date']=tmpDataObj['updated_date'];
            }
            let allLeadsChatsData:any = [];
            allLeadsChatsData = await this.escApi.geteapSupportChat(filterDataH).toPromise().catch((reson)=>{return false;})
            if(allLeadsChatsData==false && !allLeadsChatsData['result']){
                callback();
                return false;
            }

            let responseResults = allLeadsChatsData['result'];

            async.each(responseResults,async(respData,callback1:any)=>{

                let sQuery=`SELECT * FROM ${tableName} WHERE server_chat_id=${respData['chat_id']}`;
                let resQuData:any = await this.queryExecuteSql(sQuery,[]).catch((reson)=>{console.log('reson',reson)}); 
                if(!resQuData){
                    callback1();
                    return false;
                }
             
                if(resQuData.rows.length > 0){
                    let locaDataRow=resQuData.rows.item(0);
                    let updateObj={};
                    let syncStatus=1;
                    let allFileObjeArr = {};
                    if(locaDataRow['sync_status']==1){
                        updateObj['chat_from_id']=respData['chat_from_id'];
                        updateObj['chat_mesage']=respData['chat_mesage'];
                        updateObj['created_date']=respData['created_date'];
                        updateObj['updated_date']=respData['updated_date'];
                        updateObj['local_created_date']=respData['local_created_date'];
                        updateObj['local_updated_date']=respData['local_updated_date'];
                        updateObj['status']=respData['status'];
                    }
                    let whereCon=" chat_id="+locaDataRow['chat_id']+" ";
                    let resDataQUpdate:any = await this.updateData(updateObj,tableName,whereCon).catch((reson)=>{console.log('reson',reson)});

                    callback1();
                }else{
                    let insertObj={};
                    insertObj['server_chat_id']=respData['chat_id'];
                    insertObj['chat_from_id']=respData['chat_from_id'];
                    insertObj['chat_mesage']=respData['chat_mesage'];
                    insertObj['chat_lead_id']=l_lead_id;
                    insertObj['server_chat_lead_id']=s_lead_id;
                    insertObj['created_date']=respData['created_date'];
                    insertObj['updated_date']=respData['updated_date'];
                    insertObj['local_created_date']=respData['local_created_date'];
                    insertObj['local_updated_date']=respData['local_updated_date'];
                    insertObj['status']=respData['status'];
                    insertObj['sync_status']=1;
                    let resDataQInsert:any = await this.insertData(insertObj,tableName).catch((reson)=>{console.log('reson',reson)});
                    callback1();
                 }

            },async(comTT)=>{
                 //callback();

                 let queryU="SELECT * FROM "+tableName+" WHERE sync_status=0 and server_chat_lead_id="+s_lead_id+" ORDER BY chat_id ASC";
                 let resDataU:any = await this.queryExecuteSql(queryU,[]).catch((reson)=>{console.log('reson',reson)}); 
                 if(!resDataU){
                    callback();
                    return false;
                }
                let resDatasUss=[];
                for(let m=0;m<resDataU.rows.length;m++){
                    resDatasUss.push(resDataU.rows.item(m));
                }

                async.each(resDatasUss,async (resDatasUs,callbackUss)=>{
                    let chat_id=0;
                    let insertUpdateObj={};
                    insertUpdateObj['chat_from_id']=resDatasUs['chat_from_id'];
                    insertUpdateObj['chat_mesage']=resDatasUs['chat_mesage'];
                    insertUpdateObj['chat_lead_id']=resDatasUs['server_chat_lead_id'];
                    insertUpdateObj['local_created_date']=resDatasUs['local_created_date'];
                    insertUpdateObj['local_updated_date']=resDatasUs['local_updated_date'];
                    insertUpdateObj['status']=resDatasUs['status'];
                    if(resDatasUs['server_chat_id']>0){
                        chat_id=resDatasUs['server_chat_id'];
                     }
                    let resDataInsertedUpdated:any = await this.escApi.addEditSupportChat(insertUpdateObj,chat_id).toPromise().catch((reson)=>{return false;})
                     if(resDataInsertedUpdated==false){
                        callbackUss();
                        return false
                     }
                     let updateDataObj={};
                     updateDataObj['server_chat_id']=resDataInsertedUpdated['result']['id']?resDataInsertedUpdated['result']['id']:0;
                     updateDataObj['sync_status']=1;
                     let whereCond=" chat_id="+resDatasUs['chat_id'];
                     let resDataUpdated:any = await this.updateData(updateDataObj,tableName,whereCond);
                     callbackUss();

                },(comTTT)=>{
                      resolve(true);
                });

            });

         },(comT)=>{
            resolve(true);
         });
    });
}

syncProductM(){
     return new Promise((resolve,reject)=>{
        
        if(globalInternetCheckConnection==false){
                this.showSyncToast(ALL_MESSAGE.COMMON_MESSAGE.SYNC_NO_FAILED_INTERNET);
                reject(true);
                return false;
        }

        let tableName='product_master';
        let filterS={};
      //  filterS['offset']=0;
      //  filterS['limit']=1000;
        this.app_productsApi.find(filterS).subscribe((resDatas)=>{
                  console.log('resData product api',resDatas);
                  async.each(resDatas,(resData,callback:any)=>{
                    let insertObj={};
                    insertObj['server_product_id']=resData['id'];
                    insertObj['product_name']=resData['name'];
                    insertObj['product_type']=resData['type'];
                    insertObj['product_unit']=resData['unit'];
                    insertObj['product_unit_value']=resData['unit_value'];
                    insertObj['product_points']=resData['points'];
                    insertObj['product_cash']=resData['cash'];
                    insertObj['req_ac_approv_qty']=resData['req_ac_approv_qty'];
                    insertObj['is_cement']=resData['is_cement'];
                    insertObj['status']=resData['status'];
                    insertObj['created_date']=resData['created_date'];
                    insertObj['created_by']=resData['created_by'];
                    insertObj['updated_date']=resData['updated_date'];
                    insertObj['updated_by']=resData['updated_by'];
                    insertObj['sync_status']=1;
                    insertObj['ext_data']="";
                    this.insertOrReplaceData(insertObj,tableName).then((resInsData)=>{
                        callback();
                    },(err)=>{
                        callback();
                    })                     
                  },(err)=>{
                        resolve(true); 
                  });
        },(error)=>{
                console.log('app_rdsApi error',error);
                reject(false);
        });
     });  
}

syncProjectStageM(){
    return new Promise((resolve,reject)=>{
            
            if(globalInternetCheckConnection==false){
                    this.showSyncToast(ALL_MESSAGE.COMMON_MESSAGE.SYNC_NO_FAILED_INTERNET);
                    reject(true);
                    return false;
            }


            let tableName='project_stage_tbl';
            let filterS={};
           // filterS['offset']=0;
           // filterS['limit']=100;
            this.project_stageApi.find(filterS).subscribe((resDatas)=>{
                    console.log('resData',resDatas);
                    async.each(resDatas,(resData,callback:any)=>{
                        let insertObj={};
                        insertObj['server_id']=resData['id'];
                        insertObj['project_stage']=resData['project_stage'];
                        insertObj['status']=resData['status'];
                        insertObj['created_date']=resData['created_date'];
                        insertObj['created_by']=resData['created_by'];
                        insertObj['updated_date']=resData['updated_date'];
                        insertObj['updated_by']=resData['updated_by'];
                         insertObj['sync_status']=1;
                         insertObj['ext_data']="";
                        this.insertOrReplaceData(insertObj,tableName).then((resInsData)=>{
                            callback();
                        },(err)=>{
                            callback();
                        })                     
                    },(err)=>{
                            resolve(true); 
                    })
            },(error)=>{
                    console.log('app_rdsApi error',error);
                    reject(false);
            }); 
    });   
}
syncProjectTypeM(){
    return new Promise((resolve,reject)=>{

            if(globalInternetCheckConnection==false){
                    this.showSyncToast(ALL_MESSAGE.COMMON_MESSAGE.SYNC_NO_FAILED_INTERNET);
                    reject(true);
                    return false;
            }

            let tableName='project_type_tbl';
            let filterS={};
           // filterS['offset']=0;
           // filterS['limit']=100;
            this.project_typeApi.find(filterS).subscribe((resDatas)=>{
                    console.log('resData',resDatas);
                    async.each(resDatas,(resData,callback:any)=>{
                        let insertObj={};
                        insertObj['server_id']=resData['id'];
                        insertObj['project_type']=resData['project_type'];
                        insertObj['status']=resData['status'];
                        insertObj['created_date']=resData['created_date'];
                        insertObj['created_by']=resData['created_by'];
                        insertObj['updated_date']=resData['updated_date'];
                        insertObj['updated_by']=resData['updated_by'];
                         insertObj['sync_status']=1;
                         insertObj['ext_data']="";
                        this.insertOrReplaceData(insertObj,tableName).then((resInsData)=>{
                            callback();
                        },(err)=>{
                            callback();
                        })                     
                    },(err)=>{
                            resolve(true); 
                    })
            },(error)=>{
                    console.log('app_rdsApi error',error);
                    reject(false);
            });
    });   
}

syncProjectNmcM(){

    return new Promise((resolve,reject)=>{

             if(globalInternetCheckConnection==false){
                    this.showSyncToast(ALL_MESSAGE.COMMON_MESSAGE.SYNC_NO_FAILED_INTERNET);
                    reject(true);
                    return false;
            }

            let tableName='nmc_tbl';
            let filterS={};
           // filterS['offset']=0;
           // filterS['limit']=100;
            this.nmcApi.find(filterS).subscribe((resDatas)=>{
                    console.log('resData',resDatas);
                    async.each(resDatas,(resData,callback:any)=>{
                        let insertObj={};
                        insertObj['server_id']=resData['id'];
                        insertObj['nmc_type']=resData['nmc_type'];
                        insertObj['status']=resData['status'];
                        insertObj['created_date']=resData['created_date'];
                        insertObj['created_by']=resData['created_by'];
                        insertObj['updated_date']=resData['updated_date'];
                        insertObj['updated_by']=resData['updated_by'];
                        insertObj['sync_status']=1;
                        insertObj['ext_data']="";
                        this.insertOrReplaceData(insertObj,tableName).then((resInsData)=>{
                            callback();
                        },(err)=>{
                            callback();
                        })                     
                    },(err)=>{
                            resolve(true); 
                    })
            },(error)=>{
                    console.log('app_rdsApi error',error);
                    reject(false);
            });
    });   

}

syncTargetsMaster(){
      return new Promise((resolve,reject)=>{
        
         if(globalInternetCheckConnection==false){
                    this.showSyncToast(ALL_MESSAGE.COMMON_MESSAGE.SYNC_NO_FAILED_INTERNET);
                    reject(true);
                    return false;
         }

        if(this.syncTargetsMasterRunningFlag){
            this.syncTargetsMasterRunningFlag=true;
            //this.showSyncToast(ALL_MESSAGE.COMMON_MESSAGE.SYNC_RUN_GLOABL_INTERNET);
            reject(true);
            return false;
        }
        
        let sphId = sessionUserGlobalData['userId'];
        let tableNameMAT='monthly_actual_target';
        let tableNameMFT='monthly_forecast_target';
        let tableNameMVS='monthly_visiting_schedule';
        let filterMATS={"where":{"or":[{"sph_id":sphId}]}};
        let filterMFTS={"where":{"or":[{"sph_id":sphId}]}};
        let filterMVSS={"where":{"or":[{"sph_id":sphId}]}};
       // {"where":{"or":[{"sph_id":311}]}}
        let allTaskCompleteNew = ()=>{
          this.syncTargetsMasterRunningFlag=false;
           resolve(true);
        }


    let asyncTaskss = [];

    asyncTaskss.push((callbackMATS)=>{

        this.monthly_actual_targetApi.find(filterMATS).subscribe((resDatas)=>{
                    console.log('resData',resDatas);
                    async.each(resDatas,(resData,callback:any)=>{
                        let insertObj={};
                        insertObj['server_target_id']=resData['target_id'];
                        insertObj['sph_id']=resData['sph_id'];
                        insertObj['postal_code']=resData['postal_code'];
                        insertObj['target_month']=resData['target_month'];
                        insertObj['target_year']=resData['target_year'];
                        insertObj['target_label']=resData['target_label'];
                        insertObj['target_value']=resData['target_value'];
                        insertObj['status']=resData['status'];
                        insertObj['created_date']=resData['created_date'];
                        insertObj['created_by']=resData['created_by'];
                        insertObj['updated_date']=resData['updated_date'];
                        insertObj['updated_by']=resData['updated_by'];
                         insertObj['sync_status']=1;
                         insertObj['ext_data']="";
                        this.insertOrReplaceData(insertObj,tableNameMAT).then((resInsData)=>{
                            callback();
                        },(err)=>{
                            
                            callback();
                        })                     
                    },(err)=>{
                            callbackMATS(); 
                    })
            },(error)=>{
                    console.log('monthly_actual_targetApi error',error);
                    callbackMATS(); 
            });


    });

    asyncTaskss.push((callbackMFTS)=>{

        this.monthly_forecast_targetApi.find(filterMFTS).subscribe((resDatas)=>{
                    console.log('resData',resDatas);
                    async.each(resDatas,(resData,callback:any)=>{
                        let insertObj={};
                        insertObj['server_dt_id']=resData['dt_id'];
                        insertObj['sph_id']=resData['sph_id'];
                        insertObj['visitor_id']=resData['visitor_id'];
                        insertObj['visitor_type']=resData['visitor_type'];
                        insertObj['visitor_name']=resData['visitor_name'];
                        insertObj['target_date']=moment(resData['target_date']).valueOf();
                        insertObj['target_label']=resData['target_label'];
                        insertObj['target_value']=resData['target_value'];
                        insertObj['status']=resData['status'];
                        insertObj['created_date']=resData['created_date'];
                        insertObj['created_by']=resData['created_by'];
                        insertObj['updated_date']=resData['updated_date'];
                        insertObj['updated_by']=resData['updated_by'];
                         insertObj['sync_status']=1;
                         insertObj['ext_data']="";
                        this.insertOrReplaceData(insertObj,tableNameMFT).then((resInsData)=>{
                            callback();
                        },(err)=>{
                            callback();
                        })                     
                    },(err)=>{
                            callbackMFTS(); 
                    })
            },(error)=>{
                    console.log('monthly_actual_targetApi error',error);
                    callbackMFTS(); 
            });


    });

    asyncTaskss.push((callbackMVSS)=>{

        this.monthly_visiting_scheduleApi.find(filterMVSS).subscribe((resDatas)=>{
                    console.log('resData',resDatas);
                    async.each(resDatas,(resData,callback:any)=>{
                        let insertObj={};
                        insertObj['server_dv_id']=resData['dv_id'];
                        insertObj['sph_id']=resData['sph_id'];
                        insertObj['visitor_id']=resData['visitor_id'];
                        insertObj['visit_date']=moment(resData['visit_date']).valueOf();
                        insertObj['visitor_type']=resData['visitor_type'];
                        insertObj['status']=resData['status'];
                        insertObj['created_date']=resData['created_date'];
                        insertObj['created_by']=resData['created_by'];
                        insertObj['updated_date']=resData['updated_date'];
                        insertObj['updated_by']=resData['updated_by'];
                        insertObj['sync_status']=1;
                        insertObj['ext_data']="";
                        this.insertOrReplaceData(insertObj,tableNameMVS).then((resInsData)=>{
                            callback();
                        },(err)=>{
                            callback();
                        })                     
                    },(err)=>{
                            callbackMVSS(); 
                    })
            },(error)=>{
                    console.log('monthly_actual_targetApi error',error);
                          callbackMVSS(); 
            });


    });    

        
        async.parallel(asyncTaskss, function(){
            allTaskCompleteNew();
        });

    }); 
}

 insertData(dataArrObj,tableName){
       return new Promise((resolve, reject) => {
            try{
                    this.storageSql.transaction((tx) => {
                        var dataArr = [];
                        var paramsArr=[];
                        for(var o in dataArrObj) {
                            dataArr.push(dataArrObj[o]);
                            paramsArr.push("?");
                        }
                        let paramsKey= paramsArr.join(', ');
                        let keyString=Object.keys(dataArrObj).join(', ');
                        let query = "INSERT INTO "+ tableName +" (" + keyString + ") VALUES ("+ paramsKey +")";
                        tx.executeSql(query,dataArr, (tx,data) => {
                            console.log('data inserted...');
                            resolve(data);
                        },(tx,error) => {
                            console.log('failed to Update',error);
                            reject(error);
                        });
                    });  
            }catch(err){
                console.log('sqlite fail',err);
                reject(err);
                
            }
        })
  }

 insertOrReplaceData(dataArrObj,tableName){
       return new Promise((resolve, reject) => {
            try{
                    this.storageSql.transaction((tx) => {
                        var dataArr = [];
                        var paramsArr=[];
                        for(var o in dataArrObj) {
                            dataArr.push(dataArrObj[o]);
                            paramsArr.push("?");
                        }
                        let paramsKey= paramsArr.join(', ');
                        let keyString=Object.keys(dataArrObj).join(', ');
                        let query = "INSERT OR REPLACE INTO "+ tableName +" (" + keyString + ") VALUES ("+ paramsKey +")";
                        tx.executeSql(query,dataArr, (tx,data) => {
                            console.log('data inserted...');
                            resolve(data);
                        },(tx,error) => {
                            console.log('failed to Update',error);
                            
                            reject(error);
                        });
                    });  
            }catch(err){
                console.log('sqlite fail',err);
                reject(err);
                
            }
        })
  }

updateData(dataArrObj,tableName,whereCond?:any){
    return new Promise((resolve, reject) => {
        try{
            this.storageSql.transaction((tx) => {
                var dataArr = [];
                var paramsArr=[];
                for(var o in dataArrObj) {
                    dataArr.push(dataArrObj[o]);
                    paramsArr.push(o+"=?");
                }
                let paramsKey= paramsArr.join(', ');
                if(whereCond!=""){
                    whereCond='where '+whereCond;
                }
                let query = "update  "+ tableName +" set "+ paramsKey +" "+whereCond;
            
                tx.executeSql(query,dataArr, (tx,data) => {
                    console.log('data updated...');
                    resolve(data);
                },(tx,error) => {
                    console.log('failed to Update',error);
                    reject(error);
                }); 
            });  
        }catch(err){
            console.log('sqlite fail',err);
            reject(err);      
        }
    })
}
selectTableData(selectField,tableName,where,orderBy,limit){
        return new Promise((resolve, reject) => {
          try{
            let dataArr=[];
              let query = "SELECT "+selectField+" FROM "+tableName+" ";
              if(where!=""){
                  query +=" WHERE  "+where;
              }
              if(orderBy!=""){
                  query +=" ORDER BY  "+orderBy;
              }

              if(limit!=""){
                  query +=" LIMIT "+limit;
              }
              console.log('query select ',query);
              //setTimeout(()=>{
                    this.storageSql.transaction((storage) => {
                        storage.executeSql(query,dataArr, (storage,data) => {
                            resolve(data);
                        },(storage,error) => {
                            console.log('failed select query');
                            reject(error);
                        });
                    });  
              //},100);
           }catch(err){
                console.log('sqlite fail',err);
                reject(err);
                
            }

        });
  }


  queryExecuteSql(queryAll,dataArr){
        return new Promise((resolve, reject) => {
          try{            
                this.storageSql.transaction((storage) => {
                    storage.executeSql(queryAll,dataArr, (storage,data) => {
                        resolve(data);
                    },(storage,error) => {
                        reject(error);
                    });
                });  
           }catch(err){
                reject(err);     
            }

        });
  }

  alterimgPath(jsonStr){
    let jsonParse = JSON.parse(jsonStr);
    jsonParse[0]["path"] = cordova.file.dataDirectory+jsonParse[0]["path"].split("NoCloud/")[1];
    return JSON.stringify(jsonParse);
   }




}