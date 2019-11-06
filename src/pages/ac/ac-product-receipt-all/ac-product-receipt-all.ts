import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, App, Events } from 'ionic-angular';
import { App_product_receiptApi } from "../../../shared/loopback_sdk/index";
import { appCommonMethods } from "../../../providers/appCommonMethods";
import { SqlServices } from "../../../providers/sqlService";

import * as moment from 'moment';
import { AcReceiptDetailsPage } from "../receipt-details/receipt-details";
import { ALL_MESSAGE } from "../../../providers/constant";


@Component({
  selector: 'page-ac-product-receipt-all',
  templateUrl: 'ac-product-receipt-all.html',
})
export class AcProductReceiptAllPage {
  busy: any;
  busyMessage: any;
  userName:any;
  uId:number;
  userRole="$ac";
  productReceiptAllData:any=[];
  productReceiptAllDataTemp:any=[];
  limit:number = 5;
  pages:number = 0;
  dataLen:number = 0;
  dataLoadCompleted:any=false;
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
    this.events.subscribe('acProdRecieptAListFilter',(filterObj) => {
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
  }

  ionViewDidLoad() {    

  }

  async ionViewDidEnter(){
    this.busyMessage = await this.appCom.getTranslatedTxt("Please wait...");   
    this.clearFilter();
  }

  loadData(){
    return new Promise((resolve,reject)=>{
        this.busy =  this.productReciptapi.getProductReceiptWithApproval(null,null,null,this.prodReceiptFilterArr.product,null,this.uId,this.userRole,this.prodReceiptFilterArr.status,this.prodReceiptFilterArr.by,null,null,null,null,this.limit,this.pages,this.prodReceiptFilterArr.fromDate,this.prodReceiptFilterArr.toDate,this.searchString).subscribe(resData => {
        this.pages++;  
          this.dataLen = resData.result.length;
          
          for (let x=0; x<  this.dataLen;x++) {
            this.productReceiptAllData.push(resData.result[x]);
          }
          this.productReceiptAllDataTemp=this.productReceiptAllData;
          resolve(true);
          console.log("this.productReceiptAllData", this.productReceiptAllData);
        },
        error => {
          reject(error);
          console.log("error", error);
        });
    });    
  }

  

  //SEARCH Product Receipts

searchProductReceipt(ev){
     console.log("ev",ev);

      this.pages=0;
      this.limit=5;
      this.productReceiptAllData=[];
      
        //this.productReceiptAllData=this.productReceiptAllDataTemp;
        if(ev.target.value != undefined && ev.target.value != '' ){
            this.searchString = ev.target.value;   
        }else{
            this.searchString = null;
           
        }
        this.loadData();
   
        
  }

  goToAcReceiptDetail( receipt ){
    console.log("receipt----------------------------------->",receipt);
    this.app.getRootNav().push(AcReceiptDetailsPage,{
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
      this.ionViewDidEnter();
      
    }, 2000);
  }

  clearFilter(){

    console.log('ionViewDidEnter TlhProductReceiptsAllPage');
    this.appCom.getAppPreference("userCreds").then(
        resDataU => {
        this.userName = resDataU.user.realm;
        let uId = resDataU.userId;
        this.uId = parseInt(uId);
        this.productReceiptAllData=[];
        this.pages=0;
        this.limit=5;

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
        this.loadData();
      },
    err => {
        console.log("err ref", err);
    });

  }


}
