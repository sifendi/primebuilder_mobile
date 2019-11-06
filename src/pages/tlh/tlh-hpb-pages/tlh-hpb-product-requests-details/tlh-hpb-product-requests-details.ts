import { Component, ApplicationRef } from '@angular/core';
import { IonicPage, NavController, NavParams,App } from 'ionic-angular';
import { appCommonMethods } from "../../../../providers/appCommonMethods";
import * as moment from 'moment';
import async from 'async'; 
import { App_product_requestApi } from "../../../../shared/loopback_sdk/index";
import { ALL_MESSAGE } from "../../../../providers/constant";

declare var sessionUserGlobalData;
@Component({
  selector: 'tlh-hpb-page-product-requests-details',
  templateUrl: 'tlh-hpb-product-requests-details.html',
})
export class TlhHpbProductRequestsDetailsPage {
  
  productRequestData:any=[];
  hpb_Id:any;
  busyMessage:any;
  busy:any;
  uId:number;
  digitalSignaturePath:any;
 constructor(public navCtrl: NavController,public app:App, public navParams: NavParams,public appCom:appCommonMethods,public productRequestApi:App_product_requestApi) {


  }

 ionViewDidLoad() {
        console.log('ionViewDidLoad TlhHpbProductRequestsDetailsPage');
        let paramData=this.navParams.data;
        let requestId =paramData['requestId'];
        this.busy =  this.productRequestApi.getProductRequest(requestId,null,null,null,null,null,null,null,null,null,null).subscribe(resData => {
        this.productRequestData= resData.result[0];  
        if(this.productRequestData){
           if( this.productRequestData['hpb_digital_sign'] != undefined && this.productRequestData['hpb_digital_sign'] != '' ){
              let digiS= JSON.parse(this.productRequestData['hpb_digital_sign']);
              this.digitalSignaturePath=digiS[0];
           }
        }   
        }, (error) => {
            console.log('Error', error);
        });
        
  }

  async ionViewDidEnter() {
     this.busyMessage = await this.appCom.getTranslatedTxt("Please wait...");   
  }


}
