import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, App, ModalController } from 'ionic-angular';
import { AcCementBagRemovalDetailPage } from "../ac-cement-bag-removal-detail/ac-cement-bag-removal-detail";
import * as moment from 'moment';
import { appCommonMethods } from "../../../providers/appCommonMethods";
import { SqlServices } from "../../../providers/sqlService";
import { Cement_bag_removals_tblApi } from "../../../shared/loopback_sdk/index";
import { AcCementBagRemovalFormPage } from "../ac-cement-bag-removal-form/ac-cement-bag-removal-form";
import { ALL_MESSAGE } from "../../../providers/constant";
import { AcCementBagRemovalSearchPage } from "../ac-cement-bag-removal-search/ac-cement-bag-removal-search";

@Component({
  selector: 'page-ac-cement-bag-removal-list',
  templateUrl: 'ac-cement-bag-removal-list.html',
})
export class AcCementBagRemovalListPage {

  busy: any;
  busyMessage: any;
  userName:any;
  uId:number;
  userRole="$ac";
  removalAllData:any=[];
  removalAllDataTemp:any=[];
  limit:number = 5;
  pages:number = 0;
  dataLen:number = 0;
  dataLoadCompleted:any=false;
  filterby:any="";

  cementBagRemArr:any={ 
     fromDate:null,
     toDate:null,
     district:null,
  }

  constructor(public navCtrl: NavController, public navParams: NavParams,public appCom:appCommonMethods,public app :App,public sqlS:SqlServices,public getCementBagRemApi:Cement_bag_removals_tblApi,public modalCtrl:ModalController) {
  }
  

  ionViewDidLoad() {    

  }

  async ionViewDidEnter(){
  this.busyMessage = await this.appCom.getTranslatedTxt("Please wait...");   
  console.log('ionViewDidEnter TlhProductReceiptsAllPage');
      this.appCom.getAppPreference("userCreds").then(
        resDataU => {
        this.userName = resDataU.user.realm;
        let uId = resDataU.userId;
        this.uId = parseInt(uId);
        this.removalAllData=[];
        this.pages=0;
        this.limit=5;
        this.loadData();
      },
    err => {
        console.log("err ref", err);
    });
    
  }

  loadData(){

    this.busy =  this.getCementBagRemApi.getCementBagRemoval(null,this.cementBagRemArr.district,this.cementBagRemArr.fromDate,this.cementBagRemArr.toDate,null,this.uId,null,null,this.limit,this.pages).subscribe(resData => {
    this.pages++;  
      this.dataLen = resData.result.length; 
      for (let x=0; x<  this.dataLen;x++) {
        this.removalAllData.push(resData.result[x]);
      }
      this.removalAllDataTemp=this.removalAllData;
    },
    error => {
      console.log("error", error);
    });
  }



  openFilterPage(){
        let filterPageD = this.modalCtrl.create(AcCementBagRemovalSearchPage,{cementBagRemArr:this.cementBagRemArr});
        filterPageD.onDidDismiss((fDataRes:any)=>{
          console.log("fDataRes",fDataRes);
        if(fDataRes){
          if( fDataRes['cementBagRemArr'] ){ 
              this.cementBagRemArr = fDataRes['cementBagRemArr'];
              this.filterby=fDataRes?fDataRes['filterby']:"";

              if(this.cementBagRemArr['fromDate'] != null && this.cementBagRemArr['fromDate'] != undefined ){
                  this.cementBagRemArr['fromDate']=this.appCom.dateToTimeStamp(this.cementBagRemArr.fromDate);
              }

              if(this.cementBagRemArr['toDate'] != null && this.cementBagRemArr['toDate'] != undefined ){
                  let d = this.appCom.dateToTimeStamp(this.cementBagRemArr.toDate);
                  let t=new Date(d).setHours(23,59,59); 
                  this.cementBagRemArr['toDate']=t;
              }

              this.pages=0;
              this.removalAllData=[];
              this.loadData();
          }
      } 
            
        });
        filterPageD.present();
  }


  searchCementBagRemReceipts(ev){
     console.log("ev",ev);

     
        this.removalAllData=this.removalAllDataTemp;
        if(ev.target.value != undefined && ev.target.value != '' ){
                let val = ev.target.value;
                  console.log("val",val);
                  if (val && val.trim() != '') {
                          this.removalAllData = this.removalAllData.filter((item) => {
                          console.log("----->",(item['location_name'].toLowerCase().indexOf(val.toLowerCase()) > -1));
                          return (item['location_name'].toLowerCase().indexOf(val.toLowerCase()) > -1);
                      });
                  }
        }else{
            this.pages=0;
            this.limit=5;
            this.removalAllData=[];
            this.loadData();
        }
   
        
  }

  goToBagRemovalReceiptDetail( remItem ){
    console.log("remItem----------------------------------->",remItem);
    this.navCtrl.push(AcCementBagRemovalDetailPage,{
      "receiptId":remItem['id']
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

  goTRemovalForm(){
    this.navCtrl.push(AcCementBagRemovalFormPage);
  }

    clearFilter(){
    this.cementBagRemArr={ 
     fromDate:null,
     toDate:null,
     district:null,
    }
      this.filterby="";
      this.pages=0;
      this.removalAllData=[];
      this.loadData();
  }



}
