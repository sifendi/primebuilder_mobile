import { HomePage } from '../../home/home';
import { ALL_MESSAGE } from '../../../providers/constant';
import { appCommonMethods } from '../../../providers/appCommonMethods';
import { SqlServices } from '../../../providers/sqlService';
import { Component, ViewChild } from '@angular/core';
import { Events, IonicPage, NavController, NavParams,ViewController } from 'ionic-angular';
import async from 'async'; 

declare var pleaseWaitTxtTransl,mobisPlaceHolderWaitTxtTransl,filterEmptyText,filterPlaceholderText,mobisBtnArr;


@Component({
  selector: 'tlh-page-project-filter',
  templateUrl: 'tlh-project-filter.html',
})
export class TlhProjectFilterPage {
   
 @ViewChild('subdistrict') subdistrict: any; 
 @ViewChild('subdistrictMob') subdistrictMob: any; 

  projFilterArr:any={
     subDistrict:null,
     projectStage:null,
     projectType:null,
     isSrku:null,
     tabType:null
  }
  disableSrku:boolean=false;
  filterResult:any=[];
  projectStages:any = [];
  projectTypes:any = [];
  allDistrictData:any=[];
  subdistrictArrG:any=[];
  busyMessage:any="Please Wait...";  
  busy:any;
  mobiScollSubDistrictSettings:any = {
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
            this.subDistrictMobiFilter(); 
      },
      onSet: (event, inst)=> {
            
      },
    //   onFilter: (event, inst)=> {
    //         this.subDistrictMobiFilter(event.filterText);
    //   }
  };  
 
  constructor(public navCtrl: NavController,public params:NavParams,public viewCtrl:ViewController, public navParams: NavParams,public sqlS:SqlServices,public appCom:appCommonMethods,public events:Events) {

  }

   async ionViewDidLoad() {
 
    //mobi scroll placeholder translations
    let MobiProps=this.mobiScollSubDistrictSettings;
    MobiProps['placeholder']= await this.appCom.getTranslatedTxt("Please select");
    this.mobiScollSubDistrictSettings=MobiProps;
    this.subdistrictMob.instance.option(MobiProps); 

    let selData=this.params.get('selFilterData');
      console.log('ProjectFilterPage selData',selData);
      //this.getAddressData();
      this.busy=this.initDataFilters().then(()=>{
            if(selData){
                let T=selData['projFilterArr'];
                console.log("T----------->",T);
                if(T['subDistrict']){
                    console.log("subDistrict----------->",T['subDistrict']);
                        this.projFilterArr['subDistrict']=T['subDistrict'];
                    setTimeout(()=>{
                        this.subdistrict.valueAccessor._instance.setVal(this.projFilterArr['subDistrict'],true);
                    },100)
                                }

                this.projFilterArr.tabType=selData['tabType'];
                this.projFilterArr=selData['projFilterArr'];

                if(selData['tabType']=='pending'){
                this.projFilterArr.isSrku=1;
                this.disableSrku=true;
                }  
            }
      });

   }



    initDataFilters(){
    
         return new Promise((resolve,reject)=>{
             
                let allSyncTask=[];
                    let allTaskComplete = ()=>{
                    resolve(true);
                }
                    // Get project Stages
                    allSyncTask.push((callback)=>{
                    let query="SELECT `server_id` , `project_stage` FROM project_stage_tbl where status = 1" ;
                    this.sqlS.queryExecuteSql(query,[]).then((data:any)=>{

                        if(data.rows.length>0){
                            for(var i=0;i<data['rows'].length;i++){
                            this.projectStages.push(data['rows'].item(i));
                        }
                       

                    }
                        callback();
                    },(error)=>{
                        console.log('error queryRDS initFormData',error);
                        callback();
                    });

                });

                allSyncTask.push((callback)=>{

                   
                    let query="SELECT `server_id` , `project_type` FROM project_type_tbl where status = 1";
                    this.sqlS.queryExecuteSql(query,[]).then((data:any)=>{

                        if(data.rows.length>0){
                            for(var i=0;i<data['rows'].length;i++){
                                   this.projectTypes.push(data['rows'].item(i));
                            }
                         
                         

                        }
                        callback();
                    },(error)=>{
                        console.log('error queryRDS initFormData',error);
                        callback();
                    });


                });

                allSyncTask.push((callback)=>{
                    let allDistrictData=[];
                    let query="SELECT `id`, `subdistrict`, `server_id` FROM address_master GROUP BY subdistrict"
                       this.sqlS.queryExecuteSql(query,[]).then((ressqlData) => {
                            this.subdistrictArrG=[];
                            for(let i=0;i<ressqlData.rows.length;i++){
                                let tempObj=ressqlData.rows.item(i);
                                allDistrictData.push(tempObj);
                                this.subdistrictArrG.push({
                                    text:tempObj['subdistrict'],
                                    value:tempObj['subdistrict']
                                });
                            }
                            this.subdistrictMob.instance.option({
                                data: this.subdistrictArrG
                            });
                            this.allDistrictData=allDistrictData;
                             console.log('allDistrictData',this.allDistrictData); 
                            callback();


                            
                        },(error)=>{
                            console.log('allDistrictData sql error',error); 
                            callback();
                        });


                });

                    async.parallel(allSyncTask, function(){
                        allTaskComplete();
                    });

         });
        
    }

  async ionViewDidEnter() {
     this.busyMessage = await this.appCom.getTranslatedTxt("Please wait...");   
  }

    dismiss(){
        this.viewCtrl.dismiss({}); 
    }

  getProjectStageValueByid(key){
     let value =""; 
     for( let i=0;i< this.projectStages.length;i++ ){
         if( this.projectStages[i]['server_id'] == key ){
            value= this.projectStages[i]['project_stage'];
            break;
         }
     }
     return value;   
  }

  getProjectTypeValueByid(key){
     let value ="";
     for( let j=0;j< this.projectTypes.length;j++ ){
         if( this.projectTypes[j]['server_id'] == key ){
           value= this.projectTypes[j]['project_type'];
           break;
         }
     }
     return value;   
  }

  search(){
 console.log("projFilterArr",this.projFilterArr);
  var sd = this.projFilterArr.subDistrict != undefined && this.projFilterArr.subDistrict != ''; 
  var ps = this.projFilterArr.projectStage != undefined && this.projFilterArr.projectStage != ''; 
  var pt = this.projFilterArr.projectType != undefined && this.projFilterArr.projectType != ''; 
  var is = this.projFilterArr.isSrku != undefined && this.projFilterArr.isSrku != ''; 

    if( sd || ps || is || pt ){
        var selectField = " * ";
        let where ="";
        let filterby = "";
        var orderBy = " `created_date` DESC";
        var marker = 0;    
            if( this.projFilterArr.subDistrict != undefined && this.projFilterArr.subDistrict != '' ){
                where +=" projm.project_sub_district = '" +this.projFilterArr.subDistrict +"'";   
                filterby += this.projFilterArr.subDistrict ;
                marker = 1;
            }
          

          
            if( this.projFilterArr.projectStage != undefined && this.projFilterArr.projectStage != '' ){
                if(marker == 1){
                   where +=" AND " ;
                   filterby += ", ";
                   marker = 0;   

                }
                where +=" projm.project_stage_mid = '" +this.projFilterArr.projectStage +"'";   
                filterby += this.getProjectStageValueByid(this.projFilterArr.projectStage);
                marker = 1;
            }
       

          
            if( this.projFilterArr.projectType != undefined && this.projFilterArr.projectType != '' ){
                if(marker == 1){
                   where +=" AND ";
                   filterby += ", ";
                   marker = 0;   
                }
                where +=" projm.project_type_mid = '" +this.projFilterArr.projectType +"'";   
                filterby += this.getProjectTypeValueByid(this.projFilterArr.projectType);
                marker = 1;
            }
      

          
            if( this.projFilterArr.isSrku != undefined && this.projFilterArr.isSrku != '' ){
                if(marker == 1){
                   where +=" AND ";
                   filterby += ",";
                   marker = 0;  
                }

                where +=" projm.is_srku = '" +this.projFilterArr.isSrku +"'";   
                if( this.projFilterArr.isSrku == 1 ||  this.projFilterArr.isSrku == "1" ){
                   filterby += "Is Srku ? "+"Yes " ; 
                }else if( this.projFilterArr.isSrku == 0 ||  this.projFilterArr.isSrku == "0" ){
                  filterby += "Is Srku ? "+"No " ;
                }            
                marker = 1;
            }
          
    
            console.log(this.projFilterArr);
            let retData={
                "action":"filter",
                "projFilterArr":this.projFilterArr,
                "filterby":filterby,
                "type":this.projFilterArr.tabType
            };
            this.viewCtrl.dismiss(retData);


    }else{
      //this.appCom.showToast(ALL_MESSAGE.ERROR_MESSAGE.FILTER_EMPTY,"middle");
      this.appCom.showAlert(ALL_MESSAGE.ERROR_MESSAGE.FILTER_EMPTY,"Ok","");  
    }   

  }

  resetFilter(){
    this.projFilterArr['subDistrict']=null;
    this.projFilterArr['projectStage']=null;
    this.projFilterArr['projectType']=null;
    if(this.projFilterArr['tabType']== 'all'){
        this.projFilterArr['isSrku']=null;
    }

  }

  goHome(){
   //   this.navCtrl.setRoot(HomePage);
  }

subDistrictMobiFilter(serchKey?:any){
    let allAddressData=[];
    let allDistrictData=[];
       
		let query="SELECT `id`, `subdistrict`, `server_id` FROM address_master GROUP BY subdistrict" ; //LIMIT 100
         if(serchKey){
            query="SELECT `id`, `subdistrict`, `server_id` FROM address_master WHERE subdistrict LIKE '%"+serchKey+"%'  GROUP BY subdistrict " ;
        }
        this.sqlS.queryExecuteSql(query,[]).then((ressqlData) => {
        this.subdistrictArrG=[];
		for(let i=0;i<ressqlData.rows.length;i++){
          let tempObj=ressqlData.rows.item(i);
          allDistrictData.push(tempObj);
          this.subdistrictArrG.push({
              text:tempObj['subdistrict'],
              value:tempObj['subdistrict']
          });
        }
        this.subdistrictMob.instance.option({
            data: this.subdistrictArrG
        });
        this.allDistrictData=allDistrictData;
        


         console.log("allDistrictData",allDistrictData);              
		},(error)=>{
            console.log('allDistrictData sql error',error); 
    });
 }

}
