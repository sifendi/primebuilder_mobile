import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, App, ModalController } from 'ionic-angular';
import { ProductRequestsDetailsPage } from "../../product-request/product-requests-details/product-requests-details";

import { appCommonMethods } from '../../../providers/appCommonMethods';
import { SqlServices } from '../../../providers/sqlService';
import { ALL_MESSAGE } from '../../../providers/constant';
import * as moment from 'moment';
import async from 'async'; 
import { ProductRequestsSearchPage } from "../product-requests-search/product-requests-search";

@Component({
  selector: 'page-product-requests-list',
  templateUrl: 'product-requests-list.html',
})
export class ProductRequestsListPage {
  busy: any;
  busyMessage:any="Please Wait...";
  produtRequestListobjArrs:any=[];
  produtRequestListobjArrsTemp:any=[];
  produtRequestListobjArrsTempF:any=[];
  prodRequestFilterArr:any={
     fromDate:null,
     toDate:null,
     status:null,
     receiptType:null
  }
  filterby="";

  constructor(public navCtrl: NavController,public app:App, public navParams: NavParams,public appCom:appCommonMethods,public sqlS:SqlServices,public modalCtrl:ModalController) {
    
   console.log('this.navParams.data',this.navParams.data);
    this.busy=this.initListDisplayData().then(()=>{

    },()=>{

    });

  }

  ionViewDidLoad() {
 
  }

  async ionViewDidEnter() {
     this.busyMessage = await this.appCom.getTranslatedTxt("Please wait...");   
  }
  
  initListDisplayData(){

         return new Promise((resolve,reject)=>{
            let queryProdReq="SELECT DISTINCT prt.id,prt.server_id,prt.request_date,prt.product_request_status,prt.product_request_status_remark,prt.quantity_required,prt.new_price_request,prt.term_of_payment,prt.pic_same_as_hpb,prt.pic_name,prt.pic_designation,prt.pic_mobile,prt.additional_comments,prt.hpb_digital_sign,prm.project_id,prm.server_project_id,prm.project_name,hm.hpb_id,hm.server_hpb_id,hm.hpb_name, rdm.rds_id,rdm.server_rds_id,rdm.rds_name FROM products_request_tbl prt LEFT JOIN project_master prm ON prt.project_id=prm.project_id LEFT JOIN hpb_master hm ON prt.server_hpb_id=hm.server_hpb_id LEFT JOIN retailer_distributor_master rdm ON prt.rds_id=rdm.server_rds_id WHERE 1 ORDER BY prt.local_created_date DESC";
              this.sqlS.queryExecuteSql(queryProdReq,[]).then((resData:any)=>{
                if(resData.rows.length>0){
            
                  let tempDisDataAll = [];
                  let tempDisDataAllFinal:any = [];
                  for(let i=0;i<resData.rows.length;i++){
                   
                          let tempDisData = resData.rows.item(i);
                    
                          tempDisDataAllFinal.push({
                          id:tempDisData['id'],
                          server_id:tempDisData['server_id'],
                          project_id:tempDisData['project_id'],
                          server_project_id:tempDisData['server_project_id'],
                          hpb_id:tempDisData['hpb_id'],
                          server_hpb_id:tempDisData['server_hpb_id'],
                          server_rds_id:tempDisData['server_rds_id'],
                          request_date:tempDisData['request_date'],
                          product_request_status:tempDisData['product_request_status'],
                          project_name:tempDisData['project_name'],
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
                          product_request_status_remark:tempDisData['product_request_status_remark']
                        });
                     
                  }
                 
                this.produtRequestListobjArrs=tempDisDataAllFinal;
                this.produtRequestListobjArrsTemp=this.produtRequestListobjArrs; 
                }
                resolve(true);
            },(error)=>{
                console.log('initDisplayData error',error);
                resolve(true);
            });

         });
  }

  goToRequestDetails(id){ 
      this.app.getRootNav().push(ProductRequestsDetailsPage,{
           "prodReqId":id
      });
  }

    //SEARCH Product Requests
searchProductRequests(ev){
  console.log("ev",ev);
       if(this.filterby==""){
          this.produtRequestListobjArrs=this.produtRequestListobjArrsTemp;
       }else{
            this.produtRequestListobjArrs=this.produtRequestListobjArrsTempF;
       }
        let val = ev.target.value;
        if (val && val.trim() != '') {
            this.produtRequestListobjArrs = this.produtRequestListobjArrs.filter((item) => {
                return (item['project_name'].toLowerCase().indexOf(val.toLowerCase()) > -1);
            })
        }
}

  goToFilterPage(){
     let openFilterM=this.modalCtrl.create(ProductRequestsSearchPage,{prodRequestFilterArr:this.prodRequestFilterArr});
     openFilterM.onDidDismiss((fData:any)=>{
       // console.log('fData',fData);
        if(fData['filterby']){
             this.filterby = fData['filterby'];
             this.produtRequestListobjArrsTempF = fData['productReceiptData'];
             this.prodRequestFilterArr = fData['filterData'];
             this.produtRequestListobjArrs=this.produtRequestListobjArrsTempF;
        }
     });
     openFilterM.present();
    
  }

clearFilter(){
    this.filterby="";
    this.produtRequestListobjArrs=this.produtRequestListobjArrsTemp;
    this.produtRequestListobjArrsTempF=[];
    this.prodRequestFilterArr={
     fromDate:null,
     toDate:null,
     status:null,
     receiptType:null
    }   
}
}
