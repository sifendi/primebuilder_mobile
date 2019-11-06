import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Events, ModalController } from 'ionic-angular';
import { appCommonMethods } from "../../../../providers/appCommonMethods";
import { SqlServices } from "../../../../providers/sqlService";
import { SyncServices } from "../../../../providers/syncServices";
import * as moment from 'moment';
import { Eap_leadApi }  from '../../../../shared/loopback_sdk';
import 'rxjs/add/operator/toPromise';
import * as _ from 'lodash';
import { EapLeadSearchModalAc } from "../eap-lead-list-search-modal-ac/eap-lead-list-search-modal-ac";
import { EapLeadDetailsAc } from "../eap-lead-details-ac/eap-lead-details-ac";
declare var sessionUserGlobalData;


@Component({
  selector: 'eap-lead-list-ac',
  templateUrl: 'eap-lead-list-ac.html',
})
export class EapLeadListAc {
  busy:any;
  busyMessage:any="Please Wait..."; 
  projCustListObjArrs:any=[];
  fiterIdStr:any="0";
  fiterIdArr:any=[];
   constructor(private events: Events,public navCtrl: NavController, public navParams: NavParams,private appCom:appCommonMethods,private sqlS:SqlServices,private syncS:SyncServices,public modCtrl:ModalController,private elApi:Eap_leadApi) {
        
    this.initCurrUserData();

  }

  initCurrUserData(){
    let subDArr = sessionUserGlobalData['user']['subdistrict'];
     this.fiterIdArr=[];
    let subDtStr="";
    for(let l=0;l<subDArr.length;l++){
      if(l>0){
        subDtStr+=","+ subDArr[l]['id'];
      }else{
        subDtStr+=""+subDArr[l]['id'];
      }
      this.fiterIdArr.push(subDArr[l]['id']);
    }
    if(subDtStr!=""){
      this.fiterIdStr=subDtStr;
    }else{
      this.fiterIdStr="0";
    } 
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ProjectCustomerListPage');
  }
 
   ionViewDidEnter() {
      this.busy=this.initListData().then(()=>{},()=>{});
   }

 async initListData(){
       return new Promise(async(resolve,reject)=>{
              let allLeadsData:any = [];
              let filterDataH= {};
              filterDataH['lead_sub_district_id']=this.fiterIdStr;
              allLeadsData = await this.elApi.getLead(filterDataH).toPromise().catch((reson)=>{return false;})
              if(allLeadsData==false){
                resolve(true);
                return false;
              }
              let responseResults = allLeadsData['result'];
              if(responseResults.length>0){
                  let tempDisDataAll = [];
                  let tempDisDataAllFinal:any = [];
                  for(let i=0;i<responseResults.length;i++){
                          let tempDisData = responseResults[i];
                          tempDisData['lead_photos'] = tempDisData['lead_photos']?JSON.parse(tempDisData['lead_photos']):[];
                          tempDisDataAllFinal.push(tempDisData);
                  }
                  this.projCustListObjArrs=tempDisDataAllFinal;
              }
              resolve(true);
         });
  }



  goToDetails(leadId,leadData){
      this.navCtrl.push(EapLeadDetailsAc,{leadId:leadId,leadData:leadData});
  }

  openSearch(){
    console.log('ionViewDidLoad openSearch');
    let filterDataObj={};
    let modelSearch = this.modCtrl.create(EapLeadSearchModalAc,filterDataObj);
    modelSearch.onDidDismiss(()=>{
      console.log('modelSearch onDidDismiss');
    });
    modelSearch.present();
  }

}
