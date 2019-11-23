import { HomePage } from '../../home/home';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams,Events } from 'ionic-angular';
import { SqlServices } from '../../../providers/sqlService';
import { ProductReceiptsDetailsPage } from "../../product-receipts/product-receipts-details/product-receipts-details";
import { App } from 'ionic-angular';
import { appCommonMethods } from "../../../providers/appCommonMethods";


@Component({
  selector: 'project-product-receipts',
  templateUrl: 'project-product-receipts.html',
})
export class ProjectProductReceiptsPage {

    //INITIALIZE GLOBAL CHECK-IN OBJECT 
    globalCheckInData:any={
        checkinFlag:false,
        checkinType:"",
        insertId:null,
        visitCheckFlag:false,
        checkinDetails: {
            check_in_out_user_id:null,
            check_in_out_type:null,
            check_in_out_type_id:null,
            check_in_latitude:null,
            check_in_longitude:null,
            check_in_datetime:null,
            check_out_latitude:null,
            check_out_longitude:null,
            check_out_datetime:null,
            generated_by:null,
           
        }
    };  

  productReceiptData:any=[];
  productReceiptDataTemp:any=[];
  paramsData:any;
  busyMessage:any="Please Wait...";  
  busy:any;
  showEmptyFlag:any=false;

  public product_name: any = [];

  constructor(public navCtrl: NavController, public navParams: NavParams, public sqlS:SqlServices,public app: App,public events:Events,public appCom :appCommonMethods) {
    this.events.subscribe("refreshProjectProductReceipts",()=>{
   //       this.refreshProjectProductReceipts();
    });

       this.app.viewDidEnter.subscribe(()=>{
             this.refreshProjectProductReceipts();
       });

  }

  async ionViewDidEnter() {
      this.busyMessage = await this.appCom.getTranslatedTxt("Please wait...");   
      console.log('ionViewDidEnter');
   //    this.refreshProjectProductReceipts();
  }

  ionViewDidLoad() {
    
  }



  refreshProjectProductReceipts(){
    this.paramsData=this.navParams.data;
    console.log("receipt params data--------->",this.paramsData);
    var projId = (this.paramsData['projData'])?this.paramsData['projData']['projId']:"";  
    
    if( projId != undefined && projId != "" ){
    //do nothing
    } else {
      projId = (this.paramsData['projData'])?this.paramsData['projData']['project_id']:"";  
    }


    if(projId !=undefined && projId !='' ){
        let query= "SELECT projm.project_name,pm.product_name,prm.receipt_id,prm.quantity,prm.unit,prm.local_created_date,prm.product_id,(SELECT prat.approval_status FROM products_receipt_approval_tbl AS prat WHERE prat.receipt_id = prm.receipt_id AND prat.approval_role = 'TLH' AND prat.is_closed = 0 ) AS tlh_approval,(SELECT prat.approval_status FROM products_receipt_approval_tbl AS prat WHERE prat.receipt_id = prm.receipt_id AND prat.approval_role = 'AC' AND prat.is_closed = 0) AS ac_approval,(SELECT prat.approval_status FROM products_receipt_approval_tbl AS prat WHERE prat.receipt_id = prm.receipt_id AND prat.approval_role = 'SA' AND prat.is_closed = 0) AS sa_approval, (SELECT prat.rejection_reason FROM products_receipt_approval_tbl AS prat WHERE prat.receipt_id = prm.receipt_id AND prat.approval_role = 'TLH' AND prat.is_closed = 0) AS tlh_rejection_res ,(SELECT prat.rejection_reason FROM products_receipt_approval_tbl AS prat WHERE prat.receipt_id = prm.receipt_id AND prat.approval_role = 'AC' AND prat.is_closed = 0) AS ac_rejection_res ,(SELECT prat.rejection_reason FROM products_receipt_approval_tbl AS prat WHERE prat.receipt_id = prm.receipt_id AND prat.approval_role = 'SA' AND prat.is_closed = 0) AS sa_rejection_res FROM product_receipt_master prm LEFT JOIN product_master pm ON prm.product_id = pm.server_product_id LEFT JOIN project_master projm ON projm.project_id = prm.project_id where projm.project_id = "+ projId;
        this.busy=this.sqlS.queryExecuteSql(query,[]).then((data) => {

            this.productReceiptData=[];    
            this.product_name = [];

            for(let j=0;j<data['rows'].length;j++){
              let tempDataObj =  data['rows'].item(j); 
              this.productReceiptData.push(tempDataObj);

              let q= "SELECT pm.product_name, pm.server_product_id FROM product_master as pm WHERE pm.server_product_id IN (" + data['rows'].item(j).product_id + ")";
              this.busy = this.sqlS.queryExecuteSql(q,[]).then((product) => {
                for(let produ=0; produ<product['rows'].length; produ++) {

                  // Run it if the receipt contain only one product
                  if(data['rows'].item(j).product_id == product['rows'].item(produ).server_product_id) {
                    this.product_name.push({ 
                      product_id: product['rows'].item(produ).server_product_id, 
                      product_name: product['rows'].item(produ).product_name ,
                      receipt_id: data['rows'].item(j).receipt_id
                    });
                  
                  // Run it if the receipt contain more than one product
                  } else if(data['rows'].item(j).product_id.includes(product['rows'].item(produ).server_product_id)) {
                    this.product_name.push({ 
                      product_id: product['rows'].item(produ).server_product_id, 
                      product_name: product['rows'].item(produ).product_name ,
                      receipt_id: data['rows'].item(j).receipt_id
                    });
                  }
                }
                // alert(JSON.stringify(this.product_name));
              });
            }
            
            if( this.productReceiptData.length == 0 ){
                    this.showEmptyFlag=true;
            }else{
                    this.showEmptyFlag=false;
            }        
        },(error)=>{
            console.log('Error', error);  
        });
                
        this.productReceiptDataTemp= this.productReceiptData;
        console.log( "this.productReceiptData-0-0-0-0-0-0-0->",this.productReceiptData );
       
    }

  }

  

goToProductReceiptDetail(product_receipt){
    this.app.getRootNav().push(ProductReceiptsDetailsPage,{
      "productReceiptId" : product_receipt['receipt_id'],
      "projName" : product_receipt['project_name'],
      "productId" : product_receipt['product_id']
    });
}

  //SEARCH Product Receipt
  searchProductReceipt(eventVal){     
        if (typeof eventVal.target.value != 'undefined' && eventVal.target.value.length != 0) {             
            this.busy=this.sqlS.search_product_receipt( eventVal.target.value).then((searchRes)=>{
                console.log("searchRes",searchRes);
                this.productReceiptData = [];
                for (let i = 0; i < searchRes['rows'].length; i++) {
                    this.productReceiptData.push( searchRes['rows'].item(i) );    
                      // var selectField = " `hpb_id`, `hpb_name` ,`hpb_type` ";
                      // var tablename = "hpb_master";
                      // var where=" `hpb_id` = "+this.productReceiptData[i]['hpb_id'];
                      // this.sqlS.selectTableData(selectField,tablename,where,"","").then((hpbdata) => {
                      //       this.productReceiptData[i]['user']=hpbdata['rows'].item(0); 
                      // }, (error) => {
                      //     console.log('Error', error);  
                      // }); 
                }
                    if( this.productReceiptData.length == 0 ){
                            this.showEmptyFlag=true;
                    }else{
                            this.showEmptyFlag=false;
                    } 
                console.log("this.productReceiptData",this.productReceiptData);
            });
        }else{
              this.productReceiptData = this.productReceiptDataTemp;
        }
  }

  goToHome(){
    this.navCtrl.setRoot(HomePage);
  }

}
