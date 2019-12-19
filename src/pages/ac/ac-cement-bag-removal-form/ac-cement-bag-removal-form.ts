import { Component,ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController, Events, PopoverController } from 'ionic-angular';
import { SqlServices } from "../../../providers/sqlService";
import { appCommonMethods } from "../../../providers/appCommonMethods";
import { ALL_MESSAGE, SITE_API } from "../../../providers/constant";
import { Cement_bag_removals_tblApi } from "../../../shared/loopback_sdk/index";
import * as moment from 'moment';
import { DigitalSignCanvasPage } from "../../digital-sign-canvas/digital-sign-canvas";
import { SyncServices } from "../../../providers/syncServices";
import { Transfer, FileUploadOptions, TransferObject } from '@ionic-native/transfer';
import { File } from '@ionic-native/file';
import async from 'async'; 
import { ImageSelectPopPage } from "../../image-select-pop/image-select-pop";
import { AcCementBagRemovalDetailPage } from "../ac-cement-bag-removal-detail/ac-cement-bag-removal-detail";

declare var cordova;

@Component({
  selector: 'page-ac-cement-bag-removal-form',
  templateUrl: 'ac-cement-bag-removal-form.html',
})
export class AcCementBagRemovalFormPage {

   @ViewChild('district') district: any;
   @ViewChild('fromDate') fromDate: any;
   @ViewChild('fromDateMob') fromDateMob: any; 
   @ViewChild('toDate') toDate: any; 
   @ViewChild('toDateMob') toDateMob: any; 
   @ViewChild('locationName') locationName: any; 
   @ViewChild('cBQuantity') cBQuantity: any; 
   @ViewChild('quantity') quantity: any; 
   @ViewChild('address') address: any; 
   @ViewChild('postalCode') postalCode: any; 
   @ViewChild('province') province: any; 
   @ViewChild('city') city: any;  
   @ViewChild('subDistrict') subDistrict: any; 
   @ViewChild('witnessName') witnessName: any;

   @ViewChild('witnessDesignation') witnessDesignation: any;
   @ViewChild('uploadProof') uploadProof: any;
   @ViewChild('additionalComment') additionalComment: any;
   @ViewChild('digitalSign') digitalSign: any;

   @ViewChild('pincodeMob') pincodeMob: any;  
   @ViewChild('ProvinceMob') ProvinceMob: any;  
   @ViewChild('CityMob') CityMob: any;  
   @ViewChild('SubDistrictMob') SubDistrictMob: any;  
   @ViewChild('districtMob') districtMob: any;  

   
  busy:any;
  busyMessage:any="Please wait..."; 
  curUserData:any;
  userName:any;
  uId:any;
  cBagRemovData:any={
    district:null,
    fromDate:null,
    toDate:null,
    quantity:0,
    locationName:null,
    address:null,
    postalCode:null,
    province:null,
    city:null,
    subDistrict:null,
    witnessName:null,
    witnessDesignation:null,
    uploadProof:null,
    additionalComment:null,
    digitalSign:null,
    latitude:null,
    longitude:null,
  };

  toMinDate:any;
  toMaxDate:any;
  fromMinDate:any;
  fromMaxDate:any;
  disableToDateFlag:any=true;
  disableFromDateFlag:any=true;
  digitalSignPath:any;
  digitalSignData:any;
  removalProofPathObj:any=[];
  removalProofPathObjDisp:any=[];
  removalProofPathData:any=[];
  submitted:any=false;

  allAddressDataG:any=[];
  postalCodeArrG:any=[];
  provinceArrG:any=[];
  municipalityArrG:any=[];
  subDistrictArrG:any=[];
  districtArrG:any=[]

   allAddressDataF:any=[];
   postalCodeArrF:any=[];
   provinceArrF:any=[];
   municipalityArrF:any=[];
   subDistrictArrF:any=[];
   districtArrF:any=[]

   
  dateSettingsF:any={
      theme: 'material',
      display: 'center',
      dateFormat:'dd/mm/yy',
      onSet: (event, inst)=> {
        
           this.disableToDateFlag=false;
           this.cBagRemovData.toDate=null;
      },
  };

  dateSettingsT:any={
    theme: 'material',
    display: 'center',
    dateFormat:'dd/mm/yy',
    onSet: (event, inst)=> {
                  console.log("from date selected",event);
        
      },
  };

        
 /* F Address Mater : Start */

  mobiScollProvinceSettings:any = {
      inputClass: 'text-input',
      theme: 'material',
      showOnFocus: true,
      group: false,
      filter: true,
      placeholder: 'Please select',
      rows:8,
      data:[],
      readonly:false,
      buttons:['set','clear','cancel'],
     
      onClear: (event, inst)=>{
        this.cBagRemovData.city=null;
        this.cBagRemovData.subDistrict=null;
        this.cBagRemovData.postalCode=null;
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
  mobiScollCitySettings:any = {
      inputClass: 'text-input',
      theme: 'material',
      showOnFocus: true,
      group: false,
      filter: true,
      placeholder: 'Please select',
      rows:8,
      data:[],
      readonly:false,
      buttons:['set','clear','cancel'],
      onClear: (event, inst)=>{
        this.cBagRemovData.subDistrict=null;
        this.cBagRemovData.postalCode=null;
      },
      onSet: (event, inst)=> {
        if(event.valueText){
          this.addressDataFiltersF(event.valueText,'citykabname');
        }else{

        }
              
      },
      // onFilter: (event, inst)=> {
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
  mobiScollSubDistrictSettings:any = {
      inputClass: 'text-input',
      theme: 'material',
      showOnFocus: true,
      group: false,
      filter: true,
      placeholder: 'Please select',
      rows:8,
      data:[],
      readonly:false,
      buttons:['set','clear','cancel'],
      onClear: (event, inst)=>{
       
        this.cBagRemovData.postalCode=null;
      },
      onSet: (event, inst)=> {
        if(event.valueText){
          this.addressDataFiltersF(event.valueText,'subdistrict');
        }else{

        }
              
      },
      // onFilter: (event, inst)=> {
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
   mobiScollPincodeSettings:any = {
      inputClass: 'text-input',
      theme: 'material',
      showOnFocus: true,
      group: false,
      filter: true,
      placeholder: 'Please select',
      rows:8,
      data:[],
      readonly:false,
      buttons:['set','clear','cancel'],
      onClear: (event, inst)=>{
   

                    this.cBagRemovData.city=null;
                    this.cBagRemovData.subDistrict=null;
                    this.cBagRemovData.province=null;
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

 /** GET DISTRICT MASTER */
   mobiScollDistrictSettings:any = {
      inputClass: 'text-input',
      theme: 'material',
      showOnFocus: true,
      group: false,
      filter: true,
      placeholder: 'Please select',
      rows:4,
      data:[],
      readonly:false,
      buttons:['set','clear','cancel'],
     
      onClear: (event, inst)=>{
       
        this.cBagRemovData.district=null;
     
      },
      onSet: (event, inst)=> {
            
      },
      // onFilter: (event, inst)=> {
      
      // }
  };  
 

  constructor(public navCtrl: NavController, public navParams: NavParams,public sqlS:SqlServices,public appCom:appCommonMethods,public getCementBagRemApi:Cement_bag_removals_tblApi,public modalCtrl: ModalController,public syncS: SyncServices,private transfer: Transfer,public events:Events,public popoverCtrl: PopoverController ) {

  // this.dateSettingsF['max'] = new Date(moment().format());  
  // this.dateSettingsT['max'] = new Date(moment().format());

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad CementBagRemovalFormPage');
    
  }


 async ionViewDidEnter() {
     this.busyMessage = await this.appCom.getTranslatedTxt("Please wait...");   
     
      //mobi scroll placeholder translations
      let MobiProps=this.mobiScollPincodeSettings;
      MobiProps['placeholder']= await this.appCom.getTranslatedTxt("Please select");
      this.mobiScollPincodeSettings=MobiProps;
      this.pincodeMob.instance.option(MobiProps);

      let MobiProps1=this.mobiScollProvinceSettings;
      MobiProps1['placeholder']= await this.appCom.getTranslatedTxt("Please select");
      this.mobiScollProvinceSettings=MobiProps1;
      this.ProvinceMob.instance.option(MobiProps1);

      let MobiProps2=this.mobiScollCitySettings;
      MobiProps2['placeholder']= await this.appCom.getTranslatedTxt("Please select");
      this.mobiScollCitySettings=MobiProps2;
      this.CityMob.instance.option(MobiProps2);

      let MobiProps3=this.mobiScollSubDistrictSettings;
      MobiProps3['placeholder']= await this.appCom.getTranslatedTxt("Please select");
      this.mobiScollSubDistrictSettings=MobiProps3;
      this.SubDistrictMob.instance.option(MobiProps3);

      let MobiProps4=this.mobiScollDistrictSettings;
      MobiProps4['placeholder']= await this.appCom.getTranslatedTxt("Please select");
      this.mobiScollDistrictSettings=MobiProps4;
      this.districtMob.instance.option(MobiProps4);

    //  this.toMaxDate=moment().format();
    //  this.fromMaxDate=moment().format();
     this.appCom.getAppPreference("userCreds").then(
        resDataU => {
        this.userName = resDataU.user.realm;
        let uId = resDataU.userId;
        this.uId = parseInt(uId);
        this.curUserData=resDataU.user;
      },
    err => {
        console.log("err ref", err);
    });  

    //GET ADDRESS DATA
    this.busy=this.getAddressData().then(()=>{
        this.busy=this.addressInitInput().then(()=>{
              if(this.cBagRemovData.postalCode && this.cBagRemovData.postalCode!=''){
                  this.addressDataFiltersF(this.cBagRemovData.postalCode,'postalcode');
              }
          },()=>{
          });
    },()=>{
  });

      //SUBSCRIPTION FOR CAMERA OR GALLERY PHOTO CAPTURED..
   this.events.unsubscribe("getbase64Image");  
   this.events.subscribe('getbase64Image',(base64ImgOBJ) => {
        
          let base64Image =  base64ImgOBJ.base64Image;
          let extType=".jpeg";
          var filename = this.appCom.generateRandomString()+extType;
         
          this.appCom.savebase64AsImageFile(filename,base64Image,extType).then((path)=>{
                  
                  
              
                  if( base64ImgOBJ.photo_source == "rem_proof_pics" ){
                      let temp =[];
                      temp['path']=path;
                      temp['name']=filename;
                      temp['fileType']="jpeg";
                      temp['sync_status']=0;
                      temp['serverPath']="";
                      temp['container']="doc";
                      this.removalProofPathObj.push(temp);
                      this.removalProofPathObjDisp.push(this.appCom.urlSanitizer(path));
                  }else if( base64ImgOBJ.photo_source =="rem_proof" ){
                      let container = "doc";
                      this.appCom.saveFile(container).then((dataFile?:any)=>{
                            let temp =[];
                            temp['path']=dataFile.filepath;
                            temp['name']=filename;
                            temp['fileType']="jpeg";
                            temp['sync_status']=0;
                            temp['serverPath']="";
                            temp['container']="doc";

                            if(!dataFile){
                            this.appCom.showAlert("Only images,pdfs,excel and doc files allowed.",'OK',null);
                            }else{
                                this.removalProofPathObj.push(temp);      
                                if(dataFile.fileArr.fileType == 'jpeg' || dataFile.fileArr.fileType == 'jpg' || dataFile.fileArr.fileType == 'png'){
                                    this.removalProofPathObjDisp.push(dataFile.filepath);                   
                                }else{
                                    this.removalProofPathObjDisp.push('assets/images/document.jpg');
                                  
                                }  
                            }
                      });
                }     

              },(error)=>{
                console.log(error);
              }

          );

      }); 
  

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
      let districtArr=[];
      this.sqlS.selectTableData(selectField,tableName,where,orderBy,limit).then((ressqlData:any)=>{
        for(let i=0;i<ressqlData.rows.length;i++){
          let tempObj=ressqlData.rows.item(i);
          allAddressData.push(tempObj);
          postalCodeArr.push(tempObj['postalcode']);
          provinceArr.push(tempObj['province']);
          municipalityArr.push(tempObj['citykabname']);
          subDistrictArr.push(tempObj['subdistrict']);
          //districtArr.push((tempObj['district']))
        }
        districtArr=this.curUserData['district'];
        this.allAddressDataG =  new Set(allAddressData);
        postalCodeArr = Array.from(new Set(postalCodeArr));
        provinceArr =  Array.from(new Set(provinceArr));
        municipalityArr =  Array.from(new Set(municipalityArr));
        subDistrictArr =  Array.from(new Set(subDistrictArr));
        districtArr=Array.from(new Set(districtArr));

        this.postalCodeArrG=[];
         for(let i=0;i<postalCodeArr.length;i++){
              this.postalCodeArrG.push({
                text:postalCodeArr[i],
                value:postalCodeArr[i]
              });
              
         }
         this.pincodeMob.instance.option({
          data: this.postalCodeArrG
        });
         
        this.provinceArrG=[];
        for(let j=0;j<provinceArr.length;j++){
          this.provinceArrG.push({
            text:provinceArr[j],
            value:provinceArr[j]
          });
           
        }
        this.ProvinceMob.instance.option({
          data: this.provinceArrG
        });
        this.municipalityArrG=[];
        for(let k=0;k<municipalityArr.length;k++){
          this.municipalityArrG.push({
            text:municipalityArr[k],
            value:municipalityArr[k]
          });
          
        }
        this.CityMob.instance.option({
          data: this.municipalityArrG
        });
          
        this.subDistrictArrG=[];
        for(let l=0;l<subDistrictArr.length;l++){
          this.subDistrictArrG.push({
            text:subDistrictArr[l],
            value:subDistrictArr[l]
          });
           
        }
        this.SubDistrictMob.instance.option({
          data: this.subDistrictArrG
        });

        this.districtArrG=[];
        for(let m=0;m<districtArr.length;m++){
          console.log("districtArr",districtArr[m]);
          this.districtArrG.push({
            text:districtArr[m]['name'],
            value:districtArr[m]['id']
          });
           
        }
                        
        this.districtMob.instance.option({
          data: this.districtArrG
        });

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
            this.postalCode.valueAccessor._instance.setVal(eventD,true);
            this.province.valueAccessor._instance.setVal(tempP,true);
            this.city.valueAccessor._instance.setVal(tempC,true);
            this.subDistrict.valueAccessor._instance.setVal(tempS,true);
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
        this.municipalityArrF=[];
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
   //GET GEO LOCATION
   getAddress(){ 
     	this.appCom.isGpsLocationEnabledC((successCallback)=>{			
          if(successCallback)	{
                  this.appCom.getLocationModeC((res) => {
                        //if(res == 'high_accuracy'){
                                this.busy=  this.appCom.getAddressOfCurrLocation().then((address)=>{
                                  this.cBagRemovData['address'] = address;
                                },(error)=>{
                                  console.log(error);                         
                                });
                        // }else{
                        //         //show pop up for set high accuracy..
                        //         this.appCom.showAlert(ALL_MESSAGE.ERROR_MESSAGE.GET_LOCATION_COORDS_ERR,"Ok","");
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

onDistrictSelect(event){
  if(event != null && event != undefined){
    this.disableFromDateFlag=false;
  }
}

  openSignPopup(){
      
      let signPop = this.modalCtrl.create(DigitalSignCanvasPage);
      signPop.present();
      this.digitalSignPath=null;
      this.digitalSignData=null;
      signPop.onDidDismiss((signData:any)=>{
          if(signData){
            this.digitalSignPath = "data:image/png;base64, "+signData['base64Image'];
            this.digitalSignData = signData;
          }
      });
  }


  getDigitalSignImage(){
    return new Promise((resolve,reject)=>{
      if(this.digitalSignData){
               let base64Image =  this.digitalSignData.base64Image;
              let extType=".jpeg";
              var filename = this.appCom.generateRandomString()+extType;
              this.appCom.savebase64AsImageFile(filename,base64Image,extType).then((path)=>{
              let temp ={};
                temp['path']=path;
                temp['name']=filename;
                temp['fileType']="jpeg";
                temp['sync_status']=0;
                temp['serverPath']="";
                temp['container']="doc";
                resolve((temp));
              },()=>{
                let temp ={}
                resolve((temp)); 
              });
        }
    });
  }


submitCementBagRemForm(){
  this.submitted=true;

  let isvalid=false;
  isvalid = this.cBagRemovData['quantity'] != undefined && this.cBQuantity.valid  && this.cBagRemovData['quantity'] != null && this.locationName.valid && this.address.valid && this.cBagRemovData.district != undefined && this.cBagRemovData.district != null && this.cBagRemovData.fromDate != undefined && this.cBagRemovData.fromDate != null && this.cBagRemovData.toDate != null && this.cBagRemovData.toDate != undefined &&  this.postalCode.valid && this.province.valid && this.city.valid && this.subDistrict.valid && this.digitalSignPath != undefined && this.digitalSignPath != '';
  
  //check validation
  if(isvalid){ 
    if(this.cBagRemovData.quantity <=0 || this.cBagRemovData.quantity == "" || this.cBagRemovData.quantity == undefined ){
      this.appCom.showAlert(ALL_MESSAGE.ERROR_MESSAGE.QTY_ZERO_IN_CEM_BAG_REMOV_ERR,"Ok","");
      return false;
    }  
  let fd= this.appCom.dateToTimeStamp(this.cBagRemovData.fromDate);
  let td= this.appCom.dateToTimeStamp(this.cBagRemovData.toDate);

  if( fd > td ){
    this.appCom.showAlert("Please enter a valid date range","Ok","");
    return false;
  }  


  this.busy= this.uploadDigitalSignImage().then((res)=>{
       
     let arr=[];
     arr.push(res);
     this.cBagRemovData['digitalSign']=JSON.stringify(arr);
     this.busy= this.uploadBagRemovalProof().then((docsRes)=>{
      this.cBagRemovData['uploadProof']=JSON.stringify(docsRes);	  
            this.appCom.isGpsLocationEnabledC((successCallback)=>{			
                                  if(successCallback)	{
                                            this.appCom.getLocationModeC((res) => {
                                                let insertData={};
                                                insertData['district_id']=this.cBagRemovData['district'];
                                                insertData['from_date']= this.appCom.dateToTimeStamp(this.cBagRemovData['fromDate']);
                                                insertData['to_date']= this.appCom.dateToTimeStamp(this.cBagRemovData['toDate']);
                                                insertData['quantity']=this.cBagRemovData['quantity'];
                                                insertData['location_name']=this.cBagRemovData['locationName'];
                                                insertData['address']=this.cBagRemovData['address'];
                                                insertData['postal_code']=this.cBagRemovData['postalCode'];
                                                insertData['province']=this.cBagRemovData['province'];
                                                insertData['city']=this.cBagRemovData['city'];
                                                insertData['sub_district']=this.cBagRemovData['subDistrict'];
                                                insertData['witness_name']=this.cBagRemovData['witnessName'];
                                                insertData['digital_sign']=this.cBagRemovData['digitalSign'];
                                                insertData['attach_picture']=this.cBagRemovData['uploadProof'];
                                                insertData['witness_designation']=this.cBagRemovData['witnessDesignation'];
                                                insertData['additional_comments']= this.cBagRemovData['additionalComment'];
                                                insertData['created_by']=this.uId;
                                                insertData['updated_by']=this.uId;
                                                //if(res == 'high_accuracy'){                                                        
                                                      this.busy=  this.appCom.getGeoLocationCordinates("submitCementBagRemForm").then((geoCordinates)=>{
                                                               
                                                        insertData['latitude']=(geoCordinates['coords'])?geoCordinates['coords'].latitude:"";
                                                        insertData['longitude']=(geoCordinates['coords'])?geoCordinates['coords'].longitude:""; 
                                                               
                                                                
                                                            this.busy=this.getCementBagRemApi.addEditCementBagRemoval(insertData,null).subscribe((result)=>{
                                                                    
                                                                    
                                                              this.busy=this.navCtrl.pop({animate:false}).then(()=>{
                                                                this.busy=this.navCtrl.push(AcCementBagRemovalDetailPage,{
                                                                  "receiptId":result['result']['id'],
                                                                    },{animate:false}).then(()=>{
                                                                        this.appCom.showAlert(ALL_MESSAGE.SUCCESS_MESSAGE.CEM_REM_RECEIPT_ADD_SUCCESS,"Ok","");
                                                                    
                                                                });
                                                              });
                                                            },(error)=>{
                                                                this.appCom.showAlert(ALL_MESSAGE.ERROR_MESSAGE.GENERIC_LOCATION_ERR,"Ok",""); 
                                                            }); 

                                                      },(error)=>{
                                                        console.log(error);                                                                      
                                                        //this.appCom.showAlert(ALL_MESSAGE.ERROR_MESSAGE.GENERIC_LOCATION_ERR,"Ok","");
                                                        insertData['latitude']="";
                                                        insertData['longitude']="";
                                                        this.busy=this.getCementBagRemApi.addEditCementBagRemoval(insertData,null).subscribe((result)=>{
                                                           this.busy=this.navCtrl.pop({animate:false}).then(()=>{
                                                              this.busy=this.navCtrl.push(AcCementBagRemovalDetailPage,{
                                                                "receiptId":result['result']['id'],
                                                                  },{animate:false}).then(()=>{
                                                                      this.appCom.showAlert(ALL_MESSAGE.SUCCESS_MESSAGE.CEM_REM_RECEIPT_ADD_SUCCESS,"Ok","");
                                                                  
                                                              });
                                                            });
                                                        },(error)=>{
                                                            this.appCom.showAlert(ALL_MESSAGE.ERROR_MESSAGE.GENERIC_LOCATION_ERR,"Ok",""); 
                                                        }); 
                                                      });
                                                // }else{
                                                //   //show pop up for set high accuracy..                                                              
                                                //   //this.appCom.showAlert(ALL_MESSAGE.ERROR_MESSAGE.GET_LOCATION_COORDS_ERR,"Ok","");
                                                //   this.busy=  this.appCom.getGeoLocationCordinates("submitCementBagRemForm").then((geoCordinates)=>{
                                                    
                                                //   insertData['latitude']=(geoCordinates['coords'])?geoCordinates['coords'].latitude:"";
                                                //   insertData['longitude']=(geoCordinates['coords'])?geoCordinates['coords'].longitude:""; 
                                                    
                                                     
                                                //  this.busy=this.getCementBagRemApi.addEditCementBagRemoval(insertData,null).subscribe((result)=>{
                                                         
                                                         
                                                //           this.busy=this.navCtrl.pop({animate:false}).then(()=>{
                                                //             this.busy=this.navCtrl.push(AcCementBagRemovalDetailPage,{
                                                //               "receiptId":result['result']['id'],
                                                //                 },{animate:false}).then(()=>{
                                                //                     this.appCom.showAlert(ALL_MESSAGE.SUCCESS_MESSAGE.CEM_REM_RECEIPT_ADD_SUCCESS,"Ok","");
                                                                
                                                //             });
                                                //           });
                                                //         },(error)=>{
                                                //             this.appCom.showAlert(ALL_MESSAGE.ERROR_MESSAGE.GENERIC_LOCATION_ERR,"Ok",""); 
                                                //         }); 

                                                //   },(error)=>{
                                                //     console.log(error);                                                                      
                                                //     //this.appCom.showAlert(ALL_MESSAGE.ERROR_MESSAGE.GENERIC_LOCATION_ERR,"Ok","");
                                                //     insertData['latitude']="";
                                                //     insertData['longitude']="";
                                                //     this.busy=this.getCementBagRemApi.addEditCementBagRemoval(insertData,null).subscribe((result)=>{
                                                //         this.busy=this.navCtrl.pop({animate:false}).then(()=>{
                                                //           this.busy=this.navCtrl.push(AcCementBagRemovalDetailPage,{
                                                //             "receiptId":result['result']['id'],
                                                //               },{animate:false}).then(()=>{
                                                //                   this.appCom.showAlert(ALL_MESSAGE.SUCCESS_MESSAGE.CEM_REM_RECEIPT_ADD_SUCCESS,"Ok","");
                                                              
                                                //           });
                                                //         });
                                                //     },(error)=>{
                                                //         this.appCom.showAlert(ALL_MESSAGE.ERROR_MESSAGE.GENERIC_LOCATION_ERR,"Ok",""); 
                                                //     }); 
                                                //   });
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
        },(error)=>{
          //show please try again err..  
          this.appCom.showAlert(ALL_MESSAGE.SERVER_MESSAGE.COMMON_ERROR,"Ok","");
        });
    },(error)=>{
        //show please try again err..
        this.appCom.showAlert(ALL_MESSAGE.SERVER_MESSAGE.COMMON_ERROR,"Ok","");
    });

  }else{
          //form not valid..show error
          this.appCom.showAlert(ALL_MESSAGE.ERROR_MESSAGE.INVALID_FIELDS_FORM_ERR,"Ok","");
  } 
 
}

uploadDigitalSignImage(){
  return new Promise((resolve,reject)=>{
        //get digital sign
        const fileTransfer: TransferObject = this.transfer.create();

        this.getDigitalSignImage().then((digiSignObj)=>{

              let uploadUrl=SITE_API.CONTAINER+digiSignObj['container']+"/upload";
              let DownloadUrl=SITE_API.CONTAINER+"doc/download";
              let mimeType=this.appCom.getMineTypes(digiSignObj['fileType']);
              let options = {
                  fileKey: "file",
                  fileName: digiSignObj['name'],
                  chunkedMode: false,
                  mimeType: mimeType,
                  params : {"fileName":digiSignObj['name']}
                };
              fileTransfer.upload(digiSignObj['path'],uploadUrl,options)
              .then((data) => {
                 let t={};
                 t=digiSignObj;
                 t['serverPath']=DownloadUrl+"/"+digiSignObj['name'];
                resolve(t);
              }, (err) => {
                reject(err);
              });
        });
   });
}

uploadBagRemovalProof(){
   return new Promise((resolve,reject)=>{
        let uploadUrl=SITE_API.CONTAINER+"doc/upload";
        let DownloadUrl=SITE_API.CONTAINER+"doc/download";
        const fileTransfer: TransferObject = this.transfer.create();
        let serverPaths=[];
        async.each(this.removalProofPathObj,(respData,callback:any)=>{
          let mimeType=this.appCom.getMineTypes(respData['fileType']);
            let options = {
                  fileKey: "file",
                  fileName: respData['name'],
                  chunkedMode: false,
                  mimeType: mimeType,
                  params : {"fileName":respData['name']}
                };
             
            fileTransfer.upload(respData['path'],uploadUrl,options)
            .then((data) => {
                let t={};
                t['path']=respData['path'];
                t['name']=respData['name'];
                t['fileType']=respData['fileType'];
                t['sync_status']=respData['sync_status'];
                t['container']=respData['container'];
                t['serverPath']=DownloadUrl+"/"+respData['name'];
                serverPaths.push(t); 
                callback();
            }, (err) => {
                callback();
            });

        },()=>{
            resolve(serverPaths);
        });

   });
}

toDateSelected(event){
  this.cBagRemovData.toDate= moment(event).endOf('day').format(); 
  let isvalid = false;
  isvalid = this.cBagRemovData.district != undefined && this.cBagRemovData.district != null && this.cBagRemovData.fromDate != undefined && this.cBagRemovData.fromDate != null && this.cBagRemovData.toDate != null && this.cBagRemovData.toDate != undefined;
  if(isvalid){
    //QUERY SERVER TO GET QUANTITY
    let fdate=this.appCom.dateToTimeStamp(this.cBagRemovData.fromDate);
    let tdate=this.appCom.dateToTimeStamp(this.cBagRemovData.toDate);
    this.busy = this.getCementBagRemApi.getReceiptQuantity(fdate,tdate,this.cBagRemovData.district).subscribe(resData => {
              if(resData){
                let res= resData['result'][0];
                if(res){
                  this.cBagRemovData['quantity']=res['totalQuantity']?res['totalQuantity']:0;
                }
                
              }
    });
  }else{
    //this.appCom.showAlert(ALL_MESSAGE.ERROR_MESSAGE.FILL_ALL_N_GET_QUANTITY_ERR,"Ok","");
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

removeProofImages(i){
   this.removalProofPathObj.splice(i,1);
   this.removalProofPathObjDisp.splice(i,1);
}


  startDateActive() {
    this.disableToDateFlag = false;
  }

  endDateActive() {
    let fd= this.appCom.dateToTimeStamp(this.cBagRemovData.fromDate);
    let td= this.appCom.dateToTimeStamp(this.cBagRemovData.toDate);
    if( fd > td ){
      this.appCom.showAlert("Please enter a valid date range","Ok","");
        this.cBagRemovData.toDate=null;
      return false;
    }    
      
    let tempToDate=this.appCom.dateToTimeStamp(this.cBagRemovData.toDate);
    this.cBagRemovData.toDate= new Date(tempToDate).setHours(23,59,59); 
        
    let isvalid = false;
    isvalid = this.cBagRemovData.district != undefined && this.cBagRemovData.district != null && this.cBagRemovData.fromDate != undefined && this.cBagRemovData.fromDate != null && this.cBagRemovData.toDate != null && this.cBagRemovData.toDate != undefined && fd <= td;
    if(isvalid){
        //QUERY SERVER TO GET QUANTITY
      try{
          let fdate=this.appCom.dateToTimeStamp(this.cBagRemovData.fromDate);
          let tdate=this.appCom.dateToTimeStamp(this.cBagRemovData.toDate);
          console.log("fdate",fdate);
          console.log("tdate",tdate);
          this.busy = this.getCementBagRemApi.getReceiptQuantity(fdate,tdate,this.cBagRemovData.district).subscribe(resData => {
                    if(resData){
                      let res= resData['result'][0];
                      if(res){
                        this.cBagRemovData['quantity']=res['totalQuantity']?res['totalQuantity']:0;
                      }
                      
                    }
          });
      }catch(e){
        console.log("error",e);
      }  
    }else{
      //this.appCom.showAlert(ALL_MESSAGE.ERROR_MESSAGE.FILL_ALL_N_GET_QUANTITY_ERR,"Ok","");
    } 
  }

}
