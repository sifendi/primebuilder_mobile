import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';
import { appCommonMethods } from "../../../../providers/appCommonMethods";
import { ALL_MESSAGE } from "../../../../providers/constant";
import { AcHpbListContractorPage, AcHpbListMasonPage } from "../ac-hpb-list/ac-hpb-list";
import { SqlServices } from "../../../../providers/sqlService";
import { App_hpbApi } from "../../../../shared/loopback_sdk/index";

declare var pleaseWaitTxtTransl,mobisPlaceHolderWaitTxtTransl,filterEmptyText,filterPlaceholderText,mobisBtnArr;


@Component({
  selector: 'ac-hpb-filter',
  templateUrl: 'ac-hpb-filter.html',
})
export class AcHpbFilterPage {
 
  @ViewChild('city') city: any; 
  @ViewChild('CityMobi') CityMobi: any; 

  hpbFilterArr:any={
     city:null,
     hpbType:null,
     hpbStatus:null,
  }
  filterResult:any=[];
  allCityData:any=[];
  busyMessage:any;
  busy:any;

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

  constructor(public navCtrl: NavController, public navParams: NavParams,public appCom:appCommonMethods,public sqlS:SqlServices,public hpbApi: App_hpbApi,public viewCtrl:ViewController) {

  }

  async ionViewDidLoad() {
 
    //mobi scroll placeholder translations
    let MobiProps=this.mobiScollCitySettings;
    MobiProps['placeholder']= await this.appCom.getTranslatedTxt("Please select");
    this.mobiScollCitySettings=MobiProps;
    this.CityMobi.instance.option(MobiProps);

    let selFilterData = this.navParams.get('selFilterData');
    this.getAddressData().then(()=>{
        this.hpbFilterArr.hpbType=selFilterData['hpbType'];
        if(selFilterData['hpbFilterArr']){
            let T=selFilterData['hpbFilterArr'];
              if(T['hpbStatus']){
                this.hpbFilterArr['hpbStatus']=T['hpbStatus'];
              }
              if(T['city']){
                  this.hpbFilterArr['city']=T['city'];
                  setTimeout(()=>{
                      this.city.valueAccessor._instance.setVal(this.hpbFilterArr['city'],true);
                  },10)
              }
        }
    });
   
  }

  goHome(){
   // this.navCtrl.setRoot(HomePage)
  }



search(){
  var ct = this.hpbFilterArr.city != undefined && this.hpbFilterArr.city != ''; 
  var ht = this.hpbFilterArr.hpbType != undefined && this.hpbFilterArr.hpbType != ''; 
  var hs = this.hpbFilterArr.hpbStatus != undefined && this.hpbFilterArr.hpbStatus != ''; 
 

    if( ct || ht || hs ){
        var selectField = " * ";
        var tablename = "hpb_master";
        //var where ="";
        var orderBy = " `created_date` DESC";
        let filterby = "";
        var marker = 0;    
            
            if( this.hpbFilterArr.city != undefined && this.hpbFilterArr.city != '' ){
                //where +=" `id_card_city` = '" +this.hpbFilterArr.city +"'";   
                filterby += this.hpbFilterArr.city ;
                marker = 1;
            }

            if( this.hpbFilterArr.hpbType != undefined && this.hpbFilterArr.hpbType != '' ){
                if(marker == 1){
                   //where +=" AND " ;
                   filterby += ",";
                   marker = 0;   

                }
                //where +=" `hpb_type` = '" +this.hpbFilterArr.hpbType +"'";   
                filterby += this.hpbFilterArr.hpbType ;
                marker = 1;
            }

            if( this.hpbFilterArr.hpbStatus != undefined && this.hpbFilterArr.hpbStatus != '' ){
                if(marker == 1){
                   //where +=" AND ";
                   filterby += ",";
                   marker = 0;   
                }
                //where +=" `hpb_status` = '" +this.hpbFilterArr.hpbStatus +"'";   
                filterby += this.hpbFilterArr.hpbStatus ;
                marker = 1;
            }


            
           
            let retData={
                  "hpbFilterArr":this.hpbFilterArr,
                  "action":"filter",
                  "filterby": filterby,
                  "type":this.hpbFilterArr.hpbType
                };
            this.viewCtrl.dismiss(retData);

    }else{
      //this.appCom.showToast(ALL_MESSAGE.ERROR_MESSAGE.FILTER_EMPTY,"middle");
       this.appCom.showAlert(ALL_MESSAGE.ERROR_MESSAGE.FILTER_EMPTY,"Ok","");
    }   


  }

  resetFilter(){
    this.hpbFilterArr['city']=null;
    this.hpbFilterArr['hpbStatus']=null;
  }

  getAddressData(){

    return new Promise((resolve,reject)=>{
        let allAddressData=[];
        let allCityData=[];
        let query="SELECT `id`, `citykabname`, `server_id` FROM address_master GROUP BY citykabname" ;
        this.sqlS.queryExecuteSql(query,[]).then((ressqlData) => {
        if(ressqlData.rows.length>0){
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
        }
        resolve(true);
        console.log("allCityData",allCityData);              
        },(error)=>{
          console.log('allCityData sql error',error); 
          reject(error);
        });
    }); 
  }


dismiss(){
  this.viewCtrl.dismiss({}); 
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
