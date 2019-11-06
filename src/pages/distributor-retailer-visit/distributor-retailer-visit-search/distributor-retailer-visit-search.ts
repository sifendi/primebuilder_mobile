import { Component,ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';
import { ALL_MESSAGE } from "../../../providers/constant";
import { appCommonMethods } from "../../../providers/appCommonMethods";
import { SqlServices } from "../../../providers/sqlService";
import async from 'async'; 
import * as moment from 'moment';

declare var pleaseWaitTxtTransl,mobisPlaceHolderWaitTxtTransl,filterEmptyText,filterPlaceholderText,mobisBtnArr;

@Component({
  selector: 'page-distributor-retailer-visit-search',
  templateUrl: 'distributor-retailer-visit-search.html',
})
export class DistributorRetailerVisitSearchPage {

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
            this.mobiScrollCityFilter(); 
        },
        onSet: (event, inst)=> {
            
        },
        // onFilter: (event, inst)=> {
        //     this.mobiScrollCityFilter(event.filterText);
        // }
   
    };



  constructor(public navCtrl: NavController, public navParams: NavParams,public appCom:appCommonMethods,public sqlS: SqlServices,public viewCtrl:ViewController) {
  }

  async ionViewDidLoad() {
    
    //mobi scroll placeholder translations
    let MobiProps=this.mobiScollCitySettings;
    MobiProps['placeholder']= await this.appCom.getTranslatedTxt("Please select");
    this.mobiScollCitySettings=MobiProps;
    this.cityMob.instance.option(MobiProps);

    let selData=this.navParams.get('rdsFilterArr');
    console.log("selected filter -------------->",selData);
   
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
        var where ="";   
            
            if( this.rdsFilterArr.city != undefined && this.rdsFilterArr.city != '' ){
                where+= " rds_city_name = '"+this.rdsFilterArr.city+ "'"; 
                filterby += this.rdsFilterArr.city ;
                marker = 1;
            }
 
            if( this.rdsFilterArr.type != undefined && this.rdsFilterArr.type != '' ){
               if(marker == 1){
                   where +=" AND " ;  
                   filterby += ",";
                   marker = 0;   

                }
                where+= " rds_type = '"+this.rdsFilterArr.type+ "'"; 
                filterby += this.rdsFilterArr.type ;
                marker = 1;
            }


        console.log(this.rdsFilterArr);
         
                let retData={
                        "visitFilteredData":this.filterResult,
                        "action":"filter",
                        "filterby": filterby,
                        "filterData":this.rdsFilterArr,
                  };
                   
                  console.log("filter Arr",retData);
                  this.viewCtrl.dismiss(retData);


    }else{
      //this.appCom.showToast(ALL_MESSAGE.ERROR_MESSAGE.FILTER_EMPTY,"middle");
       this.appCom.showAlert(ALL_MESSAGE.ERROR_MESSAGE.FILTER_EMPTY,"Ok","");
    }   


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

mobiScrollCityFilter(serchKey?:any){
        return new Promise((resolve,reject)=>{
                this.cityArr=[];
                let query="SELECT `id`, `citykabname`, `server_id` FROM address_master GROUP BY citykabname " ;
                if(serchKey){
                    query="SELECT `id`, `citykabname`, `server_id` FROM address_master  WHERE citykabname LIKE '%"+serchKey+"%'  GROUP BY citykabname" ;
                }
                this.sqlS.queryExecuteSql(query,[]).then((ressqlData) => {
                this.cityArr=[];
                for(let i=0;i<ressqlData.rows.length;i++){
                let tempObj=ressqlData.rows.item(i);
              
                this.cityArr.push({
                    text:tempObj['citykabname'],
                    value:tempObj['citykabname']
                });
                }
                this.cityMob.instance.option({
                    data: this.cityArr
                });
                resolve(true);


                     
            },(error)=>{
                    reject(error);
                    console.log('mobiScrollCityFilter sql error',error); 
                });
        }); 
}




    initFormData(){
    
         return new Promise((resolve,reject)=>{
             
                let allSyncTask=[];
                    let allTaskComplete = ()=>{
                    resolve(true);
                }

                    allSyncTask.push((callback)=>{
                    this.cityArr=[];
                    let query="SELECT `id`, `citykabname`, `server_id` FROM address_master GROUP BY citykabname " ;
                    this.sqlS.queryExecuteSql(query,[]).then((resData:any)=>{

                        if(resData.rows.length>0){

                            for(let i=0;i<resData.rows.length;i++){
                                let currTempObj=resData.rows.item(i);
                                this.cityArr.push({
                                    text:currTempObj['citykabname'],
                                    value:currTempObj['citykabname']
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

}
