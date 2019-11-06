import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import { Subscription } from "rxjs/Rx";
import { App_product_receiptApi, App_product_receipt_approvalApi } from "../../../../shared/loopback_sdk/index";
import { appCommonMethods } from "../../../../providers/appCommonMethods";

import * as moment from 'moment';
import { ALL_MESSAGE } from "../../../../providers/constant";


@Component({
  selector: 'ac-hpb-receipt-detail',
  templateUrl: 'ac-hpb-receipt-detail.html',
})
export class AcHpbReceiptDetailPage {

 

  userName:any;
  uId:number;
  receiptId:number;
  busy: Subscription;
  busyMessage: any;
  productReceiptData:any={};
  productInvoicePhotoObj:any=[];
  digitalSignPath:any=[];
  receiptApprovalId:any=0;
  showApproveBtnFlag:any=false;
 
  constructor(public navCtrl: NavController, public navParams: NavParams,public productReciptapi: App_product_receiptApi,public productReceiptApproveapi:App_product_receipt_approvalApi,public appCom:appCommonMethods,public alertCtrl:AlertController) {
  console.log('constructor TlhReceiptDetailPage');

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AcReceiptDetailPage');
   
    this.productInvoicePhotoObj=[];
    this.appCom.getAppPreference("userCreds").then(
      resDataU => {
        this.userName = resDataU.user.realm;
        let uId = resDataU.userId;
        this.uId = parseInt(uId);

      },
    err => {
        console.log("err ref", err);
    });



     let paramData = this.navParams.data;
     this.receiptId=paramData['receiptId'];
     console.log("paramData-------->",paramData);
     this.busy =  this.productReciptapi.getProductReceiptWithApproval(this.receiptId,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null).subscribe(resData => {  
     this.productReceiptData= resData.result[0];

      if( this.productReceiptData['is_srku'] == 1 ){
         this.productReceiptData['is_srku']="Yes";
      }else if( this.productReceiptData['is_srku'] == 0 ){
         this.productReceiptData['is_srku']="No";
      } 
   
      var invoiceImage = ( this.productReceiptData['invoice_image'] && this.productReceiptData['invoice_image'] != '' )?JSON.parse(this.productReceiptData['invoice_image']):[];
      if( invoiceImage !=undefined && invoiceImage !='' && invoiceImage.length > 0 ){
            for( var i=0;i<invoiceImage.length;i++ ){
                if(invoiceImage[i].fileType == 'jpeg' || invoiceImage[i].fileType == 'jpg' || invoiceImage[i].fileType == 'png'){  
                  let tempDocArr:any = {};
                    tempDocArr.path = invoiceImage[i].serverPath;
                    tempDocArr.display = invoiceImage[i].serverPath;  
                    this.productInvoicePhotoObj.push( tempDocArr );  
                }else{
                  let tempDocArr:any = {};
                    tempDocArr.path = invoiceImage[i].serverPath;
                    tempDocArr.display = 'assets/images/document.jpg';  
                    this.productInvoicePhotoObj.push(tempDocArr);
                }
            }
      }

      if( this.productReceiptData['digital_sign'] != undefined && this.productReceiptData['digital_sign'] != '' ){
           let path= JSON.parse(this.productReceiptData['digital_sign']);
           this.digitalSignPath = path[0]?path[0]['serverPath']:"";          
      }
                                                                                                                                                                     
      if(  this.receiptApprovalId > 0 && this.productReceiptData['app'] != undefined && this.productReceiptData['app'] != '' && this.productReceiptData['app']['tlh']['approval_status'] == 0 ){
        this.showApproveBtnFlag=true;
      }else{
        this.showApproveBtnFlag=false; 
      }
      console.log("this.productReceiptData2",this.productReceiptData);

    });
  }

  async ionViewDidEnter() {
     this.busyMessage = await this.appCom.getTranslatedTxt("Please wait...");   
  }

  timeStampToDate(date){
    let newDateF = moment(date).format("DD MMM YYYY");
    return newDateF;
  }

  openFile(file){
    console.log(" file ",file);  
    this.appCom.onlineFileOpen(file);
  }

}
