import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import { Subscription } from "rxjs/Rx";
import { App_product_receiptApi, App_product_receipt_approvalApi } from "../../../shared/loopback_sdk/index";
import { appCommonMethods } from "../../../providers/appCommonMethods";
import { ALL_MESSAGE } from "../../../providers/constant";
import { SqlServices } from "../../../providers/sqlService";
import * as moment from 'moment';


@Component({
  selector: 'page-tlh-receipt-detail',
  templateUrl: 'tlh-receipt-detail.html',
})
export class TlhReceiptDetailPage {

 

  userName:any;
  uId:number;
  receiptId:number;
  busy: any;
  busyMessage: any;
  productReceiptData:any={};
  productInvoicePhotoObj:any=[];
  digitalSignPath:any=[];
  receiptApprovalId:any=0;
  showApproveBtnFlag:any=false;
 
  constructor(public navCtrl: NavController, public navParams: NavParams,public productReciptapi: App_product_receiptApi,public productReceiptApproveapi:App_product_receipt_approvalApi,public appCom:appCommonMethods,public alertCtrl:AlertController,public sqlS:SqlServices) {
  console.log('constructor TlhReceiptDetailPage');

}

ionViewDidLoadData(){
   this.ionViewDidLoad();
}

  ionViewDidLoad() {
    console.log('ionViewDidLoad TlhReceiptDetailPage');
   
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
     console.log("resData",resData);
     this.productReceiptData= resData.result[0];
    
     if(this.productReceiptData['app']){
         if( this.productReceiptData['app']['tlh'] != undefined && this.productReceiptData['app']['tlh'] != "" ){
            this.receiptApprovalId=this.productReceiptData['app']['tlh']['id'];
         }
     }


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

successMesage(){
return new Promise((resolve,reject)=>{
  setTimeout(()=>{
    this.appCom.showAlert(ALL_MESSAGE.SUCCESS_MESSAGE.RECEIPT_APPROVED_SUCCESS,"Ok",null);
    this.ionViewDidLoadData();
    resolve(true);
  },3000);

});                     
}

rejectMesage(){
return new Promise((resolve,reject)=>{
  setTimeout(()=>{
    this.appCom.showAlert(ALL_MESSAGE.SUCCESS_MESSAGE.RECEIPT_REJECT_SUCCESS,"Ok",null);
    this.ionViewDidLoadData();
    resolve(true);
  },3000);

});                     
}

  async approve(){

    let  approvalData={
    receipt_id:null,
    approval_status:null,
    approved_by:null,
    approval_role:null,
    rejection_reason:null,
    updated_by:null
    }
  
    let title = await this.appCom.getTranslatedTxt("Are you sure you want to approve ?");
    let titleYes = await this.appCom.getTranslatedTxt("Yes");
    let titleNo = await this.appCom.getTranslatedTxt("No");

    let alert = this.alertCtrl.create({
          cssClass: 'confirm',
          title: title,
          enableBackdropDismiss:false,
          buttons: [
          {
            text: titleYes,
            handler: () => {
                    approvalData['receipt_id']=this.productReceiptData['receipt_id'];
                    approvalData['approval_status']=1;
                    approvalData['approved_by']=this.uId;
                    approvalData['approval_role']="TLH";
                    approvalData['local_updated_date']=this.appCom.getCurrentTimeStamp();
                    approvalData['updated_by']=this.uId;
                    //this.approvalData['is_closed']=0;
                    console.log("this.receiptApprovalId",this.receiptApprovalId);
                    this.busy = this.productReceiptApproveapi.addEditProdReceiptApproval(approvalData,this.receiptApprovalId).subscribe(resData => {
                    console.log("approved",resData);
                     this.busy=this.successMesage().then(()=>{
                       this.navCtrl.pop();
                     });
                   
                    });  
            }
          },
          {
            text: titleNo,
            handler: () => {
            console.log('Cancel clicked');
            

            }
          }
          ]
    });
    alert.present();

  }

  async reject(){

        let  approvalData={
        receipt_id:null,
        approval_status:null,
        approved_by:null,
        approval_role:null,
        rejection_reason:null,
        updated_by:null
      }
      
      let title = await this.appCom.getTranslatedTxt("Are you sure you want to reject ?");
      let titleYes = await this.appCom.getTranslatedTxt("Yes");
      let titleNo = await this.appCom.getTranslatedTxt("No");
      let titlePlaceHold = await this.appCom.getTranslatedTxt("write here");

      let alert = this.alertCtrl.create({
        cssClass: 'confirm',
        title: title,
        enableBackdropDismiss:false,
        inputs: [
        {
            name: 'reason',
            placeholder: titlePlaceHold,
        }
        ],
        buttons: [
        {
            text: titleYes,
                handler: (data) => {
              
                var c = "";
                c=data['reason'].trim();
                //c=c.trim();
                if( c != undefined &&  c != "" ){
                      approvalData['receipt_id']=this.productReceiptData['receipt_id'];                                 
                      approvalData['approval_status']= -1;
                      approvalData['approved_by']=this.uId;
                      approvalData['approval_role']="TLH";
                      approvalData['rejection_reason']=c;
                      //approvalData['is_closed']=0;
                      approvalData['local_updated_date']=this.appCom.getCurrentTimeStamp();
                      approvalData['updated_by']=this.uId;
                      console.log("this.receiptApprovalId",this.receiptApprovalId);
                      this.busy = this.productReceiptApproveapi.addEditProdReceiptApproval(approvalData,this.receiptApprovalId).subscribe(resData => {
                        console.log("approved",resData);
                        this.busy=this.rejectMesage().then(()=>{
                          this.navCtrl.pop();
                        });
                      });              
                                                                    
                }else{
                    
                      this.appCom.showToast(ALL_MESSAGE.ERROR_MESSAGE.PRODUCT_RECEIPT_REASON,"middle");
                      return false;   
                }
            }
        }, 
        {
            text: titleNo,
            handler: () => {
            console.log('Cancel clicked');
          
            }
        }]
    });
    alert.present();

  }

  openFile(file){
    console.log(" file ",file);  
    this.appCom.onlineFileOpen(file);
  }


}
