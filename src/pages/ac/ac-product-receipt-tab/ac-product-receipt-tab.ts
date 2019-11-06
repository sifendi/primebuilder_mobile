import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController, Events } from 'ionic-angular';
import { SuperTabsModule } from 'ionic2-super-tabs';
import { AcProductReceiptPendingPage } from '../../ac/ac-product-receipt-pending/ac-product-receipt-pending';
import { AcProductReceiptAllPage } from '../../ac/ac-product-receipt-all/ac-product-receipt-all';
import { AcProductReceiptsSearchPage } from "../ac-product-receipts-search/ac-product-receipts-search";


@Component({
  selector: 'page-ac-product-receipt-tab',
  templateUrl: 'ac-product-receipt-tab.html',
})
export class AcProductReceiptPageTab {

  receiptType:any='pending';
  prodReceiptFilterArr:any={
     product:null,
     fromDate:null,
     toDate:null,
     by:null,
     status:null,
  }


  page3: any = AcProductReceiptPendingPage;
  page4: any = AcProductReceiptAllPage;
  constructor(public navCtrl: NavController, public navParams: NavParams,public modalCtrl:ModalController,public events:Events) {
  }

  ionViewDidLoad() {
	  console.log('ionViewDidLoad AcProductReceiptPageTab');
  }



  openProductReceiptFilter(){
       
        let selFilterData={
            receiptType:this.receiptType,
            prodReceiptFilterArr:this.prodReceiptFilterArr
        };
        let filterPageD = this.modalCtrl.create(AcProductReceiptsSearchPage,{selFilterData:selFilterData});
        filterPageD.onDidDismiss((fDataRes:any)=>{
            if( this.receiptType=="pending" ){
    
                  if( fDataRes ){
                    if(fDataRes['prodReceiptFilterArr']){
                        this.prodReceiptFilterArr=fDataRes['prodReceiptFilterArr'];
                        this.events.publish("acProdRecieptPListFilter",fDataRes);
                    }
                }
                
            }else if( this.receiptType=="all" ){
               
                if( fDataRes ){
                    if(fDataRes['prodReceiptFilterArr']){
                        this.prodReceiptFilterArr=fDataRes['prodReceiptFilterArr'];
                        this.events.publish("acProdRecieptAListFilter",fDataRes); 
                    }    
                }
            }
            
        });
        filterPageD.present();
  }

onTabSelect(ev: any) {
    console.log('Tab selected', 'Index: ' + ev.index, 'Unique ID: ' + ev.id);
     if(ev.index==0){
        this.receiptType="pending";
        this.prodReceiptFilterArr['product']=null;
        this.prodReceiptFilterArr['fromDate']=null;
        this.prodReceiptFilterArr['toDate']=null;
        this.prodReceiptFilterArr['status']="pending";
        this.prodReceiptFilterArr['by']="$tlh";
        this.events.publish("clearacProdRecieptPListFilter"); 
     }else{
        this.receiptType="all";
        this.prodReceiptFilterArr['product']=null;
        this.prodReceiptFilterArr['fromDate']=null;
        this.prodReceiptFilterArr['toDate']=null;
        this.prodReceiptFilterArr['status']=null;
        this.prodReceiptFilterArr['by']=null;
        this.events.publish("clearacProdRecieptAListFilter"); 
     }
    
  }

}
