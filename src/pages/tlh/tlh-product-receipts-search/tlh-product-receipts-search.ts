import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';
import { SqlServices } from "../../../providers/sqlService";
import async from 'async'; 
import { appCommonMethods } from "../../../providers/appCommonMethods";
import { ALL_MESSAGE } from "../../../providers/constant";
declare var sessionUserGlobalData;
import * as moment from 'moment';

declare var pleaseWaitTxtTransl,mobisPlaceHolderWaitTxtTransl,filterEmptyText,filterPlaceholderText,mobisBtnArr;

@Component({
  selector: 'tlh-page-product-receipts-search',
  templateUrl: 'tlh-product-receipts-search.html',
})
export class TlhProductReceiptsSearchPage {
 
  @ViewChild('toDateMob') toDateMob: any;
  @ViewChild('fromDateMob') fromDateMob: any;
  @ViewChild('Product') product: any;  
  @ViewChild('fromDate') fromDate: any;  
  @ViewChild('toDate') toDate: any;    
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
  disableToDateFlag:any=true;
  disableStatusFlag:boolean=false;

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
            this.productsMobiFilter(); 
      },
      onSet: (event, inst)=> {
            
      },
    //   onFilter: (event, inst)=> {
    //         this.productsMobiFilter(event.filterText);
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

    let MobiProps1=this.mobiScollPRODSettings;
    MobiProps1['placeholder']= await this.appCom.getTranslatedTxt("Please select");
    this.mobiScollPRODSettings=MobiProps1;
    this.ProductMob.instance.option(MobiProps1);  

    let tempDateS=this.dateSettingsTo;
    tempDateS['max']=new Date(moment().format());
    this.dateSettingsTo=tempDateS;
    this.toDateMob.instance.option(tempDateS);

    let tempDateE=this.dateSettingsFrom;
    tempDateE['max']=new Date(moment().format());
    this.dateSettingsFrom=tempDateE;
    this.fromDateMob.instance.option(tempDateE);

    let selFilterData = this.navParams.get('selFilterData');
    console.log("selFilterData",selFilterData);
    let T = selFilterData['prodReceiptFilterArr'];
   // selFilterData=selFilterData?selFilterData:"";
        if( T['fromDate'] ){
            this.prodReceiptFilterArr['fromDate']=T['fromDate'];
            setTimeout(()=>{
                    this.fromDate.valueAccessor._instance.setVal(this.appCom.timeStampToDateMMMnewM((this.prodReceiptFilterArr['fromDate'])),true);  
            },10);
        }
        if( T['toDate'] ){
            this.prodReceiptFilterArr['toDate']=T['toDate'];
                setTimeout(()=>{
                    this.disableToDateFlag=false;
                    this.toDate.valueAccessor._instance.setVal(this.appCom.timeStampToDateMMMnewM((this.prodReceiptFilterArr['toDate'])),true);  
            },10);
        }

    this.initFormData().then(()=>{
        if(selFilterData){
        this.prodReceiptFilterArr.receiptType=selFilterData['receiptType'];

            
          
          if( T['product'] ){
             this.prodReceiptFilterArr['product']=T['product'];
             setTimeout(()=>{
                  this.product.valueAccessor._instance.setVal(this.prodReceiptFilterArr['product'],true);  
             },10);
          } 
         
          if( T['by'] ){
             this.prodReceiptFilterArr['by']=T['by'];
          }
          if( T['status'] ){
             this.prodReceiptFilterArr['status']=T['status'];
          }

          if( selFilterData['receiptType']=='pending' ){
                //this.prodReceiptFilterArr.receiptType=selFilterData['status']=0;
                this.prodReceiptFilterArr.status="0";
                this.prodReceiptFilterArr.by="$tlh";
                this.disableStatusFlag=true;
          }


        }

    });
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
  var by =  this.prodReceiptFilterArr.by != undefined && this.prodReceiptFilterArr.by != ''; 
  var st =  this.prodReceiptFilterArr.status != undefined && this.prodReceiptFilterArr.status != ''; 

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
        this.appCom.showAlert("Please select role along with the approval status","Ok",""); 
        return false; 
      }

    }


    if( pdt || by || st || ( dt && df ) ){
     
     
        var orderBy = " `created_date` DESC";
        let filterby = "";
        var marker = 0;    
            
            if( this.prodReceiptFilterArr.product != undefined && this.prodReceiptFilterArr.product != '' ){
               
                filterby += this.getProductValueByid(this.prodReceiptFilterArr.product);
                marker = 1;
            }

            if( this.prodReceiptFilterArr.status != undefined && this.prodReceiptFilterArr.status != '' ){
               if(marker == 1){
                 
                   filterby += ",";
                   marker = 0;   

                }
                if(this.prodReceiptFilterArr.status==1){
                    filterby +='approved'; 
                }else if( this.prodReceiptFilterArr.status==-1 ){
                    filterby +='rejected' ;
                }else{
                     filterby +='pending' ; 
                }
                //filterby += this.prodReceiptFilterArr.status ;
                marker = 1;
            }

            if( this.prodReceiptFilterArr.fromDate != undefined && this.prodReceiptFilterArr.fromDate != '' ){
               if(marker == 1){
                 
                   filterby += ",";
                   marker = 0;   

                }

                filterby+= "from:"+ moment(this.prodReceiptFilterArr.fromDate).format("DD MMM YYYY");
                //filterby += "from:"+this.prodReceiptFilterArr.fromDate ;
                marker = 1;
            }

              if( this.prodReceiptFilterArr.toDate != undefined && this.prodReceiptFilterArr.toDate != '' ){
               if(marker == 1){
                 
                   filterby += ",";
                   marker = 0;   

                }

                filterby+= "to:"+ moment(this.prodReceiptFilterArr.toDate).format("DD MMM YYYY");
                //filterby += "to:"+this.prodReceiptFilterArr.toDate ;
                marker = 1;
            }

            // let fd= this.appCom.dateToTimeStamp(this.prodReceiptFilterArr.fromDate);
            // let td= this.appCom.dateToTimeStamp(this.prodReceiptFilterArr.toDate);
            // if( fd > td ){
            //     this.appCom.showAlert("Please enter a valid date range","Ok","");
            //     this.prodReceiptFilterArr.toDate=null;
            //     return false;
            // } 

            let retData={
                  "prodReceiptFilterArr":this.prodReceiptFilterArr,
                  "action":"filter",
                  "filterby": filterby,
                  "type":this.prodReceiptFilterArr.receiptType
            };
             console.log("filter Arr",retData);
            this.viewCtrl.dismiss(retData);
            



    }else{
      //this.appCom.showToast(ALL_MESSAGE.ERROR_MESSAGE.FILTER_EMPTY,"middle");
       this.appCom.showAlert(ALL_MESSAGE.ERROR_MESSAGE.FILTER_EMPTY,"Ok","");
    }   


}

resetFilter(){

    this.prodReceiptFilterArr['product']= null;
    this.prodReceiptFilterArr['fromDate']= null;
    this.prodReceiptFilterArr['toDate']= null;
    
   if( this.prodReceiptFilterArr.receiptType=='all' ){
        this.prodReceiptFilterArr['by']= null;
        this.prodReceiptFilterArr['status']= null;
   }
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

productsMobiFilter(serchKey?:any){
  
    let allProductData=[];
       
		let query="SELECT * FROM product_master" ; 
         if(serchKey){
            query="SELECT * FROM product_master WHERE product_name LIKE '%"+serchKey+"%' " ;
        }
        this.sqlS.queryExecuteSql(query,[]).then((ressqlData) => {
        this.productsArr=[];
		for(let i=0;i<ressqlData.rows.length;i++){
          let tempObj=ressqlData.rows.item(i);
          allProductData.push(tempObj);
          this.productsArr.push({
              text:tempObj['product_name'],
              value:tempObj['server_product_id']
          });
        }
        this.ProductMob.instance.option({
            data: this.productsArr
        });
		},(error)=>{
            console.log('productsMobiFilter sql error',error); 
    });
 }

    





}
