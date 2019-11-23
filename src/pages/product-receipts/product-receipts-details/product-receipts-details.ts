import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams,Events } from 'ionic-angular';
import { appCommonMethods } from '../../../providers/appCommonMethods';
import { SqlServices } from '../../../providers/sqlService';
import { ProductReceiptsFormPage } from '../product-receipts-form/product-receipts-form';



@Component({
  selector: 'page-product-receipts-details',
  templateUrl: 'product-receipts-details.html',
})
export class ProductReceiptsDetailsPage {

  productReceiptData:any=[];
  productInvoicePhotoObj:any=[];
  projData:any=[];
  hpbStatus:any="";
  hpbName:any="";
  rdsName:any="";
  productReceiptId:any;
  isSrku:any;
  editBtnEnb:any=false;
  busyMessage:any="Please Wait...";  
  busy:any;

  public productId: any;
  public product_name: any = [];



  constructor(public navCtrl: NavController, public navParams: NavParams, public sqlS:SqlServices, public appCom:appCommonMethods,public events:Events) {


  }

  async ionViewDidEnter() {
    this.busyMessage = await this.appCom.getTranslatedTxt("Please wait...");      
    this.productInvoicePhotoObj = [];
    console.log('ionViewDidLoad ProductReceiptsDetailsPage');
    this.productReceiptId =this.navParams.get("productReceiptId");
    this.productId =this.navParams.get("productId");

  

    var selectField = "*";
    var where =" `receipt_id` = " +this.productReceiptId;
    let query="SELECT projm.is_srku,hm.hpb_name,prm.hpb_status,prm.unit,prm.purchase_date,prm.invoice_image,prm.invoice_quantity,prm.digital_sign,prm.additional_comments,prm.created_by,prm.updated_by,prm.sync_status,prm.status,prm.quantity,prm.rds_id,prm.product_id,prm.server_project_id,prm.project_id,prm.server_hpb_id,prm.hpb_id,rdm.rds_name,rdm.rds_type,prm.server_receipt_id,  projm.project_name,pm.product_name,prm.receipt_id,prm.quantity,prm.unit,prm.local_created_date,(SELECT prat.approval_status FROM products_receipt_approval_tbl AS prat WHERE prat.receipt_id = prm.receipt_id AND prat.approval_role = 'TLH' AND prat.is_closed = 0 ) AS tlh_approval,(SELECT prat.approval_status FROM products_receipt_approval_tbl AS prat WHERE prat.receipt_id = prm.receipt_id AND prat.approval_role = 'AC' AND prat.is_closed = 0) AS ac_approval,(SELECT prat.approval_status FROM products_receipt_approval_tbl AS prat WHERE prat.receipt_id = prm.receipt_id AND prat.approval_role = 'SA' AND prat.is_closed = 0) AS sa_approval, (SELECT prat.rejection_reason FROM products_receipt_approval_tbl AS prat WHERE prat.receipt_id = prm.receipt_id AND prat.approval_role = 'TLH' AND prat.is_closed = 0) AS tlh_rejection_res ,(SELECT prat.rejection_reason FROM products_receipt_approval_tbl AS prat WHERE prat.receipt_id = prm.receipt_id AND prat.approval_role = 'AC' AND prat.is_closed = 0) AS ac_rejection_res ,(SELECT prat.rejection_reason FROM products_receipt_approval_tbl AS prat WHERE prat.receipt_id = prm.receipt_id AND prat.approval_role = 'SA' AND prat.is_closed = 0) AS sa_rejection_res FROM product_receipt_master prm LEFT JOIN product_master pm ON prm.product_id = pm.server_product_id LEFT JOIN project_master projm ON projm.project_id = prm.project_id LEFT JOIN retailer_distributor_master rdm ON rdm.server_rds_id = prm.rds_id LEFT JOIN hpb_master hm ON hm.server_hpb_id = prm.server_hpb_id where prm.receipt_id = "+ this.productReceiptId;
    this.busy=this.sqlS.queryExecuteSql(query,[]).then((data) => {

        this.productReceiptData= data['rows'].item(0);

        // Get product name
        let q= "SELECT pm.product_name, pm.server_product_id FROM product_master as pm WHERE pm.server_product_id IN (" + data['rows'].item(0).product_id + ")";
        this.busy = this.sqlS.queryExecuteSql(q,[]).then((product) => {
          for(let produ=0; produ<product['rows'].length; produ++) {
            this.product_name.push({ 
              product_id: product['rows'].item(produ).server_product_id, 
              product_name: product['rows'].item(produ).product_name ,
              receipt_id: data['rows'].item(0).receipt_id
            });
          }
        });

        this.checkEditRecpt(this.productReceiptId);
        var invoiceImage = ( this.productReceiptData['invoice_image'] && this.productReceiptData['invoice_image'] != '' )?JSON.parse(this.productReceiptData['invoice_image']):[];
        console.log("productReceiptData",this.productReceiptData);
        
        if( this.productReceiptData.digital_sign !=undefined && this.productReceiptData.digital_sign !='' ){
          let ds=[];      
          ds=JSON.parse(this.productReceiptData['digital_sign']);    
          //this.productReceiptData.digital_sign= this.appCom.urlSanitizer(ds[0]['path']) ;
          this.productReceiptData.digital_sign= this.appCom.getImageLocalPathFull(ds[0]) ; 
        }else{
              this.productReceiptData.digital_sign = "";
        }


        if( invoiceImage !=undefined && invoiceImage !='' && invoiceImage.length > 0 ){
          for( var i=0;i<invoiceImage.length;i++ ){
              if(invoiceImage[i].fileType == 'jpeg' || invoiceImage[i].fileType == 'jpg' || invoiceImage[i].fileType == 'png'){  
                let tempDocArr:any = {};
                //tempDocArr.path = invoiceImage[i].path;
                //tempDocArr.display = invoiceImage[i].path;
                
                tempDocArr.path = this.appCom.getImageLocalPathFull(invoiceImage[i]);
                tempDocArr.display = this.appCom.getImageLocalPathFull(invoiceImage[i]);

                this.productInvoicePhotoObj.push(tempDocArr); 
              }else{
                let tempDocArr:any = {};
                //tempDocArr.path = invoiceImage[i].path;
                tempDocArr.path = this.appCom.getImageLocalPathFull(invoiceImage[i]);
                
                tempDocArr.display = 'assets/images/document.jpg';
                this.productInvoicePhotoObj.push(tempDocArr);
              }
              console.log(" this.productInvoicePhotoObj ",this.productInvoicePhotoObj);
          }
        }

        if( this.productReceiptData['purchase_date'] !=undefined && this.productReceiptData['purchase_date'] !='' ) {
            this.productReceiptData['formattedPurchaseDate'] = this.appCom.timeStampToDate((this.productReceiptData['purchase_date']));
        } else {
            this.productReceiptData['formattedPurchaseDate'] = '-';
        }


   
    }, (error) => {
        console.log('Error', error);
        
    });

  }
   
openFile(file){
      this.appCom.fileOpen(file);
  }
  
  checkEditRecpt(reciptId){
    let checkInEditBtnFlag=false;
    let where=" prt.receipt_id="+reciptId;
    let query="SELECT prt.receipt_id,(SELECT prat.approval_status FROM products_receipt_approval_tbl AS prat WHERE prat.receipt_id = prt.receipt_id AND prat.approval_role = 'TLH' AND prat.is_closed = 0 ) AS tlh_approval,(SELECT prat.approval_status FROM products_receipt_approval_tbl AS prat WHERE prat.receipt_id = prt.receipt_id AND prat.approval_role = 'AC' AND prat.is_closed = 0) AS ac_approval,(SELECT prat.approval_status FROM products_receipt_approval_tbl AS prat WHERE prat.receipt_id = prt.receipt_id AND prat.approval_role = 'SA' AND prat.is_closed = 0) AS sa_approval , (SELECT prat.rejection_reason FROM products_receipt_approval_tbl AS prat WHERE prat.receipt_id = prt.receipt_id AND prat.approval_role = 'TLH' AND prat.is_closed = 0) AS tlh_rejection_res ,(SELECT prat.rejection_reason FROM products_receipt_approval_tbl AS prat WHERE prat.receipt_id = prt.receipt_id AND prat.approval_role = 'AC' AND prat.is_closed = 0) AS ac_rejection_res ,(SELECT prat.rejection_reason FROM products_receipt_approval_tbl AS prat WHERE prat.receipt_id = prt.receipt_id AND prat.approval_role = 'SA' AND prat.is_closed = 0) AS sa_rejection_res FROM product_receipt_master AS prt WHERE "+where;
    this.sqlS.queryExecuteSql(query,[]).then((ressqlData:any) => {
        console.log('ressqlData checkEditRecpt',ressqlData);
        let appStatusData = ressqlData['rows'].item(0);
        let finalCheckFlagA=0;
        let finalCheckFlagP=0;
        let finalCheckFlagR=0;
       
        if(appStatusData['tlh_approval']==0){
            finalCheckFlagP++;
        }

        if(appStatusData['tlh_approval']==1){
            finalCheckFlagA++;
        }

        if(appStatusData['tlh_approval']==-1){
            finalCheckFlagR++;
        }

        if(appStatusData['ac_approval']==0){
               finalCheckFlagP++;
        }

        if(appStatusData['ac_approval']==1){
               finalCheckFlagA++;
        }

        if(appStatusData['ac_approval']==-1){
                finalCheckFlagR++;
           
        }

        if(appStatusData['sa_approval']==0){
                   finalCheckFlagP++;
        }

        if(appStatusData['sa_approval']==1){
                 finalCheckFlagA++;
        }

        if(appStatusData['sa_approval']==-1){
            finalCheckFlagR++;
        }

            

        this.appCom.getLocalStorageItem("globalCheckinData").then((checkinObj)=>{
            console.log('checkinObj',checkinObj);
            let tempCheckOutMainObj= checkinObj['checkinDetails'];
            if(tempCheckOutMainObj['check_in_out_type'] && tempCheckOutMainObj['check_in_out_type_id']){
                    if(tempCheckOutMainObj['check_in_out_type']=="project"){
                           console.log('tempCheckOutMainObj- check_in_out_type_id',tempCheckOutMainObj['check_in_out_type_id']);
                           console.log('tempCheckOutMainObj- check_in_out_type_id',this.productReceiptData['project_id']);
                            if(tempCheckOutMainObj['check_in_out_type_id']==this.productReceiptData['project_id']){
                                console.log("finalCheckFlagR=>",finalCheckFlagR);
                                if(finalCheckFlagR>0){
                                      this.editBtnEnb=true;
                                }else if(finalCheckFlagA==0){
                                   this.editBtnEnb=true;
                                }
                            }else{
                                    this.editBtnEnb=false;
                            }
                    }
            }
        });
    
       
    },error=>{
        console.log("error",error);
           
    });
        
  }

 checkEditRecpCond(){
    
 }

  editCurrentReceipt(){
        console.log("productReceiptData---->",this.productReceiptData);
        this.navCtrl.push(ProductReceiptsFormPage,{
            "productReceiptData":this.productReceiptData,
            "projId":this.productReceiptData['project_id'],
            "action":"edit"
        });
  }

}