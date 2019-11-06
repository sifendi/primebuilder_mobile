import { ALL_KEYS, SQL_QUERY } from './constant';
import { Platform } from 'ionic-angular';
import { Injectable } from '@angular/core';


import 'rxjs/add/operator/map';
declare let window:any;
declare var cordova:any
declare var Promise:any;
@Injectable()
export class SqlServices {	
    
    db : any;
    isOpen :any=false;
    storage : any;
    storageSql:any;
  

    constructor(public platform:Platform) {

        platform.ready().then(()=>{
            this.storageSql = window.sqlitePlugin.openDatabase({name: 'hpb.db', key: ALL_KEYS.DB_KEY, location: 'default',createFromLocation: 1});   
            this.isOpen=true;
        });
        
    }

     openDb(){
        return new Promise((resolve, reject) => {
            this.storageSql = window.sqlitePlugin.openDatabase({name: "hpb.db",key: ALL_KEYS.DB_KEY, location: 'default',createFromLocation: 1});
            setTimeout(() => {
              resolve(true);
            },100)
        });
    }

    createInitialTables(){
        return new Promise((resolve, reject) => {
                    let dataArr = SQL_QUERY.TABLE_QUERY;
                    let currNum = 0;

  //                  this.storageSql.transaction((tx)=>{
                    
  //                      console.log('transaction ',tx);

                        

                        let executeAsyncBulkInsert = (dataArr,currNum)=>{
                          console.log('executeAsyncBulkInsert ',currNum);
                        if(!dataArr[currNum]){
                            resolve(true);
                            return false;
                        }
                      
                        this.storageSql.executeSql(dataArr[currNum],[],(txx,resData)=>{
                          currNum++;
                         executeAsyncBulkInsert(dataArr,currNum);
                        },(errs)=>{
                        currNum++;
                            executeAsyncBulkInsert(dataArr,currNum);
                        });

                       
                    }

                     executeAsyncBulkInsert(dataArr,currNum);

                    // }, (error)=> {
                    //     reject(error);
                    // });

               });  
    }

    createUpdateInitialTables(){
        return new Promise((resolve, reject) => {
            let dataArr = SQL_QUERY.TABLE_UPDATE_QUERY;
            let currNum = 0;
            console.log('dataArr',dataArr);
            console.log('dataArr length',dataArr.length);

  //          this.storageSql.transaction((tx)=>{
            
  //              console.log('transaction ',tx);

                

                let executeAsyncBulkInsert = (dataArr,currNum)=>{
                    console.log('executeAsyncBulkInsert ',currNum);
                    if(!dataArr[currNum]){
                        resolve(true);
                        return false;
                    }
                    
                    this.storageSql.executeSql(dataArr[currNum],[],(txx,resData)=>{
                        console.log("query success=>",currNum);
                        console.log("query success created => ",dataArr[currNum]);
                        currNum++;
                        executeAsyncBulkInsert(dataArr,currNum);
                    },(errs)=>{
                        console.log("query fail=>",currNum);
                        console.log("query success fail => ",dataArr[currNum]);
                        console.log("errs=>",errs);
                    currNum++;
                        executeAsyncBulkInsert(dataArr,currNum);
                    });
                }

                executeAsyncBulkInsert(dataArr,currNum);

            // }, (error)=> {
            //     reject(error);
            // });

        });  
    }

   
resetTables(){
    
}

insertInitialTablesDatas(){
   return new Promise((resolve, reject) => {
       let dataArr = SQL_QUERY.TBALE_DEFAULT_INSERT;
       let currNum = 0;
       this.storageSql.transaction((tx)=>{

        let executeAsyncBulkInsert = (dataArr,currNum)=>{

            if(dataArr.length==currNum){
              resolve(true);
              return false;
            }

            tx.executeSql(dataArr[currNum],[],(txx,resData)=>{
                console.log('insert okkk');
               currNum++;
               executeAsyncBulkInsert(dataArr,currNum);
            },(errs)=>{
               currNum++;
               executeAsyncBulkInsert(dataArr,currNum);
            });

        }
       executeAsyncBulkInsert(dataArr,currNum);
    },(err)=>{
         console.log('err',err);
         reject(err);
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
                            console.log('failed to Update');
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
                console.log("query=>",query);
                console.log("query dataArr=>",dataArr);
                tx.executeSql(query,dataArr, (tx,data) => {
                    console.log('data updated...');
                    resolve(data);
                },(tx,error) => {
                    console.log('failed to Update');
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

  selectTableQueryData(queryAll,dataArr){
        return new Promise((resolve, reject) => {
          try{            
              console.log('query select ',queryAll);
              //setTimeout(()=>{
                    this.storageSql.transaction((storage) => {
                        storage.executeSql(queryAll,dataArr, (storage,data) => {
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

    search_hpb(val?:any,hpbType?:any){
    console.log("value in sql is: ",val);
    return new Promise((resolve, reject) => {
            try{
                 this.storageSql.transaction((tx) =>{       
                    let queryStr ="select `hpb_id`, `hpb_name` ,`primary_mobile_no` ,`domicile_city` , `hpb_status` , `hpb_profile_pic` from `hpb_master` where hpb_name LIKE '%"+val+"%' AND hpb_type = '"+hpbType+"'" ;
                    //console.log('queryStr is::',queryStr);
                    tx.executeSql(queryStr,[], (tx, data) => {
                        resolve(data);
                    }, (tx, error) => {
                        console.log('failed');
                        reject(error);
                    });
                 });  
            }catch(err){
                reject(err);
                console.log('sqlite not working',err);
            }
        })
    }

    search_project(val?:any){
        console.log("value in sql is: ",val);
        return new Promise((resolve, reject) => {
                try{
                    this.storageSql.transaction((tx) =>{       
                        //let queryStr ="SELECT  projm.project_photo,ptt.project_type, projm.hpb_digital_sign,projm.hpb_id,projm.server_hpb_id,projm.project_completion_date,projm.project_quantity_estimation,projm.project_address,projm.project_stage,projm.project_stage_mid,projm.project_sub_district,projm.project_pincode,projm.is_srku,projm.srku_owner_name,projm.srku_owner_address,projm.srku_owner_mobile_no,projm.non_micro_credit_type,projm.non_micro_credit_type_mid,projm.bank_name,projm.nmc_document,projm.bank_document,projm.assigned_to,projm.created_by,projm.updated_by,projm.sync_status,projm.status,projm.local_created_date,projm.local_updated_date,projm.project_id,projm.server_project_id,projm.project_name,projm.project_address,projm.is_srku,hm.hpb_name,hm.server_hpb_id,hm.hpb_id,(SELECT sast.srku_approval_status FROM srku_approval_status_tbl AS sast WHERE sast.project_id = projm.project_id  AND sast.is_closed = 0 ) AS tlh_approval,(SELECT sast.srku_rejection_reason FROM srku_approval_status_tbl AS sast WHERE sast.project_id = projm.project_id  AND sast.is_closed = 0 ) AS tlh_rejection_res FROM project_master projm LEFT JOIN hpb_master hm ON projm.server_hpb_id = hm.server_hpb_id LEFT JOIN project_type_tbl ptt ON projm.project_type_mid = ptt.id WHERE projm.project_name LIKE '%"+val+"%' " ;
                        let queryStr=" SELECT projm.project_photo,ptt.project_type,nmct.nmc_type,pst.project_stage,projm.project_completion_date,projm.project_province,projm.project_city,projm.project_sub_district,projm.srku_owner_mobile_no,projm.srku_province,projm.srku_city,projm.srku_sub_district,projm.srku_pincode,projm.floor_size,projm.number_of_units,projm.is_micro_credit,projm.additional_comments, projm.hpb_digital_sign,projm.hpb_id,projm.server_hpb_id,projm.project_completion_date,projm.project_quantity_estimation,projm.project_address,projm.project_stage,projm.project_stage_mid,projm.project_sub_district,projm.project_pincode,projm.is_srku,projm.srku_owner_name,projm.srku_owner_address,projm.srku_owner_mobile_no,projm.non_micro_credit_type,projm.non_micro_credit_type_mid,projm.bank_name,projm.nmc_document,projm.bank_document,projm.assigned_to,projm.created_by,projm.updated_by,projm.sync_status,projm.status,projm.local_created_date,projm.local_updated_date,projm.project_id,projm.server_project_id,projm.project_name,projm.project_address,projm.is_srku,hm.hpb_name,hm.server_hpb_id,hm.hpb_id,(SELECT sast.srku_approval_status FROM srku_approval_status_tbl AS sast WHERE sast.project_id = projm.project_id  AND sast.is_closed = 0 ) AS tlh_approval,(SELECT sast.srku_rejection_reason FROM srku_approval_status_tbl AS sast WHERE sast.project_id = projm.project_id  AND sast.is_closed = 0 ) AS tlh_rejection_res FROM project_master projm LEFT JOIN hpb_master hm ON projm.server_hpb_id = hm.server_hpb_id LEFT JOIN project_type_tbl ptt ON projm.project_type_mid = ptt.server_id LEFT JOIN project_stage_tbl pst ON projm.project_stage_mid = pst.server_id LEFT JOIN nmc_tbl nmct ON projm.non_micro_credit_type_mid = nmct.server_id WHERE projm.project_name LIKE '%"+val+"%' " ;
                        console.log('queryStr is::',queryStr);
                        tx.executeSql(queryStr,[], (tx, data) => {
                            resolve(data);
                        }, (tx, error) => {
                            console.log('failed');
                            reject(error);
                        });
                    });  
                }catch(err){
                    reject(err);
                    console.log('sqlite not working',err);
                }
            })
    }
    search_d_r_list(val?:any){
        console.log("value in sql is: ",val);
        return new Promise((resolve, reject) => {
                try{
                    this.storageSql.transaction((tx) =>{       
                        let queryStr ="select * from `retailer_distributor_master` where rds_name LIKE '%"+val+"%' " ;
                        console.log('queryStr is::',queryStr);
                        tx.executeSql(queryStr,[], (tx, data) => {
                            resolve(data);
                        }, (tx, error) => {
                            console.log('failed');
                            reject(error);
                        });
                    });  
                }catch(err){
                    reject(err);
                    console.log('sqlite not working',err);
                }
            })
    }

    search_product_receipt(val?:any){
        console.log("value in sql is: ",val);
        return new Promise((resolve, reject) => {
                try{
                    this.storageSql.transaction((tx) =>{       
                        let queryStr =" select pjm.project_name, pm.receipt_id, pm.product_id, pm.quantity ,pm.unit , pm.project_id from `product_receipt_master` pm  JOIN `project_master` pjm  ON pm.project_id = pjm.project_id WHERE pjm.project_name LIKE '%"+val+"%' ";
                        //console.log('queryStr is::',queryStr);
                        tx.executeSql(queryStr,[], (tx, data) => {
                            resolve(data);
                        }, (tx, error) => {
                            console.log('failed');
                            reject(error);
                        });
                    });  
                }catch(err){
                    reject(err);
                    console.log('sqlite not working',err);
                }
            })
    }

    serach_user_by_id(val?:any){
        console.log("value in sql is: ",val);
        return new Promise((resolve, reject) => {
                try{
                    this.storageSql.transaction((tx) =>{        
                        let queryStr ="select `hpb_id`, `hpb_name`  where id_card_number LIKE '%"+val+"%' " ;
                        //console.log('queryStr is::',queryStr);
                        tx.executeSql(queryStr,[], (tx, data) => {
                            resolve(data);
                        }, (tx, error) => {
                            console.log('failed');
                            reject(error);
                        });
                    });  
                }catch(err){
                    reject(err);
                    console.log('sqlite not working',err);
                }
            })

    }

        serach_user_by_mobno(val?:any){
        console.log("value in sql is: ",val);
        return new Promise((resolve, reject) => {
                try{
                    this.storageSql.transaction((tx) =>{        
                        let queryStr ="select `hpb_id`, `hpb_name`  where primary_mobile_no LIKE '%"+val+"%' " ;
                        //console.log('queryStr is::',queryStr);
                        tx.executeSql(queryStr,[], (tx, data) => {
                            resolve(data);
                        }, (tx, error) => {
                            console.log('failed');
                            reject(error);
                        });
                    });  
                }catch(err){
                    reject(err);
                    console.log('sqlite not working',err);
                }
            })

    }



 

   





}