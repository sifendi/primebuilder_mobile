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
  selector: 'ac-cement-bag-removal-search',
  templateUrl: 'ac-cement-bag-removal-search.html',
})
export class AcCementBagRemovalSearchPage { 
 
  @ViewChild('toDateMob') toDateMob: any; 
  @ViewChild('fromDateMob') fromDateMob: any;
  @ViewChild('toDate') toDate: any;
  @ViewChild('fromDate') fromDate: any; 
  @ViewChild('district') district: any;
  @ViewChild('districtMob') districtMob: any;  

  cementBagRemArr:any={ 
     fromDate:null,
     toDate:null,
     district:null,
  }
  filterResult:any=[];
  rdsArr:any=[];
  districtArrG:any=[];
  allDistrictData:any=[];
  disableToDateFlag:any=true;
  busyMessage:any="Please Wait...";  
  busy:any;

  mobiScollDistrictSettings:any = {
      inputClass: 'text-input',
      theme: 'material',
      showOnFocus: true,
      group: false,
      filter: true,
      filterEmptyText:filterEmptyText,
      filterPlaceholderText:filterPlaceholderText,
      placeholder: mobisPlaceHolderWaitTxtTransl,
      rows:5,
      data:[],
      readonly:false,
      buttons:mobisBtnArr,
      onClear: (event, inst)=>{  
            this.districtsMobiFilter(); 
      },
      onSet: (event, inst)=> {
            
      },
      // onFilter: (event, inst)=> {
      //       this.districtsMobiFilter(event.filterText);
      // }
  };  
  
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

  async ionViewDidLoad() {

    let MobiProps4=this.mobiScollDistrictSettings;
      MobiProps4['placeholder']= await this.appCom.getTranslatedTxt("Please select");
      this.mobiScollDistrictSettings=MobiProps4;
      this.districtMob.instance.option(MobiProps4);
 
      let tempDateS=this.dateSettingsTo;
        tempDateS['max']=new Date(moment().format());
        this.dateSettingsTo=tempDateS;
        this.toDateMob.instance.option(tempDateS);

      let tempDateE=this.dateSettingsFrom;
      tempDateE['max']=new Date(moment().format());
      this.dateSettingsFrom=tempDateE;
      this.fromDateMob.instance.option(tempDateE); 
    
      let selData = this.navParams.get("cementBagRemArr");
      this.getAllFormData().then(()=>{
          if( selData ){ 
              if( selData['fromDate'] ){
                this.cementBagRemArr['fromDate']=selData['fromDate'];
                setTimeout(()=>{
                      this.fromDate.valueAccessor._instance.setVal(this.appCom.timeStampToDateMMMnewM((this.cementBagRemArr['fromDate'])),true);  
                },10);
              }
              if( selData['toDate'] ){
                this.cementBagRemArr['toDate']=selData['toDate'];
                setTimeout(()=>{
                      this.disableToDateFlag=false;
                      this.toDate.valueAccessor._instance.setVal(this.appCom.timeStampToDateMMMnewM((this.cementBagRemArr['toDate'])),true);  
                },10);
              }
               if( selData['district'] ){
                this.cementBagRemArr['district']=selData['district'];
                setTimeout(()=>{
                      this.district.valueAccessor._instance.setVal(this.cementBagRemArr['district'],true);  
                },10);
              }

          }
      })

  }

  async ionViewDidEnter() {
     this.busyMessage = await this.appCom.getTranslatedTxt("Please wait...");   
  }

  getAllFormData(){
     return new Promise((resolve,reject)=>{
             let allDistrictData=[];
             allDistrictData=sessionUserGlobalData['user']['district'];
             this.districtArrG=[];  
             for(let i=0;i<allDistrictData.length;i++){
                let tempObj=allDistrictData[i];
                this.districtArrG.push({
                        text:tempObj['name'],
                        value:tempObj['id']
                });
             }
             this.districtMob.instance.option({
                data: this.districtArrG
            });
             resolve(true);
            // let query="SELECT `id`, `district`, `server_district_id` FROM address_master GROUP BY district"
            //     this.sqlS.queryExecuteSql(query,[]).then((ressqlData) => {
            //         this.districtArrG=[];
            //         for(let i=0;i<ressqlData.rows.length;i++){
            //         let tempObj=ressqlData.rows.item(i);
            //         allDistrictData.push(tempObj);
            //         this.districtArrG.push({
            //             text:tempObj['district'],
            //             value:tempObj['server_district_id']
            //         });
            //         }
            //         this.allDistrictData=allDistrictData;
            //           console.log('allDistrictData',this.allDistrictData); 
            //         resolve(true);


                    
            //     },(error)=>{
            //         console.log('allDistrictData sql error',error); 
            //         reject(error);
            //     });
       });
  }


search(){
  var dt =  this.cementBagRemArr.toDate != undefined && this.cementBagRemArr.toDate != '' ; 
  var df =  this.cementBagRemArr.fromDate != undefined && this.cementBagRemArr.fromDate != '';
  var dst =  this.cementBagRemArr.district != undefined && this.cementBagRemArr.district != '';
 

  console.log("dt",dt);
  console.log("df",df);
 
  
  if(dt || df ){

       let f=this.appCom.dateToTimeStamp(this.cementBagRemArr.fromDate);
       let t=this.appCom.dateToTimeStamp(this.cementBagRemArr.toDate);
       if( f>t || !dt || !df ){
       this.appCom.showAlert("Please enter a valid date range","Ok",""); 
       return false; 
       }
  }



     if( (dt && df ) || dst ){
     
     
        var orderBy = " `created_date` DESC";
        let filterby = "";
        var marker = 0;    
      
    if( this.cementBagRemArr.district != undefined && this.cementBagRemArr.district != '' ){
              
                filterby += this.getDistrictValueByid(this.cementBagRemArr.district) ;
                marker = 1;
            }

            if( this.cementBagRemArr.fromDate != undefined && this.cementBagRemArr.fromDate != '' ){
               if(marker == 1){
                 
                   filterby += ",";
                   marker = 0;   

                }

                let f=this.appCom.dateToTimeStamp(this.cementBagRemArr.fromDate); 
             
                filterby+= "from:"+ moment(this.cementBagRemArr.fromDate).format("DD MMM YYYY");
                marker = 1;
            }

              if( this.cementBagRemArr.toDate != undefined && this.cementBagRemArr.toDate != '' ){
               if(marker == 1){
                  
                   filterby += ",";
                   marker = 0;   

                }

           
                filterby+= "to:"+ moment(this.cementBagRemArr.toDate).format("DD MMM YYYY");
                //filterby += "to:"+this.cementBagRemArr.toDate ;
                marker = 1;
            }

       

                  let retData={
                    "cementBagRemArr":this.cementBagRemArr,
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
  this.cementBagRemArr['fromDate']=null;
  this.cementBagRemArr['toDate']=null;
  this.cementBagRemArr['district']=null;
}

dismiss(){
  this.viewCtrl.dismiss({}); 
}

  getDistrictValueByid(key){
     let value ="";
    
     for( let j=0;j< this.districtArrG.length;j++ ){
          console.log("key------------------>",key);
           console.log(" this.districtArrG[j]['server_district_id']", this.districtArrG[j]['server_district_id']);
         if( this.districtArrG[j]['value'] == key ){
           value= this.districtArrG[j]['text'];
         
           break;
         }
     }
       console.log("value------0_0-->",value);
     return value;   
  }

  districtsMobiFilter(serchKey?:any){
  
    let districtData=[];
       
		let query="SELECT `id`, `district`, `server_district_id` FROM address_master GROUP BY district" ; 
         if(serchKey){
            query="SELECT `id`, `district`, `server_district_id` FROM address_master  WHERE district LIKE '%"+serchKey+"%' GROUP BY district " ;
        }
        this.sqlS.queryExecuteSql(query,[]).then((ressqlData) => {
        this.districtArrG=[];
        let allDistrictData=[];
        allDistrictData=sessionUserGlobalData['user']['district'];
      // for(let i=0;i<ressqlData.rows.length;i++){ //
      for(let i=0;i<allDistrictData.length;i++){
        //let tempObj=ressqlData.rows.item(i);
        let tempObj=allDistrictData[i];
        districtData.push(tempObj);
        this.districtArrG.push({
            text:tempObj['name'],
            value:tempObj['id']
        });
      }
      this.districtMob.instance.option({
          data: this.districtArrG
      });

		},(error)=>{
            console.log('districtData sql error',error); 
    });
 }

    


}
