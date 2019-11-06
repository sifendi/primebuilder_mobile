import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';
import { SqlServices } from "../../../providers/sqlService";
import { appCommonMethods } from "../../../providers/appCommonMethods";
import { ALL_MESSAGE } from "../../../providers/constant";
import async from 'async'; 
import * as moment from 'moment';
declare var sessionUserGlobalData;
declare var pleaseWaitTxtTransl,mobisPlaceHolderWaitTxtTransl,filterEmptyText,filterPlaceholderText,mobisBtnArr;

@Component({
  selector: 'page-product-requests-search',
  templateUrl: 'product-requests-search.html',
})
export class ProductRequestsSearchPage {
  @ViewChild('toDateMob') toDateMob: any;
  @ViewChild('fromDateMob') fromDateMob: any;
  @ViewChild('toDate') toDate: any;
  @ViewChild('fromDate') fromDate: any;
  @ViewChild('status') status: any;

  prodRequestFilterArr:any={
     fromDate:null,
     toDate:null,
     status:null,
     receiptType:null
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
      buttons:mobisBtnArr

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

  ionViewDidLoad() {
    let tempDateS=this.dateSettingsTo;
    tempDateS['max']=new Date(moment().format());
    this.dateSettingsTo=tempDateS;
    this.toDateMob.instance.option(tempDateS);

    let tempDateE=this.dateSettingsFrom;
    tempDateE['max']=new Date(moment().format());
    this.dateSettingsFrom=tempDateE;
    this.fromDateMob.instance.option(tempDateE);

    let selData = this.navParams.get("prodRequestFilterArr");
      
      if( selData ){ 
          if( selData['fromDate'] ){
             this.prodRequestFilterArr['fromDate']=selData['fromDate'];
            setTimeout(()=>{
                  this.fromDate.valueAccessor._instance.setVal(this.prodRequestFilterArr['fromDate'],true);  
            },10);
          }
          if( selData['toDate'] ){
             this.prodRequestFilterArr['toDate']=selData['toDate'];
             setTimeout(()=>{
                  this.disableToDateFlag=false;
                  this.toDate.valueAccessor._instance.setVal(this.prodRequestFilterArr['toDate'],true);  
            },10);
          }
          if( selData['status'] ){
             this.prodRequestFilterArr['status']=selData['status'];
          }
      }
 




  }

  async ionViewDidEnter() {
     this.busyMessage = await this.appCom.getTranslatedTxt("Please wait...");   
  }


search(){
  var dt =  this.prodRequestFilterArr.toDate != undefined && this.prodRequestFilterArr.toDate != '' ; 
  var df =  this.prodRequestFilterArr.fromDate != undefined && this.prodRequestFilterArr.fromDate != ''
  var st = this.prodRequestFilterArr.status != undefined && this.prodRequestFilterArr.status != ''; 

  console.log("dt",dt);
  console.log("df",df);
  console.log("st",st);
  
  if(dt || df ){

       let f=this.appCom.dateToTimeStamp(this.prodRequestFilterArr.fromDate);
       let t=this.appCom.dateToTimeStamp(this.prodRequestFilterArr.toDate);
       if( f>t || !dt || !df ){
       this.appCom.showAlert("Please enter a valid date range","Ok",""); 
       return false; 
       }
  }



     if( st || dt || df ){
     
     
        var orderBy = " `created_date` DESC";
        let filterby = "";
        var marker = 0;    
        let where ="";    
    if( this.prodRequestFilterArr.status != undefined && this.prodRequestFilterArr.status != '' ){
                where +="prt.product_request_status = '" +this.prodRequestFilterArr.status +"'";  
                if(this.prodRequestFilterArr.status==1 || this.prodRequestFilterArr.status=="1" ){
                  filterby +="Deal";  
                }else if( this.prodRequestFilterArr.status==-1 || this.prodRequestFilterArr.status=="-1"  ){
                  filterby +="Failed";
                }else{
                  filterby +="In progress";
                }
               
                marker = 1;
            }

            if( this.prodRequestFilterArr.fromDate != undefined && this.prodRequestFilterArr.fromDate != '' ){
               if(marker == 1){
                   where +=" AND " ;
                   filterby += ",";
                   marker = 0;   

                }

                let f=this.appCom.dateToTimeStamp(this.prodRequestFilterArr.fromDate); 
                where +=" prt.request_date between " +f;   
                filterby+= "from:"+ moment(this.prodRequestFilterArr.fromDate).format("DD MMM YYYY");
                //filterby += "from:"+this.prodRequestFilterArr.fromDate ;
                marker = 1;
            }

              if( this.prodRequestFilterArr.toDate != undefined && this.prodRequestFilterArr.toDate != '' ){
               if(marker == 1){
                   where +=" AND " ;
                   filterby += ",";
                   marker = 0;   

                }

                let d = this.appCom.dateToTimeStamp(this.prodRequestFilterArr.toDate);
                //this.prodRequestFilterArr['toDate']=new Date(d).setHours(23,59,59); 
                
                let t=new Date(d).setHours(23,59,59); 
                where +=" "+t;
                filterby+= "to:"+ moment(this.prodRequestFilterArr.toDate).format("DD MMM YYYY");
                //filterby += "to:"+this.prodRequestFilterArr.toDate ;
                marker = 1;
            }

          let query="SELECT DISTINCT prt.id,prt.server_id,prt.request_date,prt.product_request_status,prt.product_request_status_remark,prt.quantity_required,prt.new_price_request,prt.term_of_payment,prt.pic_same_as_hpb,prt.pic_name,prt.pic_designation,prt.pic_mobile,prt.additional_comments,prt.hpb_digital_sign,prm.project_id,prm.server_project_id,prm.project_name,hm.hpb_id,hm.server_hpb_id,hm.hpb_name, rdm.rds_id,rdm.server_rds_id,rdm.rds_name FROM products_request_tbl prt LEFT JOIN project_master prm ON prt.project_id=prm.project_id LEFT JOIN hpb_master hm ON prt.server_hpb_id=hm.server_hpb_id LEFT JOIN retailer_distributor_master rdm ON prt.rds_id=rdm.server_rds_id where "+where + " ORDER BY prt.local_created_date DESC";
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
                        "filterData":this.prodRequestFilterArr,
                        "type":this.prodRequestFilterArr.receiptType
                  };
                  console.log("filter Arr",retData);
                  this.viewCtrl.dismiss(retData);
                          
          },(error)=>{
              console.log('Error', error);  
          });

    }else{
       this.appCom.showAlert(ALL_MESSAGE.ERROR_MESSAGE.FILTER_EMPTY,"Ok","");
    }   


}

clearFilter(){
  this.prodRequestFilterArr['fromDate']=null;
  this.prodRequestFilterArr['toDate']=null;
  this.prodRequestFilterArr['status']=null;
  this.prodRequestFilterArr['receiptType']=null;
}


dismiss(){
  this.viewCtrl.dismiss({}); 
}

    


}
