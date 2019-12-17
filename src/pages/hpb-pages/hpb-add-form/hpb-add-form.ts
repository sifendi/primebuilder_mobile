
import { DigitalSignCanvasPage } from '../../digital-sign-canvas/digital-sign-canvas';
import { ImageSelectPopPage } from '../../image-select-pop/image-select-pop';
import { ALL_MESSAGE } from '../../../providers/constant';
import { HpbListPage } from "../hpb-list/hpb-list";
import { SqlServices } from '../../../providers/sqlService';
import { ShareService } from '../../../providers/ShareService';
import { appCommonMethods } from '../../../providers/appCommonMethods';
import { Component,ViewChild,ApplicationRef } from '@angular/core';
import { Events, NavController, NavParams, PopoverController, ModalController, Platform } from 'ionic-angular';
import { NgForm, NgModel,NgControl } from "@angular/forms";
import {Subscription} from 'rxjs';
import { SyncServices } from '../../../providers/syncServices';
import { App_hpbApi } from "../../../shared/loopback_sdk/index";

import * as moment from 'moment';
import   async  from 'async';


declare var cordova;
declare var debugDataCustom;
declare var sessionUserGlobalData;
declare var globalInternetCheckConnection;
declare var pleaseWaitTxtTransl,mobisPlaceHolderWaitTxtTransl,filterEmptyText,filterPlaceholderText,mobisBtnArr;

@Component({
  selector: 'hpb-add-form',
  templateUrl: 'hpb-add-form.html',
})
export class addHpbFormPage {
 
  //HPB DATA OBJECT
  HpbData:any={
    HpbId:null,
    HpbType:null,
    HpbName:null,
    HpbProfilePic:null,
    MobileNo_1:null,
    MobileNo_2:null,
    HpbEmail:null,
    PlaceOfBirth:null,
    DateOfBirth:null,
    IdCardNumber:null,
    IdPhoto:[],
    IdCardAddress :null,
    IdCardProvince:null,
    IdCardCity:null,
    IdCardSubDistrict:null,
    IdCardPincode:null,
    DomicileSameAsIdCard:null,
    DomicileAddress:null,
    DomicileProvince:null,
    DomicileCity:null,
    DomicileSubDistrict:null,
    DomicilePincode:null,
    CompanyName:null,
    CompanyRepresentativeName:null,
    CompanyDesignation:null,
    HpbStatus:null,
    HpbDigitalSign:null,
    AdditionalComments:null,
    latitude:null,
    longitude:null,
    MobApprovalStatus:null,
    MobApprovalReason:null,
    IdApprovalStatus:null,
    IdApprovalReason:null
  };

   oldHpbData:any=[];
   showLocateBtn:boolean=false;
   check:any=false;
   submitted:boolean= false;
   busy:  any;
   busy1: any;
   busyMessage:any="Please Wait...";
   hideLocate:any=false;
   Action:boolean=true;

   @ViewChild('DateOfBirth') DateOfBirth: any; 
   @ViewChild('DateOfBirthMob') DateOfBirthMob: any; 
   @ViewChild('HpbType') HpbType: any; 
   @ViewChild('HpbName') HpbName: any; 
   @ViewChild('IdCardNumber') IdCardNumber: any;  
   @ViewChild('IdCardAddress') IdCardAddress: any;  
   @ViewChild('IdCardProvince') IdCardProvince: any; 
   @ViewChild('IdCardProvinceM') IdCardProvinceM: any; 
   @ViewChild('IdCardCity') IdCardCity: any;
   @ViewChild('IdCardSubDistrict') IdCardSubDistrict: any; 
   @ViewChild('IdCardPincode') IdCardPincode: any; 
   @ViewChild('IdCardPincodeM') IdCardPincodeM: any; 
   @ViewChild('DomicileSameAsIdCard') DomicileSameAsIdCard: any;
   @ViewChild('DomicileAddress') DomicileAddress: any;  
   @ViewChild('DomicileProvince') DomicileProvince: any; 
   @ViewChild('DomicileCity') DomicileCity: any;
   @ViewChild('DomicileSubDistrict') DomicileSubDistrict: any; 
   @ViewChild('DomicilePincode') DomicilePincode: any;

   @ViewChild('MobileNo_1') MobileNo_1: any; 
   @ViewChild('MobileNo_2') MobileNo_2: any; 
   @ViewChild('HpbEmail') HpbEmail: any; 
   @ViewChild('PlaceOfBirth') PlaceOfBirth: any; 
   @ViewChild('CompanyName') CompanyName: any; 
   @ViewChild('CompanyRepresentativeName') CompanyRepresentativeName: any; 
   @ViewChild('CompanyDesignation') CompanyDesignation: any;  
   @ViewChild('HpbStatus') HpbStatus: any; 
   @ViewChild('AdditionalComments') AdditionalComments: any;

   @ViewChild('pincodeMob') pincodeMob: any;  
   @ViewChild('IdCardProvinceMob') IdCardProvinceMob: any;  
   @ViewChild('IdCardCityMob') IdCardCityMob: any;  
   @ViewChild('IdCardSubDistrictMob') IdCardSubDistrictMob: any;   
  
   @ViewChild('DomicilePincodeMob') DomicilePincodeMob: any;  
   @ViewChild('DomicileProvinceMob') DomicileProvinceMob: any;  
   @ViewChild('DomicileCityMob') DomicileCityMob: any;  
   @ViewChild('DomicileSubDistrictMob') DomicileSubDistrictMob: any; 

  MaxDate:any;
  MinDate:any;
  pageTitle:any;
  disableDomicileAddrFlag:any=0;
  profimagePath:any="assets/img/user_create.png";
  digitalSignPath:any;
  idCardPhotoObj:any=[];
   

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

  IdCardProvinceDFlag:boolean=false;
 
  dateSettingsG:any={
    theme: 'material',
    display: 'center',
     dateFormat:'dd/mm/yy'
  };

 /* F Address Mater : Start */

  mobiScollIdCardProvinceSettings:any = {
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
        this.HpbData.IdCardCity=null;
        this.HpbData.IdCardSubDistrict=null;
        this.HpbData.IdCardPincode=null;
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

  mobiScollIdCardCitySettings:any = {
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
        this.HpbData.IdCardSubDistrict=null;
        this.HpbData.IdCardPincode=null;
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
      //                     break;
      //                   }
      //             }else if(currData.value.toString().toLowerCase().includes(query.toString().toLowerCase())) {
      //                    this.municipalityArrF.push({
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

  mobiScollIdCardSubDistrictSettings:any = {
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
        this.HpbData.IdCardPincode=null;
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
      //                     break;
      //                   }
      //             }else if(currData.value.toString().toLowerCase().includes(query.toString().toLowerCase())) {
      //                    this.subDistrictArrF.push({
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

   mobiScollIdCardPincodeSettings:any = {
      inputClass: 'text-input',
      theme: 'material',
      showOnFocus: true,
      group: false,
      filter: true,
      rows:8,
      data:[],
      readonly:false,
      buttons:mobisBtnArr,
      onClear: (event, inst)=>{
          this.HpbData.IdCardProvince=null;
          this.HpbData.IdCardCity=null;
          this.HpbData.IdCardSubDistrict=null;
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
                     this.IdCardProvinceMob.instance.option({
                      data: this.provinceArrF
                    });

      },
      onSet: (event, inst)=> {
        if(event.valueText){
          this.addressDataFiltersF(event.valueText,'postalcode');
        }else{

        }
              
            //  if(this.DomicileSameAsIdCard){
            //         // setTimeout(()=>{
            //         //      this.copyAddress();
            //         // },100);
            //  }
             
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
      //                     break;
      //                   }
      //             }else if(currData.value.toString().toLowerCase().includes(query.toString().toLowerCase())) {
      //                    this.postalCodeArrF.push({
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

 /* F Address Mater : End */


 /* D Address Mater : Start */

   mobiScollDomicileProvinceSettings:any = {
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
        this.HpbData.DomicileCity=null;
        this.HpbData.DomicileSubDistrict=null;
        this.HpbData.DomicilePincode=null;
        
      },
      onSet: (event, inst)=> {
        if(event.valueText){
          this.addressDataFiltersS(event.valueText,'province');
        }else{

        }
              
      },
      // onFilter: (event, inst)=> {
      //   let filtered : any[] = [];
      //   let query = event.filterText;
      //   this.provinceArrS=[];
      //    for(let i = 0; i < this.provinceArrG.length; i++) {
      //             let currData = this.provinceArrG[i];
      //             if(query=='' || query==null){
      //                     this.provinceArrS.push({
      //                       text:currData.text,
      //                       value:currData.value,
      //                     });
      //                   if(i==50){
      //                     break;
      //                   }
      //             }else if(currData.value.toString().toLowerCase().includes(query.toString().toLowerCase())) {
      //                    this.provinceArrS.push({
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

  mobiScollDomicileCitySettings:any = {
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
        this.HpbData.DomicileSubDistrict=null;
        this.HpbData.DomicilePincode=null;
      },
      onSet: (event, inst)=> {
        if(event.valueText){
          this.addressDataFiltersS(event.valueText,'citykabname');
        }else{

        }
              
      },
      // onFilter: (event, inst)=> {
      //   console.log('onFilter ',event);
      //   let filtered : any[] = [];
      //   let query = event.filterText;
      //   this.municipalityArrS=[];
      //    for(let i = 0; i < this.municipalityArrG.length; i++) {
      //             let currData = this.municipalityArrG[i];
      //             if(query=='' || query==null){
      //                     this.municipalityArrS.push({
      //                       text:currData.text,
      //                       value:currData.value,
      //                     });
      //                   if(i==50){
      //                     break;
      //                   }
      //             }else if(currData.value.toString().toLowerCase().includes(query.toString().toLowerCase())) {
      //                    this.municipalityArrS.push({
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

  mobiScollDomicileSubDistrictSettings:any = {
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
        this.HpbData.DomicilePincode=null;
      },
      onSet: (event, inst)=> {
        if(event.valueText){
          this.addressDataFiltersS(event.valueText,'subdistrict');
        }else{

        }
              
      },
      // onFilter: (event, inst)=> {
      //   console.log('onFilter ',event);
      //   let filtered : any[] = [];
      //   let query = event.filterText;
      //   this.subDistrictArrS=[];
      //    for(let i = 0; i < this.subDistrictArrG.length; i++) {
      //             let currData = this.subDistrictArrG[i];
      //             if(query=='' || query==null){
      //                     this.subDistrictArrS.push({
      //                       text:currData.text,
      //                       value:currData.value,
      //                     });
      //                   if(i==50){
      //                     break;
      //                   }
      //             }else if(currData.value.toString().toLowerCase().includes(query.toString().toLowerCase())) {
      //                    this.subDistrictArrS.push({
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

   mobiScollDomicilePincodeSettings:any = {
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
          this.HpbData.DomicileProvince=null;
          this.HpbData.DomicileCity=null;
          this.HpbData.DomicileSubDistrict=null;
                     this.postalCodeArrS=[];
                     for(let i = 0; i < this.postalCodeArrG.length; i++) {
                        this.postalCodeArrS.push({
                              text:this.postalCodeArrG[i].text,
                              value:this.postalCodeArrG[i].value,
                            });
                          // if(i==50){
                          //   break;
                          // }
                     }
                     this.DomicilePincodeMob.instance.option({
                      data: this.postalCodeArrS
                    });
                     this.provinceArrS=[];
                     for(let i = 0; i < this.provinceArrG.length; i++) {
                        this.provinceArrS.push({
                              text:this.provinceArrG[i].text,
                              value:this.provinceArrG[i].value,
                            });
                          // if(i==50){
                          //   break;
                          // }
                     }
                     this.DomicileProvinceMob.instance.option({
                      data: this.provinceArrS
                    });
      },
      onSet: (event, inst)=> {
        if(event.valueText){
          this.addressDataFiltersS(event.valueText,'postalcode');
        }else{

        }
              
      },
      // onFilter: (event, inst)=> {
      //   console.log('onFilter ',event);
      //   let filtered : any[] = [];
      //   let query = event.filterText;
      //   this.postalCodeArrS=[];
      //    for(let i = 0; i < this.postalCodeArrG.length; i++) {
      //             let currData = this.postalCodeArrG[i];
      //             if(query=='' || query==null){
      //                     this.postalCodeArrS.push({
      //                       text:currData.text,
      //                       value:currData.value,
      //                     });
      //                   if(i==50){
      //                     break;
      //                   }
      //             }else if(currData.value.toString().toLowerCase().includes(query.toString().toLowerCase())) {
      //                    this.postalCodeArrS.push({
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
 /* S Address Mater : End */

 
  userId:any="";
  internetStatus:any;
  updateFlag:boolean=false;
  constructor(private syncS:SyncServices,public navCtrl: NavController, public navParams: NavParams,public popoverCtrl: PopoverController,public appCom:appCommonMethods,public events:Events,public modalCtrl: ModalController,public shareS:ShareService,public sqlS: SqlServices, public platform: Platform,private app_hpbApi:App_hpbApi,public appliRef:ApplicationRef) {
    this.Action = true;
    this.MaxDate=moment().subtract(15,'years').format();
    this.MinDate=moment().subtract(99,'years').format();
    this.pageTitle="Add DPB";
    this.userId=sessionUserGlobalData['userId'];
  }

  async ionViewDidLoad() {
      this.Action = true;
      //mobi scroll placeholder translations
      let MobiProps=this.mobiScollIdCardPincodeSettings;
      MobiProps['placeholder']= await this.appCom.getTranslatedTxt("Please select");
      this.mobiScollIdCardPincodeSettings=MobiProps;
      this.pincodeMob.instance.option(MobiProps);

      let MobiProps1=this.mobiScollIdCardProvinceSettings;
      MobiProps1['placeholder']= await this.appCom.getTranslatedTxt("Please select");
      this.mobiScollIdCardProvinceSettings=MobiProps1;
      this.IdCardProvinceMob.instance.option(MobiProps1);

      let MobiProps2=this.mobiScollIdCardCitySettings;
      MobiProps2['placeholder']= await this.appCom.getTranslatedTxt("Please select");
      this.mobiScollIdCardCitySettings=MobiProps2;
      this.IdCardCityMob.instance.option(MobiProps2);

      let MobiProps3=this.mobiScollIdCardSubDistrictSettings;
      MobiProps3['placeholder']= await this.appCom.getTranslatedTxt("Please select");
      this.mobiScollIdCardSubDistrictSettings=MobiProps3;
      this.IdCardSubDistrictMob.instance.option(MobiProps3);

      let MobiProps4=this.mobiScollDomicilePincodeSettings;
      MobiProps4['placeholder']= await this.appCom.getTranslatedTxt("Please select");
      this.mobiScollDomicilePincodeSettings=MobiProps4;
      this.DomicilePincodeMob.instance.option(MobiProps4);

      let MobiProps5=this.mobiScollDomicileProvinceSettings;
      MobiProps5['placeholder']= await this.appCom.getTranslatedTxt("Please select");
      this.mobiScollDomicileProvinceSettings=MobiProps5;
      this.DomicileProvinceMob.instance.option(MobiProps5);

      let MobiProps6=this.mobiScollDomicileCitySettings;
      MobiProps6['placeholder']= await this.appCom.getTranslatedTxt("Please select");
      this.mobiScollDomicileCitySettings=MobiProps6;
      this.DomicileCityMob.instance.option(MobiProps6);

      let MobiProps7=this.mobiScollDomicileSubDistrictSettings;
      MobiProps7['placeholder']= await this.appCom.getTranslatedTxt("Please select");
      this.mobiScollDomicileSubDistrictSettings=MobiProps7;
      this.DomicileSubDistrictMob.instance.option(MobiProps7);


      console.log('ionViewDidLoad addHpbFormPage');
      console.log("globalInternetCheckConnection",globalInternetCheckConnection); 
      this.showLocateBtn=globalInternetCheckConnection;
   

     let action = this.navParams.get("action"); 
      console.log("action",action);
      if( action == 'edit' || action == 'hpbSpecific' ){
      //TREAT THIS PAGE AS EDIT HPB
      
      this.pageTitle="EDIT HPB";
      this.updateFlag=true;

      this.Action = true; //to hide/show approval status.
     
      let insertData = [];
      insertData = this.navParams.get("hpbData"); 
      

      //FETCH DATA FROM DATABASE USING HPB ID..
      var selectField = " * ";
      var tablename = "hpb_master";
      var where = " `hpb_id` = "+insertData['hpb_id'];
      this.sqlS.selectTableData(selectField,tablename,where,"","").then((data) => {
          console.log('data fetched', data);
          for(let i=0;i<data['rows'].length;i++){       
              insertData = ( data['rows'].item(i) );                
          }
            
      console.log("insertData--check insert data->",insertData);
      //PREFILL ALL FORM VALUES HERE    
    
      
      this.HpbData['HpbId']=insertData['hpb_id'];
      this.HpbData['ServerHpbId']=insertData['server_hpb_id']; //storing hpb server id.
      this.HpbData['HpbType']=insertData['hpb_type'] ;
      this.HpbData['HpbName']=insertData['hpb_name'];
      
      console.log("insertData['hpb_profile_pic']---------->",insertData['hpb_profile_pic']);
      console.log("insertData['hpb_digital_sign']---------->",insertData['hpb_digital_sign']);

      let dp =[];
      dp=JSON.parse(insertData['hpb_profile_pic']);     
      this.HpbData['HpbProfilePic']=dp;
      if(dp['length']>0){
        //this.profimagePath= this.appCom.urlSanitizer(dp[0]['path']);
        this.profimagePath= this.appCom.getImageLocalPathFull(dp[0]);
      }
      
      // this.HpbData['HpbProfilePic']=(insertData['hpb_profile_pic'].changingThisBreaksApplicationSecurity) ;
      // this.profimagePath=  insertData['hpb_profile_pic'];
        console.log(" this.HpbData['HpbProfilePic']**", this.HpbData['HpbProfilePic']);

      

      this.HpbData['MobileNo_2']=insertData['secondary_mobile_no'];
      this.HpbData['HpbEmail']=insertData['hpb_email'];
      this.HpbData['DateOfBirth']=insertData['date_of_birth']>0?this.appCom.timeStampToDateMMMnewM((insertData['date_of_birth'])):null;
      this.HpbData['PlaceOfBirth']=insertData['place_of_birth']; 
       

     
      var idPhoto = JSON.parse(insertData['id_photo']);     
      this.HpbData['IdPhoto']=idPhoto;
      if( idPhoto !=undefined && idPhoto !=''  ){
        this.idCardPhotoObj=[];
        for( var i=0;i<idPhoto.length;i++ ){
              //this.idCardPhotoObj.push(  this.appCom.urlSanitizer(idPhoto[i]['path']) );
              this.idCardPhotoObj.push(  this.appCom.getImageLocalPathFull(idPhoto[i]) );  
        }
      }


      this.HpbData['IdCardAddress']=insertData['id_card_address'];
      this.HpbData['IdCardProvince']=insertData['id_card_province'];
      this.HpbData['IdCardCity']=insertData['id_card_city'];
      this.HpbData['IdCardSubDistrict']=insertData['id_card_sub_district'];
      this.HpbData['IdCardPincode']=insertData['id_card_pincode'];
      this.HpbData['DomicileSameAsIdCard']=(insertData['domicile_same_as_id_card'] == 1) ? true:false;
      if( this.HpbData['DomicileSameAsIdCard'] ){
        this.disableDomicileAddrFlag=1;
      }else{
        this.disableDomicileAddrFlag=0;
      }

      this.HpbData['DomicileAddress']=insertData['domicile_address'];
      this.HpbData['DomicileProvince']=insertData['domicile_province'];
      this.HpbData['DomicileCity']=insertData['domicile_city'];
      this.HpbData['DomicileSubDistrict']=insertData['domicile_sub_district'];
      this.HpbData['DomicilePincode']=insertData['domicile_pincode'];
      this.HpbData['CompanyName']=insertData['company_name'];
      this.HpbData['CompanyRepresentativeName']=insertData['company_representative_name'];
      this.HpbData['CompanyDesignation']=insertData['company_designation'];
      this.HpbData['HpbStatus']=insertData['hpb_status'];

     
      // this.HpbData['HpbDigitalSign']=insertData['hpb_digital_sign'].changingThisBreaksApplicationSecurity;
      // if( this.HpbData['HpbDigitalSign'] !=undefined && this.HpbData['HpbDigitalSign'] !=""  ){

      // }else{
      //  this.HpbData['HpbDigitalSign']=insertData['hpb_digital_sign'];  
      // }
      // this.digitalSignPath=insertData['hpb_digital_sign'];
      console.log("insertData['hpb_digital_sign']",insertData['hpb_digital_sign']);
      let ds=[];
      ds=JSON.parse(insertData['hpb_digital_sign']);     
      this.HpbData['HpbDigitalSign']=ds;
      if( this.HpbData['HpbDigitalSign'] !=undefined && this.HpbData['HpbDigitalSign'] !=""  ){
          //this.digitalSignPath= this.appCom.urlSanitizer(ds[0]['path']) ;
          this.digitalSignPath= this.appCom.getImageLocalPathFull(ds[0]) ;
      }else{
      //this.HpbData['HpbDigitalSign']=insertData['hpb_digital_sign'];  

      }
     

     this.HpbData['AdditionalComments']=insertData['additional_comments'];
 
      console.log("approval status query start");

      var hpbApprovalQuery = "select * from hpb_update_approval where server_hpb_id="+insertData['server_hpb_id']+" and is_closed = 0";
      console.log("hpbApprovalQuery=>",hpbApprovalQuery);
      
      this.busy = this.sqlS.selectTableQueryData(hpbApprovalQuery,[]).then((data)=>{
        console.log("hpbApprovalQuery result length=>",data.rows.length);

        if(data && data.rows.length>0){
           
          this.HpbData['MobApprovalStatus'] = 1;
          this.HpbData['MobApprovalReason'] = '';
          this.HpbData['IdApprovalStatus'] = 1;
          this.HpbData['IdApprovalReason'] = '';
          this.HpbData['IdCardNumber']=insertData['id_card_number'];
          this.HpbData['MobileNo_1']=insertData['primary_mobile_no'];
          this.oldHpbData['MobileNo_1']=insertData['primary_mobile_no']; //storing old hpb mobile no.
          this.oldHpbData['IdCardNumber']=insertData['id_card_number']; //storing old hpb id card no.
          
          for(let i = 0;i<data.rows.length;i++){

            if(data.rows.item(i).field_name=='Mobile'){

              this.HpbData['MobApprovalStatus'] = data.rows.item(i).approval_status;
              this.HpbData['MobApprovalReason'] = data.rows.item(i).reason;
              if(this.HpbData['MobApprovalStatus']==-1){
                this.HpbData['MobileNo_1']=data.rows.item(i).field_old_value;
                this.oldHpbData['MobileNo_1']=data.rows.item(i).field_old_value; //storing old hpb mobile no.
              }else{
                this.HpbData['MobileNo_1']=data.rows.item(i).field_new_value;
                this.oldHpbData['MobileNo_1']=data.rows.item(i).field_new_value;
              }

            }else if(data.rows.item(i).field_name=='Card Number'){

              this.HpbData['IdApprovalStatus'] = data.rows.item(i).approval_status;
              this.HpbData['IdApprovalReason'] = data.rows.item(i).reason;
              if(this.HpbData['IdApprovalStatus']==-1){
                this.HpbData['IdCardNumber']=data.rows.item(i).field_old_value;
                this.oldHpbData['IdCardNumber']=data.rows.item(i).field_old_value;
              }else{
                this.HpbData['IdCardNumber']=data.rows.item(i).field_new_value;
                this.oldHpbData['IdCardNumber']=data.rows.item(i).field_new_value;
              }

            }
          }

        }else{

          this.HpbData['MobApprovalStatus'] = 1;
          this.HpbData['MobApprovalReason'] = '';
          this.HpbData['IdApprovalStatus'] = 1;
          this.HpbData['IdApprovalReason'] = '';
          this.HpbData['IdCardNumber']=insertData['id_card_number'];
          this.HpbData['MobileNo_1']=insertData['primary_mobile_no'];
          this.oldHpbData['MobileNo_1']=insertData['primary_mobile_no']; //storing old hpb mobile no.
          this.oldHpbData['IdCardNumber']=insertData['id_card_number']; //storing old hpb id card no.
          

        }
      });

      //show the approval status div.
      this.Action = false
     

      console.log("HpbData",this.HpbData);
      
      }, (error) => {
      console.log('Error', error);

      });


        
          // let tempDateS=this.dateSettingsG;
         // tempDateS['max']=new Date(moment().subtract(1,'days').format());
          // tempDateS['max']=new Date(moment().subtract(18,'years').format());
          // this.dateSettingsG=tempDateS;
          // this.DateOfBirthMob.instance.option(tempDateS);
      }else{
      //TREAT THIS PAGE AS ADD HPB
        this.pageTitle="ADD HPB";
        // let tempDateS=this.dateSettingsG;
        // tempDateS['max']=new Date(moment().subtract(18,'years').format());
        // this.dateSettingsG=tempDateS;
        // this.DateOfBirthMob.instance.option(tempDateS);
      }
      

      //SUBSCRIPTION FOR CAMERA OR GALLERY PHOTO CAPTURED..
      this.events.unsubscribe("getbase64Image");  
      this.events.subscribe('getbase64Image',(base64ImgOBJ) => {
   
          let base64Image =  base64ImgOBJ.base64Image;
          let extType=".jpeg";
          var filename = this.appCom.generateRandomString()+extType;

          this.appCom.savebase64AsImageFile(filename,base64Image,extType).then((path)=>{
              
                if( base64ImgOBJ.photo_source == "profile_pic" ){
                  //IF PROFILE PICTURE
                  //this.HpbData.HpbProfilePic=path;
                  this.profimagePath = this.appCom.urlSanitizer(path);
                  let t ={};
                  t['path']=path;
                  t['name']=filename;
                  t['fileType']="jpeg";
                  t['serverPath']="";
                  t['sync_status']=0;
                  t['container']="profile";
                  let tArr=[];
                  tArr.push(t);
                  this.HpbData.HpbProfilePic=(tArr);


                }else if( base64ImgOBJ.photo_source == "id_card_photo" ){
                  //IF ID CARD MULTIPLE PICS
                  //this.HpbData.IdPhoto.push(path);
                  this.idCardPhotoObj.push(this.appCom.urlSanitizer(path));
                  let t ={};
                  t['path']=path;
                  t['name']=filename;
                  t['fileType']="jpeg";
                  t['serverPath']="";
                  t['sync_status']=0; 
                  t['container']="doc";
                  //let tArr=[];
                  //tArr.push(t);
                  this.HpbData.IdPhoto.push(t);



                }else if( base64ImgOBJ.photo_source =="digital_sign" ){
                  //IF DIGITAL SIGN PICTURE
                  this.HpbData.HpbDigitalSign=path;
                  this.digitalSignPath=this.appCom.urlSanitizer(path);
                  let t ={};
                  t['path']=path;
                  t['name']=filename;
                  t['fileType']="jpeg";
                  t['sync_status']=0;
                  t['serverPath']="";
                  t['container']="doc";
                  let tArr=[];
                  tArr.push(t);
                  this.HpbData.HpbDigitalSign=(tArr);
                } 
                //console.log("this.idCardPhotoObj",this.idCardPhotoObj);

             
              
              },(error)=>{
                console.log(error);
              }

          );

      }); 


        this.busy=this.getAddressData().then((response)=>{
              this.busy=this.addressInitInput().then(()=>{
                      console.log('this.HpbData.IdCardPincode',this.HpbData.IdCardPincode);
                      if(this.HpbData.IdCardPincode && this.HpbData.IdCardPincode!=''){
                          this.addressDataFiltersF(this.HpbData.IdCardPincode,'postalcode');
                      }
                      if(this.HpbData.DomicilePincode && this.HpbData.DomicilePincode!=''){
                          this.addressDataFiltersS(this.HpbData.DomicilePincode,'postalcode');
                      }

                },()=>{
                  
                });
            
          },()=>{

        });


  }

  async ionViewDidEnter() {
     this.busyMessage = await this.appCom.getTranslatedTxt("Please wait...");   
  }


  ionViewDidLeave(){
      // console.log("leave page");
      // var b=  this.events.unsubscribe("getbase64Image");  
      // console.log("unsubscribed",b);
     // this.appliRef.tick();
  }

  //SUBMIT HPB DATA FORM
  submitHpbForm(){
    
    let previousView = this.navCtrl.getPrevious();

    this.submitted=true; 
    let isvalid = false;
    if( this.check == false ){

      

    this.internetStatus=this.shareS.getshareData('netConnection'); 
                                     
        if( this.HpbType.valid &&  this.HpbData.HpbType == "contractor" ){
                isvalid = this.HpbName.valid && this.IdCardNumber.valid && this.IdCardAddress.valid &&
                      this.IdCardProvince.valid && this.IdCardCity.valid && this.IdCardSubDistrict.valid && this.IdCardPincode.valid &&   
                      this.MobileNo_1.valid && this.MobileNo_2.valid  && this.PlaceOfBirth.valid && this.PlaceOfBirth.value.trim() != "" && this.PlaceOfBirth.value.trim() != null && this.PlaceOfBirth.value.trim() != undefined  && this.DateOfBirth.valid 
                      && this.CompanyName.valid && this.CompanyRepresentativeName.valid && this.CompanyDesignation.valid &&
                      this.HpbStatus.valid  && this.profimagePath != 'assets/img/user_create.png' && this.profimagePath !=''&& this.digitalSignPath !='' && this.digitalSignPath !=undefined  
                      && this.idCardPhotoObj !=undefined && this.idCardPhotoObj !="" && this.MobileNo_1.value != this.MobileNo_2.value
                      && this.HpbName.value != undefined && this.HpbName.value != "" && this.HpbName.value.trim() != undefined && this.HpbName.value.trim() != ""
                      && this.CompanyName.value != undefined && this.CompanyName.value != "" && this.CompanyName.value.trim() != undefined && this.CompanyName.value.trim() != ""
                      && this.CompanyRepresentativeName.value != undefined && this.CompanyRepresentativeName.value != "" && this.CompanyRepresentativeName.value.trim() != undefined && this.CompanyRepresentativeName.value.trim() != ""
                      && this.IdCardAddress.value != undefined && this.IdCardAddress.value != "" && this.IdCardAddress.value.trim() != undefined && this.IdCardAddress.value.trim() != "" 
                      ;

                if( this.HpbEmail.value != undefined && this.HpbEmail.value != '' && this.HpbEmail.value.trim() != '' ){
                       isvalid = isvalid && this.HpbEmail.valid ;                     
                }else{

                }      
                     
                if( this.disableDomicileAddrFlag && isvalid ){
                  isvalid = true;  
                }else if( isvalid ){
                  isvalid = isvalid && this.DomicileAddress.valid && this.DomicileProvince.valid && this.DomicileCity.valid && this.DomicileSubDistrict.valid && this.DomicilePincode.valid; 
                }


        }else if( this.HpbType.valid &&  this.HpbData.HpbType == "mason" ){
                isvalid = this.HpbName.valid && this.IdCardNumber.valid && this.IdCardAddress.valid &&
                      this.IdCardProvince.valid && this.IdCardCity.valid && this.IdCardSubDistrict.valid && this.IdCardPincode.valid &&   
                      this.MobileNo_1.valid && this.MobileNo_2.valid  && this.PlaceOfBirth.valid && this.PlaceOfBirth.value.trim() != "" && this.PlaceOfBirth.value.trim() != null && this.PlaceOfBirth.value.trim() != undefined && this.DateOfBirth.valid &&
                      this.HpbStatus.valid && this.profimagePath != 'assets/img/user_create.png' && this.profimagePath !='' && this.digitalSignPath !='' && this.digitalSignPath !=undefined
                      && this.idCardPhotoObj !=undefined && this.idCardPhotoObj !="" && this.MobileNo_1.value != this.MobileNo_2.value   
                      && this.HpbName.value != undefined && this.HpbName.value != "" && this.HpbName.value.trim() != undefined && this.HpbName.value.trim() != ""
                      && this.IdCardAddress.value != undefined && this.IdCardAddress.value != "" && this.IdCardAddress.value.trim() != undefined && this.IdCardAddress.value.trim() != "" 
                      ;
                
                if( this.HpbEmail.value != undefined && this.HpbEmail.value != '' && this.HpbEmail.value.trim() != '' ){
                       isvalid = isvalid && this.HpbEmail.valid ;                     
                }else{

                }   
                      
                if( this.disableDomicileAddrFlag && isvalid ){
                  isvalid = true;  
                }else if( isvalid ){
                  isvalid = isvalid && this.DomicileAddress.valid && this.DomicileProvince.valid && this.DomicileCity.valid && this.DomicileSubDistrict.valid && this.DomicilePincode.valid; 
                }      

        }else{
          //invalid
          console.log("//invalid");
          
        }
                                                                    
        if(isvalid){
     
            console.log("valid");
            console.log(this.HpbData);                                         
            //SAVE HPB TO DATABASE
            let insertData = {};
            insertData['hpb_type']=this.HpbData['HpbType'];
            insertData['hpb_name']=this.HpbData['HpbName'].trim();
            insertData['hpb_profile_pic']=JSON.stringify(this.HpbData['HpbProfilePic']);
            insertData['secondary_mobile_no']=this.HpbData['MobileNo_2'];
            insertData['hpb_email']=this.HpbData['HpbEmail'];
            insertData['place_of_birth']=this.HpbData['PlaceOfBirth'];
            insertData['date_of_birth']= this.appCom.dateToTimeStamp(this.HpbData['DateOfBirth']);
                     
            if(this.HpbData.IdPhoto != undefined && this.HpbData.IdPhoto != ''){
              insertData['id_photo']= JSON.stringify( this.HpbData.IdPhoto ); 
            }else{
              insertData['id_photo']=''; 
            }
            insertData['id_card_address']=this.HpbData['IdCardAddress'].trim();
            insertData['id_card_province']=this.HpbData['IdCardProvince'];
            insertData['id_card_city']=this.HpbData['IdCardCity'];
            insertData['id_card_sub_district']=this.HpbData['IdCardSubDistrict'];
            insertData['id_card_pincode']=this.HpbData['IdCardPincode'];
            insertData['domicile_same_as_id_card']=(this.HpbData['DomicileSameAsIdCard']) ? 1 : 0;
            insertData['domicile_address']=this.HpbData['DomicileAddress'].trim();
            insertData['domicile_province']=this.HpbData['DomicileProvince'];
            insertData['domicile_city']=this.HpbData['DomicileCity'];
            insertData['domicile_sub_district']=this.HpbData['DomicileSubDistrict'];
            insertData['domicile_pincode']=this.HpbData['DomicilePincode'];
            
            if( this.HpbData['CompanyName'] != undefined && this.HpbData['CompanyName'] != '' ){
            insertData['company_name']=this.HpbData['CompanyName'].trim();
            }
            if( this.HpbData['CompanyRepresentativeName'] != undefined && this.HpbData['CompanyRepresentativeName'] != '' ){
            insertData['company_representative_name']=this.HpbData['CompanyRepresentativeName'].trim();
            }
            if( this.HpbData['CompanyDesignation'] != undefined && this.HpbData['CompanyDesignation'] != '' ){
            insertData['company_designation']=this.HpbData['CompanyDesignation'].trim();
            }

            insertData['hpb_status']=this.HpbData['HpbStatus'];
            insertData['hpb_digital_sign']=JSON.stringify(this.HpbData['HpbDigitalSign']);

            if( this.HpbData['AdditionalComments'] != undefined && this.HpbData['AdditionalComments'] != '' ){
            insertData['additional_comments']=this.HpbData['AdditionalComments'].trim();
            }
           
                                                        
            insertData['created_by']=this.userId;
           
            insertData['generated_by']=sessionUserGlobalData['userIdG']?sessionUserGlobalData['userIdG']:this.userId;
            insertData['updated_by']=sessionUserGlobalData['userIdG']?sessionUserGlobalData['userIdG']:this.userId;  


            insertData['assigned_to']=this.userId;
            insertData['sync_status']=0;


            console.log("before update",insertData);
            this.check = false;   
            if( parseInt(this.HpbData['HpbId']) >0){
              
              console.log("editing hpb details");

              let approval_tbl_data = {};
              let dataArr = [];
              approval_tbl_data['server_hpb_id'] = this.HpbData['ServerHpbId'];
              approval_tbl_data['approval_status'] = 0;
              approval_tbl_data['reason'] = '';
              approval_tbl_data['local_created_date'] = Date.now();
              approval_tbl_data['local_updated_date'] = Date.now();
              approval_tbl_data['created_by'] = insertData['created_by'];
              approval_tbl_data['updated_by'] = insertData['updated_by'];
              approval_tbl_data['sync_status'] = 0;

              console.log("object for the hpb upadte approval tbl=>",approval_tbl_data);

              if( this.oldHpbData['MobileNo_1'] != this.HpbData['MobileNo_1'] || this.oldHpbData['IdCardNumber']!=this.HpbData['IdCardNumber'] ){

                  //check for valid primary mobile number..
                  let selectField = "  `primary_mobile_no`,`id_card_number` ";
                  let where =" 1=1";
                  let checkApprovaltbl = "";
                  let tablename = "hpb_master";
                  let approval_tbl = "hpb_update_approval";
                  let dualCondtnFlag = false;
                  let dualCondtnObj = {};

                  if((this.HpbData['MobApprovalStatus']!=0 && this.oldHpbData['MobileNo_1'] != this.HpbData['MobileNo_1']) && (this.HpbData['IdApprovalStatus']!=0 && this.oldHpbData['IdCardNumber']!=this.HpbData['IdCardNumber'])){
                    
                    dualCondtnFlag = true;
                    dualCondtnObj['primary_mobile_no'] = this.MobileNo_1.value;
                    dualCondtnObj['id_card_number'] = this.IdCardNumber.value;
                    where +=" and (`primary_mobile_no` ='"+this.MobileNo_1.value+"' or `id_card_number` = '"+this.IdCardNumber.value+"') and hpb_id!="+this.HpbData['HpbId'];
                    checkApprovaltbl = "select server_hpb_id from hpb_update_approval where field_name='Mobile' and field_new_value = '"+this.MobileNo_1.value+"' and server_hpb_id!="+this.HpbData['ServerHpbId']+" union all select server_hpb_id from hpb_update_approval where field_name='Card Number' and field_new_value = '"+this.IdCardNumber.value+"' and server_hpb_id!="+this.HpbData['ServerHpbId']+"";
                  
                  }

                  if(this.HpbData['MobApprovalStatus']!=0 && this.oldHpbData['MobileNo_1'] != this.HpbData['MobileNo_1']){

                    if(!dualCondtnFlag){
                      dualCondtnObj['primary_mobile_no'] = this.MobileNo_1.value;
                      where +=" and `primary_mobile_no` ='"+this.MobileNo_1.value+"' and hpb_id!="+this.HpbData['HpbId'];
                      checkApprovaltbl = "select server_hpb_id from hpb_update_approval where field_name='Mobile' and field_new_value = '"+this.MobileNo_1.value+"' and server_hpb_id!="+this.HpbData['ServerHpbId']+"";
                    }
                    approval_tbl_data['field_name'] = 'Mobile';
                    approval_tbl_data['field_new_value'] = this.HpbData['MobileNo_1'];
                    approval_tbl_data['field_old_value'] = this.oldHpbData['MobileNo_1'];
                    
                    dataArr.push(Object.assign({},approval_tbl_data));
                  }

                  if(this.HpbData['IdApprovalStatus']!=0 && this.oldHpbData['IdCardNumber']!=this.HpbData['IdCardNumber']){
                    if(!dualCondtnFlag){
                      dualCondtnObj['id_card_number'] = this.IdCardNumber.value; 
                      where +=" and `id_card_number` = '"+this.IdCardNumber.value+"' and hpb_id!="+this.HpbData['HpbId'];
                      checkApprovaltbl = "select server_hpb_id from hpb_update_approval where field_name='Card Number' and field_new_value = '"+this.IdCardNumber.value+"' and server_hpb_id!="+this.HpbData['ServerHpbId']+"";
                    }
                    approval_tbl_data['field_name'] = 'Card Number';
                    approval_tbl_data['field_new_value'] = this.HpbData['IdCardNumber'];
                    approval_tbl_data['field_old_value'] = this.oldHpbData['IdCardNumber'];
                    
                    dataArr.push(Object.assign({},approval_tbl_data));
                  }

                  let whereUpdatecondtn = '';
                  let approvaltable = 'hpb_update_approval';
                  let updateOBj = {};
                  updateOBj['is_closed'] = 1;
                  updateOBj['sync_status'] = 0;



                  this.busy=this.sqlS.selectTableData(selectField,tablename,where,"","").then((data) => {

                    let res =   data['rows'].item(0);
                    console.log("result data-->",data['rows'].item(0));  

                    if( res == undefined  ){

                      console.log("mob no or id card is unique in hpb master"); 
                      console.log("checkApprovaltbl query=>",checkApprovaltbl);

                      this.busy = this.sqlS.queryExecuteSql(checkApprovaltbl,[]).then((result)=>{
                        console.log("checkApprovaltbl query result length=>",result.rows.length);

                        if(result && result.rows.length>0){

                          console.log("mob no or id card is not unique in hpb update approval");
                          this.appCom.showAlert(ALL_MESSAGE.ERROR_MESSAGE.DUPLICATE_MOBNO_IN_DB,"Ok","");
                          return false;
                          
                        }else{

                          let approErrFlag = false;
                                      
                          //NOW CHECK FOR DUPLICATE MOBILE NO IN SERVER DB
                          
                          if( this.internetStatus ){ //IF INTERNET CONNECTION CHECK FOR DUPLICATE HPB

                            console.log("internet connection true");

                            let wher = {"where":{"or":[{"primary_mobile_no":dualCondtnObj['primary_mobile_no']},{"id_card_number":dualCondtnObj['id_card_number']}]}};
                                                        
                            this.busy = this.app_hpbApi.find(wher).subscribe((result)=>{
                                            
                              if( result.length == 0 || result == undefined || result == null ){ //ALLOW THIS UNIQUE PRIMARY MOBILE NO 

                                console.log("mobile or id card is unique in hpb master server level");
                                                                                             
                                let currentTime = this.appCom.getCurrentTimeStamp();
                                insertData['local_updated_date']=currentTime;
      
                                //UPDATE EXISTING HPB DATA
                                if(this.HpbData['ServerHpbId']==0){

                                  console.log("server hpb id is > 0 ");
                                  insertData['primary_mobile_no']=this.MobileNo_1.value;
                                  insertData['id_card_number']=this.IdCardNumber.value;

                                }
      
                                insertData['assigned_to']=this.userId;
                                insertData['sync_status']=0;
                                insertData['updated_by']=sessionUserGlobalData['userIdG']?sessionUserGlobalData['userIdG']:this.userId;
                                insertData['updated_date']=Date.now();
                                var whereCond =" `hpb_id` = "+this.HpbData['HpbId'];

                                console.log("updateData in the hpb_master=>",insertData);

                                this.busy=this.sqlS.updateData(insertData,"hpb_master",whereCond).then((data) => {
                                   
                                  console.log("updateData in the hpb_master success");

                                  if(this.HpbData['ServerHpbId']>0){             
                                         
                                    this.busy = async.forEachOf(dataArr, (detail, i, callback)=>{
                                      console.log("async iterate detail=>",detail);
                                                     
                                      let existingDataQry = "select * from hpb_update_approval where server_hpb_id ="+detail['server_hpb_id']+" and field_name='"+detail['field_name']+"' and is_closed = 0";
                                      console.log("existingDataQry=>",existingDataQry);
                                                            
                                      this.busy = this.sqlS.queryExecuteSql(existingDataQry,[]).then((Seldata)=>{
                                        console.log("existingDataQry result length=>",Seldata.rows.length);

                                        if(Seldata && Seldata.rows.length>0){
            
                                          whereUpdatecondtn = " server_hpb_id ="+detail['server_hpb_id']+" and is_closed = 0 and field_name ='"+detail['field_name']+"'";

                                          this.busy = this.sqlS.updateData(updateOBj,approvaltable,whereUpdatecondtn).then((deldata)=>{
                                            console.log("existing data updated");
                                                                    
                                            this.busy = this.sqlS.insertData(detail,approval_tbl).then((success)=>{
                                              
                                              console.log("new data inserted into approval table");
                                              callback();
                                            
                                            },(err)=>{

                                              approErrFlag = true;
                                              console.log("new data not inserted into approval table");
                                              callback();

                                            });
                                          },(err)=>{

                                            approErrFlag = true;
                                            console.log("existing data not updated");
                                            callback();

                                          });
                                        }else{
                                            
                                            console.log("existingDataQry no result");
                                            this.busy = this.sqlS.insertData(detail,approval_tbl).then((success)=>{

                                              console.log("new data inserted into approval table");
                                              callback();

                                            },(err)=>{

                                              approErrFlag = true;
                                              console.log("new data not inserted into approval table");
                                              callback();

                                            });
                                        }
                                      });

                                    },(complete)=>{

                                      console.log("async iterate detail complete");
                                        
                                      if(approErrFlag){
                                                        
                                          this.appCom.showAlert(ALL_MESSAGE.ERROR_MESSAGE.HPB_UPDATE_ERR,"Ok","");
                                      
                                      }else{
      
                                        this.appCom.showAlert(ALL_MESSAGE.SUCCESS_MESSAGE.HPB_UPDATE_SUCCESS,"Ok","");
                                        this.events.publish('globalSync');
                                        let currView = this.navCtrl.getActive();
                                        let index = this.navCtrl.indexOf(currView);
                                        
                                        if(previousView.instance instanceof HpbListPage){

                                        }else{
                                            if( this.HpbData['HpbType'] == 'mason' ){
                                                this.navCtrl.push(HpbListPage,{
                                                    "type":"mason"
                                                });
                                            }else if( this.HpbData['HpbType'] == 'contractor' ){
                                                this.navCtrl.push(HpbListPage,{
                                                    "type":"contractor"
                                                }); 
                                            }
                                        }
                                        this.navCtrl.remove(index, 1,null);
                                      }
                                    });
                                  }else{

                                    console.log("server hpb id not > 0");

                                    this.appCom.showAlert(ALL_MESSAGE.SUCCESS_MESSAGE.HPB_UPDATE_SUCCESS,"Ok","");
                                    this.events.publish('globalSync');
                                    let currView = this.navCtrl.getActive();
                                    let index = this.navCtrl.indexOf(currView);
                                    
                                    if(previousView.instance instanceof HpbListPage){

                                    }else{
                                        if( this.HpbData['HpbType'] == 'mason' ){
                                            this.navCtrl.push(HpbListPage,{
                                                "type":"mason"
                                            });
                                        }else if( this.HpbData['HpbType'] == 'contractor' ){
                                            this.navCtrl.push(HpbListPage,{
                                                "type":"contractor"
                                            }); 
                                        }
                                    }
                                    this.navCtrl.remove(index, 1,null);
                                  }
                                                    
                                }, (error) => {

                                    console.log('Error', error);
                                                                                  
                                    this.appCom.showAlert(ALL_MESSAGE.ERROR_MESSAGE.HPB_UPDATE_ERR,"Ok","");
                                });              
                              }else{

                                    this.appCom.showAlert(ALL_MESSAGE.ERROR_MESSAGE.DUPLICATE_MOBNO_IN_DB,"Ok","");
                                    return false;

                              }              
                            });

                          }else{ //NO INTERNET CONNECTION

                            console.log("internet connection false");

                            let currentTime = this.appCom.getCurrentTimeStamp();
                            insertData['local_updated_date']=currentTime;
  
                            //UPDATE EXISTING HPB DATA
                            if(this.HpbData['ServerHpbId']==0){

                              console.log("server hpb id is > 0 ");
                              insertData['primary_mobile_no']=this.MobileNo_1.value;
                              insertData['id_card_number']=this.IdCardNumber.value;

                            }
  
                            insertData['assigned_to']=this.userId;
                            insertData['sync_status']=0;
                            insertData['updated_by']=sessionUserGlobalData['userIdG']?sessionUserGlobalData['userIdG']:this.userId;
                            insertData['updated_date']=Date.now();
                            var whereCond =" `hpb_id` = "+this.HpbData['HpbId'];

                            console.log("updateData in the hpb_master=>",insertData);

                            this.busy=this.sqlS.updateData(insertData,"hpb_master",whereCond).then((data) => {
                               
                              console.log("updateData in the hpb_master success");

                              if(this.HpbData['ServerHpbId']>0){             
                                     
                                this.busy = async.forEachOf(dataArr, (detail, i, callback)=>{
                                  console.log("async iterate detail=>",detail);
                                                 
                                  let existingDataQry = "select * from hpb_update_approval where server_hpb_id ="+detail['server_hpb_id']+" and field_name='"+detail['field_name']+"' and is_closed = 0";
                                  console.log("existingDataQry=>",existingDataQry);
                                                        
                                  this.busy = this.sqlS.queryExecuteSql(existingDataQry,[]).then((Seldata)=>{
                                    console.log("existingDataQry result length=>",Seldata.rows.length);

                                    if(Seldata && Seldata.rows.length>0){
        
                                      
                                      whereUpdatecondtn = " server_hpb_id ="+detail['server_hpb_id']+" and is_closed = 0 and field_name ='"+detail['field_name']+"'";
                                      
                                        this.busy = this.sqlS.updateData(updateOBj,approvaltable,whereUpdatecondtn).then((deldata)=>{
                                          console.log("existing data updated");
                                                                  
                                          this.busy = this.sqlS.insertData(detail,approval_tbl).then((success)=>{
                                            
                                            console.log("new data inserted into approval table");
                                            callback();
                                          
                                          },(err)=>{

                                            approErrFlag = true;
                                            console.log("new data not inserted into approval table");
                                            callback();

                                          });
                                        },(err)=>{

                                          approErrFlag = true;
                                          console.log("existing data not updated");
                                          callback();

                                        });
                                    }else{
                                        
                                        console.log("existingDataQry no result");
                                        this.busy = this.sqlS.insertData(detail,approval_tbl).then((success)=>{

                                          console.log("new data inserted into approval table");
                                          callback();

                                        },(err)=>{

                                          approErrFlag = true;
                                          console.log("new data not inserted into approval table");
                                          callback();

                                        });
                                    }
                                  });

                                },(complete)=>{

                                  console.log("async iterate detail complete");
                                    
                                  if(approErrFlag){
                                                    
                                      this.appCom.showAlert(ALL_MESSAGE.ERROR_MESSAGE.HPB_UPDATE_ERR,"Ok","");
                                  
                                  }else{
  
                                    this.appCom.showAlert(ALL_MESSAGE.SUCCESS_MESSAGE.HPB_UPDATE_SUCCESS,"Ok","");
                                    this.events.publish('globalSync');
                                    let currView = this.navCtrl.getActive();
                                    let index = this.navCtrl.indexOf(currView);
                                    
                                    if(previousView.instance instanceof HpbListPage){

                                    }else{
                                        if( this.HpbData['HpbType'] == 'mason' ){
                                            this.navCtrl.push(HpbListPage,{
                                                "type":"mason"
                                            });
                                        }else if( this.HpbData['HpbType'] == 'contractor' ){
                                            this.navCtrl.push(HpbListPage,{
                                                "type":"contractor"
                                            }); 
                                        }
                                    }
                                    this.navCtrl.remove(index, 1,null);
                                  }
                                });
                              }else{

                                console.log("server hpb id not > 0");

                                this.appCom.showAlert(ALL_MESSAGE.SUCCESS_MESSAGE.HPB_UPDATE_SUCCESS,"Ok","");
                                this.events.publish('globalSync');
                                let currView = this.navCtrl.getActive();
                                let index = this.navCtrl.indexOf(currView);
                                
                                if(previousView.instance instanceof HpbListPage){

                                }else{
                                    if( this.HpbData['HpbType'] == 'mason' ){
                                        this.navCtrl.push(HpbListPage,{
                                            "type":"mason"
                                        });
                                    }else if( this.HpbData['HpbType'] == 'contractor' ){
                                        this.navCtrl.push(HpbListPage,{
                                            "type":"contractor"
                                        }); 
                                    }
                                }
                                this.navCtrl.remove(index, 1,null);
                              }
                                                
                            }, (error) => {

                                console.log('Error', error);
                                                                              
                                this.appCom.showAlert(ALL_MESSAGE.ERROR_MESSAGE.HPB_UPDATE_ERR,"Ok","");
                            });
                          }
                        }
                      }); 
                    }else{

                      this.appCom.showAlert(ALL_MESSAGE.ERROR_MESSAGE.DUPLICATE_MOBNO_IN_DB,"Ok","");
                      return false;

                    }
                  });
                }else{
                    
                    //number not changed, do nothing and update as is
                    //UPDATE EXISTING HPB DATA
                                  
                    insertData['assigned_to']=this.userId;
                    insertData['sync_status']=0;
                    insertData['updated_by']=sessionUserGlobalData['userIdG']?sessionUserGlobalData['userIdG']:this.userId;
                    insertData['updated_date']=Date.now();
                    var whereCond =" `hpb_id` = "+this.HpbData['HpbId'];

                    this.busy=this.sqlS.updateData(insertData,"hpb_master",whereCond).then((data) => {
                                      
                      this.appCom.showAlert(ALL_MESSAGE.SUCCESS_MESSAGE.HPB_UPDATE_SUCCESS,"Ok","");
                      this.events.publish('globalSync');
                      let currView = this.navCtrl.getActive();
                      let index = this.navCtrl.indexOf(currView);

                      if(previousView.instance instanceof HpbListPage){

                      }else{
                          if( this.HpbData['HpbType'] == 'mason' ){
                              this.navCtrl.push(HpbListPage,{
                                  "type":"mason"
                              });
                          }else if( this.HpbData['HpbType'] == 'contractor' ){
                              this.navCtrl.push(HpbListPage,{
                                  "type":"contractor"
                              }); 
                          }
                      }
                      
                      this.navCtrl.remove(index, 1,null);
                    }, (error) => {
                        console.log('Error', error);
                        //this.appCom.showToast(ALL_MESSAGE.ERROR_MESSAGE.HPB_UPDATE_ERR,"middle");
                        
                        this.appCom.showAlert(ALL_MESSAGE.ERROR_MESSAGE.HPB_UPDATE_ERR,"Ok","");
                    }); 
                  }
            }else{

              insertData['primary_mobile_no']=this.HpbData['MobileNo_1'];
              insertData['id_card_number']=this.HpbData['IdCardNumber'];
            
              //check for valid primary mobile number..
              let selectField = "  `primary_mobile_no`,`id_card_number` ";
              let tablename = "hpb_master";
              let approval_tbl = "hpb_update_approval";
              let dualCondtnFlag = false;
              let dualCondtnObj = {'primary_mobile_no':'','id_card_number':''};
              dualCondtnObj['primary_mobile_no'] = this.MobileNo_1.value;
              dualCondtnObj['id_card_number'] = this.IdCardNumber.value;
              let where =" 1=1 and (`primary_mobile_no` ='"+this.MobileNo_1.value+"' or `id_card_number` = '"+this.IdCardNumber.value+"')";
              let checkApprovaltbl = "select server_hpb_id from hpb_update_approval where field_name='Mobile' and field_new_value = '"+this.MobileNo_1.value+"' union all select server_hpb_id from hpb_update_approval where field_name='Card Number' and field_new_value = '"+this.IdCardNumber.value+"'";

            //   if((this.HpbData['MobApprovalStatus']!=0 && this.oldHpbData['MobileNo_1'] != this.HpbData['MobileNo_1']) && (this.HpbData['IdApprovalStatus']!=0 && this.oldHpbData['IdCardNumber']!=this.HpbData['IdCardNumber'])){
            //     dualCondtnFlag = true;
                
            //   }

            // if(this.HpbData['MobApprovalStatus']!=0 && this.oldHpbData['MobileNo_1'] != this.HpbData['MobileNo_1']){
            //   if(!dualCondtnFlag){
            //     dualCondtnObj['primary_mobile_no'] = this.MobileNo_1.value;
            //     where +=" and `primary_mobile_no` ='"+this.MobileNo_1.value+"'";
            //     checkApprovaltbl = "select hpb_id from hpb_update_approval where field_name='Mobile' and field_new_value = '"+this.MobileNo_1.value+"'";
            //   }
            // }

            // if(this.HpbData['IdApprovalStatus']!=0 && this.oldHpbData['IdCardNumber']!=this.HpbData['IdCardNumber']){
            //   if(!dualCondtnFlag){
            //     dualCondtnObj['id_card_number'] = this.IdCardNumber.value; 
            //     where +=" and `id_card_number` = '"+this.IdCardNumber.value+"'";
            //     checkApprovaltbl = "select hpb_id from hpb_update_approval where field_name='Card Number' and field_new_value = '"+this.IdCardNumber.value+"'";
            //   }
            // }

            console.log("selectField=>",selectField);
            console.log("tablename=>",tablename);
            console.log("where=>",where);
            
            this.busy=this.sqlS.selectTableData(selectField,tablename,where,"","").then((data) => {
                let res =   data['rows'].item(0);
                console.log("result data-->",data['rows'].item(0));    
                if( res == undefined  ){
                  //mob no is unique in hpb master 
                  console.log("checkApprovaltbl=>",checkApprovaltbl);
                  this.busy = this.sqlS.queryExecuteSql(checkApprovaltbl,[]).then((result)=>{
                    console.log("checkApprovaltbl=>",checkApprovaltbl);
                    console.log("result=>",result);
                    console.log("result.rows.length=>",result.rows.length);
                    if(result && result.rows.length>0){
                      this.appCom.showAlert(ALL_MESSAGE.ERROR_MESSAGE.DUPLICATE_MOBNO_IN_DB,"Ok","");
                      return false;
                    }else{
                      console.log("entered else=>");
                      console.log("internetStatus=>",this.internetStatus);
                      //Check primary mobile number at server if internet is on    
                      if( this.internetStatus ){  //IF INTERNET CONNECTION CHECK FOR DUPLICATE HPB
              
                              let wher = {"where":{"or":[{"primary_mobile_no":dualCondtnObj['primary_mobile_no']},{"id_card_number":dualCondtnObj['id_card_number']}]}};
              
                              this.busy=this.app_hpbApi.find(wher).subscribe((result)=>{
              
                                if( result.length == 0 || result == undefined || result == null ){ //ALLOW THIS UNIQUE PRIMARY MOBILE NO 
              
                                  this.busy=this.appCom.isGpsLocationEnabledC((successCallback)=>{			
                                      if(successCallback)	{
                                        this.busy=this.appCom.getLocationModeC((res) => {
                                          console.log("res",res);
                                          //if(res == 'high_accuracy'){                                                        
                                            this.busy= this.appCom.getGeoLocationCordinates("submitHpbForm").then((geoCordinates)=>{
                                                  this.addHPBGeoLoc(geoCordinates,insertData);     
                                                        
                                            },(error)=>{
                                                console.log(error);
                                                //this.appCom.showAlert(ALL_MESSAGE.ERROR_MESSAGE.GENERIC_LOCATION_ERR,"Ok","");
                                                this.addHPBGeoLoc('',insertData);
                                            });
                                          // }else{
                                          //   //show pop up for set high accuracy..
                                          //   //this.appCom.showAlert(ALL_MESSAGE.ERROR_MESSAGE.GET_LOCATION_COORDS_ERR,"Ok","");
                                          //   this.addHPBGeoLoc('',insertData);
                                          // }
                                        },(err)=>{
                                            console.log(err);
                                        });
                                      }else{
                                        //show alert enable gps
                                          this.appCom.showAlert(ALL_MESSAGE.ERROR_MESSAGE.GET_LOCATION_COORDS_ERR,"Ok","");  
                                        
                                      }	
              
                                  },(err)=>{
                                    console.log(err);
                                    this.appCom.showAlert(ALL_MESSAGE.ERROR_MESSAGE.GENERIC_LOCATION_ERR,"Ok",""); 
                                  });
                                }else{
                                      this.appCom.showAlert(ALL_MESSAGE.ERROR_MESSAGE.DUPLICATE_MOBNO_IN_DB,"Ok","");
                                      return false;
                                } 
              
                              }); 
                                                                
                          }else{ //NO INTERNET CONNECTION
              
                            this.busy=this.appCom.isGpsLocationEnabledC((successCallback)=>{			
                                if(successCallback)	{
                                  this.busy=this.appCom.getLocationModeC((res) => {
                                          console.log("res",res);
                                              //if(res == 'high_accuracy'){
                                                      
                                                this.busy=this.appCom.getGeoLocationCordinates("submitHpbForm").then((geoCordinates)=>{
                                                      this.addHPBGeoLoc(geoCordinates,insertData);        
                                                                
                                                },(error)=>{
                                                    console.log(error);
                                                    //this.appCom.showAlert(ALL_MESSAGE.ERROR_MESSAGE.GENERIC_LOCATION_ERR,"Ok","");
                                                    this.addHPBGeoLoc('',insertData);
                                                });
                                              // }else{
                                              //   //show pop up for set high accuracy..
                                              //   //this.appCom.showAlert(ALL_MESSAGE.ERROR_MESSAGE.GET_LOCATION_COORDS_ERR,"Ok","");
                                              //   this.addHPBGeoLoc('',insertData);
                                              // }
                                  },(err)=>{
                                  console.log(err);
                                  });
                                }else{
                                  //show alert enable gps
                                  this.appCom.showAlert(ALL_MESSAGE.ERROR_MESSAGE.GET_LOCATION_COORDS_ERR,"Ok","");  
                                  
                                }	
              
                              },(err)=>{
                                console.log(err);
                                this.appCom.showAlert(ALL_MESSAGE.ERROR_MESSAGE.GENERIC_LOCATION_ERR,"Ok",""); 
                              });
                          }
                    }
                  });
                }else{
                  this.appCom.showAlert(ALL_MESSAGE.ERROR_MESSAGE.DUPLICATE_MOBNO_IN_DB,"Ok","");
                  return false;
                } 
          }); //END OF DUPLICATE PHONE NO CHECK
        }
      }else{
        //invalid
        this.check = false;   
        this.appCom.showAlert(ALL_MESSAGE.ERROR_MESSAGE.INVALID_FIELDS_FORM_ERR,"Ok","");
      }
    }else{
        
    }

  } 

  addHPBGeoLoc(geoCordinates,insertData){
    let previousView = this.navCtrl.getPrevious();
    console.log("geoCordinates------>",geoCordinates);
    this.HpbData.latitude=(geoCordinates['coords'])?geoCordinates['coords'].latitude:"";
    this.HpbData.longitude=(geoCordinates['coords'])?geoCordinates['coords'].longitude:""; 
    //INSERT NEW HPB DATA
    let currentTime = this.appCom.getCurrentTimeStamp();
    insertData['local_created_date']=currentTime;
    insertData['local_updated_date']=currentTime;

    insertData['latitude']=this.HpbData.latitude;
    insertData['longitude']= this.HpbData.longitude;
    this.busy=this.sqlS.insertData(insertData,"hpb_master").then((data) => {
       //this.appCom.showToast(ALL_MESSAGE.SUCCESS_MESSAGE.HPB_ADD_SUCCESS,"middle");
      this.appCom.showAlert(ALL_MESSAGE.SUCCESS_MESSAGE.HPB_ADD_SUCCESS,"Ok","");
      this.appCom.updateMyPlanStats(insertData['hpb_type']);

      let currView = this.navCtrl.getActive();
      let index = this.navCtrl.indexOf(currView);
        if(previousView.instance instanceof HpbListPage){

        }else{
            if( this.HpbData['HpbType'] == 'mason' ){
                this.navCtrl.push(HpbListPage,{
                    "type":"mason"
                });
            }else if( this.HpbData['HpbType'] == 'contractor' ){
                this.navCtrl.push(HpbListPage,{
                    "type":"contractor"
                }); 
            }
        }

      this.events.publish('globalSync');
      this.navCtrl.remove(index, 1,null);
    }, (error) => {
        console.log('Error', error);
        //this.appCom.showToast(ALL_MESSAGE.ERROR_MESSAGE.HPB_ADD_ERR,"middle");
        
        this.appCom.showAlert(ALL_MESSAGE.ERROR_MESSAGE.HPB_ADD_ERR,"Ok","");
    });
  }
  
  copyAddress(){
      console.log("this.HpbData.DomicileSameAsIdCard",this.HpbData.DomicileSameAsIdCard);
      if( this.HpbData.DomicileSameAsIdCard ){
          if(this.IdCardAddress.valid && this.IdCardProvince.valid && this.IdCardCity.valid && this.IdCardSubDistrict.valid && this.IdCardPincode.valid){
            this.postalCodeArrS=this.postalCodeArrG;
            this.provinceArrS=this.provinceArrG;
            this.municipalityArrS=this.municipalityArrG;
            this.subDistrictArrS=this.subDistrictArrG;
            this.HpbData.DomicileAddress = this.HpbData.IdCardAddress;
            this.HpbData.DomicileProvince = this.HpbData.IdCardProvince;
            this.HpbData.DomicileCity = this.HpbData.IdCardCity;
            this.HpbData.DomicileSubDistrict = this.HpbData.IdCardSubDistrict;
            this.HpbData.DomicilePincode = this.HpbData.IdCardPincode;
            this.disableDomicileAddrFlag=1;
          }else{
            this.disableDomicileAddrFlag=0;
            //show error pop up 
          }

          console.log(" this.HpbData", this.HpbData);
      }else{
       
        this.disableDomicileAddrFlag=0;
        this.HpbData.DomicileAddress=null;
        this.HpbData.DomicileProvince=null;
        this.HpbData.DomicileCity=null;
        this.HpbData.DomicileSubDistrict=null;
        this.HpbData.DomicilePincode=null;

        this.postalCodeArrS=this.postalCodeArrG;
        this.provinceArrS=this.provinceArrG;
        this.municipalityArrS=this.municipalityArrG;
        this.subDistrictArrS=this.subDistrictArrG;
      }
  }
  
  //CAMERA OR GALLERY SELECTION POP
  openSelectCameraPop(myEvent,photo_source){
    var popover;
    popover = this.popoverCtrl.create(ImageSelectPopPage,{photo_source});
    popover.present({
      ev: myEvent
    });
   
  }
  
  //SIGNATURE PAD POP
  getSignature(){
   let Modal = this.modalCtrl.create(DigitalSignCanvasPage);
   Modal.present();

  }

   getAddress(){
      this.hideLocate=true;
     	this.appCom.isGpsLocationEnabledC((successCallback)=>{			
          if(successCallback)	{
                  this.appCom.getLocationModeC((res) => {
                    console.log("res",res);
                        //if(res == 'high_accuracy'){
                          
                          this.busy=  this.appCom.getAddressOfCurrLocation().then((address)=>{
                            this.HpbData['IdCardAddress'] = address;
                            this.hideLocate=false;
                          },(error)=>{
                            console.log(error);
                            this.hideLocate=false;
                          });


                        // }else{
                        //         //show pop up for set high accuracy..
                        //         // this.hideLocate=false;
                        //         // this.appCom.showAlert(ALL_MESSAGE.ERROR_MESSAGE.GET_LOCATION_COORDS_ERR,"Ok","");
                        //         this.busy=  this.appCom.getAddressOfCurrLocation().then((address)=>{
                        //           this.HpbData['IdCardAddress'] = address;
                        //           this.hideLocate=false;
                        //         },(error)=>{
                        //           console.log(error);
                        //           this.hideLocate=false;
                        //         });  
                        // }
                  },(err)=>{
                      this.hideLocate=false;
                      console.log(err);
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

  removeIdCardImage(i){
      this.idCardPhotoObj.splice(i, 1);
      this.HpbData.IdPhoto.splice(i,1);
  }

  onSelectHpbTypeChange(Hpbtype){
      if(Hpbtype == 'mason'){
        this.HpbData['CompanyName']="";
        this.HpbData['CompanyRepresentativeName']="";
        this.HpbData['CompanyDesignation']="";
      }else if(Hpbtype == 'contractor'){
         //do nothing       
      }
  } 






  //INSERT INTO DATABASE
 
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
        //  console.log('getOpenTendersData sql ressqlData',ressqlData);

        // alert(JSON.stringify(ressqlData));

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
              if(
                value2Data['postalcode']==eventD && eventD!="" && eventD!=null){
                 
                 
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

        this.IdCardProvinceMob.instance.option({
          data: this.provinceArrF
        });
         
        this.IdCardCityMob.instance.option({
          data: this.municipalityArrF
        });

        this.IdCardSubDistrictMob.instance.option({
          data: this.subDistrictArrF
        });
        setTimeout(()=>{
            this.IdCardProvince.valueAccessor._instance.setVal(tempP,true);
            this.IdCardCity.valueAccessor._instance.setVal(tempC,true);
            this.IdCardSubDistrict.valueAccessor._instance.setVal(tempS,true);
            this.IdCardPincode.valueAccessor._instance.setVal(eventD,true);
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
           
          this.IdCardCityMob.instance.option({
            data: this.municipalityArrF
          });
  
          this.IdCardSubDistrictMob.instance.option({
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
           
          this.IdCardSubDistrictMob.instance.option({
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


 addressDataFiltersS(eventD,type){

  if(type=="postalcode"){
        // bind - province , citykabname, subdistrict 
        let tempP=null;
        let tempC=null;
        let tempS=null;
        this.provinceArrS=[];
        this.municipalityArrS=[];
        this.subDistrictArrS=[];
        this.postalCodeArrS=[];
        this.allAddressDataG.forEach((value1Data, value2Data, set)=>{
              if(value2Data['postalcode']==eventD && eventD!="" && eventD!=null){
                  this.postalCodeArrS.push({
                    text:value2Data['postalcode'],
                    value:value2Data['postalcode']
                  });
                  this.provinceArrS.push({
                    text:value2Data['province'],
                    value:value2Data['province']
                  });
                  this.municipalityArrS.push({
                    text:value2Data['citykabname'],
                    value:value2Data['citykabname']
                  });
                  this.subDistrictArrS.push({
                    text:value2Data['subdistrict'],
                    value:value2Data['subdistrict']
                  });

                  tempP=value2Data['province'];
                  tempC=value2Data['citykabname'];
                  tempS=value2Data['subdistrict'];
              }

        }); 

        this.municipalityArrS=this.municipalityArrS.uniqueObjects();
        this.subDistrictArrS=this.subDistrictArrS.uniqueObjects();
        this.provinceArrS=this.provinceArrS.uniqueObjects();
        this.DomicilePincodeMob.instance.option({
          data: this.postalCodeArrS
        });

        this.DomicileProvinceMob.instance.option({
          data: this.provinceArrS
        });
         
        this.DomicileCityMob.instance.option({
          data: this.municipalityArrS
        });

        this.DomicileSubDistrictMob.instance.option({
          data: this.subDistrictArrS
        }); 
        setTimeout(()=>{
            this.DomicileProvince.valueAccessor._instance.setVal(tempP,true);
            this.DomicileCity.valueAccessor._instance.setVal(tempC,true);
            this.DomicileSubDistrict.valueAccessor._instance.setVal(tempS,true);
            this.DomicilePincode.valueAccessor._instance.setVal(eventD,true);
       },10);
        


      }else if(type=="province"){
        // bind -  citykabname, subdistrict
        this.postalCodeArrS=[];
        this.municipalityArrS=[];
        this.subDistrictArrS=[];
        this.allAddressDataG.forEach((value1Data, value2Data, set)=>{
            if(value2Data['province']==eventD && eventD!="" && eventD!=null){
            
              this.municipalityArrS.push({
                    text:value2Data['citykabname'],
                    value:value2Data['citykabname']
              });
              this.subDistrictArrS.push({
                    text:value2Data['subdistrict'],
                    value:value2Data['subdistrict']
              });
               this.postalCodeArrS.push({
                    text:value2Data['postalcode'],
                    value:value2Data['postalcode']
              });
            }
        });

    
          this.municipalityArrS=this.municipalityArrS.uniqueObjects();
          this.subDistrictArrS=this.subDistrictArrS.uniqueObjects();
          this.DomicilePincodeMob.instance.option({
            data: this.postalCodeArrS
          });
           
          this.DomicileCityMob.instance.option({
            data: this.municipalityArrS
          });
  
          this.DomicileSubDistrictMob.instance.option({
            data: this.subDistrictArrS
          }); 
       
      }else if(type=="citykabname"){
          // bind -   subdistrict and Up province
           this.postalCodeArrS=[];
          this.subDistrictArrS=[];
          this.allAddressDataG.forEach((value1Data, value2Data, set)=>{
              if(value2Data['citykabname']==eventD && eventD!="" && eventD!=null){
                    this.subDistrictArrS.push({
                      text:value2Data['subdistrict'],
                      value:value2Data['subdistrict']
                });
                this.postalCodeArrS.push({
                      text:value2Data['postalcode'],
                      value:value2Data['postalcode']
                });
              }
          });
     
          this.subDistrictArrS=this.subDistrictArrS.uniqueObjects();
          this.DomicilePincodeMob.instance.option({
            data: this.postalCodeArrS
          });
           
          this.DomicileSubDistrictMob.instance.option({
            data: this.subDistrictArrS
          });
         
   
      }else if(type=="subdistrict"){
        // bind -   postalcode and Up citykabname, province

          this.postalCodeArrS=[];
          this.allAddressDataG.forEach((value1Data, value2Data, set)=>{
              if(value2Data['subdistrict']==eventD && eventD!="" && eventD!=null){
                  this.postalCodeArrS.push({
                        text:value2Data['postalcode'],
                        value:value2Data['postalcode']
                  });
              }
          });
          this.DomicilePincodeMob.instance.option({
            data: this.postalCodeArrS
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
                 this.postalCodeArrS.push({
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
        this.DomicilePincodeMob.instance.option({
          data: this.postalCodeArrS
        });
        this.provinceArrF=[];
        this.provinceArrS=[];
        for(let i = 0; i < this.provinceArrG.length; i++) {
                this.provinceArrF.push({
                      text:this.provinceArrG[i].text,
                      value:this.provinceArrG[i].value,
                });
                 this.provinceArrS.push({
                      text:this.provinceArrG[i].text,
                      value:this.provinceArrG[i].value,
                });
                  // if(i==50){
                  //   break;
                  // }
        }
        this.IdCardProvinceMob.instance.option({
          data: this.provinceArrF
        });
        this.DomicileProvinceMob.instance.option({
          data: this.provinceArrS
        });
        this.municipalityArrF=[];
        this.municipalityArrS=[];
        for(let i = 0; i < this.municipalityArrG.length; i++) {
                this.municipalityArrF.push({
                      text:this.municipalityArrG[i].text,
                      value:this.municipalityArrG[i].value,
                });
                 this.municipalityArrS.push({
                      text:this.municipalityArrG[i].text,
                      value:this.municipalityArrG[i].value,
                });
                  // if(i==50){
                  //   break;
                  // }
        }
        this.IdCardCityMob.instance.option({
          data: this.municipalityArrF
        });
        this.DomicileCityMob.instance.option({
          data: this.municipalityArrS
        });
        this.subDistrictArrF=[];
        this.subDistrictArrS=[];
        for(let i = 0; i < this.subDistrictArrG.length; i++) {
                this.subDistrictArrF.push({
                      text:this.subDistrictArrG[i].text,
                      value:this.subDistrictArrG[i].value,
                 });
               this.subDistrictArrS.push({
                      text:this.subDistrictArrG[i].text,
                      value:this.subDistrictArrG[i].value,
                 });                 
                  // if(i==50){
                  //   break;
                  // }
        }  
        this.IdCardSubDistrictMob.instance.option({
          data: this.subDistrictArrF
        });  
        this.DomicileSubDistrictMob.instance.option({
          data: this.subDistrictArrS
        });              
    
   resolve(resolve);

  });
        

}




}
