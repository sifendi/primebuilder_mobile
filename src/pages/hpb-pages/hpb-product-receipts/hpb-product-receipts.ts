import { HomePage } from '../../home/home';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams,Events } from 'ionic-angular';
import { SqlServices } from '../../../providers/sqlService';
import { ProductReceiptsDetailsPage } from "../../product-receipts/product-receipts-details/product-receipts-details";
import { App } from 'ionic-angular';
import { appCommonMethods } from "../../../providers/appCommonMethods";

import * as moment from 'moment';

@Component({
  selector: 'hpb-product-receipts',
  templateUrl: 'hpb-product-receipts.html',
})
export class HpbProductReceiptsPage {
  
  productReceiptData:any=[];
  productReceiptDataTemp:any=[];
  paramsData:any;
  projectData:any=[];
  serverHpbId:any;
  hpbId:any;
  busyMessage:any="Please Wait...";  
  busy:any;
  showEmptyFlag:any=false;
  constructor(public navCtrl: NavController, public navParams: NavParams, public sqlS:SqlServices,public app: App,public events:Events,public appCom:appCommonMethods) {
       this.events.subscribe("refreshHpbProductList",()=>{
     //   this.refreshHpbProductReceiptList();
        
    });
      this.app.viewDidEnter.subscribe(()=>{
            this.refreshHpbProductReceiptList();
      });
  }

  ionViewDidLoad() {
   
  //  this.refreshHpbProductReceiptList();
  }

 async ionViewDidEnter() {
     this.busyMessage = await this.appCom.getTranslatedTxt("Please wait...");   
  }


  refreshHpbProductReceiptList(){
    this.paramsData=this.navParams.data;
    var hpbData = this.paramsData['hpbData'];   
    var hpbId = hpbData['server_hpb_id'];
    if( hpbId != undefined && hpbId != "" ){
        let query="SELECT projm.project_name,pm.product_name,prm.receipt_id,prm.quantity,prm.unit,prm.local_created_date,(SELECT prat.approval_status FROM products_receipt_approval_tbl AS prat WHERE prat.receipt_id = prm.receipt_id AND prat.approval_role = 'TLH' AND prat.is_closed = 0 ) AS tlh_approval,(SELECT prat.approval_status FROM products_receipt_approval_tbl AS prat WHERE prat.receipt_id = prm.receipt_id AND prat.approval_role = 'AC' AND prat.is_closed = 0) AS ac_approval,(SELECT prat.approval_status FROM products_receipt_approval_tbl AS prat WHERE prat.receipt_id = prm.receipt_id AND prat.approval_role = 'SA' AND prat.is_closed = 0) AS sa_approval, (SELECT prat.rejection_reason FROM products_receipt_approval_tbl AS prat WHERE prat.receipt_id = prm.receipt_id AND prat.approval_role = 'TLH' AND prat.is_closed = 0) AS tlh_rejection_res ,(SELECT prat.rejection_reason FROM products_receipt_approval_tbl AS prat WHERE prat.receipt_id = prm.receipt_id AND prat.approval_role = 'AC' AND prat.is_closed = 0) AS ac_rejection_res ,(SELECT prat.rejection_reason FROM products_receipt_approval_tbl AS prat WHERE prat.receipt_id = prm.receipt_id AND prat.approval_role = 'SA' AND prat.is_closed = 0) AS sa_rejection_res FROM product_receipt_master prm LEFT JOIN product_master pm ON prm.product_id = pm.server_product_id LEFT JOIN project_master projm ON projm.project_id = prm.project_id where prm.server_hpb_id = "+hpbId;
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
        },(error)=>{
            console.log('Error', error);  
        });
                
        this.productReceiptDataTemp= this.productReceiptData;
        console.log( "this.productReceiptData-0-0-0-0-0-0-0->",this.productReceiptData );
      }

   
  }


  timeStampToDate(date){
    let newDateF = moment(date).format("DD MMM YYYY");
    return newDateF;
  }

  

  goToProductReceiptDetail(product_receipt){
    this.app.getRootNav().push(ProductReceiptsDetailsPage,{
      "productReceiptId" : product_receipt['receipt_id'],
      "projName" : product_receipt['project_name']
    });
  }

  //SEARCH Product Receipt
  searchProductReceipt(eventVal){
     
        if (typeof eventVal.target.value != 'undefined' && eventVal.target.value.length != 0) {
             
            this.busy=this.sqlS.search_product_receipt( eventVal.target.value).then((searchRes)=>{
                console.log("searchRes",searchRes);
                this.productReceiptData = [];
                for (let i = 0; i < searchRes['rows'].length; i++) {
                    this.productReceiptData.push( searchRes['rows'].item(i) );    

                      // var selectField = " `hpb_id`, `hpb_name` ,`hpb_type` ";
                      // var tablename = "hpb_master";
                      // var where=" `hpb_id` = "+this.productReceiptData[i]['hpb_id'];
                      // this.sqlS.selectTableData(selectField,tablename,where,"","").then((hpbdata) => {
                      //       this.productReceiptData[i]['user']=hpbdata['rows'].item(0); 
                      // }, (error) => {
                      //     console.log('Error', error);  
                      // }); 
                }
                console.log("this.productReceiptData",this.productReceiptData);
            });

        }else{
              this.productReceiptData = this.productReceiptDataTemp;
        }
  }

  goToHome(){
    this.app.getRootNav().setRoot(HomePage);
  }

}
