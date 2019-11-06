import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams,ModalController, Events } from 'ionic-angular';
import { DigitalSignCanvasPage } from "../../digital-sign-canvas/digital-sign-canvas";
import { ProductRequestsDetailsPage } from "../../product-request/product-requests-details/product-requests-details";


import { appCommonMethods } from '../../../providers/appCommonMethods';
import { SqlServices } from '../../../providers/sqlService';
import { ALL_MESSAGE } from '../../../providers/constant';
import * as moment from 'moment';
import async from 'async'; 
declare var sessionUserGlobalData;
@Component({
  selector: 'page-product-requests-form',
  templateUrl: 'product-requests-form.html',
})
export class ProductRequestsFormPage {
  submitted:any=false;
  busy: any;
  busyMessage:any="Please Wait...";
  produtRequestObj={
    id:0,
    server_id:0,
    request_date:null,
    project_id:null,
    server_project_id:null,
    project_name:null,
    hpb_id:null,
    server_hpb_id:null,
    hpb_name:null,
    quantity_required:null,
    rds_id:null,
    rds_name:null,
    pic_same_as_hpb:null,
    pic_name:null,
    pic_designation:null,
    pic_mobile:null,
    new_price_request:null,
    term_of_payment:null,
    product_request_status:null,
    product_request_status_remark:null,
    product_request_status_remark_comment:null,
    status_change_date:null,
    additional_comments:null,
    hpb_digital_sign:null
  };
  hpbDigitalSignPath:any=null;
  hpbDigitalSignData:any=null;
  brandInUseArrs:any=[];
  brandProductArrs:any=[];
  allRDSDataArrs:any=[];
  mobiScollRDSSettings:any = {
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
      onClear: (event, inst)=>{},
      onSet: (event, inst)=> {},
      onFilter: (event, inst)=> {}
  };
   mobiScollProductSettings:any = {
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
        this.brandProductArrs=[];
        let queryRDS="SELECT * FROM product_master";
        this.sqlS.queryExecuteSql(queryRDS,[]).then((resData:any)=>{
            if(resData.rows.length>0){
                for(let i=0;i<resData.rows.length;i++){
                    let currTempObj=resData.rows.item(i);
                    this.brandProductArrs.push({
                      text:currTempObj['product_name'],
                      value:currTempObj['server_product_id']
                    });
                }
                this.productMob.instance.option({
                  data:this.brandProductArrs
                });
            }
           
        },(error)=>{
          console.log('error queryRDS initFormData',error);
           
        });
      },
      onSet: (event, inst)=> {},
      // onFilter: (event, inst)=> {}
  };
  mobiScollRequestDateSettings: any = {
    theme: 'material'
 };
  paramsData:any={};
  updateFlag:boolean=false;
  @ViewChild('quantityR') quantityR: any;
  @ViewChild('rdsI') rdsI: any;
  @ViewChild('sameAsHpb') sameAsHpb: any;
  @ViewChild('picName') picName: any;
  @ViewChild('picDesignation') picDesignation: any;
  @ViewChild('picMobile') picMobile: any;
  @ViewChild('newPriceRequest') newPriceRequest: any;
  @ViewChild('termOfPayment') termOfPayment: any;
  @ViewChild('additionalComments') additionalComments: any;
  @ViewChild('productRequestStatusRemark') productRequestStatusRemark: any;
  @ViewChild('productRequestStatusRemarkComment') productRequestStatusRemarkComment: any;
  @ViewChild('productMob') productMob: any;
   
  constructor(public navCtrl: NavController,public events:Events, public navParams: NavParams,public modalCtrl: ModalController,public appCom:appCommonMethods,public sqlS:SqlServices) {
    let brandUnserUserItem={brandId:null,price:null,req_rds_name:null};
    this.brandInUseArrs=[];
    this.brandInUseArrs.push(brandUnserUserItem);
 




  }

  async ionViewDidLoad() {
       
        //mobi scroll placeholder translations
        let MobiProps=this.mobiScollProductSettings;
        MobiProps['placeholder']= await this.appCom.getTranslatedTxt("Please select");
        this.mobiScollProductSettings=MobiProps;
        this.productMob.instance.option(MobiProps);

        this.busy=this.initFormData().then((res:any)=>{
          console.log('Complete');
        
          setTimeout(()=>{
              let brandInUser = this.brandInUseArrs;
              let rds_id = this.produtRequestObj.rds_id;
              this.brandInUseArrs=[];
              this.brandInUseArrs=brandInUser;
              this.produtRequestObj.rds_id=null;
              this.produtRequestObj.rds_id=rds_id;
          },100);

        },()=>{
                console.log('error');
        });
  }

initFormData(){

    return new Promise((resolve,reject)=>{

      let allSyncTask=[];
      let allTaskComplete = ()=>{
          resolve(true);
      }
       
      allSyncTask.push((callback)=>{

        this.paramsData = this.navParams.data;
        console.log('this.paramsData',this.paramsData);
        if(this.paramsData['projId'] && this.paramsData['projId']>0){
          this.produtRequestObj.request_date=moment().format('DD MMM YYYY'); 
          let queryProject="SELECT prm.project_id, prm.server_project_id, prm.project_name,hpm.hpb_id,hpm.server_hpb_id,hpm.hpb_name FROM project_master prm LEFT JOIN hpb_master hpm ON prm.server_hpb_id=hpm.server_hpb_id WHERE prm.project_id="+this.paramsData['projId'];
          this.sqlS.queryExecuteSql(queryProject,[]).then((resData:any)=>{
             if(resData.rows.length>0){
               let currTempObj=resData.rows.item(0);
               this.produtRequestObj.project_id=currTempObj['project_id'];
               this.produtRequestObj.server_project_id=currTempObj['server_project_id'];
               this.produtRequestObj.project_name=currTempObj['project_name'];
               this.produtRequestObj.hpb_id=currTempObj['hpb_id']?currTempObj['hpb_id']:0;
               this.produtRequestObj.server_hpb_id=currTempObj['server_hpb_id']?currTempObj['server_hpb_id']:0;
               this.produtRequestObj.hpb_name=currTempObj['hpb_name']?currTempObj['hpb_name']:null;
             }
            callback();
          },(error)=>{
              console.log('error queryProject initFormData',error);
              callback();
          }); 

          }else if(this.paramsData['prodReqId'] && this.paramsData['prodReqId']>0){
           
              let queryProdReq="SELECT prt.id,prt.server_id,prt.request_date,prt.product_request_status,prt.product_request_status_remark,prt.product_request_status_remark_comment,prt.quantity_required,prt.new_price_request,prt.term_of_payment,prt.pic_same_as_hpb,prt.pic_name,prt.pic_designation,prt.pic_mobile,prt.additional_comments,prt.hpb_digital_sign,prm.project_id,prm.server_project_id,prm.project_name,hm.hpb_id,hm.server_hpb_id,hm.hpb_name, rdm.rds_id,rdm.server_rds_id,rdm.rds_name,prbc.id as 'prbc_id',prbc.server_id 'prbc_server_id',prbc.brand_id,prbc.req_rds_name,prbc.server_brand_id,prbc.price,pm.product_name,pm.product_id,pm.server_product_id FROM products_request_tbl prt LEFT JOIN project_master prm ON prt.project_id=prm.project_id LEFT JOIN hpb_master hm ON prt.server_hpb_id=hm.server_hpb_id LEFT JOIN retailer_distributor_master rdm ON prt.rds_id=rdm.server_rds_id LEFT JOIN products_request_brand_capture_tbl prbc ON prt.id=prbc.request_id LEFT JOIN product_master pm ON prbc.brand_id=pm.server_product_id WHERE prt.id="+this.paramsData['prodReqId'];
              this.sqlS.queryExecuteSql(queryProdReq,[]).then((resData:any)=>{
                if(resData.rows.length>0){
                  this.updateFlag=true;
                  let tempDisDataAll = [];
                  let tempDisDataAllFinal:any = {};
                  for(let i=0;i<resData.rows.length;i++){
                   
                     let tempDisData = resData.rows.item(i);
                     let key = '_'+tempDisData['id']+'_';
                     if(tempDisDataAllFinal[key]){
                        tempDisDataAllFinal[key]['brandDatas'].push({
                           product_name:tempDisData['product_name'],
                           price:tempDisData['price'],
                           brand_id:tempDisData['brand_id'],
                           req_rds_name:tempDisData['req_rds_name']
                        });
                     }else{
                          tempDisDataAllFinal[key]={
                          project_id:tempDisData['project_id'],
                          server_project_id:tempDisData['server_project_id'],
                          hpb_id:tempDisData['hpb_id'],
                          server_hpb_id:tempDisData['server_hpb_id'],
                          server_rds_id:tempDisData['server_rds_id'],
                          request_date:tempDisData['request_date'],
                          product_request_status:tempDisData['product_request_status'],
                          product_name:tempDisData['product_name'],
                          project_name:tempDisData['project_name'],
                          hpb_name:tempDisData['hpb_name'],
                          quantity_required:tempDisData['quantity_required'],
                          rds_name:tempDisData['rds_name'],
                          pic_same_as_hpb:tempDisData['pic_same_as_hpb'],
                          pic_name:tempDisData['pic_name'],
                          pic_designation:tempDisData['pic_designation'],
                          pic_mobile:tempDisData['pic_mobile'],
                          new_price_request:tempDisData['new_price_request'],
                          term_of_payment:tempDisData['term_of_payment'],
                          additional_comments:tempDisData['additional_comments'],
                          product_request_status_remark:tempDisData['product_request_status_remark'],
                          product_request_status_remark_comment:tempDisData['product_request_status_remark_comment'],
                          hpb_digital_sign:JSON.parse(tempDisData['hpb_digital_sign']),
                          brandDatas:[{
                            product_name:tempDisData['product_name'],
                            brand_id:tempDisData['brand_id'],
                            price:tempDisData['price'],
                            req_rds_name:tempDisData['req_rds_name']
                          }]
                        };
                     }
                  }
                 
                  let newKey = '_'+this.paramsData['prodReqId']+'_';
                  console.log('tempDisDataAllFinal',tempDisDataAllFinal[newKey]);
                  let dataDisplayObj=tempDisDataAllFinal[newKey];
                  this.produtRequestObj.request_date=this.appCom.timeStampToDate(dataDisplayObj['request_date']); 
                  this.produtRequestObj.project_id=dataDisplayObj['project_id'];
                  this.produtRequestObj.server_project_id=dataDisplayObj['server_project_id'];
                  this.produtRequestObj.hpb_id=dataDisplayObj['hpb_id'];
                  this.produtRequestObj.rds_id=dataDisplayObj['server_rds_id'];
                  this.produtRequestObj.rds_name=dataDisplayObj['rds_name'];
                  this.produtRequestObj.server_hpb_id=dataDisplayObj['server_hpb_id'];
                  this.produtRequestObj.project_name=dataDisplayObj['project_name'];
                  this.produtRequestObj.hpb_name=dataDisplayObj['hpb_name']?dataDisplayObj['hpb_name']:null;
                  this.produtRequestObj.quantity_required=dataDisplayObj['quantity_required'];
                  this.produtRequestObj.pic_same_as_hpb=dataDisplayObj['pic_same_as_hpb'];
                  this.produtRequestObj.pic_name=dataDisplayObj['pic_name'];
                  this.produtRequestObj.pic_designation=dataDisplayObj['pic_designation'];
                  this.produtRequestObj.pic_mobile=dataDisplayObj['pic_mobile'];
                  this.produtRequestObj.new_price_request=dataDisplayObj['new_price_request'];
                  this.produtRequestObj.term_of_payment=dataDisplayObj['term_of_payment'];
                  this.produtRequestObj.additional_comments=dataDisplayObj['additional_comments'];
                  this.produtRequestObj.product_request_status=dataDisplayObj['product_request_status'];
                  this.produtRequestObj.product_request_status_remark=dataDisplayObj['product_request_status_remark'];
                  this.produtRequestObj.product_request_status_remark_comment=dataDisplayObj['product_request_status_remark_comment'];
                // console.log("dataDisplayObj['hpb_digital_sign'][0]=>",dataDisplayObj['hpb_digital_sign'][0]);
                // console.log("getImageLocalPathFull=>",this.appCom.getImageLocalPathFull(dataDisplayObj['hpb_digital_sign'][0]));
                // console.log("hpbDigitalSignPath=>",this.appCom.urlSanitizer(this.appCom.getImageLocalPathFull(dataDisplayObj['hpb_digital_sign'][0])));
                  try{
                    //this.hpbDigitalSignPath=dataDisplayObj['hpb_digital_sign'][0]['path'];
                    this.hpbDigitalSignPath= this.appCom.getImageLocalPathFull(dataDisplayObj['hpb_digital_sign'][0]);                    
                  }catch(e){
                    this.hpbDigitalSignPath=null;
                  }
                  
                  this.brandInUseArrs=[];
                  for(let i=0;i<dataDisplayObj['brandDatas'].length;i++){
                    this.brandInUseArrs.push({
                      brandId:dataDisplayObj['brandDatas'][i]['brand_id'],
                      price:dataDisplayObj['brandDatas'][i]['price'],
                      product_name:dataDisplayObj['brandDatas'][i]['product_name'],
                      req_rds_name:dataDisplayObj['brandDatas'][i]['req_rds_name']
                    });
                  }

                }
                callback();
            },(error)=>{
                console.log('initDisplayData error',error);
                callback();
            });


            
          }

      });

      // get Rds Data
     allSyncTask.push((callback)=>{
      this.brandProductArrs=[];
      let queryRDS="SELECT * FROM product_master";
      this.sqlS.queryExecuteSql(queryRDS,[]).then((resData:any)=>{
          if(resData.rows.length>0){
              for(let i=0;i<resData.rows.length;i++){
                  let currTempObj=resData.rows.item(i);
                  this.brandProductArrs.push({
                    text:currTempObj['product_name'],
                    value:currTempObj['server_product_id']
                  });
              }
              this.productMob.instance.option({
                data:this.brandProductArrs
              });
          }
          callback();
      },(error)=>{
        console.log('error queryRDS initFormData',error);
          callback();
      });
   });

   allSyncTask.push((callback)=>{

      this.allRDSDataArrs=[];
      let queryRDS="SELECT * FROM retailer_distributor_master WHERE rds_status=1";
      this.sqlS.queryExecuteSql(queryRDS,[]).then((resData:any)=>{

          if(resData.rows.length>0){

              for(let i=0;i<resData.rows.length;i++){
                  let currTempObj=resData.rows.item(i);
                  this.allRDSDataArrs.push({
                    text:currTempObj['rds_name'],
                    value:currTempObj['server_rds_id']
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

  async ionViewDidEnter() {
    this.busyMessage = await this.appCom.getTranslatedTxt("Please wait...");
    console.log('ionViewDidEnter ProductRequestsFormPage');
  }

 


  onSelectRequestDate(){
          console.log('onSelectRequestDate');
  }

  sameAsAboveF(){
       console.log('sameAsAboveF');
       this.produtRequestObj.pic_name=null;
       this.produtRequestObj.pic_mobile=null;
       this.produtRequestObj.pic_designation=null;
  }

  addMoreBrand(){
    console.log('addMoreBrand');
     let checkValidBrandUnderU=this.brandUnserUserValid();
     if(checkValidBrandUnderU){
        let brandUnserUserItem={brandId:null,price:null,req_rds_name:null};
        this.brandInUseArrs.push(brandUnserUserItem);
     }else{
        this.appCom.showAlert(ALL_MESSAGE.ERROR_MESSAGE.INVALID_BRAND_DATA_ERR,'Ok',null);
     }
    
  }
  removeBrandInUseItem(currIndex){
    this.brandInUseArrs.splice(currIndex,1);
  }
  onSelectBrandProduct(event,currIndex){
    console.log('event',event);
    console.log('currIndex',currIndex);
  }
  openSignPopup(){
      
      let signPop = this.modalCtrl.create(DigitalSignCanvasPage);
      signPop.present();
      this.hpbDigitalSignPath=null;
      this.hpbDigitalSignData=null;
      signPop.onDidDismiss((signData:any)=>{
         console.log('signData',signData);
          if(signData){
            this.hpbDigitalSignPath = "data:image/png;base64, "+signData['base64Image'];
            this.hpbDigitalSignData = signData;
          }
      });
  }

  brandUnserUserValid(){
        let brandInUserCheckValid=true;
         for(let i=0;i<this.brandInUseArrs.length;i++){
            
          if(!(this.brandInUseArrs[i]['brandId']>0)){
                brandInUserCheckValid=false;
                break;
            }

            if(!(this.brandInUseArrs[i]['price']>0)){       
                    brandInUserCheckValid=false;
                    break;

            }
            let rTname=this.brandInUseArrs[i]['req_rds_name']?this.brandInUseArrs[i]['req_rds_name'].toString().trim():'';
            if(rTname=="" || this.brandInUseArrs[i]['req_rds_name']==null || !this.brandInUseArrs[i]['req_rds_name']){       
                  brandInUserCheckValid=false;
                  break;
            }  
            if(rTname){
              let chk= this.nameValidation(rTname);
              if(!chk){
                  brandInUserCheckValid=false;
                  break;
              }
            }                
              
            
      }

      return brandInUserCheckValid;
  }

 submitUpdateInsertRequestF(){
 this.submitted=true;  

      if(this.updateFlag){


          let checkValidupdate = true;
          if(this.produtRequestObj.product_request_status=="-1" || this.produtRequestObj.product_request_status==-1 ){
              //checkValidupdate=this.productRequestStatusRemark.valid;
              if(this.productRequestStatusRemark.valid){
                  if(this.produtRequestObj.product_request_status_remark == "others"){
                    checkValidupdate=this.productRequestStatusRemark.valid && this.productRequestStatusRemarkComment.valid;
                  }
              }else{
                checkValidupdate=false;
              }
          }

           if(checkValidupdate){

                this.busy=this.updateRequestSatusOnly().then(()=>{
                     this.checkInOutUpdate();
                     this.busy=this.navCtrl.pop({animate:false}).then(()=>{
                       this.busy=this.navCtrl.push(ProductRequestsDetailsPage,{
                        "prodReqId":this.paramsData['prodReqId']
                       },{animate:false}).then(()=>{
                            this.appCom.showAlert(ALL_MESSAGE.SUCCESS_MESSAGE.PRODUCT_REQUEST_ADD_SUCCESS,'Ok',null);
                            this.events.publish('globalSync');
                       });
                     });

                },(error)=>{
                     this.appCom.showAlert('Please Try Again','Ok',null);
                });

                

           }else{
               this.appCom.showAlert('Please enter valid details','Ok',null);
           }

          

      }else{
            this.submitUpdateInsertRequestFF();
         
      }

 } 

  submitUpdateInsertRequestFF(){
      console.log('submitUpdateInsertRequestF');
      let checkAllValid = (this.quantityR.valid  && this.newPriceRequest.valid && this.termOfPayment.valid && this.additionalComments.valid);
      let sameAsAboveCheckValid = this.produtRequestObj.pic_same_as_hpb?true:(this.picName.valid && this.picDesignation.valid && this.picMobile.valid);
      let brandInUserCheckValid = this.brandUnserUserValid();

      if(!brandInUserCheckValid){
         this.appCom.showAlert(ALL_MESSAGE.ERROR_MESSAGE.INVALID_BRAND_DATA_ERR,'Ok',null);
         return false;
      }

      if(checkAllValid && this.hpbDigitalSignPath && this.hpbDigitalSignPath!=null && sameAsAboveCheckValid && brandInUserCheckValid){
    //    if(checkAllValid && sameAsAboveCheckValid && brandInUserCheckValid){

           this.busy=this.getSignSaveDigital().then((resDataS:any)=>{
               this.produtRequestObj['hpb_digital_sign']=resDataS;
               this.busy=this.insertUpdateRequestData(this.produtRequestObj).then((prodReqIdC:any)=>{
                this.checkInOutUpdate();    
                this.busy=this.navCtrl.pop({animate:false}).then(()=>{
                       this.busy=this.navCtrl.push(ProductRequestsDetailsPage,{
                        "prodReqId":prodReqIdC
                       },{animate:false}).then(()=>{
                            this.appCom.showAlert(ALL_MESSAGE.SUCCESS_MESSAGE.PRODUCT_REQUEST_ADD_SUCCESS,'Ok',null);
                            this.events.publish('globalSync');
                        });
                     });
             },(errorN)=>{
                      if(errorN['error']=='location'){
                        this.appCom.showAlert(ALL_MESSAGE.ERROR_MESSAGE.GENERIC_LOCATION_ERR,"Ok","");
                      }else{
                        this.appCom.showAlert('Please Try Again','Ok',null);
                      }
                     
             });

          },()=>{
                  this.appCom.showAlert('Please Try Again','Ok',null);
          });


      }else{
        this.appCom.showAlert('Please enter valid details','Ok',null);
      }

  }


  getSignSaveDigital(){

    return new Promise((resolve,reject)=>{
    
      let base64Image =  this.hpbDigitalSignData.base64Image;
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
        let tmpArr=[];
        tmpArr.push(temp);
        resolve(JSON.stringify(tmpArr));
      },()=>{
         let temp ={}
        let tmpArr=[];
        tmpArr.push(tmpArr);
         resolve(JSON.stringify(tmpArr)); 
      });

    });

  }

  insertUpdateRequestData(currDatas){

   return new Promise((resolve,reject)=>{

    

      let insertUpdateObj={};
      insertUpdateObj['server_id']=currDatas['server_id'];
      insertUpdateObj['request_date']=this.appCom.getCurrentTimeStamp();
      insertUpdateObj['project_id']=currDatas['project_id'];
      insertUpdateObj['server_project_id']=currDatas['server_project_id'];
      insertUpdateObj['hpb_id']=currDatas['hpb_id'];
      insertUpdateObj['server_hpb_id']=currDatas['server_hpb_id'];
      insertUpdateObj['quantity_required']=currDatas['quantity_required'];
      insertUpdateObj['rds_id']=currDatas['rds_id'];
      insertUpdateObj['pic_same_as_hpb']=currDatas['pic_same_as_hpb']?1:0;
      insertUpdateObj['pic_name']=currDatas['pic_name'];
      insertUpdateObj['pic_designation']=currDatas['pic_designation'];
      insertUpdateObj['pic_mobile']=currDatas['pic_mobile'];
      insertUpdateObj['new_price_request']=currDatas['new_price_request'];
      insertUpdateObj['term_of_payment']=currDatas['term_of_payment'];
      insertUpdateObj['product_request_status']=0;
      insertUpdateObj['status_change_date']=currDatas['status_change_date'];
      insertUpdateObj['additional_comments']=currDatas['additional_comments'];
      insertUpdateObj['hpb_digital_sign']=currDatas['hpb_digital_sign'];
      insertUpdateObj['latitude']=0;
      insertUpdateObj['longitude']=0;
      insertUpdateObj['created_by']=sessionUserGlobalData['userId'];
      insertUpdateObj['generated_by']=sessionUserGlobalData['userIdG']?sessionUserGlobalData['userIdG']:sessionUserGlobalData['userId'];
      insertUpdateObj['updated_by']=sessionUserGlobalData['userIdG']?sessionUserGlobalData['userIdG']:sessionUserGlobalData['userId'];
      insertUpdateObj['local_created_date']=this.appCom.getCurrentTimeStamp();
      insertUpdateObj['local_updated_date']=this.appCom.getCurrentTimeStamp();
      insertUpdateObj['status']=1;
      insertUpdateObj['sync_status']=0;

      this.appCom.getGeoLocationCordinates("insertUpdateRequestData").then((geoCordinates)=>{
        insertUpdateObj['latitude']=(geoCordinates['coords'])?geoCordinates['coords'].latitude:0;
        insertUpdateObj['longitude']=(geoCordinates['coords'])?geoCordinates['coords'].longitude:0;    
        this.sqlS.insertData(insertUpdateObj,"products_request_tbl").then((resInsData:any)=>{
            // resolve(true);
          this.insertUpdateRequestBrandInUseData(this.brandInUseArrs,resInsData['insertId']).then(()=>{
                resolve(resInsData['insertId']);
          },()=>{
                resolve(true);
          });
      },(error)=>{
         reject(false);
         
      });

    },(error)=>{
        
        //reject({error:'location'});
        insertUpdateObj['latitude'] = 0;
        insertUpdateObj['longitude'] = 0;    
        this.sqlS.insertData(insertUpdateObj,"products_request_tbl").then((resInsData:any)=>{
            // resolve(true);
          this.insertUpdateRequestBrandInUseData(this.brandInUseArrs,resInsData['insertId']).then(()=>{
                resolve(resInsData['insertId']);
          },()=>{
                resolve(true);
          });
      },(error)=>{
         reject(false);
         
      });
    });

   });

  }

  insertUpdateRequestBrandInUseData(brandInUseDatas,prodReqId){

    return new Promise((resolve,reject)=>{
      
      async.each(brandInUseDatas,(brandInUseData,callback)=>{

        let insertUpdateObj={};
        insertUpdateObj['server_id']=0;
        insertUpdateObj['request_id']=prodReqId;
        insertUpdateObj['server_request_id']=0;
        insertUpdateObj['brand_id']=brandInUseData['brandId'];
        insertUpdateObj['server_brand_id']=brandInUseData['brandId'];
        insertUpdateObj['req_rds_name']=brandInUseData['req_rds_name'];
        insertUpdateObj['price']=brandInUseData['price'];
        insertUpdateObj['created_by']=sessionUserGlobalData['userId'];
        insertUpdateObj['updated_by']=sessionUserGlobalData['userId'];
        insertUpdateObj['local_created_date']=this.appCom.getCurrentTimeStamp();
        insertUpdateObj['local_updated_date']=this.appCom.getCurrentTimeStamp();
        insertUpdateObj['sync_status']=0;
        this.sqlS.insertData(insertUpdateObj,"products_request_brand_capture_tbl").then((resInsData:any)=>{
            callback();
        },(error)=>{
          callback();
          console.log('error ',error);
        });

      },()=>{
           resolve(true);
      });

    

    })

  }
  
  updateRequestSatusOnly(){
       return new Promise((resolve,reject)=>{
        
              let insertUpdateObj={};
              insertUpdateObj['product_request_status']=this.produtRequestObj.product_request_status;
              insertUpdateObj['product_request_status_remark']=this.produtRequestObj.product_request_status_remark;
              insertUpdateObj['product_request_status_remark_comment']=this.produtRequestObj.product_request_status_remark_comment;
              insertUpdateObj['updated_by']=sessionUserGlobalData['userIdG']?sessionUserGlobalData['userIdG']:sessionUserGlobalData['userId'];
              insertUpdateObj['local_updated_date']=this.appCom.getCurrentTimeStamp();
              insertUpdateObj['sync_status']=0;
              let whereCond=" id="+this.paramsData['prodReqId'];
              this.sqlS.updateData(insertUpdateObj,"products_request_tbl",whereCond).then((resInsData:any)=>{
                resolve(true);
              },(error)=>{
                 console.log('error ',error);
                resolve(true);
              });
       });
  }

  checkInOutUpdate(){
      this.appCom.getLocalStorageItem("globalCheckinData").then((checkinObj)=>{
         let tempCheckInOutData = checkinObj;
         tempCheckInOutData['visitCheckFlag']=true;
         this.appCom.setLocalStorageItem("globalCheckinData",tempCheckInOutData).then(()=>{
         },()=>{
         });
      });
    
  }

  allowOnlyNumbers(str){
     var regex = /^[0-9]+$/;  
     return regex.test(str) && (parseInt(str)>0) &&  parseInt(str) < 10000 ;
  }

  nameValidation(str){
     if(str){
        str = str.trim();
        var regex = /^[a-z ,.'-]+$/i;  
        var a= regex.test(str);
        return a;
     }else{
        return false;
     }
  }

}
