import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController, Events } from 'ionic-angular';
import { SuperTabsModule } from 'ionic2-super-tabs';
import { TlhProductReceiptsAllPage } from '../tlh-product-receipts-all/tlh-product-receipts-all';
import { TlhProductReceiptsPendingPage } from "../tlh-product-receipts-pending/tlh-product-receipts-pending";
import { TlhProductReceiptsSearchPage } from "../tlh-product-receipts-search/tlh-product-receipts-search";


@Component({
  selector: 'page-tlh-product-receipts-tab',
  templateUrl: 'tlh-product-receipts-tab.html',
})
export class TlhProductReceiptsTabPage {

   receiptType:any='pending'; 
   prodReceiptFilterArr:any={
     product:null,
     fromDate:null,
     toDate:null,
     by:null,
     status:null,
  }

  page1: any = TlhProductReceiptsPendingPage;
  page2: any = TlhProductReceiptsAllPage;
  constructor(public navCtrl: NavController, public navParams: NavParams,public modalCtrl:ModalController,public events:Events) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad TlhProductReceiptsTabPage');
  }

    openProductReceiptFilter(){
       
        let selFilterData={
            receiptType:this.receiptType,
            prodReceiptFilterArr:this.prodReceiptFilterArr
        };
        let filterPageD = this.modalCtrl.create(TlhProductReceiptsSearchPage,{selFilterData:selFilterData});
        filterPageD.onDidDismiss((fDataRes:any)=>{
            if( this.receiptType=="pending" ){

                if( fDataRes ){
                    if(fDataRes['prodReceiptFilterArr']){
                        this.prodReceiptFilterArr=fDataRes['prodReceiptFilterArr'];
                        this.events.publish("tlhProdRecieptPListFilter",fDataRes);
                    }
                }
                
            }else if( this.receiptType=="all" ){
                if( fDataRes ){
                    if(fDataRes['prodReceiptFilterArr']){
                        this.prodReceiptFilterArr=fDataRes['prodReceiptFilterArr'];
                        this.events.publish("tlhProdRecieptAListFilter",fDataRes); 
                    }    
                }
            }  
            
        });
        filterPageD.present();
  }

onTabSelect(ev: any) {
    console.log('Tab selected', 'Index: ' + ev.index, 'Unique ID: ' + ev.id);
    let filterObj={};
     if(ev.index==0){
        this.receiptType="pending";
        this.prodReceiptFilterArr['product']=null;
        this.prodReceiptFilterArr['fromDate']=null;
        this.prodReceiptFilterArr['toDate']=null;
        this.prodReceiptFilterArr['status']="pending";
        this.prodReceiptFilterArr['by']="$tlh";
        this.events.publish("cleartlhProdRecieptPListFilter"); 
     }else{
        this.receiptType="all";
        this.prodReceiptFilterArr['product']=null;
        this.prodReceiptFilterArr['fromDate']=null;
        this.prodReceiptFilterArr['toDate']=null;
        this.prodReceiptFilterArr['status']=null;
        this.prodReceiptFilterArr['by']=null;
        this.events.publish("cleartlhProdRecieptAListFilter");  
     }
    
  }

}
