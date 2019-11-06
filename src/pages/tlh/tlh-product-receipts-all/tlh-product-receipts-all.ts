import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, App, Events } from 'ionic-angular';
import { App_product_receiptApi } from "../../../shared/loopback_sdk/index";
import { Subscription } from "rxjs";
import { appCommonMethods } from "../../../providers/appCommonMethods";
import { TlhReceiptDetailPage } from "../tlh-receipt-detail/tlh-receipt-detail";
import { SqlServices } from "../../../providers/sqlService";

import * as moment from 'moment';

@Component({
  selector: 'page-tlh-product-receipts-all',
  templateUrl: 'tlh-product-receipts-all.html',
})
export class TlhProductReceiptsAllPage {
  busy: Subscription;
  busyMessage: any;
  userName:any;
  uId:number;
  userRole="$tlh";
  productReceiptAllData:any=[];
  productReceiptAllDataTemp:any=[];
  limit:number = 5;
  pages:number = 0;
  dataLen:number = 0;
  dataLoadCompleted:any=false;
  firstFunctionCalled:boolean=false;
  filterby:any='';
  searchString:any=null;
  prodReceiptFilterArr:any={
     product:null,
     fromDate:null,
     toDate:null,
     receiptType:'all',
     by:null,
     status:null,
  }


  constructor(public navCtrl: NavController, public navParams: NavParams,public productReciptapi: App_product_receiptApi,public appCom:appCommonMethods,public app :App,public sqlS:SqlServices,public events:Events) {
      this.events.subscribe('tlhProdRecieptAListFilter',(filterObj) => {
      if(filterObj){
          if( filterObj['prodReceiptFilterArr'] ){ 
              console.log("filterObj['prodReceiptFilterArr']",filterObj['prodReceiptFilterArr']); 
              this.prodReceiptFilterArr = filterObj['prodReceiptFilterArr'];
              this.filterby=filterObj?filterObj['filterby']:"";

              if(this.prodReceiptFilterArr['fromDate'] != null && this.prodReceiptFilterArr['fromDate'] != undefined ){
                  this.prodReceiptFilterArr['fromDate']=this.appCom.dateToTimeStamp(this.prodReceiptFilterArr.fromDate);
              }

              if(this.prodReceiptFilterArr['toDate'] != null && this.prodReceiptFilterArr['toDate'] != undefined ){
                  let d = this.appCom.dateToTimeStamp(this.prodReceiptFilterArr.toDate);
                  this.prodReceiptFilterArr['toDate']=new Date(d).setHours(23,59,59); 
              }

              this.pages=0;
              this.productReceiptAllData=[];
              this.loadData();
          }
      }   
    });

     /*this.events.subscribe('cleartlhProdRecieptAListFilter',() => {
         console.log("<------------------------------------------------------------->");
         this.clearFilter();
     });*/

      /*this.app.viewDidEnter.subscribe(()=>{
          if(this.firstFunctionCalled == false){
            this.firstFunctionCalled = true;
            this.productReceiptAllData=[];
            this.firstFunction();
          }
      })*/
  }

  async ionViewDidEnter(){
      this.busyMessage = await this.appCom.getTranslatedTxt("Please wait...");   
      this.clearFilter();
  }

  firstFunction(){
      console.log('ionViewDidEnter TlhProductReceiptsAllPage');
      this.dataLoadCompleted = false; 
      this.dataLen = 0;
      this.appCom.getAppPreference("userCreds").then(
        resDataU => {
        this.userName = resDataU.user.realm;
        let uId = resDataU.userId;
        this.uId = parseInt(uId);
        this.pages=0;
        this.limit=5;
        this.productReceiptAllData=[];
        this.loadData();
      },
    err => {
        console.log("err ref", err);
    });
  }

  loadData(){
    console.log(" load data called")
   return new Promise((resolve,reject)=>{
        this.busy =  this.productReciptapi.getProductReceiptWithApproval(null,null,null,this.prodReceiptFilterArr.product,null,this.uId,this.userRole,this.prodReceiptFilterArr.status,this.prodReceiptFilterArr.by,null,null,null,null,this.limit,this.pages,this.prodReceiptFilterArr.fromDate,this.prodReceiptFilterArr.toDate,this.searchString).subscribe(resData => {
        //this.productReciptapi.getProductReceiptWithApproval(null,null,null,null,null,this.uId,this.userRole,null,null,null,null,null,null,this.limit,this.pages,null,null).subscribe(resData => {
          this.pages++;  
          this.dataLen = resData.result.length; 
          if(this.dataLen < this.limit){
            this.dataLoadCompleted = true;
          }
          for (let x=0; x<  this.dataLen;x++) {
            this.productReceiptAllData.push(resData.result[x]);
            if(x == this.dataLen-1){
              this.firstFunctionCalled = false;
            }
          }
          this.productReceiptAllDataTemp=this.productReceiptAllData;
          resolve(true);
        },
        error => {
          this.firstFunctionCalled = false;
          reject(error);
          console.log("error", error);
        });
    });    
  }



  //SEARCH Product Receipts
searchProductReceipts(ev){
     console.log("ev",ev);

        this.pages=0;
        this.limit=5;
        this.productReceiptAllData=[];
        //this.productReceiptAllData=this.productReceiptAllDataTemp;
        if(ev.target.value != undefined && ev.target.value != '' ){
            this.searchString = ev.target.value;
        }else{
            this.searchString =null;
        }
        this.loadData(); 
        
  }

  goToTlhReceiptDetail( receipt ){
    console.log("receipt----------------------------------->",receipt);
    this.app.getRootNav().push(TlhReceiptDetailPage,{
      "receiptId":receipt['receipt_id']
    });
  }

  timeStampToDate(date){
    let newDateF = moment(date).format("DD MMM YYYY");
    return newDateF;
  }

  doInfinite(infiniteScroll) {
    setTimeout(() => {
      if(this.dataLen < this.limit){
          this.dataLoadCompleted = true;
      }else{
          this.loadData();
      }
      infiniteScroll.complete();
    }, 500);
  }

  doRefresh(refresher) {
    setTimeout(() => {
      refresher.complete();
      this.productReceiptAllData=[];
      this.firstFunction();
    }, 2000);
  }

  clearFilter(){
      this.prodReceiptFilterArr={
        product:null,
        fromDate:null,
        toDate:null,
        receiptType:'all',
        by:null,
        status:null,
      }
      this.filterby="";
      this.pages=0;
      this.productReceiptAllData=[];
      this.firstFunction();
  }

  

}
