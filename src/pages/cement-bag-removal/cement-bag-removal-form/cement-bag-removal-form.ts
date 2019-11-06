import { Component,ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { SqlServices } from "../../../providers/sqlService";
import { appCommonMethods } from "../../../providers/appCommonMethods";

@Component({
  selector: 'page-cement-bag-removal-form',
  templateUrl: 'cement-bag-removal-form.html',
})
export class CementBagRemovalFormPage {
   @ViewChild('district') district: any;
   @ViewChild('fromDate') fromDate: any;
   @ViewChild('toDate') toDate: any; 
   @ViewChild('locationName') locationName: any; 
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

   
  busy:any;
  busyMessage:any="Please wait..."; 
  cBagRemovData:any={
    district:null,
    fromDate:null,
    toDate:null,
    quantity:null,
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
  };

  toMinDate:any;
  toMaxDate:any;
  
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
        this.cBagRemovData.SrkuCity=null;
        this.cBagRemovData.SrkuSubDistrict=null;
        this.cBagRemovData.SrkuPincode=null;
      },
      onSet: (event, inst)=> {
              this.addressDataFiltersF(event.valueText,'province');
      },
      onFilter: (event, inst)=> {
        let filtered : any[] = [];
        let query = event.filterText;
        this.provinceArrF=[];
         for(let i = 0; i < this.provinceArrG.length; i++) {
                  let currData = this.provinceArrG[i];
                  if(query=='' || query==null){
                          this.provinceArrF.push({
                            text:currData.text,
                            value:currData.value,
                          });
                        if(i==50){
                          break;
                        }
                  }else if(currData.value.toString().toLowerCase().includes(query.toString().toLowerCase())) {
                         this.provinceArrF.push({
                            text:currData.text,
                            value:currData.value,
                          });
                        if(i==50){
                          break;
                        }
                  }

                 
          } 
      }
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
        this.cBagRemovData.SrkuSubDistrict=null;
        this.cBagRemovData.SrkuPincode=null;
      },
      onSet: (event, inst)=> {
              this.addressDataFiltersF(event.valueText,'citykabname');
      },
      onFilter: (event, inst)=> {
        console.log('onFilter ',event);
        let filtered : any[] = [];
        let query = event.filterText;
        this.municipalityArrF=[];
         for(let i = 0; i < this.municipalityArrG.length; i++) {
                  let currData = this.municipalityArrG[i];
                  if(query=='' || query==null){
                          this.municipalityArrF.push({
                            text:currData.text,
                            value:currData.value,
                          });
                        if(i==50){
                          break;
                        }
                  }else if(currData.value.toString().toLowerCase().includes(query.toString().toLowerCase())) {
                         this.municipalityArrF.push({
                            text:currData.text,
                            value:currData.value,
                          });
                        if(i==50){
                          break;
                        }
                  }
          } 
      }
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
       
        this.cBagRemovData.SrkuPincode=null;
      },
      onSet: (event, inst)=> {
              this.addressDataFiltersF(event.valueText,'subdistrict');
      },
      onFilter: (event, inst)=> {
        console.log('onFilter ',event);
        let filtered : any[] = [];
        let query = event.filterText;
        this.subDistrictArrF=[];
         for(let i = 0; i < this.subDistrictArrG.length; i++) {
                  let currData = this.subDistrictArrG[i];
                  if(query=='' || query==null){
                          this.subDistrictArrF.push({
                            text:currData.text,
                            value:currData.value,
                          });
                        if(i==50){
                          break;
                        }
                  }else if(currData.value.toString().toLowerCase().includes(query.toString().toLowerCase())) {
                         this.subDistrictArrF.push({
                            text:currData.text,
                            value:currData.value,
                          });
                        if(i==50){
                          break;
                        }
                  }

                 
          } 
      }
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
   

                    this.cBagRemovData.SrkuCity=null;
                    this.cBagRemovData.SrkuSubDistrict=null;
                    this.cBagRemovData.SrkuProvince=null;
                     this.postalCodeArrF=[];
                     for(let i = 0; i < this.postalCodeArrG.length; i++) {
                        this.postalCodeArrF.push({
                              text:this.postalCodeArrG[i].text,
                              value:this.postalCodeArrG[i].value,
                            });
                          if(i==50){
                            break;
                          }
                     }
                     this.provinceArrF=[];
                     for(let i = 0; i < this.provinceArrG.length; i++) {
                        this.provinceArrF.push({
                              text:this.provinceArrG[i].text,
                              value:this.provinceArrG[i].value,
                            });
                          if(i==50){
                            break;
                          }
                     }

      },
      onSet: (event, inst)=> {
              this.addressDataFiltersF(event.valueText,'postalcode');
            
             
      },
      onFilter: (event, inst)=> {
        console.log('onFilter ',event);
        let filtered : any[] = [];
        let query = event.filterText;
        this.postalCodeArrF=[];
         for(let i = 0; i < this.postalCodeArrG.length; i++) {
                  let currData = this.postalCodeArrG[i];
                  if(query=='' || query==null){
                          this.postalCodeArrF.push({
                            text:currData.text,
                            value:currData.value,
                          });
                        if(i==50){
                          break;
                        }
                  }else if(currData.value.toString().toLowerCase().includes(query.toString().toLowerCase())) {
                         this.postalCodeArrF.push({
                            text:currData.text,
                            value:currData.value,
                          });
                        if(i==50){
                          break;
                        }
                  }

                 
          } 
      }
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
      rows:8,
      data:[],
      readonly:false,
      buttons:['set','clear','cancel'],
     
      onClear: (event, inst)=>{
       
        this.cBagRemovData.district=null;
     
      },
      onSet: (event, inst)=> {
            
      },
      onFilter: (event, inst)=> {
      
      }
  };  
 

  constructor(public navCtrl: NavController, public navParams: NavParams,public sqlS:SqlServices,public appCom: appCommonMethods, ) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad CementBagRemovalFormPage');
  }


  async ionViewDidEnter() {

   this.busyMessage = await this.appCom.getTranslatedTxt("Please wait...");   

          this.busy=this.getAddressData().then(()=>{

              this.busy=this.addressInitInput().then(()=>{
                     
                      if(this.cBagRemovData.postalCode && this.cBagRemovData.postalCode!=''){
                          this.addressDataFiltersF(this.cBagRemovData.postalCode,'postalcode');
                      }

                },()=>{
                  
                });
            
          },()=>{

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
         console.log('getOpenTendersData sql ressqlData',ressqlData);
        for(let i=0;i<ressqlData.rows.length;i++){
          let tempObj=ressqlData.rows.item(i);
          allAddressData.push(tempObj);
          postalCodeArr.push(tempObj['postalcode']);
          provinceArr.push(tempObj['province']);
          municipalityArr.push(tempObj['citykabname']);
          subDistrictArr.push(tempObj['subdistrict']);
          districtArr.push((tempObj['district']))
        }
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
        this.districtArrG=[];
        for(let m=0;m<districtArr.length;m++){
          this.districtArrG.push({
            text:districtArr[m],
            value:districtArr[m]
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
                
                  if(i==50){
                    break;
                  }
        }
        this.provinceArrF=[];
        for(let i = 0; i < this.provinceArrG.length; i++) {
                this.provinceArrF.push({
                      text:this.provinceArrG[i].text,
                      value:this.provinceArrG[i].value,
                });
                
                  if(i==50){
                    break;
                  }
        }
        this.municipalityArrF=[];
        for(let i = 0; i < this.municipalityArrG.length; i++) {
                this.municipalityArrF.push({
                      text:this.municipalityArrG[i].text,
                      value:this.municipalityArrG[i].value,
                });
                
                  if(i==50){
                    break;
                  }
        }
        this.subDistrictArrF=[];
        for(let i = 0; i < this.subDistrictArrG.length; i++) {
                this.subDistrictArrF.push({
                      text:this.subDistrictArrG[i].text,
                      value:this.subDistrictArrG[i].value,
                 });
                             
                  if(i==50){
                    break;
                  }
        }                  
    
   resolve(resolve);

  });
        

}

fromDateSelected(date){
  console.log("from date selected",this.fromDate);
  console.log("from date selected",date.value);
  this.toMinDate =date;
  //this.toMaxDate

}

toDateSelected(date){
  console.log("to date selected");
  console.log("from date selected",date.value);
}


submitCementBagRemForm(){
  this.submitted=true;
}

}
