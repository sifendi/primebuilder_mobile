import { HpbListPage } from '../hpb-list/hpb-list';

import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';
import { SqlServices } from "../../../providers/sqlService";
import { appCommonMethods } from "../../../providers/appCommonMethods";
import { ALL_MESSAGE } from "../../../providers/constant";
import { HomePage } from "../../home/home";

declare var pleaseWaitTxtTransl,mobisPlaceHolderWaitTxtTransl,filterEmptyText,filterPlaceholderText,mobisBtnArr;

@Component({
  selector: 'page-hpb-filter',
  templateUrl: 'hpb-filter.html',
})
export class HpbFilterPage {

  @ViewChild('City') City: any; 
  @ViewChild('CityMobi') CityMobi: any; 
  filters:any = [];
  hpbFilterArr:any={
     city:null,
     hpbType:null,
     hpbStatus:null,
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


  filterResult:any=[];
  allCityData:any=[];

  constructor(public navCtrl: NavController,public viewCtrl:ViewController, public navParams: NavParams,public sqlS:SqlServices,public appCom:appCommonMethods) {
    
   

  }

 async ionViewDidLoad() {
   
     //mobi scroll placeholder translations
    let MobiProps=this.mobiScollCitySettings;
    MobiProps['placeholder']= await this.appCom.getTranslatedTxt("Please select");
    this.mobiScollCitySettings=MobiProps;
    this.CityMobi.instance.option(MobiProps);
    
    let selFilterData = this.navParams.get('selFilterData');
    this.getAddressData().then(()=>{
      if( selFilterData ){
         if( selFilterData['hpbType'] ){
            this.hpbFilterArr.hpbType=selFilterData['hpbType'];
         }
         if( selFilterData['hpbFilterArr'] ){
           let T=selFilterData['hpbFilterArr'];
            if( T['city'] ){
                this.hpbFilterArr['city']=T['city'];
                setTimeout(()=>{
                   console.log("this.hpbFilterArr['city']",this.hpbFilterArr['city']);
                   this.City.valueAccessor._instance.setVal(this.hpbFilterArr['city'],true);
                }, 100);

            }
            if( T['hpbStatus'] ){
               this.hpbFilterArr['hpbStatus']=T['hpbStatus'];
            }
         }
      }

    });
   // this.hpbFilterArr.hpbType='mason';
  }

  goHome(){
  //  this.navCtrl.setRoot(HomePage)
  }

dismiss(){
   this.viewCtrl.dismiss({}); 
}

/*    search(){
  var ct = this.hpbFilterArr.city != undefined && this.hpbFilterArr.city != ''; 
  var ht = this.hpbFilterArr.hpbType != undefined && this.hpbFilterArr.hpbType != ''; 
  var hs = this.hpbFilterArr.hpbStatus != undefined && this.hpbFilterArr.hpbStatus != ''; 
 

    if( ct || ht || hs ){
       var selectField = " * ";
       var tablename = "hpb_master";
        var where ="";
        var orderBy = " `created_date` DESC";
        let filterby = "";
        var marker = 0;    
            
            if( this.hpbFilterArr.city != undefined && this.hpbFilterArr.city != '' ){
                where +=" `id_card_city` = '" +this.hpbFilterArr.city +"'";   
                filterby += this.hpbFilterArr.city ;
                marker = 1;
            }

            if( this.hpbFilterArr.hpbType != undefined && this.hpbFilterArr.hpbType != '' ){
                if(marker == 1){
                   where +=" AND " ;
                   filterby += ",";
                   marker = 0;   
                }
                where +=" `hpb_type` = '" +this.hpbFilterArr.hpbType +"'";   
                filterby += this.hpbFilterArr.hpbType ;
                marker = 1;
            }

            if( this.hpbFilterArr.hpbStatus != undefined && this.hpbFilterArr.hpbStatus != '' ){
                if(marker == 1){
                   where +=" AND ";
                   filterby += ",";
                   marker = 0;   
                }
                where +=" `hpb_status` = '" +this.hpbFilterArr.hpbStatus +"'";   
                filterby += this.hpbFilterArr.hpbStatus ;
                marker = 1;
            }



        console.log(this.hpbFilterArr);
        this.sqlS.selectTableData(selectField,tablename,where,orderBy,"").then((result)=>{
          this.filterResult=[]; 
          for(let i=0;i<result['rows'].length;i++){       
             this.filterResult.push( result['rows'].item(i)); 
           }  
           console.log("this.filterResult",this.filterResult);  

           let retData={
                    "hpbData":this.filterResult,
                    "action":"filter",
                    "filterby": filterby,
                    "hpbFilterArr":this.hpbFilterArr,
                    "type":this.hpbFilterArr.hpbType
           };
           this.viewCtrl.dismiss(retData);

        },(error)=>{
          console.log(error);  
          this.viewCtrl.dismiss({});
        });

    }else{
      //this.appCom.showToast(ALL_MESSAGE.ERROR_MESSAGE.FILTER_EMPTY,"middle");
       this.appCom.showAlert(ALL_MESSAGE.ERROR_MESSAGE.FILTER_EMPTY,"Ok","");
    }   


  }
*/
search(){
  var ct = this.hpbFilterArr.city != undefined && this.hpbFilterArr.city != ''; 
  var ht = this.hpbFilterArr.hpbType != undefined && this.hpbFilterArr.hpbType != ''; 
  var hs = this.hpbFilterArr.hpbStatus != undefined && this.hpbFilterArr.hpbStatus != ''; 
 
    let filterby = [];
    if( ct || ht || hs ){
      
        this.filters.city = this.hpbFilterArr.city;
        if(this.hpbFilterArr.city){
          filterby.push(this.hpbFilterArr.city);
        }
        this.filters.hpbType = this.hpbFilterArr.hpbType;
        if(this.filters.hpbType){
            filterby.push(this.filters.hpbType);
        }
        this.filters.hpbStatus = this.hpbFilterArr.hpbStatus;
        if(this.filters.hpbStatus){
            filterby.push(this.filters.hpbStatus);          
        }
        this.filters.type = this.hpbFilterArr.hpbType;
        this.filters.filterby = filterby.join();
        this.filters.status = true;
        this.filters.hpbFilterArr = this.hpbFilterArr;
        this.viewCtrl.dismiss(this.filters);
    }else{  
        this.filters.city = '';
        this.filters.hpbType = '';
        this.filters.hpbStatus = '';
        this.filters.status = false;
        this.filters.hpbFilterArr = '';
        this.filters.type = this.hpbFilterArr.hpbType;
    }   
  }

  resetFilter(){
    this.hpbFilterArr['city']=null;
    this.hpbFilterArr['hpbStatus']=null;

  }

  getAddressData(){
     return new Promise((resolve,reject)=>{
        let query="SELECT `id`, `citykabname`, `server_id` FROM address_master GROUP BY citykabname " ;
        this.sqlS.queryExecuteSql(query,[]).then((ressqlData) => {
            for(let i=0;i<ressqlData.rows.length;i++){
                let currTempObj=ressqlData.rows.item(i);
                this.allCityData.push({
                    text:currTempObj['citykabname'],
                    value:currTempObj['citykabname']
                });
            }
            this.CityMobi.instance.option({
                data: this.allCityData
            });
            resolve(true);
        },(error)=>{
          reject(error);
          console.log('allCityData sql error',error); 
        });
    });    
 }

 cityMobiFilter(serchKey?:any){
   
    let allcityData=[];
       
		let query="SELECT `id`, `citykabname`, `server_id` FROM address_master GROUP BY citykabname" ; 
         if(serchKey){
            query="SELECT `id`, `citykabname`, `server_id` FROM address_master  WHERE citykabname LIKE '%"+serchKey+"%'  GROUP BY citykabname " ;
        }
        this.sqlS.queryExecuteSql(query,[]).then((ressqlData) => {
            this.allCityData=[];
            for(let i=0;i<ressqlData.rows.length;i++){
            let tempObj=ressqlData.rows.item(i);
            this.allCityData.push({
                text:tempObj['citykabname'],
                value:tempObj['citykabname']
            });
            }
            this.CityMobi.instance.option({
                data: this.allCityData
            });
                        
		},(error)=>{
            console.log('allDistrictData sql error',error); 
    });
 }





}
