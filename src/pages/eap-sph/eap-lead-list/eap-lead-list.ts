import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Events, ModalController } from 'ionic-angular';
import { appCommonMethods } from "../../../providers/appCommonMethods";
import { SqlServices } from "../../../providers/sqlService";
import { SyncServices } from "../../../providers/syncServices";
import * as moment from 'moment';
import async from 'async'; 
import { EapLeadSearchModal } from "../../../pages/eap-sph/eap-lead-list-search-modal/eap-lead-list-search-modal";
import { EapLeadDetails } from "../../../pages/eap-sph/eap-lead-details/eap-lead-details";
@Component({
  selector: 'eap-lead-list',
  templateUrl: 'eap-lead-list.html',
})
export class EapLeadList {

  busy:any;
  busyMessage:any="Please Wait..."; 
  projCustListObjArrs:any=[];
   constructor(private events: Events,public navCtrl: NavController, public navParams: NavParams,private appCom:appCommonMethods,private sqlS:SqlServices,private syncS:SyncServices,public modCtrl:ModalController) {
   }
  ionViewDidLoad() {
    console.log('ionViewDidLoad ProjectCustomerListPage');
  }
 
   ionViewDidEnter() {
      this.busy=this.initListData().then(()=>{},()=>{});
   }

  initListData(){
       return new Promise((resolve,reject)=>{
              let queryProdReq="SELECT * from eap_lead";
              this.sqlS.queryExecuteSql(queryProdReq,[]).then((resData:any)=>{
                if(resData.rows.length>0){
            
                  let tempDisDataAll = [];
                  let tempDisDataAllFinal:any = [];
                  for(let i=0;i<resData.rows.length;i++){
                          let tempDisData = resData.rows.item(i);
                          tempDisData['lead_photos'] =  JSON.parse(tempDisData['lead_photos']);
                          tempDisData['segmentDetail'] =  JSON.parse(tempDisData['segmentDetail']);
                          tempDisDataAllFinal.push(tempDisData);
                  }
                 
                 this.projCustListObjArrs=tempDisDataAllFinal;
                }
                resolve(true);
            },(error)=>{
                console.log('initDisplayData error',error);
                resolve(true);
            });

         });
  }



  goToDetails(leadId){
      this.navCtrl.push(EapLeadDetails,{leadId:leadId});
  }

  openSearch(){
    console.log('ionViewDidLoad openSearch');
    let filterDataObj={};
    let modelSearch = this.modCtrl.create(EapLeadSearchModal,filterDataObj);
    modelSearch.onDidDismiss(()=>{
      console.log('modelSearch onDidDismiss');
    });
    modelSearch.present();
  }

}
