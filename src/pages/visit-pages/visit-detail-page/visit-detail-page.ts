
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams,Events } from 'ionic-angular';
import { AddVisitFormPage } from "../visit-add-form/visit-add-form";
import { SqlServices } from "../../../providers/sqlService";

/**
 * Generated class for the VisitDetailsPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@Component({
  selector: 'visit-detail-page',
  templateUrl: 'visit-detail-page.html',
})
export class VisitDetailsPage {
  visitId:any;
  visitDate:any;
  rdsData:any;
  stockData:any=[];
  visitData:any=[];
  constructor(public navCtrl: NavController, public navParams: NavParams,public sqlS:SqlServices,public events:Events) {
     
      let paramData = this.navParams.data;
      this.visitId= paramData["visitId"];
      this.visitDate= paramData["visitDate"]; 
      this.rdsData=  paramData["rdsData"];  
      console.log("params Data----->",paramData);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad VisitDetailsPage');

    var selectField = "*";
    var where =" `rds_visit_id` ="+this.visitId;
    var tablename = "retailer_curent_stock";
    let query="SELECT * FROM retailer_curent_stock rcs LEFT OUTER JOIN product_master pm ON rcs.product_brand_id = pm.server_product_id WHERE "+where ;
    		this.sqlS.queryExecuteSql(query,[]).then((data) => {
        this.stockData=[];
        for(let i=0;i<data['rows'].length;i++){       
            this.stockData.push( data['rows'].item(i));      
        }
			  console.log(" this.stockData", this.stockData);                     
		});
    // this.sqlS.selectTableData(selectField,tablename,where,orderBy,"").then((data) => {

    //     for(let i=0;i<data['rows'].length;i++){       
    //         this.stockData.push( data['rows'].item(i));      

    //     }
    // }, (error) => {
    //     console.log('Error', error);
        
    // });




    var selectField = "*";
    var where =" `rds_visit_id` ="+this.visitId;
    var tablename = "rds_visit";
    this.sqlS.selectTableData(selectField,tablename,where,"","").then((visit) => {
    this.visitData = visit['rows'].item(0) ;    
    console.log("this.visitDatasdssdsd",this.visitData);

    this.events.publish("",this.visitData);


    }, (error) => {
    console.log('Error', error);

    });



  }

  openVisitEditPage(){
    
  }

  goToAddVisitForm(){
    this.navCtrl.push(AddVisitFormPage);
  }

}
