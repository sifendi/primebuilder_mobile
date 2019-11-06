import { Component,ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';
import async from 'async'; 
import * as moment from 'moment';
import { ALL_MESSAGE } from "../../../../providers/constant";
import { appCommonMethods } from "../../../../providers/appCommonMethods";
import { SqlServices } from "../../../../providers/sqlService";

declare var pleaseWaitTxtTransl,mobisPlaceHolderWaitTxtTransl,filterEmptyText,filterPlaceholderText,mobisBtnArr;

@Component({
  selector: 'page-distributor-retailer-search',
  templateUrl: 'tlh-distributor-retailer-search.html',
})
export class TlhDistributorRetailerSearchPage {

  @ViewChild('fromDate') fromDate: any;
  @ViewChild('fromDateMob') fromDateMob: any;  
  @ViewChild('toDate') toDate: any;
  @ViewChild('toDateMob') toDateMob: any;

  @ViewChild('Product') Product: any; 
  @ViewChild('City') City: any; 
  @ViewChild('cityMob') cityMob: any; 

  filterResult:any=[];
  cityArr:any=[];
  productsArr:any=[];
  toMinDate:any;
  toMaxDate:any;
  fromMinDate:any;
  fromMaxDate:any;
  disableToDateFlag:any=true;
  busyMessage:any="Please Wait...";  
  busy:any;

  rdsFilterArr:any={
     city:null,
     type:null,
  }



    mobiScollCitySettings:any = {
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
            this.cityMobiFilter(); 
      },
      onSet: (event, inst)=> {
            
      },
    //   onFilter: (event, inst)=> {
    //         this.cityMobiFilter(event.filterText);
    //   }
   
    };



  constructor(public navCtrl: NavController, public navParams: NavParams,public appCom:appCommonMethods,public sqlS: SqlServices,public viewCtrl:ViewController) {
  }

  async ionViewDidLoad() {
    console.log('ionViewDidLoad DistributorRetailerVisitSearchPage');
    
    //mobi scroll placeholder translations
    let MobiProps=this.mobiScollCitySettings;
    MobiProps['placeholder']= await this.appCom.getTranslatedTxt("Please select");
    this.mobiScollCitySettings=MobiProps;
    this.cityMob.instance.option(MobiProps);

    let selData = this.navParams.get("rdsFilterArr");
    this.initFormData().then(()=>{
        setTimeout(()=>{
            this.rdsFilterArr=selData;
            if(this.rdsFilterArr ){
                  if( this.rdsFilterArr['city'] ){
                        this.City.valueAccessor._instance.setVal(this.rdsFilterArr['city'],true);
                  }
            }
        }, 10);
    });
  }

  async ionViewDidEnter() {
     this.busyMessage = await this.appCom.getTranslatedTxt("Please wait...");   
  }

search(){
 
  var ct = this.rdsFilterArr.city != undefined && this.rdsFilterArr.city != ''; 
  var ty = this.rdsFilterArr.type != undefined && this.rdsFilterArr.type != ''; 


  console.log("ct",ct);
  console.log("ty",ty); 

    if(  ct ||  ty ){
     
     
        var orderBy = " `created_date` DESC";
        let filterby = "";
        var marker = 0; 
      
            
            if( this.rdsFilterArr.city != undefined && this.rdsFilterArr.city != '' ){
             
                filterby += this.getCityValueByid(this.rdsFilterArr.city) ;
                marker = 1;
            }
 
            if( this.rdsFilterArr.type != undefined && this.rdsFilterArr.type != '' ){
               if(marker == 1){
                
                   filterby += ",";
                   marker = 0;   

                }
              
                filterby += this.rdsFilterArr.type ;
                marker = 1;
            }


          console.log(this.rdsFilterArr);
          let retData={
                  "rdsFilterArr":this.rdsFilterArr,
                  "action":"filter",
                  "filterby": filterby,
            };
          
            this.viewCtrl.dismiss(retData);
     



    }else{
      //this.appCom.showToast(ALL_MESSAGE.ERROR_MESSAGE.FILTER_EMPTY,"middle");
       this.appCom.showAlert(ALL_MESSAGE.ERROR_MESSAGE.FILTER_EMPTY,"Ok","");
    }   


}

getCityValueByid(key){
     let value ="";
     console.log("key",key);
     console.log("cityArr",this.cityArr);
     for( let j=0;j< this.cityArr.length;j++ ){
         if( this.cityArr[j]['value'] == key ){
           value= this.cityArr[j]['text'];
           break;
         }
     }
     console.log("value",value);
     return value;   
  }

clearFilter(){
  this.rdsFilterArr={
     city:null,
     type:null,
  }
}

dismiss(){
    this.viewCtrl.dismiss();
}

    initFormData(){
    
         return new Promise((resolve,reject)=>{
             
                let allSyncTask=[];
                    let allTaskComplete = ()=>{
                    resolve(true);
                }

                    allSyncTask.push((callback)=>{
                    this.cityArr=[];
                    let query="SELECT `id`, `citykabname`, `server_citykabname_id`, `server_id` FROM address_master GROUP BY citykabname" ;
                    this.sqlS.queryExecuteSql(query,[]).then((resData:any)=>{

                        if(resData.rows.length>0){

                            for(let i=0;i<resData.rows.length;i++){
                                let currTempObj=resData.rows.item(i);
                                this.cityArr.push({
                                    text:currTempObj['citykabname'],
                                    value:currTempObj['server_citykabname_id']
                                });
                            }
                            this.cityMob.instance.option({
                                data: this.cityArr
                            });

                        }
                        callback();
                    },(error)=>{
                        console.log('error queryRDS initFormData',error);
                        callback();
                    });

                });

                allSyncTask.push((callback)=>{

                    this.productsArr=[];
                    let query="SELECT * FROM product_master WHERE product_type = 'holcim_product'";
                    this.sqlS.queryExecuteSql(query,[]).then((resData:any)=>{

                        if(resData.rows.length>0){

                            for(let i=0;i<resData.rows.length;i++){
                                let currTempObj=resData.rows.item(i);
                                this.productsArr.push({
                                    text:currTempObj['product_name'],
                                    value:currTempObj['server_product_id']
                                });
                            }

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

    cityMobiFilter(serchKey?:any){
    let allAddressData=[];
    let allDistrictData=[];
       
		let query="SELECT `id`, `citykabname`,`server_citykabname_id`, `server_id` FROM address_master GROUP BY citykabname" ; //LIMIT 100
         if(serchKey){
            query="SELECT `id`, `citykabname`,`server_citykabname_id`, `server_id` FROM address_master  WHERE citykabname LIKE '%"+serchKey+"%'  GROUP BY citykabname " ;
        }
        this.sqlS.queryExecuteSql(query,[]).then((ressqlData) => {
        this.cityArr=[];
		for(let i=0;i<ressqlData.rows.length;i++){
          let tempObj=ressqlData.rows.item(i);
          allDistrictData.push(tempObj);
          this.cityArr.push({
              text:tempObj['citykabname'],
              value:tempObj['server_citykabname_id']
          });
        }
        this.cityMob.instance.option({
            data: this.cityArr
        });
      
		},(error)=>{
            console.log('cityMobiFilter sql error',error); 
    });
 }

}
