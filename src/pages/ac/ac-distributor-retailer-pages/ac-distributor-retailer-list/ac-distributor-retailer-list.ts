import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, Platform, Events, ModalController } from 'ionic-angular';
import { SqlServices } from "../../../../providers/sqlService";
import { appCommonMethods } from "../../../../providers/appCommonMethods";
import { AddVisitFormPage } from "../../../visit-pages/visit-add-form/visit-add-form";
import { ALL_MESSAGE } from "../../../../providers/constant";
import { CallNumber } from '@ionic-native/call-number';
import { DistributorRetailerVisitSearchPage } from "../../../distributor-retailer-visit/distributor-retailer-visit-search/distributor-retailer-visit-search";
import { App_rdsApi } from "../../../../shared/loopback_sdk/index";
import { AcDistributorRetailerDetailPage } from "../ac-distributor-retailer-detail-page/ac-distributor-retailer-detail-page";
import { AcDistributorRetailerSearchPage } from "../ac-distributor-retailer-search/ac-distributor-retailer-search";

declare var cordova;
declare var sessionUserGlobalData;

@Component({
  selector: 'ac-distributor-retailer-list',
  templateUrl: 'ac-distributor-retailer-list.html',
})
export class AcDistributorRetailerListPage {
    dataLoadCompleted : any = false;
    dataLen: any;
    limit: number = 5;
    userName: any;
    pages: number = 0;
    retailerDistributorAllData: any=[];
    retailerDistributorAllDataTemp:any=[];
    retailerDistributorAllDataTempF:any=[];
    uId: number;
    roleName: any;

    rdsData:any=[];
    rdsDataTemp:any=[];
    insertId:any;
    check:any=false;
    busy:  any;
    busyMessage:any="Please Wait...";  
    userId:any;
    showEmptyFlag:any=false;
    filterby:any='';
    searchString:any=null;
    rdsFilterArr:any={
     city:null,
     type:null,
    }

    constructor(private appRds:App_rdsApi,public navCtrl: NavController, public navParams: NavParams,public sqlS:SqlServices,public appCom:appCommonMethods,public alertCtrl:AlertController,public callNumber: CallNumber,public platform: Platform,public events:Events,public modalCtrl:ModalController) {
     

    }

    ionViewDidLoad() {

    }


    async ionViewDidEnter(){
        this.busyMessage = await this.appCom.getTranslatedTxt("Please wait...");   
        console.log(" tlh ionViewDidEnter called ");
        this.userName = sessionUserGlobalData.user.userinfo[0].name;
        this.roleName = sessionUserGlobalData.user.roles[0].name;
        let uId = sessionUserGlobalData.userId;
        this.uId = parseInt(uId);
        this.retailerDistributorAllData=[];
        this.pages=0;
        this.limit=5;
        this.loadData();
    }

    loadData(){
          return new Promise((resolve,reject)=>{
             this.busy=this.appRds.getRds(null,null,this.limit,this.pages,this.uId,this.roleName,this.rdsFilterArr.city,this.rdsFilterArr.type,this.searchString).subscribe(resData => {
            this.pages++;  
            this.dataLen = resData.result.length; 
            if(this.dataLen < this.limit){
                this.dataLoadCompleted = true;
            }
            for (let x=0; x<  this.dataLen;x++) {
                console.log(" loaded data rds ",resData.result[x]);
                this.retailerDistributorAllData.push(resData.result[x]);
                
            }
            
                if(this.retailerDistributorAllData){
                for(let j=0;j<this.retailerDistributorAllData.length;j++){
                   if(this.retailerDistributorAllData[j]['municipality']){
                     let temp=[];
                     temp = (this.retailerDistributorAllData[j]['municipality']);
                     let p=0;
                     let tempstr="";
                        temp.forEach(element => {
                            if( p>0 ){
                                  tempstr+=","+ element['name'];
                            }else{
                                  tempstr+=element['name'];
                            }
                            element['name']
                            p++;
                        });
                        this.retailerDistributorAllData[j]['city_display_str']=tempstr;
                   }

                    if(this.retailerDistributorAllData[j]['province']){
                     let temp=[];
                     temp = (this.retailerDistributorAllData[j]['province']);
                     let p=0;
                     let tempstr="";
                        temp.forEach(element => {
                            if( p>0 ){
                                  tempstr+=","+ element['name'];
                            }else{
                                  tempstr+=element['name'];
                            }
                            element['name']
                            p++;
                        });
                        this.retailerDistributorAllData[j]['province_display_str']=tempstr;
                   }

                    if(this.retailerDistributorAllData[j]['subdistrict']){
                     let temp=[];
                     temp = (this.retailerDistributorAllData[j]['subdistrict']);
                     let p=0;
                     let tempstr="";
                        temp.forEach(element => {
                            if( p>0 ){
                                  tempstr+=","+ element['name'];
                            }else{
                                  tempstr+=element['name'];
                            }
                            element['name']
                            p++;
                        });
                       this.retailerDistributorAllData[j]['sub_district_display_str']=tempstr;
                   }

                   if(this.retailerDistributorAllData[j]['postal_code']){
                     let temp=[];
                     temp = (this.retailerDistributorAllData[j]['postal_code']);
                     let p=0;
                     let tempstr="";
                        temp.forEach(element => {
                            if( p>0 ){
                                  tempstr+=","+ element['name'];
                            }else{
                                  tempstr+=element['name'];
                            }
                            element['name']
                            p++;
                        });
                       this.retailerDistributorAllData[j]['postal_code_display_str']=tempstr;
                   }

                } 

            }
            console.log("this.retailerDistributorAllData",this.retailerDistributorAllData);
            this.retailerDistributorAllDataTemp=this.retailerDistributorAllData;
            resolve(true);

        },
        error => {
            console.log("error", error);
            reject(true);
        });
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

    makephonecall(mobno){
        if( mobno !=undefined && mobno !='' ){
            this.callNumber.callNumber(mobno, true)
            .then(() => console.log('Launched dialer!'))
            .catch(() => console.log('Error launching dialer')); 
        }     
    }


    goToRdsDetail(rds){
        this.navCtrl.push(AcDistributorRetailerDetailPage,{
            "rdsData":rds
        });
    }
 
    goToFilterPage(){
        let selFilterData={};
        let filterPageD = this.modalCtrl.create(AcDistributorRetailerSearchPage,{rdsFilterArr:this.rdsFilterArr});
        filterPageD.onDidDismiss((fDataRes:any)=>{
            console.log("fDataRes--->",fDataRes);
        if(fDataRes){
                if( fDataRes['rdsFilterArr'] ){ 
                    this.rdsFilterArr = fDataRes['rdsFilterArr'];
                    this.filterby=fDataRes?fDataRes['filterby']:"";
                    this.pages=0;
                    this.retailerDistributorAllData=[];
                    this.loadData();
		    }}
        });
        filterPageD.present();

    }

    clearFilter(){
      this. rdsFilterArr={
        city:null,
        type:null,
      }
      this.filterby="";
      this.pages=0;
      this.retailerDistributorAllData=[];
      this.loadData();
  }

  searchDRList(ev){
     console.log("ev",ev);

        this.pages=0;
        this.limit=5;
        this.retailerDistributorAllData=[];
        //this.retailerDistributorAllData=this.retailerDistributorAllDataTemp;
        if(ev.target.value != undefined && ev.target.value != '' ){
            this.searchString = ev.target.value;
        }else{
            this.searchString=null;
        }
            this.loadData();
        
  }

}
