import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, App, Events } from 'ionic-angular';
import { App_product_receiptApi } from "../../../shared/loopback_sdk/index";
import { appCommonMethods } from "../../../providers/appCommonMethods";
import { SqlServices } from "../../../providers/sqlService";
import { TlhReceiptDetailPage } from "../tlh-receipt-detail/tlh-receipt-detail";
import { Subscription } from "rxjs/Rx";

import * as moment from 'moment';




@Component({
  selector: 'page-tlh-product-receipts-pending',
  templateUrl: 'tlh-product-receipts-pending.html',
})
export class TlhProductReceiptsPendingPage {
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
  approval:any="0";
  approval_by:any="$tlh";
  dataLoadCompleted:any=false;
  firstFunctionCalled:boolean=false;
  filterby:any='';
  searchString:any=null;
  prodReceiptFilterArr:any={
     product:null,
     fromDate:null,
     toDate:null,
     receiptType:'pending',
     by:"$tlh",
     status:"0",
  }

  constructor(public navCtrl: NavController, public navParams: NavParams,public productReciptapi: App_product_receiptApi,public appCom:appCommonMethods,public app :App,public sqlS:SqlServices,public events:Events) {
      this.events.subscribe('tlhProdRecieptPListFilter',(filterObj) => {
      if(filterObj){
          if( filterObj['prodReceiptFilterArr'] ){
            
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

     this.events.subscribe('cleartlhProdRecieptPListFilter',() => {
         this.clearFilter();
     })

    this.app.viewDidEnter.subscribe(()=>{
        if(this.firstFunctionCalled == false){
          this.firstFunctionCalled = true;
          this.productReceiptAllData=[];
          this.firstFunction();
        }
    })
  }

  
  async ionViewDidEnter() {
    this.busyMessage = await this.appCom.getTranslatedTxt("Please wait...");  
    this.clearFilter();
    if(this.firstFunctionCalled == false){
      this.firstFunctionCalled = true;
      this.productReceiptAllData=[];
      this.firstFunction();
      console.log("enter1");
    }
    // }else{
    //   console.log("enter2");
    //   this.searchProductReceipts('');
    // }
 }

  /*ionViewDidEnter(){
  
      if(this.firstFunctionCalled == false){
      this.firstFunctionCalled = true;
      this.productReceiptAllData=[];
      this.firstFunction();
    }
  }*/

  firstFunction(){
    this.dataLoadCompleted = false;
    this.dataLen = 0;
  
    console.log('ionViewDidEnter TlhProductReceiptsAllPage');
      this.appCom.getAppPreference("userCreds").then(
        resDataU => {
        console.log(" resDataU ",resDataU);
        this.userName = resDataU.user.realm;
        let uId = resDataU.userId;
        this.uId = parseInt(uId);
        console.log("this.uId ",this.uId );
        console.log("this.userName ",this.userName );
        this.pages=0;
        this.limit=5;
        this.approval="0";
        this.productReceiptAllData=[];
        this.loadData();
        this.firstFunctionCalled = false;
      },
    err => {
        console.log("err ref", err);
    });
    
  }

  loadData(){
    return new Promise((resolve,reject)=>{
        this.busy =  this.productReciptapi.getProductReceiptWithApproval(null,null,null,this.prodReceiptFilterArr.product,null,this.uId,this.userRole,this.prodReceiptFilterArr.status,this.prodReceiptFilterArr.by,null,null,null,null,this.limit,this.pages,this.prodReceiptFilterArr.fromDate,this.prodReceiptFilterArr.toDate,this.searchString).subscribe(resData => {
        //this.productReciptapi.getProductReceiptWithApproval(null,null,null,null,null,this.uId,this.userRole,this.approval,this.approval_by,null,null,null,null,this.limit,this.pages,null,null).subscribe(resData => {  
          this.dataLen = resData.result.length;
          this.pages++;
          if(this.dataLen < this.limit){
            this.dataLoadCompleted = true;
          }
          for (let x=0; x< resData.result.length;x++) {
            this.productReceiptAllData.push(resData.result[x]);
          }
          this.productReceiptAllDataTemp=this.productReceiptAllData;
          resolve(true);
        },error=>{
          reject(true);
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
            this.searchString=null;
        }
        this.loadData();
        
  }

  goToTlhReceiptDetail( receipt ){
    this.app.getRootNav().push(TlhReceiptDetailPage,{
      "receiptId":receipt['receipt_id']
    });
  }

  timeStampToDate(date){
    let newDateF = moment(date).format("DD MMM YYYY");
    return newDateF;
  }

  doInfinite(infiniteScroll) {
    //console.log('Begin async operation');

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
    //console.log('Begin async operation', refresher);
    setTimeout(() => {
      //console.log('Async operation has ended');
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
        receiptType:'pending',
        by:"$tlh",
        status:"0",
      }
      this.filterby="";
      this.pages=0;
      this.productReceiptAllData=[];
      this.loadData();
  }

}
