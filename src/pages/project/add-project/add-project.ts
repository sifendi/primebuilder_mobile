import { addSrkuPage } from '../add-srku/add-srku';
import { ALL_MESSAGE } from '../../../providers/constant';
import { ShareService } from '../../../providers/ShareService';
import { HomePage } from '../../home/home';
import { SqlServices } from '../../../providers/sqlService';
import { ImageSelectPopPage } from '../../image-select-pop/image-select-pop';
import { appCommonMethods } from '../../../providers/appCommonMethods';
import { SyncServices } from '../../../providers/syncServices';
import { Component,ViewChild } from '@angular/core';
import { Events, IonicPage, NavController, NavParams, PopoverController } from 'ionic-angular';
import { App_hpbApi }  from '../../../shared/loopback_sdk';

import * as moment from 'moment';
declare var cordova;
declare var debugDataCustom;
declare var globalInternetCheckConnection;
declare var sessionUserGlobalData;
declare var pleaseWaitTxtTransl,mobisPlaceHolderWaitTxtTransl,filterEmptyText,filterPlaceholderText,mobisBtnArr;
@Component({
  selector: 'page-add-project',
  templateUrl: 'add-project.html',
})
export class AddProjectPage {
  
   busy:  Promise<any>;
   busy1:  Promise<any>;
   busyMessage:any;
   hideLocate:any=false;
   disableSrkuBtn:any=false;
   syncGlobalHPB:boolean=false;
   showLocateBtn:boolean=false;
  
  projData:any={
    ProjectId:null,
    ProjectName:null,
    ProjectCompletionDate:null,
    ProjectQuantityEstimation:null,
    ProjectType:null,
    ProjectTypeId:null,
    ProjectStage:null,
    ProjectStageId:null,
    ProjectAddress:null,
    ProjectProvince:null,
    ProjectCity:null,
    ProjectSubDistrict:null,
    ProjectPincode:null,
    ProjectPhoto :[],
    HpbId:null,
    IsSrku:null,
    SrkuOwnerName:null,
    SrkuOwnerAddress:null,
    SrkuProvince:null,
    SrkuCity:null,
    SrkuSubDistrict:null,
    SrkuPincode:null,
    SrkuOwnerMobileNumber:null,
    FloorSize:null,
    NumberOfUnit:null,
    IsMicroCredit:null,
    BankName:null,
    BankDocument:[],
    NonMicroCreditType:null,
    NMCDocument:[],
    HpbDigitalSign:null,
    AdditionalComments:null,
    latitude:null,
    longitude:null
  };

   submitted:boolean= false;
   @ViewChild('ProjectName') ProjectName: any; 
   @ViewChild('ProjectCompletionDate') ProjectCompletionDate: any; 
   @ViewChild('ProjectCompletionDateMob') ProjectCompletionDateMob: any; 
   @ViewChild('ProjectQuantityEstimation') ProjectQuantityEstimation: any;  
   @ViewChild('ProjectType') ProjectType: any;  
   @ViewChild('ProjectTypeId') ProjectTypeId: any;  
   @ViewChild('ProjectStage') ProjectStage: any; 
   @ViewChild('ProjectStageId') ProjectStageId: any; 
   @ViewChild('ProjectAddress') ProjectAddress: any;
   @ViewChild('ProjectProvince') ProjectProvince: any; 
   @ViewChild('ProjectCity') ProjectCity: any; 

   @ViewChild('ProjectSubDistrict') ProjectSubDistrict: any;
   @ViewChild('ProjectPincode') ProjectPincode: any;  
   @ViewChild('ProjectPhoto') ProjectPhoto: any; 
   @ViewChild('HpbId') HpbId: any;
   @ViewChild('IsSrku') IsSrku: any;  
   @ViewChild('searchBy') searchBy: any; 

  @ViewChild('completionDateObj') completionDateObj;  

   @ViewChild('pincodeMob') pincodeMob: any;  
   @ViewChild('ProvinceMob') ProvinceMob: any;  
   @ViewChild('CityMob') CityMob: any;  
   @ViewChild('SubDistrictMob') SubDistrictMob: any;  
   @ViewChild('HpbMob') HpbMob: any;  
   
   projectPhotoObj:any=[];
   projectPhotoLimitFlag:any=false;
   query:any = '';
   filteredList:any;
   action:any;
   disableFieldsFlag:any=false;
   hpbList:any=[];
   MinDate:any;
   MaxDate:any;
   pageTitle:any;
   
  allAddressDataG:any=[];
  postalCodeArrG:any=[];
  provinceArrG:any=[];
  municipalityArrG:any=[];
  subDistrictArrG:any=[];

   allAddressDataF:any=[];
   postalCodeArrF:any=[];
   provinceArrF:any=[];
   municipalityArrF:any=[];
   subDistrictArrF:any=[];

  allAddressDataS:any=[];
  postalCodeArrS:any=[];
  provinceArrS:any=[];
  municipalityArrS:any=[];
  subDistrictArrS:any=[];

  projectStages:any = [];
  projectTypes:any = [];
  
  oldHpbDataArray:any=[];

  hpbLocalData:any=[];
 
 dateSettingsG:any={
    theme: 'material',
    display: 'center',
    dateFormat:'dd/mm/yy'
  };
  

 /* F Address Mater : Start */

  mobiScollProjectProvinceSettings:any = {
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
      buttons:mobisBtnArr,//['set','clear','cancel'],
     
      onClear: (event, inst)=>{
        this.projData.ProjectCity=null;
        this.projData.ProjectSubDistrict=null;
        this.projData.ProjectPincode=null;
      },
      onSet: (event, inst)=> {
        if(event.valueText){
          this.addressDataFiltersF(event.valueText,'province');
        }else{

        }
             
      },
      // onFilter: (event, inst)=> {
      //   let filtered : any[] = [];
      //   let query = event.filterText;
      //   this.provinceArrF=[];
      //    for(let i = 0; i < this.provinceArrG.length; i++) {
      //             let currData = this.provinceArrG[i];
      //             if(query=='' || query==null){
      //                     this.provinceArrF.push({
      //                       text:currData.text,
      //                       value:currData.value,
      //                     });
      //                   if(i==50){
      //                     break;
      //                   }
      //             }else if(currData.value.toString().toLowerCase().includes(query.toString().toLowerCase())) {
      //                    this.provinceArrF.push({
      //                       text:currData.text,
      //                       value:currData.value,
      //                     });
      //                   if(i==50){
      //                     break;
      //                   }
      //             }

                 
      //     } 
      // }
  };  
  mobiScollProjectCitySettings:any = {
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
        this.projData.ProjectSubDistrict=null;
        this.projData.ProjectPincode=null;
      },
      onSet: (event, inst)=> {
        if(event.valueText){
          this.addressDataFiltersF(event.valueText,'citykabname');
        }else{

        }
              
      },
      // onFilter: (event, inst)=> {
      //   console.log('onFilter ',event);
      //   let filtered : any[] = [];
      //   let query = event.filterText;
      //   this.municipalityArrF=[];
      //    for(let i = 0; i < this.municipalityArrG.length; i++) {
      //             let currData = this.municipalityArrG[i];
      //             if(query=='' || query==null){
      //                     this.municipalityArrF.push({
      //                       text:currData.text,
      //                       value:currData.value,
      //                     });
      //                   if(i==50){
      //                     // this.CityMob.instance.option({
      //                     //   data: this.municipalityArrF
      //                     // });
      //                     break;
      //                   }
      //             }else if(currData.value.toString().toLowerCase().includes(query.toString().toLowerCase())) {
      //                    this.municipalityArrF.push({
      //                       text:currData.text,
      //                       value:currData.value,
      //                     });
      //                   if(i==50){
      //                     // this.CityMob.instance.option({
      //                     //   data: this.municipalityArrF
      //                     // });
      //                     break;
      //                   }
      //             }

                 
      //     } 
      // }
  }; 
  mobiScollProjectSubDistrictSettings:any = {
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
        this.projData.ProjectPincode=null;
      },
      onSet: (event, inst)=> {
        if(event.valueText){
          this.addressDataFiltersF(event.valueText,'subdistrict');
        }else{

        }
              
      },
      // onFilter: (event, inst)=> {
      //   console.log('onFilter ',event);
      //   let filtered : any[] = [];
      //   let query = event.filterText;
      //   this.subDistrictArrF=[];
      //    for(let i = 0; i < this.subDistrictArrG.length; i++) {
      //             let currData = this.subDistrictArrG[i];
      //             if(query=='' || query==null){
      //                     this.subDistrictArrF.push({
      //                       text:currData.text,
      //                       value:currData.value,
      //                     });
      //                   if(i==50){
      //                     // this.SubDistrictMob.instance.option({
      //                     //   data: this.subDistrictArrF
      //                     // });
      //                     break;
      //                   }
      //             }else if(currData.value.toString().toLowerCase().includes(query.toString().toLowerCase())) {
      //                    this.subDistrictArrF.push({
      //                       text:currData.text,
      //                       value:currData.value,
      //                     });
      //                   if(i==50){
      //                     // this.SubDistrictMob.instance.option({
      //                     //   data: this.subDistrictArrF
      //                     // });
      //                     break;
      //                   }
      //             }

                 
      //     } 
      // }
  };
   mobiScollProjectPincodeSettings:any = {
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
   

            this.projData.ProjectCity=null;
            this.projData.ProjectSubDistrict=null;
            this.projData.ProjectProvince=null;

            this.postalCodeArrF=[];
            for(let i = 0; i < this.postalCodeArrG.length; i++) {
              this.postalCodeArrF.push({
                    text:this.postalCodeArrG[i].text,
                    value:this.postalCodeArrG[i].value,
                  });
                // if(i==50){
                //   break;
                // }
            }
           
            this.pincodeMob.instance.option({
              data: this.postalCodeArrF
            });
            this.provinceArrF=[];
            for(let i = 0; i < this.provinceArrG.length; i++) {
              this.provinceArrF.push({
                    text:this.provinceArrG[i].text,
                    value:this.provinceArrG[i].value,
                  });
                // if(i==50){
                //   break;
                // }
            }
            
            this.ProvinceMob.instance.option({
              data: this.provinceArrF
            });
      },
      onSet: (event, inst)=> {
        
        if(event.valueText){
          this.addressDataFiltersF(event.valueText,'postalcode');
        }else{

        }
                   
      },
      // onFilter: (event, inst)=> {
      //   console.log('onFilter ',event);
      //   let filtered : any[] = [];
      //   let query = event.filterText;
      //   this.postalCodeArrF=[];
      //    for(let i = 0; i < this.postalCodeArrG.length; i++) {
      //             let currData = this.postalCodeArrG[i];
      //             if(query=='' || query==null){
      //                     this.postalCodeArrF.push({
      //                       text:currData.text,
      //                       value:currData.value,
      //                     });
      //                   if(i==50){
      //                     // this.pincodeMob.instance.option({
      //                     //   data: this.postalCodeArrF
      //                     // });
      //                     break;
      //                   }
      //             }else if(currData.value.toString().toLowerCase().includes(query.toString().toLowerCase())) {
      //                    this.postalCodeArrF.push({
      //                       text:currData.text,
      //                       value:currData.value,
      //                     });
      //                   if(i==50){
      //                     // this.pincodeMob.instance.option({
      //                     //   data: this.postalCodeArrF
      //                     // });
      //                     break;
      //                   }
      //             }

                 
      //     } 
      // }
  };

 /* F Address Mater : End */


  mobiScollHpbListSettings:any = {
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
            this.busy=this.mobiScrollHpbFilter(); 
      },
      onSet: (event, inst)=> {
            
      },
      onFilter: (event, inst)=> {
            this.busy=this.mobiScrollHpbFilter(event.filterText);
      }
  };

  updateFlag:boolean=false;
  constructor(public navCtrl: NavController,public syncS:SyncServices,public appHpbApi:App_hpbApi, public navParams: NavParams,public events:Events,public popoverCtrl: PopoverController,public sqlS:SqlServices,public shareS:ShareService,public appCom:appCommonMethods) {
    this.MinDate=moment(new Date()).format();
    this.MaxDate=moment().add(20,'years').format(); 
    this.pageTitle="Add Project";
   

  }

  async ionViewDidLoad() {
    console.log('ionViewDidLoad AddProjectPage');
    this.projData={
      ProjectId:null,
      ProjectName:null,
      ProjectCompletionDate:null,
      ProjectQuantityEstimation:null,
      ProjectType:null,
      ProjectTypeId:null,
      ProjectStage:null,
      ProjectAddress:null,
      ProjectProvince:null,
      ProjectCity:null,
      ProjectSubDistrict:null,
      ProjectPincode:null,
      ProjectPhoto :[],
      HpbId:null,
      IsSrku:null,
      SrkuOwnerName:null,
      SrkuOwnerAddress:null,
      SrkuProvince:null,
      SrkuCity:null,
      SrkuSubDistrict:null,
      SrkuPincode:null,
      SrkuOwnerMobileNumber:null,
      FloorSize:null,
      NumberOfUnit:null,
      IsMicroCredit:null,
      BankName:null,
      BankDocument:[],
      NonMicroCreditType:null,
      NMCDocument:[],
      HpbDigitalSign:null,
      AdditionalComments:null,
      latitude:null,
      longitude:null
    };

    let MobiProps4=this.mobiScollHpbListSettings;
    MobiProps4['placeholder']= await this.appCom.getTranslatedTxt("Please select");
    this.mobiScollHpbListSettings=MobiProps4;
    this.HpbMob.instance.option(MobiProps4);


    //POPULATE HPBs
    var selectField = " * ";
    var where =" server_hpb_id > 0 AND status = 1";
    var tablename = "hpb_master";
    this.hpbList=[];
    this.sqlS.selectTableData(selectField,tablename,where,"","").then((data) => {
      for (let i = 0; i < data['rows'].length; i++) {
              let currTempObj=data.rows.item(i);
              let displayText = currTempObj['hpb_name']+" ("+currTempObj['primary_mobile_no']+")";
              this.hpbList.push({
                      text:displayText,
                      value:currTempObj['server_hpb_id']
              });
              this.hpbLocalData.push(currTempObj['server_hpb_id']);
      }
          console.log("this.hpbList----->",this.hpbList);    
    });

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


      let action = this.navParams.get("action"); 
      console.log("action",action);
      if( action == 'edit' ){
      //TREAT THIS PAGE AS EDIT HPB
      this.pageTitle="Edit Project";
      this.disableFieldsFlag=true;
      let insertData = [];
      this.updateFlag = true;
   
      insertData = this.navParams.get("projData"); 


     

       //FETCH DATA FROM DATABASE USING HPB ID..
      let selectField = " * ";
      let tablename = "project_master";
      let where = " `project_id` = "+insertData['project_id'];
      this.sqlS.selectTableData(selectField,tablename,where,"","").then((data) => {
            console.log('data fetched', data);
            for(let i=0;i<data['rows'].length;i++){       
              insertData = ( data['rows'].item(i) );                
            }
            
            console.log("insertData",insertData);
              
            if( insertData['is_srku'] == 1 ){
              this.disableSrkuBtn = true;     
            }else{
              this.disableSrkuBtn = false;
            }

            //PREFILL ALL FORM VALUES HERE    
            this.projData['ProjectId']=insertData['project_id'];
            this.projData['ProjectName']=insertData['project_name'];
            this.projData['ProjectCompletionDate']=this.appCom.timeStampToDateMMMnewM((insertData['project_completion_date']));
            this.projData['ProjectQuantityEstimation']=insertData['project_quantity_estimation'];
            this.projData['ProjectType']=insertData['project_type'];
            this.projData['ProjectTypeId']=insertData['project_type_mid'];
            this.projData['ProjectStage']=insertData['project_stage'];
            this.projData['ProjectStageId']=insertData['project_stage_mid'];
            this.projData['ProjectAddress']=insertData['project_address'];
            this.projData['ProjectProvince']= insertData['project_province']; 
            this.projData['ProjectCity']=insertData['project_city'];
            this.projData['ProjectSubDistrict']=insertData['project_sub_district']; 
            this.projData['ProjectPincode']=insertData['project_pincode'];
            this.projData['HpbId']=insertData['server_hpb_id'];
            this.projData['IsSrku']=(insertData['is_srku'] == 0)? 'no':'yes';
            this.projData['SrkuOwnerName']=insertData['srku_owner_name'];
            this.projData['SrkuOwnerAddress']=insertData['srku_owner_address'];
            this.projData['SrkuProvince']=insertData['srku_province'];
            this.projData['SrkuCity']=insertData['srku_city'];
            this.projData['SrkuSubDistrict']=insertData['srku_sub_district'];
            this.projData['SrkuPincode']=insertData['srku_pincode'];
            this.projData['SrkuOwnerMobileNumber']=insertData['srku_owner_mobile_no'];
            this.projData['FloorSize']=insertData['floor_size'];
            this.projData['NumberOfUnit']=insertData['number_of_units'];
            this.projData['IsMicroCredit']=insertData['is_micro_credit'];
            this.projData['BankName']=insertData['bank_name'];
            this.projData['NonMicroCreditType']=insertData['non_micro_credit_type'];   
            this.projData['NonMicroCreditTypeMid']=insertData['non_micro_credit_type_mid'];   
            this.projData['HpbDigitalSign']=insertData['hpb_digital_sign'];
            this.projData['AdditionalComments']=insertData['additional_comments'];
            this.projData['NMCDocument'] = insertData['nmc_document'];
            this.projData['BankDocument'] =insertData['bank_document'];

            var projPhoto = JSON.parse(insertData['project_photo']);      
            this.projData['ProjectPhoto']=JSON.parse(insertData['project_photo']);
            console.log("this.projData['ProjectPhoto']--------->",this.projData['ProjectPhoto']);
            if( projPhoto !=undefined && projPhoto !=''  ){
              for( var i=0;i<projPhoto.length;i++ ){
                    //this.projectPhotoObj.push(  this.appCom.urlSanitizer(projPhoto[i]['path']) ); 
                    this.projectPhotoObj.push(  this.appCom.getImageLocalPathFull(projPhoto[i]) ); 
              } 
            }


            if( this.projData['HpbId'] != undefined &&  this.projData['HpbId'] != '' && this.projData['HpbId'] >0 ){    
                              let ds=[];
                              ds=JSON.parse(insertData['hpb_digital_sign']);     
                              this.projData['HpbDigitalSign']=ds;
            }else{
                  this.projData['HpbDigitalSign']='';
            }

            

            this.projData['AdditionalComments']=insertData['additional_comments'];
            this.projData['latitude']=insertData['latitude'];
            this.projData['longitude']=insertData['longitude'];
       


            console.log("this.projData",this.projData);
            this.oldHpbDataArray = insertData;


      }, (error) => {
      console.log('Error', error);

      });

      }else{
      //TREAT THIS PAGE AS ADD HPB
        this.pageTitle="ADD Project";
        let tempDateS=this.dateSettingsG;
        tempDateS['max']=new Date(moment().add(20,'years').format());
        tempDateS['min']=new Date(moment().add(1, 'days').format());
        this.dateSettingsG=tempDateS;
        this.ProjectCompletionDateMob.instance.option(tempDateS);
      }

      console.log("getAddressData=>out");

       this.busy=this.getAddressData().then(()=>{
              
              this.busy=this.addressInitInput().then(()=>{
                      
                      if(this.projData.ProjectPincode && this.projData.ProjectPincode!=''){
                          this.addressDataFiltersF(this.projData.ProjectPincode,'postalcode');
                      }else{
                        
                      }

                },()=>{
                  
                });
            
          },()=>{

        });

    setTimeout(()=> {
      console.log('completionDateObj',this.completionDateObj);
       debugDataCustom=this.completionDateObj;
    //  this.completionDateObj.setValue(new Date().toISOString());
    }, 500);

  }


  async ionViewDidEnter(){
    this.showLocateBtn=globalInternetCheckConnection;  
    this.busyMessage = await this.appCom.getTranslatedTxt("Please wait...");   

      //mobi scroll placeholder translations
      let MobiProps=this.mobiScollProjectPincodeSettings;
      MobiProps['placeholder']= await this.appCom.getTranslatedTxt("Please select");
      this.mobiScollProjectPincodeSettings=MobiProps;
      this.pincodeMob.instance.option(MobiProps);

      let MobiProps1=this.mobiScollProjectProvinceSettings;
      MobiProps1['placeholder']= await this.appCom.getTranslatedTxt("Please select");
      this.mobiScollProjectProvinceSettings=MobiProps1;
      this.ProvinceMob.instance.option(MobiProps1);

      let MobiProps2=this.mobiScollProjectCitySettings;
      MobiProps2['placeholder']= await this.appCom.getTranslatedTxt("Please select");
      this.mobiScollProjectCitySettings=MobiProps2;
      this.CityMob.instance.option(MobiProps2);

      let MobiProps3=this.mobiScollProjectSubDistrictSettings;
      MobiProps3['placeholder']= await this.appCom.getTranslatedTxt("Please select");
      this.mobiScollProjectSubDistrictSettings=MobiProps3;
      this.SubDistrictMob.instance.option(MobiProps3);
   
      //SUBSCRIPTION FOR CAMERA OR GALLERY PHOTO CAPTURED..
      this.events.unsubscribe("getbase64Image"); 
        this.events.subscribe('getbase64Image',(base64ImgOBJ) => {
    
            let base64Image =  base64ImgOBJ.base64Image;
            let extType=".jpeg";
            var filename = this.appCom.generateRandomString()+extType;

            this.appCom.savebase64AsImageFile(filename,base64Image,extType).then((path)=>{
                
                if( base64ImgOBJ.photo_source == "project_photo" ){
                    //IF ID CARD MULTIPLE PICS
                    this.projectPhotoObj.push(this.appCom.urlSanitizer(path));
                    let t ={};
                    t['path']=path;
                    t['name']=filename;
                    t['container']="doc";
                    t['fileType']="jpeg";
                    t['sync_status']=0;
                    t['serverPath']="";
                    this.projData.ProjectPhoto.push(t);   
                  }else{

                  } 

                },(error)=>{
                  console.log(error);
                }

            );

        }); 




  }

  ionViewDidLeave(){
 
  }

  goToNextPage(){
    this.submitted= true;
    let isvalid = false;


    //IF HPB ID HAS CHANGED >>CLEAR SIGNATURE PAD..
    console.log("this.projData['HpbId']",this.projData['HpbId']);
    console.log("this.oldHpbDataArray['HpbId']",this.oldHpbDataArray['server_hpb_id']);
    if( this.projData['HpbId'] == this.oldHpbDataArray['server_hpb_id'] ){
             
    }else{
       this.projData['HpbDigitalSign']=""; 
    }

    isvalid = this.ProjectName.valid && this.projData['ProjectName'] != undefined  &&this.projData['ProjectName'] != ''  && this.projData['ProjectName'].trim() != '' && this.projData['ProjectName'].trim() != undefined && this.ProjectCompletionDate != undefined && this.ProjectCompletionDate != '' && this.ProjectQuantityEstimation.valid &&
                  this.ProjectType.valid && this.ProjectStage.valid && this.ProjectAddress.valid && this.ProjectProvince.valid && this.projData['ProjectAddress'].trim() != undefined && this.projData['ProjectAddress'].trim() != '' && 
                  this.ProjectCity.valid && this.ProjectSubDistrict.valid && this.ProjectPincode.valid &&
                  this.IsSrku.value != undefined && this.IsSrku.value != '' && this.IsSrku.valid && this.projectPhotoObj != undefined &&  this.projectPhotoObj != '' ;
  
                 

    if(isvalid){
      let action='none';
      if( this.projData['ProjectId'] > 0 ){
          if( this.projData['IsSrku'] == 0 ){
          //clear srku data
            this.projData.SrkuOwnerName=null;
            this.projData.SrkuOwnerAddress=null;
            this.projData.SrkuProvince=null;
            this.projData.SrkuCity=null;
            this.projData.SrkuSubDistrict=null;
            this.projData.SrkuPincode=null;
            this.projData.SrkuOwnerMobileNumber=null;
            this.projData.FloorSize=null;
            this.projData.NumberOfUnit=null;
            this.projData.IsMicroCredit=null;
            this.projData.BankName=null;
            this.projData.BankDocument=[];
            this.projData.NonMicroCreditType=null;
            this.projData.NMCDocument=[];
          }
        action="edit";
      }   
      let syncHPBExt=false;
      if(this.hpbLocalData.indexOf(this.projData.HpbId)){
            syncHPBExt=false
      }else{
            syncHPBExt=true;
      }

      alert(JSON.stringify(this.projectPhotoObj));
        // this.navCtrl.push(addSrkuPage,{
        //   "projData":this.projData,
        //   "action":action,
        //   "syncHPBExt":syncHPBExt
        // });
     
    }else{
      console.log("skru is invalid");
      this.appCom.showAlert(ALL_MESSAGE.ERROR_MESSAGE.INVALID_FIELDS_FORM_ERR,"Ok","");
    }


  }


    getAddress(){
      this.hideLocate=true;
      this.appCom.isGpsLocationEnabledC((successCallback)=>{			
        if(successCallback)	{ 
          this.appCom.getLocationModeC((res) => {
            console.log("res",res);
            //if(res == 'high_accuracy'){
              this.busy=this.appCom.getAddressOfCurrLocation().then((address)=>{
                if(address){
                  this.projData['ProjectAddress'] = address; 
                } 
                this.hideLocate=false;
              },(error)=>{
                console.log(error);
                this.hideLocate=false;
              });
            // }else{
            //   //show pop up for set high accuracy..
            //   //this.hideLocate=false;
            //   //this.appCom.showAlert(ALL_MESSAGE.ERROR_MESSAGE.GET_LOCATION_COORDS_ERR,"Ok","");
            //   this.busy=this.appCom.getAddressOfCurrLocation().then((address)=>{
            //     if(address){
            //       this.projData['ProjectAddress'] = address; 
            //     } 
            //     this.hideLocate=false;
            //   },(error)=>{
            //     console.log(error);
            //     this.hideLocate=false;
            //   });
            // }
          },(err)=>{
          console.log(err);
          this.hideLocate=false;
          });
        }else{
          //show alert enable gps
          this.hideLocate=false;
          this.appCom.showAlert(ALL_MESSAGE.ERROR_MESSAGE.GET_LOCATION_COORDS_ERR,"Ok","");  
        }
      },(err)=>{
        console.log(err);
        this.hideLocate=false;
        this.appCom.showAlert(ALL_MESSAGE.ERROR_MESSAGE.GENERIC_LOCATION_ERR,"Ok",""); 
      });
    }


    //CAMERA OR GALLERY SELECTION POP
    openSelectCameraPop(myEvent,photo_source){
      if( this.projData.ProjectPhoto.length > 4 && photo_source == 'project_photo' ){
        this.appCom.showAlert(ALL_MESSAGE.ERROR_MESSAGE.PROJ_PHOTO_LIMIT_REACHED,"Ok","");
        return false;
      }else{
       
      }

      var popover;
      popover = this.popoverCtrl.create(ImageSelectPopPage,{photo_source});
      popover.present({
        ev: myEvent
      });
   
    }

    removeProjectImage(i){
      this.projectPhotoObj.splice(i, 1);
      this.projData.ProjectPhoto.splice(i,1);
    }

    goHome(){
      this.navCtrl.setRoot(HomePage);
    }

    ionViewWillLeave(){
    //this.base64subscription.unsubscribe();
    }



   

 getAddressData(){

  return new Promise((resolve,reject)=>{

     let selectField = " * ";  
      let tableName = " address_master ";
      let where = "";
      let orderBy = "";
      let limit = "";
      let allAddressData=[];
      let postalCodeArr=[];
      let provinceArr=[];
      let municipalityArr=[];
      let subDistrictArr=[];
      this.sqlS.selectTableData(selectField,tableName,where,orderBy,limit).then((ressqlData:any)=>{
         console.log('getOpenTendersData sql ressqlData',ressqlData);
        for(let i=0;i<ressqlData.rows.length;i++){
          let tempObj=ressqlData.rows.item(i);
          allAddressData.push(tempObj);
          postalCodeArr.push(tempObj['postalcode']);
          provinceArr.push(tempObj['province']);
          municipalityArr.push(tempObj['citykabname']);
          subDistrictArr.push(tempObj['subdistrict']);
        }
        this.allAddressDataG =  new Set(allAddressData);
        postalCodeArr = Array.from(new Set(postalCodeArr));
        provinceArr =  Array.from(new Set(provinceArr));
        municipalityArr =  Array.from(new Set(municipalityArr));
        subDistrictArr =  Array.from(new Set(subDistrictArr));

        this.postalCodeArrG=[];
         for(let i=0;i<postalCodeArr.length;i++){
              this.postalCodeArrG.push({
                text:postalCodeArr[i],
                value:postalCodeArr[i]
              });
              
         }

        this.provinceArrG=[];
        for(let j=0;j<provinceArr.length;j++){
          this.provinceArrG.push({
            text:provinceArr[j],
            value:provinceArr[j]
          });
           
        }
        this.municipalityArrG=[];
        for(let k=0;k<municipalityArr.length;k++){
          this.municipalityArrG.push({
            text:municipalityArr[k],
            value:municipalityArr[k]
          });
          
        }  
        this.subDistrictArrG=[];
        for(let l=0;l<subDistrictArr.length;l++){
          this.subDistrictArrG.push({
            text:subDistrictArr[l],
            value:subDistrictArr[l]
          });
           
        }
                           


      resolve(true);  
      },(error)=>{
        console.log(' sql error',error); 
        reject(false);
      });

   });
 }

 addressDataFiltersF(eventD,type){
 
      if(type=="postalcode"){
        // bind - province , citykabname, subdistrict 
        let tempP=null;
        let tempC=null;
        let tempS=null;
        this.provinceArrF=[];
        this.municipalityArrF=[];
        this.subDistrictArrF=[];
        this.postalCodeArrF=[];
        this.allAddressDataG.forEach((value1Data, value2Data, set)=>{
              if(value2Data['postalcode']==eventD && eventD!="" && eventD!=null){
                 
                 
                  this.postalCodeArrF.push({
                    text:value2Data['postalcode'],
                    value:value2Data['postalcode']
                  });
                 
                  this.provinceArrF.push({
                    text:value2Data['province'],
                    value:value2Data['province']
                  });
                  
                  this.municipalityArrF.push({
                    text:value2Data['citykabname'],
                    value:value2Data['citykabname']
                  });
                  this.subDistrictArrF.push({
                    text:value2Data['subdistrict'],
                    value:value2Data['subdistrict']
                  });

                  tempP=value2Data['province'];
                  tempC=value2Data['citykabname'];
                  tempS=value2Data['subdistrict'];
              }

        }); 

        this.municipalityArrF=this.municipalityArrF.uniqueObjects();
        this.subDistrictArrF=this.subDistrictArrF.uniqueObjects();
        this.provinceArrF=this.provinceArrF.uniqueObjects();

        this.pincodeMob.instance.option({
          data: this.postalCodeArrF
        });

        this.ProvinceMob.instance.option({
          data: this.provinceArrF
        });

        this.CityMob.instance.option({
          data: this.municipalityArrF
        });

        this.SubDistrictMob.instance.option({
          data: this.subDistrictArrF
        }); 
        setTimeout(()=>{
            this.ProjectPincode.valueAccessor._instance.setVal(eventD,true);
            this.ProjectProvince.valueAccessor._instance.setVal(tempP,true);
            this.ProjectCity.valueAccessor._instance.setVal(tempC,true);
            this.ProjectSubDistrict.valueAccessor._instance.setVal(tempS,true);
       },10);
        


      }else if(type=="province"){
        // bind -  citykabname, subdistrict
        this.postalCodeArrF=[];
        this.municipalityArrF=[];
        this.subDistrictArrF=[];
        this.allAddressDataG.forEach((value1Data, value2Data, set)=>{
            if(value2Data['province']==eventD && eventD!="" && eventD!=null){
            
              this.municipalityArrF.push({
                    text:value2Data['citykabname'],
                    value:value2Data['citykabname']
              });
              this.subDistrictArrF.push({
                    text:value2Data['subdistrict'],
                    value:value2Data['subdistrict']
              });
               this.postalCodeArrF.push({
                    text:value2Data['postalcode'],
                    value:value2Data['postalcode']
              });
            }
        });

    
          this.municipalityArrF=this.municipalityArrF.uniqueObjects();
          this.subDistrictArrF=this.subDistrictArrF.uniqueObjects();
          this.pincodeMob.instance.option({
            data: this.postalCodeArrF
          });
           
          this.CityMob.instance.option({
            data: this.municipalityArrF
          });
  
          this.SubDistrictMob.instance.option({
            data: this.subDistrictArrF
          }); 
       
      }else if(type=="citykabname"){
          // bind -   subdistrict and Up province
           this.postalCodeArrF=[];
          this.subDistrictArrF=[];
          this.allAddressDataG.forEach((value1Data, value2Data, set)=>{
              if(value2Data['citykabname']==eventD && eventD!="" && eventD!=null){
                    this.subDistrictArrF.push({
                      text:value2Data['subdistrict'],
                      value:value2Data['subdistrict']
                });
                this.postalCodeArrF.push({
                      text:value2Data['postalcode'],
                      value:value2Data['postalcode']
                });
              }
          });
     
          this.subDistrictArrF=this.subDistrictArrF.uniqueObjects();
          this.pincodeMob.instance.option({
            data: this.postalCodeArrF
          });
           
          this.SubDistrictMob.instance.option({
            data: this.subDistrictArrF
          });
         
   
      }else if(type=="subdistrict"){
        // bind -   postalcode and Up citykabname, province

          this.postalCodeArrF=[];
          this.allAddressDataG.forEach((value1Data, value2Data, set)=>{
              if(value2Data['subdistrict']==eventD && eventD!="" && eventD!=null){
                  this.postalCodeArrF.push({
                        text:value2Data['postalcode'],
                        value:value2Data['postalcode']
                  });
              }
          });
          this.pincodeMob.instance.option({
            data: this.postalCodeArrF
          });
      }
  }



addressInitInput(){
  return new Promise((resolve,reject)=>{

        this.postalCodeArrF=[];
        this.postalCodeArrS=[];
        for(let i = 0; i < this.postalCodeArrG.length; i++) {
                this.postalCodeArrF.push({
                      text:this.postalCodeArrG[i].text,
                      value:this.postalCodeArrG[i].value,
                });
                
                  // if(i==50){
                  //   break;
                  // }
        }
        this.pincodeMob.instance.option({
          data: this.postalCodeArrF
        });
        this.provinceArrF=[];
        this.provinceArrS=[];
        for(let i = 0; i < this.provinceArrG.length; i++) {
                this.provinceArrF.push({
                      text:this.provinceArrG[i].text,
                      value:this.provinceArrG[i].value,
                });
                
                  // if(i==50){
                  //    break;
                  // }
        }
        this.ProvinceMob.instance.option({
          data: this.provinceArrF
        });
        this.municipalityArrF=[];
        this.municipalityArrS=[];
        for(let i = 0; i < this.municipalityArrG.length; i++) {
                this.municipalityArrF.push({
                      text:this.municipalityArrG[i].text,
                      value:this.municipalityArrG[i].value,
                });
                
                  // if(i==50){
                  //   break;
                  // }
        }
        this.CityMob.instance.option({
          data: this.municipalityArrF
        });
        this.subDistrictArrF=[];
        this.subDistrictArrS=[];
        for(let i = 0; i < this.subDistrictArrG.length; i++) {
                this.subDistrictArrF.push({
                      text:this.subDistrictArrG[i].text,
                      value:this.subDistrictArrG[i].value,
                 });
                             
                  // if(i==50){
                  //   break;
                  // }
        }  
        this.SubDistrictMob.instance.option({
          data: this.subDistrictArrF
        });                
    
   resolve(resolve);

  });
        

}




  selectProjectStage(projectStage?:any){
      console.log(" selectProjectStage ",projectStage);
      this.projData.ProjectStage = projectStage.project_stage;
      this.projData.ProjectStageId = projectStage.server_id;
  }
  selectProjectType(projectType?:any){
      console.log(" selectProjectType ",projectType);
      this.projData.ProjectType = projectType.project_type;
      this.projData.ProjectTypeId = projectType.server_id;
  }

mobiScrollHpbFilter(serchKey?:any){
			return new Promise((resolve,reject)=>{
            
			  		let query="SELECT * FROM hpb_master WHERE server_hpb_id > 0 AND status = 1 " ;
            if(serchKey){
                if(isNaN(serchKey)){
                    query="SELECT * FROM hpb_master WHERE server_hpb_id > 0 AND status = 1 AND hpb_name LIKE '%"+serchKey+"%' " ;
                }else{
                    query="SELECT * FROM hpb_master WHERE server_hpb_id > 0 AND status = 1 AND primary_mobile_no LIKE '%"+serchKey+"%' " ;
                }
            }
            this.sqlS.queryExecuteSql(query,[]).then((ressqlData) => {
            this.hpbList=[];
            for(let i=0;i<ressqlData.rows.length;i++){
            let tempObj=ressqlData.rows.item(i);
            let displayText = tempObj['hpb_name']+" ("+tempObj['primary_mobile_no']+")";
            this.hpbList.push({
              text:displayText,
              value:tempObj['server_hpb_id']
            });
           }
          console.log("this.hpbList",this.hpbList);

         

          if(serchKey!='' && serchKey!=null){
            this.getHPBOnlineSearch(serchKey).then(()=>{
                  resolve(true);
              },(errorHH)=>{
                  resolve(true);
            });
          }else{
               resolve(true);
          }
          
				},(error)=>{
						reject(error);
						console.log('mobiScrollProductFilter sql error',error); 
					});
			}); 
	} 

getHPBOnlineSearch(serchKey?:any){
  		return new Promise((resolve,reject)=>{
          if(globalInternetCheckConnection){

            let idsExcld = [];
            for(let i=0;i<this.hpbList.length;i++){
              idsExcld.push(this.hpbList[i]['value']);
            }
            let serchLike="%"+serchKey+"%";
            let searchFF={};
            if(isNaN(serchKey)){
                searchFF={hpb_name:{like:serchLike}};
            }else{
                 searchFF={primary_mobile_no:{like:serchLike}};
            }
            let filterH={"limit": 100, "skip": 0,"where":{and:[{hpb_id:{nin:idsExcld}},{status:1},searchFF]}};  
            this.appHpbApi.find(filterH).subscribe((respData:any)=>{
                    console.log('respData',respData);
                    for(let i=0;i<respData.length;i++){
                      let tempObj=respData[i];
                      let displayText = tempObj['hpb_name']+" ("+tempObj['primary_mobile_no']+")";
                      this.hpbList.push({
                        text:displayText,
                        value:tempObj['hpb_id']
                      });
                    }
                     resolve(true);
                },(errorH)=>{
                    console.log('errorH',errorH);
                    resolve(true);
              });
          }else{
                    console.log('No Internet Connection...');
                    resolve(true);
          }
      });
}

}
