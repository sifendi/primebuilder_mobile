import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import { appCommonMethods } from "../../../providers/appCommonMethods";
import { App_product_receipt_approvalApi, App_product_receiptApi } from "../../../shared/loopback_sdk/index";
import { ALL_MESSAGE } from "../../../providers/constant";
import { AcProductReceiptPageTab } from "../ac-product-receipt-tab/ac-product-receipt-tab";
import * as moment from 'moment';


@Component({
  selector: 'page-receipt-details',
  templateUrl: 'receipt-details.html',
})
export class AcReceiptDetailsPage {

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

  constructor(public navCtrl: NavController, public navParams: NavParams,public productReciptapi: App_product_receiptApi,public productReceiptApproveapi:App_product_receipt_approvalApi,public appCom:appCommonMethods,public alertCtrl:AlertController) {
  }
 
   ionViewDidLoad() {
    this.ionViewDidLoadData();
   }

  async ionViewDidEnter() {
     this.busyMessage = await this.appCom.getTranslatedTxt("Please wait...");   
  }
  
  ionViewDidLoadData() {
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
       this.busy =  this.productReciptapi.getProductReceiptWithApproval(this.receiptId).subscribe(resData => {  
     //this.busy =  this.productReciptapi.getProductReceiptWithApproval(this.receiptId,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null).subscribe(resData => {  
     console.log("resData",resData);
     this.productReceiptData= resData.result[0];
    
     if(this.productReceiptData['app']){
         if( this.productReceiptData['app']['ac'] != undefined && this.productReceiptData['app']['ac'] != "" ){
            this.receiptApprovalId=this.productReceiptData['app']['ac']['id'];
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
          console.log("this.receiptApprovalId",this.receiptApprovalId);
          console.log("this.productReceiptData['app']",this.productReceiptData['app']);
          console.log("this.productReceiptData['app']['ac']['approval_status']",this.productReceiptData['app']['ac']['approval_status']);  
           console.log("this.productReceiptData['app']['tlh']['approval_status'] == 1",this.productReceiptData['app']['tlh']['approval_status'] == 1);                                                                                                                                                      
      if(  this.receiptApprovalId > 0 && this.productReceiptData['app'] != undefined && this.productReceiptData['app'] != '' && this.productReceiptData['app']['ac']['approval_status'] == "0" && this.productReceiptData['app']['tlh']['approval_status'] == 1 ){
        this.showApproveBtnFlag=true;
        console.log("true");
      }else{
        this.showApproveBtnFlag=false;
        console.log("false"); 
      }

      console.log("this.productReceiptData2",this.productReceiptData);

    

    },()=>{
           //this.navCtrl.setRoot(AcProductReceiptPageTab);
    });
  }

  timeStampToDate(date){
    let newDateF = moment(date).format("DD MMM YYYY");
    return newDateF;
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

    let titleYes = await this.appCom.getTranslatedTxt("Yes");
    let title = await this.appCom.getTranslatedTxt("Are you sure you want to approve ?");
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
                    approvalData['approval_role']="AC";
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

  async reject(){

        let  approvalData={
        receipt_id:null,
        approval_status:null,
        approved_by:null,
        approval_role:null,
        rejection_reason:null,
        updated_by:null
      }
      
      let titleYes = await this.appCom.getTranslatedTxt("Yes");
      let title = await this.appCom.getTranslatedTxt("Are you sure you want to reject ?");
      let titleNo = await this.appCom.getTranslatedTxt("No");
      let titlePlaceHolder=await this.appCom.getTranslatedTxt("write here");

      let alert = this.alertCtrl.create({
        cssClass: 'confirm',
        title: title,
        enableBackdropDismiss:false,
        inputs: [
        {
            name: 'reason',
            placeholder: titlePlaceHolder,
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
                      approvalData['approval_role']="AC";
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
