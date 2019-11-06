import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { appCommonMethods } from '../../../providers/appCommonMethods';
import { SqlServices } from '../../../providers/sqlService';
import { Subscription } from 'rxjs';
import { App_product_receiptApi,App_hpbApi,App_product_receipt_approvalApi }  from '../../../shared/loopback_sdk';
import { SITE_API, ALL_MESSAGE } from "../../../providers/constant";

@Component({
  selector: 'page-receipt-detail',
  templateUrl: 'receipt-detail.html',
})
export class ReceiptDetailPage {
  busyMessage:any;
  busy:Subscription;
  receipt:any = [];
  hpbData:any = [];
  digital_sign:any;
  invoices:any = [];
  constructor(private productReceiptApprovalApi: App_product_receipt_approvalApi,private hpbApi:App_hpbApi,private productReceiptApi:App_product_receiptApi,public navCtrl: NavController, public navParams: NavParams, public sqlS:SqlServices, public appCom:appCommonMethods) {
  }

  async ionViewDidEnter() {
      let receiptId = this.navParams.get('receiptId');
      let hpbId = this.navParams.get('hpbId');
      if(receiptId){
          
        this.busyMessage = await this.appCom.getTranslatedTxt("Please wait...");   
          this.busy=this.hpbApi.findById(hpbId).subscribe((resHpbData?:any)=>{
            console.log(" resHpbData ",resHpbData);
            this.hpbData = resHpbData; 
            this.productReceiptApi.getProductReceipt(receiptId).subscribe((resData)=>{
                console.log(" receipt detail ",resData);
                resData.result[0].created_date = this.appCom.timeStampToDate(resData.result[0].created_date);
                
                this.productReceiptApprovalApi.getProductReceiptApproval(null,receiptId).subscribe((resApprovalData)=>{
                    console.log(" approval data ",resApprovalData);
                    let x;
                    if(resData.result[0].digital_sign != null && resData.result[0].digital_sign != ''){
                        let tempObjPic = JSON.parse(resData.result[0].digital_sign);
                        this.digital_sign = SITE_API.CONTAINER+'doc/download/'+tempObjPic[0].name;
                    }
                    if(resData.result[0].invoice_image != null && resData.result[0].invoice_image != ''){
                        let tempObjPic = JSON.parse(resData.result[0].invoice_image);
                        let y;
                        for(let y=0;y<tempObjPic.length;y++){
                            console.log(" file format ",tempObjPic[y].fileType);
                            if(tempObjPic[y].fileType == 'jpeg' || tempObjPic[y].fileType == 'jpg' || tempObjPic[y].fileType == 'png'){
                                
                                let temp = SITE_API.CONTAINER+'doc/download/'+tempObjPic[y].name;
                                let tempDocArr:any = {};
                                tempDocArr.path = temp;
                                tempDocArr.display = tempObjPic[y].serverPath;
                                this.invoices.push(tempDocArr);
                            }else{
                                let tempDocArr:any = {};
                                tempDocArr.path = tempObjPic[y].serverPath;
                                tempDocArr.display = 'assets/images/document.jpg';
                                this.invoices.push(tempDocArr);
                            }
                        }
                        console.log(" invoices ",this.invoices);
                    }
                    resData.result[0].tlhStatus = 0;
                    resData.result[0].acStatus = 0;
                    resData.result[0].adminStatus = 0;
                    
                    for(let j = 0;j<resApprovalData.result.length;j++){
                        console.log(" approvals data ",resApprovalData.result[j]);
                        if(resApprovalData.result[j].approval_role.toLowerCase() == 'tlh'){
                            resData.result[0].tlhStatus = resApprovalData.result[j].approval_status;
                        }else if(resApprovalData.result[j].approval_role.toLowerCase() == 'ac'){
                            resData.result[0].acStatus = resApprovalData.result[j].approval_status;
                        }else if(resApprovalData.result[j].approval_role.toLowerCase() == 'sa' || resApprovalData.result[j].approval_role.toLowerCase() == 'ra'){
                            resData.result[0].adminStatus = resApprovalData.result[j].approval_status;
                        }
                    }

                    this.receipt = resData.result[0];
                    console.log(' getProductReceipt History ',this.receipt);

                },(error)=>{
                    console.log('error',error);
                });

            },(error)=>{
                console.log('error',error);
            });

          },(error)=>{
              console.log('error',error);
          });
      }
  }

  openFile(file){
    console.log(" file ",file);  
    this.appCom.onlineFileOpen(file);
  }

}