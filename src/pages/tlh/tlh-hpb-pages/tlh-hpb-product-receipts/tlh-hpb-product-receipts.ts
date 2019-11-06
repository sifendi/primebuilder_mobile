import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams,Events } from 'ionic-angular';
import { App } from 'ionic-angular';


import * as moment from 'moment';
import { SqlServices } from "../../../../providers/sqlService";
import { appCommonMethods } from "../../../../providers/appCommonMethods";
import { App_product_receiptApi } from "../../../../shared/loopback_sdk/index";
import { TlhHpbReceiptDetailPage } from "../tlh-hpb-receipt-detail/tlh-hpb-receipt-detail";
import { ALL_MESSAGE } from "../../../../providers/constant";


@Component({
  selector: 'tlh-hpb-product-receipts',
  templateUrl: 'tlh-hpb-product-receipts.html',
})
export class TlhHpbProductReceiptsPage {
  
  busy: any;
  busyMessage: any;
  userName:any;
  uId:number;
  userRole="$tlh";
  productReceiptAllData:any=[];
  limit:number = 5;
  pages:number = 0;
  dataLen:number = 0;
  hpbId:number;
  dataLoadCompleted:any=false;
  constructor(public navCtrl: NavController, public navParams: NavParams,public productReciptapi: App_product_receiptApi,public appCom:appCommonMethods,public app :App,public sqlS:SqlServices) {
  }

  ionViewDidLoad() {
   
  
  }


  async ionViewDidEnter(){
        this.busyMessage = await this.appCom.getTranslatedTxt("Please wait...");
        let paramsData= this.navParams.data
        this.hpbId=paramsData['hpbId']
        console.log('ionViewDidEnter TlhProductReceiptsAllPage');
        this.appCom.getAppPreference("userCreds").then(
        resDataU => {
        this.userName = resDataU.user.realm;
        let uId = resDataU.userId;
        this.uId = parseInt(uId);
        this.productReceiptAllData=[];
        this.pages=0;
        this.limit=5;
        this.loadData();
      },
    err => {
        console.log("err ref", err);
    });
    
  }

  loadData(){

    this.busy =  this.productReciptapi.getProductReceiptWithApproval(null,this.hpbId,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null).subscribe(resData => {
    this.pages++;  
    this.dataLen = resData.result.length;
    for (let x=0; x<  this.dataLen;x++) {
        this.productReceiptAllData.push(resData.result[x]);
    }
      
      console.log("this.productReceiptAllData", this.productReceiptAllData);
    },
    error => {
      console.log("error", error);
    });
  }

  goToTlhReceiptDetail( receipt ){
    console.log("receipt----------------------------------->",receipt);
    this.app.getRootNav().push(TlhHpbReceiptDetailPage,{
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
      this.ionViewDidEnter();
    }, 2000);
  }

}
