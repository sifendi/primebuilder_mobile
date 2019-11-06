import { HomePage } from '../../home/home';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Events, ModalController } from 'ionic-angular';
import { SqlServices } from '../../../providers/sqlService';
import { ProductReceiptsDetailsPage } from '../product-receipts-details/product-receipts-details';
import { appCommonMethods } from "../../../providers/appCommonMethods";

import * as moment from 'moment';
import { ProductReceiptsSearchPage } from "../product-receipts-search/product-receipts-search";

@Component({
  selector: 'page-product-receipts-list',
  templateUrl: 'product-receipts-list.html',
})
export class ProductReceiptsListPage {

  productReceiptData:any=[];
  productReceiptDataTempF:any=[];
  productReceiptDataTemp:any=[];
  paramsData:any;
  busyMessage:any="Please Wait...";  
  busy:any;
  showEmptyFlag:any=false;
  prodReceiptFilterArr:any={
     product:null,
     fromDate:null,
     toDate:null,
     receiptType:null,
     by:null,
     status:null,
  }
  filterby:any='';


  constructor(public navCtrl: NavController, public navParams: NavParams, public sqlS:SqlServices,public events:Events,public appCom:appCommonMethods,public modalCtrl:ModalController) {
    this.events.subscribe("refreshProductReceiptList",()=>{
        
        // update home slider stats and myplan stats
        this.appCom.updateHomeSliderStats();
        this.appCom.updateMyPlanStats('mason');
        this.appCom.updateMyPlanStats('contractor');
                
        this.refreshProductReceiptList();
    });

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ProductReceiptsListPage');
    this.refreshProductReceiptList();
  }

  async ionViewDidEnter() {
     this.busyMessage = await this.appCom.getTranslatedTxt("Please wait...");   
  }

timeStampToDate(date){
    let newDateF = moment(date).format("DD MMM YYYY");
    return newDateF;
}

  refreshProductReceiptList(){ 

      let query="SELECT projm.project_name,pm.product_name,prm.receipt_id,prm.quantity,prm.unit,prm.local_created_date,(SELECT prat.approval_status FROM products_receipt_approval_tbl AS prat WHERE prat.receipt_id = prm.receipt_id AND prat.approval_role = 'TLH' AND prat.is_closed = 0 ) AS tlh_approval,(SELECT prat.approval_status FROM products_receipt_approval_tbl AS prat WHERE prat.receipt_id = prm.receipt_id AND prat.approval_role = 'AC' AND prat.is_closed = 0) AS ac_approval,(SELECT prat.approval_status FROM products_receipt_approval_tbl AS prat WHERE prat.receipt_id = prm.receipt_id AND prat.approval_role = 'SA' AND prat.is_closed = 0) AS sa_approval, (SELECT prat.rejection_reason FROM products_receipt_approval_tbl AS prat WHERE prat.receipt_id = prm.receipt_id AND prat.approval_role = 'TLH' AND prat.is_closed = 0) AS tlh_rejection_res ,(SELECT prat.rejection_reason FROM products_receipt_approval_tbl AS prat WHERE prat.receipt_id = prm.receipt_id AND prat.approval_role = 'AC' AND prat.is_closed = 0) AS ac_rejection_res ,(SELECT prat.rejection_reason FROM products_receipt_approval_tbl AS prat WHERE prat.receipt_id = prm.receipt_id AND prat.approval_role = 'SA' AND prat.is_closed = 0) AS sa_rejection_res FROM product_receipt_master prm LEFT JOIN product_master pm ON prm.product_id = pm.server_product_id LEFT JOIN project_master projm ON projm.project_id = prm.project_id ";
      query+=" ORDER BY prm.updated_date DESC";
      this.busy=this.sqlS.queryExecuteSql(query,[]).then((data) => {
              this.productReceiptData=[];
              for(let j=0;j<data['rows'].length;j++){
                  let tempDataObj =  data['rows'].item(j);
                  this.productReceiptData.push( tempDataObj );    
                }
                if( this.productReceiptData.length == 0 ){
                  this.showEmptyFlag=true;
                }else{
                  this.showEmptyFlag=false;
                }
                this.productReceiptDataTemp= this.productReceiptData;                             
      },(error)=>{
          console.log('Error', error);  
      });

    


  }
   
  goToProductReceiptDetail(product_receipt){
    this.navCtrl.push(ProductReceiptsDetailsPage,{
      "productReceiptId" : product_receipt['receipt_id'],
      "projName" : product_receipt['project_name']
    });
  }



  //SEARCH Product Receipt
searchProductReceipt(ev){
  console.log("ev",ev);
       if(this.filterby==""){
          this.productReceiptData=this.productReceiptDataTemp;
       }else{
            this.productReceiptData=this.productReceiptDataTempF;
       }
        let val = ev.target.value;
        if (val && val.trim() != '') {
            this.productReceiptData = this.productReceiptData.filter((item) => {
                return (item['project_name'].toLowerCase().indexOf(val.toLowerCase()) > -1);
            })
        }
}

  goToHome(){
    this.navCtrl.setRoot(HomePage);
  }

  goToFilterPage(){
     let openFilterM=this.modalCtrl.create(ProductReceiptsSearchPage,{prodReceiptFilterArr:this.prodReceiptFilterArr});
     openFilterM.onDidDismiss((fData:any)=>{
        console.log('fData',fData);
        if(fData['filterby']){
             this.filterby = fData['filterby'];
             this.productReceiptDataTempF = fData['productReceiptData'];
             this.prodReceiptFilterArr = fData['filterData'];
             this.productReceiptData=this.productReceiptDataTempF;
        }else{
          this.clearFilter();
        }
     });
     openFilterM.present();

  }


  clearFilter(){
    this.filterby="";
    this.productReceiptData=this.productReceiptDataTemp;
    console.log("this.productReceiptDataTemp",this.productReceiptDataTemp);
    this.productReceiptDataTempF=[];
    this.prodReceiptFilterArr={
      product:null,
      fromDate:null,
      toDate:null,
      receiptType:null,
      by:null,
      status:null,
    }
}

}
