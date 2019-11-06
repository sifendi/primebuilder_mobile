
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams,Events } from 'ionic-angular';
import { SqlServices } from "../../../../providers/sqlService";
import { App_rds_stockApi } from "../../../../shared/loopback_sdk/index";


@Component({
  selector: 'ac-visit-detail-page',
  templateUrl: 'ac-visit-detail-page.html',
})
export class AcVisitDetailsPage {
  visitId:any;
  visitDate:any;
  rdsData:any;
  stockData:any=[];
  visitData:any=[];
  constructor(private appRdsStock:App_rds_stockApi,public navCtrl: NavController, public navParams: NavParams,public sqlS:SqlServices,public events:Events) {
     
      let paramData = this.navParams.data;
      this.visitId= paramData["visitId"];
      this.visitDate= paramData["visitDate"]; 
      this.rdsData=  paramData["rdsData"];  
      console.log("params Data----->",paramData,this.rdsData);
  }

  ionViewDidLoad() {
    
  }

  ionViewDidEnter() {
      this.appRdsStock.getStock(this.visitId).subscribe(resData => {
          for (let x=0;x<resData.result.length;x++) {
              console.log(" loaded data stock rds ",resData.result[x]);
              this.stockData.push(resData.result[x]);
          }
      },
      error => {
          console.log("error", error);
      });
  }

  openVisitEditPage(){
    
  }

}
