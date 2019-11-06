import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { App_loginApi,App_hpbApi,LoopBackAuth,RewardApi,App_product_receiptApi } from "../../../shared/loopback_sdk";
import { Subscription } from "rxjs";

import { ShareService } from "../../../providers/ShareService";
import { appCommonMethods } from "../../../providers/appCommonMethods";

import { ReceiptDetailPage } from "../receipt-detail/receipt-detail";
import { ALL_MESSAGE } from "../../../providers/constant";

/**
 * Generated class for the MasonReceiptListPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@Component({
  selector: 'page-mason-receipt-list',
  templateUrl: 'mason-receipt-list.html',
})
export class MasonReceiptListPage {
  netCon: any;
  busy: Subscription;
  busyMessage: any;
  userName: any;
  receiptList: any = [];
  uId: any;
  totalPoints: number = 0;
  limit:number = 5;
  pages:number = 0;
  dataLen:number = 0;
  dataLoadCompleted:boolean = false;
  hpb_id:number = 0;
  range: Array < Date > = [];
  calender: any;
  from_date: number = 0;
  to_date: number = 0;
  rangeSettings: any = {
      theme: 'material',
      display: 'center',
      onChange: function(event, inst) {
          alert(" getdate ");
          console.log(" get date ",event,inst);
      }
  };
  constructor( public rewardApi: RewardApi,public productRecipt: App_product_receiptApi,public navCtrl: NavController,public navParams: NavParams,public shareS: ShareService,public appCom: appCommonMethods) {
  }
  
  changeDate(){
      setTimeout(() => {
          console.log(" check range ",this.range);
          let date1 = this.appCom.dateToTimeStamp(this.range[0]); 
          let date2 = this.appCom.dateToTimeStamp(this.range[1]); 
          console.log("date1 --",date1);
          console.log("date2 --",date2);
          this.from_date = date1;
          this.to_date = date2;
      },100);
  }

  async ionViewDidEnter() {
    this.busyMessage = await this.appCom.getTranslatedTxt("Please wait...");   
    this.receiptList = [];
    this.totalPoints = 0;
    this.limit = 5;
    this.pages = 0;
    this.netCon = this.shareS.getshareData("netConnection");
    if (this.netCon) {
      this.appCom.getAppPreference("userCreds").then(
        resDataU => {
          //console.log(" resDataU ",resDataU);
          this.userName = resDataU.user.realm;
          this.uId = resDataU.userId;
          this.hpb_id = resDataU.user.userinfohpb[0].hpb_id;
          this.limit = 5;
          this.pages = 0;
          this.loadData();
        },
        err => {
          console.log("err ref", err);
        });
    }else{

    }

  }

  loadData(){
    if(this.from_date == 0){
      this.from_date = null;
    }
    if(this.to_date == 0){
      this.to_date = null;
    }
  
    this.busy = this.productRecipt.getProductReceipt(null, this.hpb_id,null,null,null,null,null,null,null,this.limit,this.pages,this.from_date,this.to_date).subscribe(resData => {
    //this.busy = this.productRecipt.getProductReceipt(null, this.hpb_id,null,null,null,null,null,null,null,this.limit,null,null,null).subscribe(resData => {
      
      this.dataLen = resData.result.length;
      this.pages++;
      let x;

      //for (x in resData.result) {
      for(let i=0;i<resData.result.length;i++) {
          resData.result[i].created_date = this.appCom.timeStampToDate(
              resData.result[i].created_date
          );
          this.totalPoints = this.totalPoints + resData.result[i].points;
          this.receiptList.push(resData.result[i]);
      }
      console.log("data length",this.dataLen,this.limit);
        
      if(this.dataLen < this.limit){
        console.log(this.dataLen);
        this.dataLoadCompleted = true;
      }      
      console.log("this.receiptList", this.receiptList);
    },
    error => {
      console.log("error", error);
    });
  }

  doInfinite(infiniteScroll) {
    console.log('Begin async operation');

    setTimeout(() => {
      if(this.dataLen < this.limit){
          this.dataLoadCompleted = true;
      }else{
          this.loadData();
      }
      infiniteScroll.complete();
    }, 500);
  }

  openReceipt(id){

    this.navCtrl.push(ReceiptDetailPage, {
      receiptId: id,
      hpbId: this.hpb_id
    });
  }

}
