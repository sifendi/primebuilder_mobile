import { Component, ApplicationRef } from '@angular/core';
import { IonicPage, NavController, NavParams,App } from 'ionic-angular';
import { ProductRequestsFormPage } from "../product-requests-form/product-requests-form";
import { appCommonMethods } from '../../../providers/appCommonMethods';
import { SqlServices } from '../../../providers/sqlService';
import { ALL_MESSAGE } from '../../../providers/constant';
import * as moment from 'moment';
import async from 'async'; 
declare var sessionUserGlobalData;
@Component({
  selector: 'page-product-requests-details',
  templateUrl: 'product-requests-details.html',
})
export class ProductRequestsDetailsPage {
  
  paramsData:any={};
  busy: any;
  busyMessage:any="Please Wait...";
  dataDisplayObj={};
  prodReqIdC:any=0;
  editBtnEnb:boolean=false;
 constructor(public navCtrl: NavController,public appRef:ApplicationRef,public app:App, public navParams: NavParams,public appCom:appCommonMethods,public sqlS:SqlServices) {

  

  }


async ionViewWillEnter(){
    this.busyMessage = await this.appCom.getTranslatedTxt("Please wait...");
    this.busy=this.initDisplayData().then(()=>{

    },()=>{
      
    });
}

 ionViewWillLeave(){

  }

  
initDisplayData(){

    return new Promise((resolve,reject)=>{

      let allSyncTask=[];
      let allTaskComplete = ()=>{
          resolve(true);
      }
     
      allSyncTask.push((callback)=>{

         this.paramsData = this.navParams.data;
         if(this.paramsData['prodReqId'] && this.paramsData['prodReqId']>0){
            this.prodReqIdC=this.paramsData['prodReqId'];
            let queryProdReq="SELECT prt.id,prt.server_id,prt.request_date,prt.product_request_status,prt.product_request_status_remark,prt.product_request_status_remark_comment,prt.quantity_required,prt.new_price_request,prt.term_of_payment,prt.pic_same_as_hpb,prt.pic_name,prt.pic_designation,prt.pic_mobile,prt.additional_comments,prt.hpb_digital_sign,prm.project_id,prm.server_project_id,prm.project_name,hm.hpb_id,hm.server_hpb_id,hm.hpb_name, rdm.rds_id,rdm.server_rds_id,rdm.rds_name,prbc.id as 'prbc_id',prbc.server_id 'prbc_server_id',prbc.brand_id,prbc.server_brand_id,prbc.price,prbc.req_rds_name,pm.product_name FROM products_request_tbl prt LEFT JOIN project_master prm ON prt.project_id=prm.project_id LEFT JOIN hpb_master hm ON prt.server_hpb_id=hm.server_hpb_id LEFT JOIN retailer_distributor_master rdm ON prt.rds_id=rdm.server_rds_id LEFT JOIN products_request_brand_capture_tbl prbc ON prt.id=prbc.request_id LEFT JOIN product_master pm ON prbc.brand_id=pm.server_product_id WHERE prt.id="+this.paramsData['prodReqId'];
          //  console.log('queryProdReq',queryProdReq);
            this.sqlS.queryExecuteSql(queryProdReq,[]).then((resData:any)=>{
                if(resData.rows.length>0){
            
                  let tempDisDataAll = [];
                  let tempDisDataAllFinal:any = {};
                  for(let i=0;i<resData.rows.length;i++){
                   
                     let tempDisData = resData.rows.item(i);
                     console.log('tempDisData',tempDisData);
                     let key = '_'+tempDisData['id']+'_';
                     if(tempDisDataAllFinal[key]){
                        tempDisDataAllFinal[key]['brandDatas'].push({
                           product_name:tempDisData['product_name'],
                           price:tempDisData['price'],
                           req_rds_name:tempDisData['req_rds_name']
                        });
                     }else{
                        tempDisDataAllFinal[key]={
                          request_date:tempDisData['request_date'],
                          product_request_status:tempDisData['product_request_status'],
                          product_request_status_remark:tempDisData['product_request_status_remark'],
                          product_request_status_remark_comment:tempDisData['product_request_status_remark_comment'],
                          product_name:tempDisData['product_name'],
                          project_name:tempDisData['project_name'],
                          project_id:tempDisData['project_id'],
                          hpb_name:tempDisData['hpb_name'],
                          quantity_required:tempDisData['quantity_required'],
                          rds_name:tempDisData['rds_name'],
                          pic_same_as_hpb:tempDisData['pic_same_as_hpb'],
                          pic_name:tempDisData['pic_name'],
                          pic_designation:tempDisData['pic_designation'],
                          pic_mobile:tempDisData['pic_mobile'],
                          new_price_request:tempDisData['new_price_request'],
                          term_of_payment:tempDisData['term_of_payment'],
                          additional_comments:tempDisData['additional_comments'],
                          hpb_digital_sign:JSON.parse(tempDisData['hpb_digital_sign']),
                          brandDatas:[{
                            product_name:tempDisData['product_name'],
                            price:tempDisData['price'],
                            req_rds_name:tempDisData['req_rds_name']
                          }]
                        };

                     }
                  }
                 
                  let newKey = '_'+this.paramsData['prodReqId']+'_';
                  this.dataDisplayObj=tempDisDataAllFinal[newKey];
                  this.editCheckInOutBtnShowHide();
                }
                callback();
            },(error)=>{
                console.log('initDisplayData error',error);
                callback();
            });
          
          }

      });

   
     
    async.parallel(allSyncTask, function(){
           allTaskComplete();
    });


    });

}

editCheckInOutBtnShowHide(){
         this.appCom.getLocalStorageItem("globalCheckinData").then((checkinObj)=>{
            let tempCheckOutMainObj= checkinObj['checkinDetails'];
            if(tempCheckOutMainObj['check_in_out_type'] && tempCheckOutMainObj['check_in_out_type_id']){
                    if(tempCheckOutMainObj['check_in_out_type']=="project"){
                            if(tempCheckOutMainObj['check_in_out_type_id']==this.dataDisplayObj['project_id']){
                              this.editBtnEnb=true;
                            }else{
                              this.editBtnEnb=true;
                            }
                    }
            }
        });
}

  ionViewDidLoad() {
    console.log('ionViewDidLoad ProductRequestsDetailsPage');
  }

  goToEditPage(){
    this.navCtrl.push(ProductRequestsFormPage,{
      "prodReqId":this.prodReqIdC
    });
  }

}
