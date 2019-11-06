import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';
import { SqlServices } from "../../../providers/sqlService";
import { ALL_MESSAGE } from "../../../providers/constant";
import { appCommonMethods } from "../../../providers/appCommonMethods";
import async from 'async'; 
import * as moment from 'moment';
declare var sessionUserGlobalData;
declare var pleaseWaitTxtTransl,mobisPlaceHolderWaitTxtTransl,filterEmptyText,filterPlaceholderText,mobisBtnArr;

@Component({
  selector: 'page-product-receipts-search',
  templateUrl: 'product-receipts-search.html',
})
export class ProductReceiptsSearchPage {
  
   @ViewChild('Product') product: any;  
   @ViewChild('fromDate') fromDate: any;  
   @ViewChild('toDate') toDate: any;    
   @ViewChild('toDateMob') toDateMob: any;  
   @ViewChild('fromDateMob') fromDateMob: any;
   @ViewChild('ProductMob') ProductMob: any;

  prodReceiptFilterArr:any={
     product:null,
     fromDate:null,
     toDate:null,
     receiptType:null,
     by:null,
     status:null,
  }
  
  filterResult:any=[];
  rdsArr:any=[];
  productsArr:any=[];
  productReceiptData:any=[];
  disableToDateFlag:any=true;
  busyMessage:any="Please Wait...";  
  busy:any;
  

  mobiScollPRODSettings:any = {
      inputClass: 'text-input',
      theme: 'material',
      showOnFocus: true,
      group: false,
      filter: true,
      filterEmptyText:filterEmptyText,
      filterPlaceholderText:filterPlaceholderText,
      placeholder: mobisPlaceHolderWaitTxtTransl,
      rows:8,
      data:[],
      readonly:false,
      buttons:mobisBtnArr,
      onClear: (event, inst)=>{  
            this.mobiScrollProductFilter(); 
      },
      onSet: (event, inst)=> {
            
      },
    //   onFilter: (event, inst)=> {
    //         this.mobiScrollProductFilter(event.filterText);
    //   }

  };

  dateSettingsFrom:any={
      theme: 'material',
      display: 'center',
      dateFormat:'dd/mm/yy',
      onSet: (event, inst)=> {
           this.disableToDateFlag=false;
           //this.prodReceiptFilterArr.toDate=null;
      },
  };

  dateSettingsTo:any={
      theme: 'material',
      display: 'center',
      dateFormat:'dd/mm/yy',
      onSet: (event, inst)=> {
                    console.log("from date selected",event);
     
      },
  };

  constructor(public navCtrl: NavController, public navParams: NavParams,public sqlS: SqlServices,public appCom:appCommonMethods,public viewCtrl:ViewController) {
 
  }

  async ionViewDidLoad() {
   
    let tempDateS=this.dateSettingsTo;
    tempDateS['max']=new Date(moment().format());
    this.dateSettingsTo=tempDateS;
    this.toDateMob.instance.option(tempDateS);

    let tempDateE=this.dateSettingsFrom;
    tempDateE['max']=new Date(moment().format());
    this.dateSettingsFrom=tempDateE;
    this.fromDateMob.instance.option(tempDateE);

    let MobiProps1=this.mobiScollPRODSettings;
    MobiProps1['placeholder']= await this.appCom.getTranslatedTxt("Please select");
    this.mobiScollPRODSettings=MobiProps1;
    this.ProductMob.instance.option(MobiProps1);

  let selData = this.navParams.get("prodReceiptFilterArr");
  console.log("selData--->",selData);
  this.initFormData().then(()=>{
      if( selData ){
          if( selData['product'] ){
             this.prodReceiptFilterArr['product']=selData['product'];
             setTimeout(()=>{
                  this.product.valueAccessor._instance.setVal(this.prodReceiptFilterArr['product'],true);  
             },10);
          } 
          if( selData['fromDate'] ){
             this.prodReceiptFilterArr['fromDate']=selData['fromDate'];
            setTimeout(()=>{
                  this.fromDate.valueAccessor._instance.setVal(this.prodReceiptFilterArr['fromDate'],true);  
            },10);
          }
          if( selData['toDate'] ){
             this.prodReceiptFilterArr['toDate']=selData['toDate'];
             setTimeout(()=>{
                  this.disableToDateFlag=false;
                  this.toDate.valueAccessor._instance.setVal(this.prodReceiptFilterArr['toDate'],true);  
            },10);
          }
          if( selData['by'] ){
             this.prodReceiptFilterArr['by']=selData['by'];
          }
          if( selData['status'] ){
             this.prodReceiptFilterArr['status']=selData['status'];
          }
      }
  });



  }


  async ionViewDidEnter() {
     this.busyMessage = await this.appCom.getTranslatedTxt("Please wait...");   
  }

  initFormData(){

      return new Promise((resolve,reject)=>{
          
            let allSyncTask=[];
                let allTaskComplete = ()=>{
                resolve(true);
            }

            allSyncTask.push((callback)=>{

                this.productsArr=[];  //WHERE product_type = 'holcim_product'
                let query="SELECT * FROM product_master";
                this.sqlS.queryExecuteSql(query,[]).then((resData:any)=>{

                    if(resData.rows.length>0){

                        for(let i=0;i<resData.rows.length;i++){
                            let currTempObj=resData.rows.item(i);
                            this.productsArr.push({
                                text:currTempObj['product_name'],
                                value:currTempObj['server_product_id']
                            });
                        }
                        this.ProductMob.instance.option({
                            data: this.productsArr
                        });

                    }
                    callback();
                },(error)=>{
                    console.log('error queryRDS initFormData',error);
                    callback();
                });


            });

                async.parallel(allSyncTask, function(){
                    allTaskComplete();
                });

      });
    
}

search(){
  var dt =  this.prodReceiptFilterArr.toDate != undefined && this.prodReceiptFilterArr.toDate != '' ; 
  var df =  this.prodReceiptFilterArr.fromDate != undefined && this.prodReceiptFilterArr.fromDate != ''
  var pdt = this.prodReceiptFilterArr.product != undefined && this.prodReceiptFilterArr.product != ''; 
  var by = this.prodReceiptFilterArr.by != undefined && this.prodReceiptFilterArr.by != ''; 
  var st = this.prodReceiptFilterArr.status != undefined && this.prodReceiptFilterArr.status != ''; 

  console.log("dt",dt);
  console.log("pdt",pdt);
  
  console.log("st",st);
  console.log("by",by);
  if(dt || df ){

       let f=this.appCom.dateToTimeStamp(this.prodReceiptFilterArr.fromDate);
       let t=this.appCom.dateToTimeStamp(this.prodReceiptFilterArr.toDate);
       if( f>t || !dt || !df ){
       this.appCom.showAlert("Please enter a valid date range","Ok",""); 
       return false; 
       }
  }

  if( by || st ){

      if( this.prodReceiptFilterArr.by != undefined && this.prodReceiptFilterArr.by != '' && this.prodReceiptFilterArr.status != undefined && this.prodReceiptFilterArr.status != '' ){
     
      }else{
        this.appCom.showAlert("Please select the 'user type' along with the 'status' option to proceed","Ok",""); 
        return false; 
      }

  }

     if( pdt || by || st || ( dt && df ) ){
     
     
        var orderBy = " `created_date` DESC";
        let filterby = "";
        var marker = 0;    
        let where ="";    
            if( this.prodReceiptFilterArr.product != undefined && this.prodReceiptFilterArr.product != '' ){
                where +=" pm.server_product_id = '" +this.prodReceiptFilterArr.product +"'";   
                filterby += this.getProductValueByid(this.prodReceiptFilterArr.product);
                marker = 1;
            }

            if( this.prodReceiptFilterArr.status != undefined && this.prodReceiptFilterArr.status != '' ){
               if(marker == 1){
                   where +=" AND " ;
                   filterby += ",";
                   marker = 0;   

                }

               
                if(this.prodReceiptFilterArr.status==1){
                   
                    if( this.prodReceiptFilterArr.by == "$tlh" ){
                      filterby +='approved by TLH'; 
                      where +=" tlh_approval = '" +this.prodReceiptFilterArr.status +"'";   
                    }else if( this.prodReceiptFilterArr.by == "$ac" ){
                      filterby +='approved by AC';
                      where +=" ac_approval = '" +this.prodReceiptFilterArr.status +"'";   
                    }else if( this.prodReceiptFilterArr.by == "$sa" ){
                      filterby +='approved by SA';
                      where +=" sa_approval = '" +this.prodReceiptFilterArr.status +"'";    
                    }
                }else if( this.prodReceiptFilterArr.status==-1 ){
                  
                    if( this.prodReceiptFilterArr.by == "$tlh" ){
                      filterby +='rejected by TLH';
                      where +=" tlh_approval = '" +this.prodReceiptFilterArr.status +"'";   
                    }else if( this.prodReceiptFilterArr.by == "$ac" ){
                      filterby +='rejected by AC';
                      where +=" ac_approval = '" +this.prodReceiptFilterArr.status +"'";  
                    }else if( this.prodReceiptFilterArr.by == "$sa" ){
                      filterby +='rejected by SA';
                      where +=" sa_approval = '" +this.prodReceiptFilterArr.status +"'";      
                    }
                }else{
                   
                    if( this.prodReceiptFilterArr.by == "$tlh" ){
                      filterby +='pending by TLH'; 
                      where +=" tlh_approval = '" +this.prodReceiptFilterArr.status +"'";  
                    }else if( this.prodReceiptFilterArr.by == "$ac" ){
                      filterby +='pending by AC';
                      where +=" ac_approval = '" +this.prodReceiptFilterArr.status +"'";  
                    }else if( this.prodReceiptFilterArr.by == "$sa" ){
                      filterby +='pending by SA';   
                      where +=" sa_approval = '" +this.prodReceiptFilterArr.status +"'";       
                    }
                }
                //filterby += this.prodReceiptFilterArr.status ;
                marker = 1;
            }

            if( this.prodReceiptFilterArr.fromDate != undefined && this.prodReceiptFilterArr.fromDate != '' ){
               if(marker == 1){
                   where +=" AND " ;
                   filterby += ",";
                   marker = 0;   

                }

                let f=this.appCom.dateToTimeStamp(this.prodReceiptFilterArr.fromDate); 
                where +=" prm.local_created_date between " +f;   
                filterby+= "from:"+ moment(this.prodReceiptFilterArr.fromDate).format("DD MMM YYYY");
                //filterby += "from:"+this.prodReceiptFilterArr.fromDate ;
                marker = 1;
            }

              if( this.prodReceiptFilterArr.toDate != undefined && this.prodReceiptFilterArr.toDate != '' ){
               if(marker == 1){
                   where +=" AND " ;
                   filterby += ",";
                   marker = 0;   

                }
                
                let d = this.appCom.dateToTimeStamp(this.prodReceiptFilterArr.toDate);
                let t=new Date(d).setHours(23,59,59); 
                where +=" "+t;
                filterby+= "to:"+ moment(this.prodReceiptFilterArr.toDate).format("DD MMM YYYY");
                //filterby += "to:"+this.prodReceiptFilterArr.toDate ;
                marker = 1;
            }

          let query="SELECT projm.project_name,pm.product_name,prm.receipt_id,prm.quantity,prm.unit,prm.local_created_date,(SELECT prat.approval_status FROM products_receipt_approval_tbl AS prat WHERE prat.receipt_id = prm.receipt_id AND prat.approval_role = 'TLH' AND prat.is_closed = 0 ) AS tlh_approval,(SELECT prat.approval_status FROM products_receipt_approval_tbl AS prat WHERE prat.receipt_id = prm.receipt_id AND prat.approval_role = 'AC' AND prat.is_closed = 0) AS ac_approval,(SELECT prat.approval_status FROM products_receipt_approval_tbl AS prat WHERE prat.receipt_id = prm.receipt_id AND prat.approval_role = 'SA' AND prat.is_closed = 0) AS sa_approval, (SELECT prat.rejection_reason FROM products_receipt_approval_tbl AS prat WHERE prat.receipt_id = prm.receipt_id AND prat.approval_role = 'TLH' AND prat.is_closed = 0) AS tlh_rejection_res ,(SELECT prat.rejection_reason FROM products_receipt_approval_tbl AS prat WHERE prat.receipt_id = prm.receipt_id AND prat.approval_role = 'AC' AND prat.is_closed = 0) AS ac_rejection_res ,(SELECT prat.rejection_reason FROM products_receipt_approval_tbl AS prat WHERE prat.receipt_id = prm.receipt_id AND prat.approval_role = 'SA' AND prat.is_closed = 0) AS sa_rejection_res FROM product_receipt_master prm LEFT JOIN product_master pm ON prm.product_id = pm.server_product_id LEFT JOIN project_master projm ON projm.project_id = prm.project_id where "+where;
          console.log('query---------0-0-0-0-0->?',query);
          this.busy=this.sqlS.queryExecuteSql(query,[]).then((data) => {
                  this.filterResult=[];
                  for(let j=0;j<data['rows'].length;j++){
                      let tempDataObj =  data['rows'].item(j);
                      this.filterResult.push( tempDataObj );    
                    }

                  let retData={
                        "productReceiptData":this.filterResult,
                        "action":"filter",
                        "filterby": filterby,
                        "filterData":this.prodReceiptFilterArr,
                        "type":this.prodReceiptFilterArr.receiptType
                  };
                  console.log("filter Arr",retData);
                  this.viewCtrl.dismiss(retData);
                          
          },(error)=>{
              console.log('Error', error);  
          });

    }else{
      //this.appCom.showToast(ALL_MESSAGE.ERROR_MESSAGE.FILTER_EMPTY,"middle");
       this.appCom.showAlert(ALL_MESSAGE.ERROR_MESSAGE.FILTER_EMPTY,"Ok","");
    }   


}

clearFilter(){

   this.prodReceiptFilterArr['product']=null;
   this.prodReceiptFilterArr['fromDate']=null;
   this.prodReceiptFilterArr['toDate']=null;
   this.prodReceiptFilterArr['receiptType']=null;
   this.prodReceiptFilterArr['by']=null;
   this.prodReceiptFilterArr['status']=null;

}

  getProductValueByid(key){
     let value ="";
     console.log("key",key);
     console.log("productsArr",this.productsArr);
     for( let j=0;j< this.productsArr.length;j++ ){
         if( this.productsArr[j]['value'] == key ){
           value= this.productsArr[j]['text'];
           break;
         }
     }
     console.log("value",value);
     return value;   
  }

dismiss(){
  this.viewCtrl.dismiss({}); 
}

	mobiScrollProductFilter(serchKey?:any){
        return new Promise((resolve,reject)=>{
                let productsObj=[];
            
                let query="SELECT * FROM product_master" ;
                if(serchKey){
                    query="SELECT * FROM product_master  WHERE product_name LIKE '%"+serchKey+"%' " ;
                }
                this.sqlS.queryExecuteSql(query,[]).then((ressqlData) => {
                this.productsArr=[];
                for(let i=0;i<ressqlData.rows.length;i++){
                    let tempObj=ressqlData.rows.item(i);
                    productsObj.push(tempObj);
                    this.productsArr.push({
                        text:tempObj['product_name'],
                        value:tempObj['server_product_id']
                    });
                }
                this.ProductMob.instance.option({
                    data: this.productsArr
                });
                resolve(true);


                     
            },(error)=>{
                    reject(error);
                    console.log('allDistrictData sql error',error); 
                });
        }); 
}

    




}
