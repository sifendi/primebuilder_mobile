import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, App, ModalController } from 'ionic-angular';
import { appCommonMethods } from "../../../providers/appCommonMethods";
import { SqlServices } from "../../../providers/sqlService";
import { App_product_requestApi } from "../../../shared/loopback_sdk/index";
import { ALL_MESSAGE } from "../../../providers/constant";
import { AcHpbProductRequestsDetailsPage } from "../ac-hpb-pages/ac-hpb-product-requests-details/ac-hpb-product-requests-details";
import { AcProductRequestsSearchPage } from "../ac-product-requests-search/ac-product-requests-search";

import * as moment from 'moment';

declare var sessionUserGlobalData;

@Component({
  selector: 'ac-product-request-list',
  templateUrl: 'ac-product-request-list.html',
})
export class AcProductRequestsListPage {

  busy: any;
  busyMessage: any;
  productRequestAllData:any=[];
  productRequestAllDataTemp:any=[];
  limit:number = 5;
  pages:number = 0;
  dataLen:number = 0;
  uId:number;
  hpbId:number;
  dataLoadCompleted:any=false;
  searchString:any=null;
  prodRequestFilterArr:any={
     fromDate:null,
     toDate:null,
     status:null,
     receiptType:null
  }
  filterby="";
  role:any;

  constructor(public navCtrl: NavController, public navParams: NavParams,public appCom:appCommonMethods,public app :App,public sqlS:SqlServices,public productRequestApi:App_product_requestApi,public modalCtrl:ModalController) {
  }

  async ionViewDidEnter(){
        this.busyMessage = await this.appCom.getTranslatedTxt("Please wait...");  
        let paramsData= this.navParams.data;
        this.hpbId=paramsData['hpbId'];
        console.log("this.navParams.data",this.navParams.data);

        this.uId = parseInt(sessionUserGlobalData.userId);
        this.role = sessionUserGlobalData.user.roles[0].name;
        this.productRequestAllData=[];
        this.pages=0;
        this.limit=5;
        this.loadData();
    
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AcProjectProductRequestsPage');
  }


  loadData(){
    return new Promise((resolve,reject)=>{
        //this.busy =  this.productRequestApi.getProductRequest(null,null,null,null,null,null,null,this.limit,this.pages,this.hpbId,this.prodRequestFilterArr.fromDate,this.prodRequestFilterArr.toDate,this.prodRequestFilterArr.status).subscribe(resData => {
        this.busy =  this.productRequestApi.getProductRequest(null,null,null,null,null,sessionUserGlobalData.userId,sessionUserGlobalData.role,this.limit,this.pages,null,null,this.prodRequestFilterArr.fromDate,this.prodRequestFilterArr.toDate,this.prodRequestFilterArr.status,this.searchString).subscribe(resData => {
        this.pages++;  
        this.dataLen = resData.result.length;
          
        for (let x=0; x< this.dataLen;x++) {
            this.productRequestAllData.push(resData.result[x]);
        }
        this.productRequestAllDataTemp=this.productRequestAllData;
          resolve(true);
          console.log("this.productRequestAllData", this.productRequestAllData);
        },
        error => {
          console.log("error", error);
          reject(error);
        });
    });    
  }

//SEARCH Product Requests

searchProductRequests(ev){
     console.log("ev",ev);

        this.pages=0;
        this.limit=5;
        this.productRequestAllData=[];
        //this.productRequestAllData=this.productRequestAllDataTemp;
        if(ev.target.value != undefined && ev.target.value != '' ){
            this.searchString = ev.target.value;
        }else{
            this.searchString=null;
        }
        this.loadData(); 
        
  }


  goToRequestDetails(requestId){
    this.app.getRootNav().push(AcHpbProductRequestsDetailsPage,{
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

  clearFilter(){
    this.filterby="";
    this.pages=0;
    this.prodRequestFilterArr={
     fromDate:null,
     toDate:null,
     status:null,
     receiptType:null
    }
    this.loadData();    
  
}

openProductRequestFilter(){
       
      
        let filterPageD = this.modalCtrl.create(AcProductRequestsSearchPage,{prodRequestFilterArr:this.prodRequestFilterArr});
        filterPageD.onDidDismiss((fDataRes:any)=>{
          console.log("fDataRes",fDataRes);
        if(fDataRes){
          if( fDataRes['prodRequestFilterArr'] ){ 
              this.prodRequestFilterArr = fDataRes['prodRequestFilterArr'];
              this.filterby=fDataRes?fDataRes['filterby']:"";

              if(this.prodRequestFilterArr['fromDate'] != null && this.prodRequestFilterArr['fromDate'] != undefined ){
                  this.prodRequestFilterArr['fromDate']=this.appCom.dateToTimeStamp(this.prodRequestFilterArr.fromDate);
              }

              if(this.prodRequestFilterArr['toDate'] != null && this.prodRequestFilterArr['toDate'] != undefined ){
                  let d = this.appCom.dateToTimeStamp(this.prodRequestFilterArr.toDate);
                  let t=new Date(d).setHours(23,59,59); 
                  this.prodRequestFilterArr['toDate']=t;
              }

              this.pages=0;
              this.productRequestAllData=[];
              this.loadData();
          }
      } 
            
        });
        filterPageD.present();
  }

}
