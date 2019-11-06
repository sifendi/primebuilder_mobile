import { HomePage } from '../../home/home';
import { ProjectListPage } from '../project-list/project-list';
import { ALL_MESSAGE } from '../../../providers/constant';
import { appCommonMethods } from '../../../providers/appCommonMethods';
import { SqlServices } from '../../../providers/sqlService';
import { Component, ViewChild } from '@angular/core';
import { Events, IonicPage, NavController, NavParams,ViewController } from 'ionic-angular';

declare var pleaseWaitTxtTransl,mobisPlaceHolderWaitTxtTransl,filterEmptyText,filterPlaceholderText,mobisBtnArr;

@Component({
  selector: 'page-project-filter',
  templateUrl: 'project-filter.html',
})
export class ProjectFilterPage {
   
 @ViewChild('subdistrict') subdistrictM: any;
 @ViewChild('subdistrictMob') subdistrictMob: any; 


  projFilterArr:any={
     subDistrict:null,
     projectStage:null,
     projectType:null,
     isSrku:null,
  }
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
            this.getAddressData(); 
      },
      onSet: (event, inst)=> {
            
      },
    //   onFilter: (event, inst)=> {
    //         this.getAddressData(event.filterText);
    //   }
  };  
 
  constructor(public navCtrl: NavController,public params:NavParams,public viewCtrl:ViewController, public navParams: NavParams,public sqlS:SqlServices,public appCom:appCommonMethods,public events:Events) {

  }

    ionViewDidEnter() {
    
    }

    async ionViewDidLoad() {
        this.busyMessage = await this.appCom.getTranslatedTxt("Please wait...");   

        //mobi scroll placeholder translations
        let MobiProps=this.mobiScollSubDistrictSettings;
        MobiProps['placeholder']= await this.appCom.getTranslatedTxt("Please select");
        this.mobiScollSubDistrictSettings=MobiProps;
        this.subdistrictMob.instance.option(MobiProps);

            let selData=this.params.get('projFilterArr');
            if(selData){
                this.projFilterArr=selData;
                    this.getAddressData(this.projFilterArr['subDistrict']).then(()=>{
                            setTimeout(()=>{
                                this.subdistrictM.valueAccessor._instance.setVal(this.projFilterArr['subDistrict'],true);
                            },100)
                    }); 
            }else{
                this.getAddressData();
            }
    
      console.log('ProjectFilterPage selData',selData);
      this.initDataFilters();
    }

  initDataFilters() {
    console.log('ionViewDidLoad ProjectFilterPage');

    
    // Get project Stages
    var selectField = " `server_id` , `project_stage` ";
    var where =" status = 1 ";
    var tablename = "project_stage_tbl";
    this.sqlS.selectTableData(selectField,tablename,where,"","").then((data) => {
            for(var i=0;i<data['rows'].length;i++){
                this.projectStages.push(data['rows'].item(i));
            }
            console.log(" projectStages ---- ",this.projectStages);
    });

    // Get project Types
    var selectField = " `server_id` , `project_type` ";
    var where =" status = 1 ";
    var tablename = "project_type_tbl";
    this.sqlS.selectTableData(selectField,tablename,where,"","").then((data) => {
            for(var i=0;i<data['rows'].length;i++){
                this.projectTypes.push(data['rows'].item(i));
            }
            console.log(" projectTypes ---- ",this.projectTypes);
    });
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
          
      
        //var tablename = "project_master";
    
        console.log(this.projFilterArr);
       
        let query=" SELECT projm.project_photo,ptt.project_type,nmct.nmc_type,pst.project_stage,projm.project_completion_date,projm.project_province,projm.project_city,projm.project_sub_district,projm.srku_owner_mobile_no,projm.srku_province,projm.srku_city,projm.srku_sub_district,projm.srku_pincode,projm.floor_size,projm.number_of_units,projm.is_micro_credit,projm.additional_comments, projm.hpb_digital_sign,projm.hpb_id,projm.server_hpb_id,projm.project_completion_date,projm.project_quantity_estimation,projm.project_address,projm.project_stage,projm.project_stage_mid,projm.project_sub_district,projm.project_pincode,projm.is_srku,projm.srku_owner_name,projm.srku_owner_address,projm.srku_owner_mobile_no,projm.non_micro_credit_type,projm.non_micro_credit_type_mid,projm.bank_name,projm.nmc_document,projm.bank_document,projm.assigned_to,projm.created_by,projm.updated_by,projm.sync_status,projm.status,projm.local_created_date,projm.local_updated_date,projm.project_id,projm.server_project_id,projm.project_name,projm.project_address,projm.is_srku,hm.hpb_name,hm.server_hpb_id,hm.hpb_id,(SELECT sast.srku_approval_status FROM srku_approval_status_tbl AS sast WHERE sast.project_id = projm.project_id  AND sast.is_closed = 0 ) AS tlh_approval,(SELECT sast.srku_rejection_reason FROM srku_approval_status_tbl AS sast WHERE sast.project_id = projm.project_id  AND sast.is_closed = 0 ) AS tlh_rejection_res FROM project_master projm LEFT JOIN hpb_master hm ON projm.server_hpb_id = hm.server_hpb_id LEFT JOIN project_type_tbl ptt ON projm.project_type_mid = ptt.server_id LEFT JOIN project_stage_tbl pst ON projm.project_stage_mid = pst.server_id LEFT JOIN nmc_tbl nmct ON projm.non_micro_credit_type_mid = nmct.server_id where "+where+" ORDER BY  projm.local_created_date desc ";
        this.busy= this.sqlS.queryExecuteSql(query,[]).then((result) => {      
           
           for(let i=0;i<result['rows'].length;i++){       
           this.filterResult.push( result['rows'].item(i)); 
            
                var selectField = " * ";
                var tablename = "hpb_master";
                var where=" `server_hpb_id` = "+this.filterResult[i]['server_hpb_id'];
                this.sqlS.selectTableData(selectField,tablename,where,"","").then((hpbdata) => {
                this.filterResult[i]['user']=hpbdata['rows'].item(0); 

                }, (error) => {
                    console.log('Error', error);  
                });  

          }  
           console.log("filterby",filterby); 

           console.log("this.filterResult",this.filterResult);   
           
        //    this.events.publish("projFilterEvent",{
        //       "projData":this.filterResult,
        //       "action":"filter",
        //       "filterby":filterby
        //    });

            let retData={
              "projData":this.filterResult,
              "action":"filter",
              "filterData":this.projFilterArr,
              "filterQuery":query,
              "filterby":filterby
           };
           this.viewCtrl.dismiss(retData);

         //  this.navCtrl.pop();  

        },(error)=>{
          console.log(error);  
           this.viewCtrl.dismiss({});
        });

    }else{
      //this.appCom.showToast(ALL_MESSAGE.ERROR_MESSAGE.FILTER_EMPTY,"middle");
      this.appCom.showAlert(ALL_MESSAGE.ERROR_MESSAGE.FILTER_EMPTY,"Ok","");  
    }   

  }

  clearFilter(){

   this.projFilterArr['subDistrict']=null;
   this.projFilterArr['subDistrict']=null;
   this.projFilterArr['projectStage']=null; 
   this.projFilterArr['projectType']=null;
   this.projFilterArr['isSrku']=null;
 
  }

  goHome(){
   //   this.navCtrl.setRoot(HomePage);
  }

getAddressData(serchKey?:any){
    return new Promise((resolve,reject)=>{
                let allAddressData=[];
                let allDistrictData=[];
            
                let query="SELECT `id`, `subdistrict`, `server_id` FROM address_master GROUP BY subdistrict" ;
                if(serchKey){
                    query="SELECT `id`, `subdistrict`, `server_id` FROM address_master WHERE subdistrict LIKE '%"+serchKey+"%'  GROUP BY subdistrict" ;
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
                resolve(true);


                console.log("allDistrictData",allDistrictData);              
            },(error)=>{
                    reject(error);
                    console.log('allDistrictData sql error',error); 
                });
    });         
 }

}
