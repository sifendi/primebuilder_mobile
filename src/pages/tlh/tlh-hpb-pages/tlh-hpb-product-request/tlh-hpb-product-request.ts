import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, App } from 'ionic-angular';
import { appCommonMethods } from "../../../../providers/appCommonMethods";
import { SqlServices } from "../../../../providers/sqlService";
import { App_product_requestApi } from "../../../../shared/loopback_sdk/index";
import * as moment from 'moment';
import { TlhHpbProductRequestsDetailsPage } from "../tlh-hpb-product-requests-details/tlh-hpb-product-requests-details";
import { ALL_MESSAGE } from "../../../../providers/constant";



@Component({
  selector: 'tlh-hpb-product-request',
  templateUrl: 'tlh-hpb-product-request.html',
})
export class TlhHpbProductRequestsPage {

  busy: any;
  busyMessage: any;
  productRequestAllData:any=[];
  limit:number = 5;
  pages:number = 0;
  dataLen:number = 0;
  uId:number;
  hpbId:number;
  dataLoadCompleted:any=false;

  constructor(public navCtrl: NavController, public navParams: NavParams,public appCom:appCommonMethods,public app :App,public sqlS:SqlServices,public productRequestApi:App_product_requestApi) {
  }

   async ionViewDidEnter(){

        this.busyMessage = await this.appCom.getTranslatedTxt("Please wait..."); 
        let paramsData= this.navParams.data;
        this.hpbId=paramsData['hpbId'];
        console.log("this.navParams.data",this.navParams.data);
        this.appCom.getAppPreference("userCreds").then(
        resDataU => {
        let uId = resDataU.userId;
        this.uId = parseInt(uId);
        this.productRequestAllData=[];
        this.pages=0;
        this.limit=5;
        this.loadData();
      },
    err => {
        console.log("err ref", err);
    });
    
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AcProjectProductRequestsPage');
  }


  loadData(){

    this.busy =  this.productRequestApi.getProductRequest(null,null,null,null,null,null,null,this.limit,this.pages,this.hpbId).subscribe(resData => {
    this.pages++;  
    this.dataLen = resData.result.length;
      
    for (let x=0; x< this.dataLen;x++) {
        this.productRequestAllData.push(resData.result[x]);
    }
      
      console.log("this.productRequestAllData", this.productRequestAllData);
    },
    error => {
      console.log("error", error);
    });
  }

  


  goToRequestDetails(requestId){
    this.app.getRootNav().push(TlhHpbProductRequestsDetailsPage,{
      "requestId":requestId
    });
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
