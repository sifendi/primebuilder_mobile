import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';
import { SqlServices } from "../../../providers/sqlService";
import { appCommonMethods } from "../../../providers/appCommonMethods";
import { ALL_MESSAGE } from "../../../providers/constant";
import async from 'async'; 
import * as moment from 'moment';
declare var sessionUserGlobalData;


@Component({
  selector: 'tlh-page-product-requests-search',
  templateUrl: 'tlh-product-requests-search.html',
})
export class TlhProductRequestsSearchPage {
 
  @ViewChild('toDateMob') toDateMob: any; 
  @ViewChild('fromDateMob') fromDateMob: any;
  @ViewChild('toDate') toDate: any;
  @ViewChild('fromDate') fromDate: any;
 

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
  
  dateSettingsFrom:any={
      theme: 'material',
      display: 'center',
      dateFormat:'dd/mm/yy',
      onSet: (event, inst)=> {
           this.disableToDateFlag=false;
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
                  this.fromDate.valueAccessor._instance.setVal(this.appCom.timeStampToDateMMMnewM((this.prodRequestFilterArr['fromDate'])),true);  
            },10);
          }
          if( selData['toDate'] ){
             this.prodRequestFilterArr['toDate']=selData['toDate'];
             setTimeout(()=>{
                  this.disableToDateFlag=false;
                  this.toDate.valueAccessor._instance.setVal(this.appCom.timeStampToDateMMMnewM((this.prodRequestFilterArr['toDate'])),true);  
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
      
    if( this.prodRequestFilterArr.status != undefined && this.prodRequestFilterArr.status != '' ){
            
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
                 
                   filterby += ",";
                   marker = 0;   

                }

                let f=this.appCom.dateToTimeStamp(this.prodRequestFilterArr.fromDate); 
             
                filterby+= "from:"+ moment(this.prodRequestFilterArr.fromDate).format("DD MMM YYYY");
                marker = 1;
            }

              if( this.prodRequestFilterArr.toDate != undefined && this.prodRequestFilterArr.toDate != '' ){
               if(marker == 1){
                  
                   filterby += ",";
                   marker = 0;   

                }

           
                filterby+= "to:"+ moment(this.prodRequestFilterArr.toDate).format("DD MMM YYYY");
                //filterby += "to:"+this.prodRequestFilterArr.toDate ;
                marker = 1;
            }

       

                  let retData={
                    "prodRequestFilterArr":this.prodRequestFilterArr,
                    "action":"filter",
                    "filterby": filterby,
                  };
                  console.log("filter Arr",retData);
                  this.viewCtrl.dismiss(retData);


    }else{
       this.appCom.showAlert(ALL_MESSAGE.ERROR_MESSAGE.FILTER_EMPTY,"Ok","");
    }   


}

resetFilter(){

  this.prodRequestFilterArr['fromDate']=null;
  this.prodRequestFilterArr['toDate']=null;
  this.prodRequestFilterArr['status']=null;
}

dismiss(){
  this.viewCtrl.dismiss({}); 
}

    


}
